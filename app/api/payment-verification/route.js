import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import {
    sendEmail,
    paymentScreenshotAdminEmail,
    paymentScreenshotCustomerEmail
} from '@/lib/email';

export const runtime = 'nodejs';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VALID_PAYMENT_METHODS = ['jazzcash', 'easypaisa', 'bank-transfer'];

export async function POST(request) {
    try {
        await connectDB();

        // Parse form data
        const formData = await request.formData();
        const screenshotFile = formData.get('screenshot');
        const orderNumber = formData.get('orderNumber');
        const paymentMethod = formData.get('paymentMethod');

        console.log('Received payment upload request:', {
            orderNumber,
            paymentMethod,
            hasFile: !!screenshotFile,
            fileType: screenshotFile?.type,
            fileSize: screenshotFile?.size
        });

        // --- Enhanced Validation ---
        if (!screenshotFile || !(screenshotFile instanceof File)) {
            return NextResponse.json({
                success: false,
                error: 'Screenshot file is required'
            }, { status: 400 });
        }

        if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
            return NextResponse.json({
                success: false,
                error: 'Valid order number is required'
            }, { status: 400 });
        }

        if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
            return NextResponse.json({
                success: false,
                error: `Invalid payment method. Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`
            }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(screenshotFile.type)) {
            return NextResponse.json({
                success: false,
                error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            }, { status: 400 });
        }

        // Validate file size
        if (screenshotFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                success: false,
                error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            }, { status: 400 });
        }

        // --- Find the order ---
        const order = await Order.findOne({ orderNumber: orderNumber.trim() });
        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Order not found'
            }, { status: 404 });
        }

        // Check if screenshot already uploaded
        if (order.paymentScreenshot) {
            return NextResponse.json({
                success: false,
                error: 'Payment screenshot already uploaded for this order'
            }, { status: 400 });
        }

        // Validate order has required fields
        if (!order.shippingAddress?.email) {
            return NextResponse.json({
                success: false,
                error: 'Order missing required shipping information'
            }, { status: 400 });
        }

        // --- Convert file to Base64 ---
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:${screenshotFile.type};base64,${base64Data}`;

        console.log('File converted to base64, size:', base64Data.length);

        // --- Update order in database ---
        order.paymentScreenshot = dataUrl;
        order.paymentScreenshotUploadedAt = new Date();
        order.paymentStatus = 'awaiting_verification';
        order.paymentMethod = paymentMethod;

        await order.save();

        console.log('Order updated successfully');

        // --- Send Professional Emails ---
        const emailPromises = [];

        // Get admin emails from environment variable
        const adminEmails = process.env.ADMIN_EMAILS
            ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
            : [];

        // Also check single admin email
        if (process.env.ADMIN_EMAIL && !adminEmails.includes(process.env.ADMIN_EMAIL)) {
            adminEmails.push(process.env.ADMIN_EMAIL);
        }

        if (adminEmails.length === 0) {
            console.warn('No admin emails configured. Skipping admin notifications.');
        }

        // Admin emails - Professional template with embedded screenshot
        adminEmails.forEach(email => {
            emailPromises.push(
                sendEmail({
                    to: email,
                    subject: `📸 Payment Verification Required: ${orderNumber} - Rs. ${order.totalAmount?.toLocaleString()}`,
                    html: paymentScreenshotAdminEmail(order),
                }).catch(err => {
                    console.error(`Failed to send admin email to ${email}:`, err);
                    return { error: err.message, email };
                })
            );
        });

        // Customer email - Professional template
        emailPromises.push(
            sendEmail({
                to: order.shippingAddress.email,
                subject: `📸 Payment Received #${orderNumber} - Verification in Progress`,
                html: paymentScreenshotCustomerEmail(order),
            }).catch(err => {
                console.error('Failed to send customer email:', err);
                return { error: err.message, email: order.shippingAddress.email };
            })
        );

        // Send all emails in parallel
        const emailResults = await Promise.allSettled(emailPromises);

        // Log email results
        emailResults.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Email ${index + 1} failed:`, result.reason);
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Payment screenshot uploaded successfully. Your payment is now under verification.',
            order: {
                orderNumber: order.orderNumber,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                paymentScreenshotUploadedAt: order.paymentScreenshotUploadedAt,
            },
        });

    } catch (error) {
        console.error('Error processing payment verification:', error);

        if (error.name === 'ValidationError') {
            return NextResponse.json({
                success: false,
                error: 'Invalid order data: ' + error.message
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to process payment verification. Please try again.'
        }, { status: 500 });
    }
}
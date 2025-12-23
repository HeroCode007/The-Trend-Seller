import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import {
    sendEmailAsync,
    paymentScreenshotAdminEmail,
    paymentScreenshotCustomerEmail
} from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 30; // Allow 30s for file upload

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VALID_PAYMENT_METHODS = ['jazzcash', 'easypaisa', 'bank-transfer'];

export async function POST(request) {
    const startTime = Date.now();
    
    try {
        // Parse form data
        const formData = await request.formData();
        const screenshotFile = formData.get('screenshot');
        const orderNumber = formData.get('orderNumber');
        const paymentMethod = formData.get('paymentMethod');

        // Quick validation before any DB operations
        if (!screenshotFile || !(screenshotFile instanceof File)) {
            return NextResponse.json({
                success: false,
                error: 'Screenshot file is required'
            }, { status: 400 });
        }

        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Order number is required'
            }, { status: 400 });
        }

        if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
            return NextResponse.json({
                success: false,
                error: `Invalid payment method`
            }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.includes(screenshotFile.type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Use JPG, PNG, or WebP.'
            }, { status: 400 });
        }

        if (screenshotFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                success: false,
                error: 'File too large. Maximum 5MB allowed.'
            }, { status: 400 });
        }

        // Connect to database
        await connectDB();

        // Find order - use lean() for faster read, only select needed fields
        const order = await Order.findOne(
            { orderNumber: orderNumber.trim() },
            { 
                orderNumber: 1, 
                paymentScreenshot: 1, 
                shippingAddress: 1, 
                totalAmount: 1,
                items: 1,
                deliveryCharges: 1,
                paymentMethod: 1,
                paymentStatus: 1
            }
        );

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Order not found'
            }, { status: 404 });
        }

        if (order.paymentScreenshot) {
            return NextResponse.json({
                success: false,
                error: 'Payment screenshot already uploaded'
            }, { status: 400 });
        }

        // Convert file to Base64
        // NOTE: For production, consider using Cloudinary or AWS S3 instead
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Compress image if it's too large (optional optimization)
        let base64Data = buffer.toString('base64');
        const dataUrl = `data:${screenshotFile.type};base64,${base64Data}`;

        // Update order - use updateOne for better performance
        const updateResult = await Order.updateOne(
            { orderNumber: orderNumber.trim() },
            {
                $set: {
                    paymentScreenshot: dataUrl,
                    paymentScreenshotUploadedAt: new Date(),
                    paymentStatus: 'awaiting_verification',
                    paymentMethod: paymentMethod
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Failed to update order'
            }, { status: 500 });
        }

        // Fetch updated order for email (lightweight query)
        const updatedOrder = await Order.findOne(
            { orderNumber: orderNumber.trim() }
        ).lean();

        console.log(`✅ Payment screenshot uploaded for ${orderNumber} in ${Date.now() - startTime}ms`);

        // Send emails asynchronously - DON'T BLOCK THE RESPONSE
        setImmediate(() => {
            // Admin email
            const adminEmails = process.env.ADMIN_EMAILS
                ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
                : [];
            
            if (process.env.ADMIN_EMAIL) {
                adminEmails.push(process.env.ADMIN_EMAIL);
            }

            adminEmails.forEach(email => {
                sendEmailAsync({
                    to: email,
                    subject: `📸 Payment Verification: ${orderNumber} - Rs. ${updatedOrder.totalAmount?.toLocaleString()}`,
                    html: paymentScreenshotAdminEmail(updatedOrder),
                });
            });

            // Customer email
            if (updatedOrder.shippingAddress?.email) {
                sendEmailAsync({
                    to: updatedOrder.shippingAddress.email,
                    subject: `📸 Payment Received #${orderNumber} - Verification in Progress`,
                    html: paymentScreenshotCustomerEmail(updatedOrder),
                });
            }
        });

        // Return immediately
        return NextResponse.json({
            success: true,
            message: 'Payment screenshot uploaded. Verification in progress.',
            order: {
                orderNumber: orderNumber,
                paymentStatus: 'awaiting_verification',
                paymentMethod: paymentMethod,
            },
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({
            success: false,
            error: 'Upload failed. Please try again.'
        }, { status: 500 });
    }
}

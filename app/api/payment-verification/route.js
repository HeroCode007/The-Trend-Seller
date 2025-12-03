import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/email';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VALID_PAYMENT_METHODS = ['jazzcash', 'easypaisa', 'bank-transfer'];

// Utility function to sanitize filename
function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 100);
}

// Utility function to clean up uploaded file
async function cleanupFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Failed to cleanup file:', error);
    }
}

export async function POST(request) {
    let uploadedFilePath = null;

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

        // --- Save file with enhanced security ---
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create uploads directory (async and recursive)
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Generate secure filename
        const fileExtension = path.extname(screenshotFile.name) || '.jpg';
        const sanitizedName = sanitizeFilename(path.basename(screenshotFile.name, fileExtension));
        const uniqueId = crypto.randomUUID();
        const fileName = `${uniqueId}-${sanitizedName}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);

        // Save file asynchronously
        await fs.writeFile(filePath, buffer);
        uploadedFilePath = filePath;

        console.log('File saved successfully:', fileName);

        // --- Update order in database ---
        order.paymentScreenshot = `/uploads/${fileName}`;
        order.paymentScreenshotUploadedAt = new Date();
        order.paymentStatus = 'awaiting_verification';
        order.paymentMethod = paymentMethod;

        await order.save();

        console.log('Order updated successfully');

        // --- Send Emails (in parallel with error handling) ---
        const emailPromises = [];

        // Get admin emails from environment variable
        const adminEmails = process.env.ADMIN_EMAILS
            ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
            : [];

        if (adminEmails.length === 0) {
            console.warn('No admin emails configured. Skipping admin notifications.');
        }

        // Calculate amounts
        const totalAmountWithDelivery = (order.totalAmount || 0);
        const subtotalAmount = totalAmountWithDelivery - (order.deliveryCharges || 0);

        // Generate screenshot URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        const screenshotUrl = `${baseUrl}/uploads/${fileName}`;

        // Admin emails
        adminEmails.forEach(email => {
            emailPromises.push(
                sendEmail({
                    to: email,
                    subject: `Payment Verification Required: ${orderNumber}`,
                    html: `
                <h2>Payment Screenshot Received</h2>
                <p>Order Number: <strong>${order.orderNumber}</strong></p>
                <p>Payment Method: <strong>${paymentMethod.toUpperCase().replace('-', ' ')}</strong></p>
                <hr>
                <h3>Order Summary:</h3>
                <ul>
                    ${order.items.map(item =>
                        `<li>${item.name} × ${item.quantity} - ₨${(item.price * item.quantity).toFixed(2)}</li>`
                    ).join('')}
                </ul>
                <p><strong>Subtotal:</strong> ₨${subtotalAmount.toFixed(2)}</p>
                <p><strong>Delivery Charges:</strong> ${order.deliveryCharges === 0 ? 'FREE' : `₨${order.deliveryCharges.toFixed(2)}`}</p>
                <p style="font-size: 18px; color: #059669;"><strong>Total Amount: ₨${totalAmountWithDelivery.toFixed(2)}</strong></p>
                <hr>
                <h3>Customer Details:</h3>
                <p>Name: ${order.shippingAddress.fullName || 'N/A'}</p>
                <p>Email: ${order.shippingAddress.email}</p>
                <p>Phone: ${order.shippingAddress.phone || 'N/A'}</p>
                <p>Status: <strong>Awaiting Verification</strong></p>
                <p>Screenshot: <a href="${screenshotUrl}" target="_blank">View Screenshot</a></p>
                <hr>
                <p><strong>⚠️ Action Required:</strong> Please verify the payment screenshot and update the order status.</p>
            `,
                }).catch(err => {
                    console.error(`Failed to send admin email to ${email}:`, err);
                    return { error: err.message, email };
                })
            );
        });

        // Customer email
        emailPromises.push(
            sendEmail({
                to: order.shippingAddress.email,
                subject: `Payment Screenshot Received: ${orderNumber}`,
                html: `
            <h2>Thank you for your payment!</h2>
            <p>Order Number: <strong>${order.orderNumber}</strong></p>
            <p>Payment Method: <strong>${paymentMethod.toUpperCase().replace('-', ' ')}</strong></p>
            <p>Status: <strong>Awaiting Verification</strong></p>
            <hr>
            <h3>Order Summary:</h3>
            <ul>
                ${order.items.map(item =>
                    `<li>${item.name} × ${item.quantity} - ₨${(item.price * item.quantity).toFixed(2)}</li>`
                ).join('')}
            </ul>
            <p><strong>Subtotal:</strong> ₨${subtotalAmount.toFixed(2)}</p>
            <p><strong>Delivery Charges:</strong> ${order.deliveryCharges === 0 ? 'FREE' : `₨${order.deliveryCharges.toFixed(2)}`}</p>
            <p style="font-size: 18px; color: #059669;"><strong>Total Amount: ₨${totalAmountWithDelivery.toFixed(2)}</strong></p>
            <hr>
            <p>We have received your payment screenshot and it is now under verification. You will receive a confirmation email once your payment is verified.</p>
            <p>Thank you for shopping with us!</p>
        `
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

        // Cleanup uploaded file if something went wrong
        if (uploadedFilePath) {
            await cleanupFile(uploadedFilePath);
        }

        // Return appropriate error message
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
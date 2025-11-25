import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// --- NEW CONFIG ---
export const runtime = 'nodejs';


export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const screenshotFile = formData.get('screenshot');
        const orderNumber = formData.get('orderNumber');
        const paymentMethod = formData.get('paymentMethod');

        // --- Validation ---
        if (!screenshotFile || !(screenshotFile instanceof File)) {
            return NextResponse.json({ success: false, error: 'Screenshot file is required' }, { status: 400 });
        }

        if (!orderNumber) {
            return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
        }

        if (!paymentMethod || !['jazzcash', 'easypaisa', 'bank-transfer'].includes(paymentMethod)) {
            return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });
        }

        // Check file type & size
        if (!screenshotFile.type.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
        }

        if (screenshotFile.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
        }

        // --- Find the order ---
        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // --- Save file locally ---
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

        const fileName = `${Date.now()}-${screenshotFile.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);

        // Save relative URL in DB
        order.paymentScreenshot = `/uploads/${fileName}`;
        order.paymentScreenshotUploadedAt = new Date();
        order.paymentStatus = 'awaiting_verification';
        order.paymentMethod = paymentMethod;
        await order.save();

        // --- Send Emails ---
        const totalAmountWithDelivery = (order.totalAmount || 0) + (order.deliveryCharges || 0);

        const adminEmails = (process.env.ADMIN_EMAIL || '').split(',');

        for (const email of adminEmails) {
            await sendEmail({
                to: email.trim(),
                subject: `Payment Verification Required: ${orderNumber}`,
                html: `
                  <h2>Payment Screenshot Received</h2>
                  <p>Order Number: <strong>${order.orderNumber}</strong></p>
                  <p>Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></p>
                  <p>Amount: <strong>₨${totalAmountWithDelivery}</strong></p>
                  <p>Customer: ${order.shippingAddress.fullName}</p>
                  <p>Email: ${order.shippingAddress.email}</p>
                  <p>Phone: ${order.shippingAddress.phone}</p>
                  <p>Status: <strong>Awaiting Verification</strong></p>
                  <p>Screenshot URL: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${fileName}" target="_blank">View Screenshot</a></p>
                  <h3>Order Items:</h3>
                  <ul>
                    ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
                  </ul>
                  <p>Delivery Charges: ₨${order.deliveryCharges || 0}</p>
                  <p><strong>Action Required:</strong> Please verify the payment screenshot and update the order status.</p>
                `,
            });
        }

        await sendEmail({
            to: order.shippingAddress.email,
            subject: `Payment Screenshot Received: ${orderNumber}`,
            html: `<h2>Thank you for your payment!</h2>
                  <p>Order Number: <strong>${order.orderNumber}</strong></p>
                  <p>Amount: <strong>₨${totalAmountWithDelivery}</strong></p>
                  <p>Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></p>
                  <p>Status: <strong>Awaiting Verification</strong></p>
                  <p>We have received your payment screenshot and it is now under verification.</p>
                  <h3>Order Items:</h3>
                  <ul>
                    ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
                  </ul>
                  <p>Delivery Charges: ₨${order.deliveryCharges || 0}</p>
                  <p>Thank you for shopping with us!</p>`
        });

        return NextResponse.json({
            success: true,
            message: 'Payment screenshot uploaded successfully',
            order: {
                orderNumber: order.orderNumber,
                paymentStatus: order.paymentStatus,
                paymentScreenshotUploadedAt: order.paymentScreenshotUploadedAt,
            },
        });

    } catch (error) {
        console.error('Error processing payment verification:', error);
        return NextResponse.json({ success: false, error: 'Failed to process payment verification' }, { status: 500 });
    }
}

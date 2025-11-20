import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const screenshot = formData.get('screenshot');
        const orderNumber = formData.get('orderNumber');
        const paymentMethod = formData.get('paymentMethod'); // new field

        // Validate inputs
        if (!screenshot) {
            return NextResponse.json(
                { success: false, error: 'Screenshot is required' },
                { status: 400 }
            );
        }

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order number is required' },
                { status: 400 }
            );
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { success: false, error: 'Payment method is required' },
                { status: 400 }
            );
        }

        // Find the order
        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Validate payment method
        if (!['jazzcash', 'easypaisa', 'bank'].includes(paymentMethod)) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Convert screenshot to base64
        const bytes = await screenshot.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        const mimeType = screenshot.type || 'image/jpeg';
        const screenshotData = `data:${mimeType};base64,${base64String}`;

        // Update order
        order.paymentScreenshot = screenshotData;
        order.paymentScreenshotUploadedAt = new Date();
        order.paymentStatus = 'awaiting_verification';
        order.paymentMethod = paymentMethod;
        await order.save();

        const totalAmountWithDelivery = (order.totalAmount || 0) + (order.deliveryCharges || 0);

        // Email to Admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
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
                <p>Screenshot uploaded at: ${new Date(order.paymentScreenshotUploadedAt).toLocaleString()}</p>
                <h3>Order Items:</h3>
                <ul>
                    ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
                </ul>
                <p>Delivery Charges: ₨${order.deliveryCharges || 0}</p>
                <p><strong>Action Required:</strong> Please verify the payment screenshot and update the order status.</p>
            `,
        });

        // Email to Customer
        await sendEmail({
            to: order.shippingAddress.email,
            subject: `Payment Screenshot Received: ${orderNumber}`,
            html: `
                <h2>Thank you for your payment!</h2>
                <p>Order Number: <strong>${order.orderNumber}</strong></p>
                <p>Amount: <strong>₨${totalAmountWithDelivery}</strong></p>
                <p>Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></p>
                <p>Status: <strong>Awaiting Verification</strong></p>
                <p>We have received your payment screenshot and it is now under verification.</p>
                <p>Our team will verify your payment and confirm your order within 24 hours.</p>
                <h3>Order Items:</h3>
                <ul>
                    ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
                </ul>
                <p>Delivery Charges: ₨${order.deliveryCharges || 0}</p>
                <p>Thank you for shopping with us!</p>
            `,
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
        return NextResponse.json(
            { success: false, error: 'Failed to process payment verification' },
            { status: 500 }
        );
    }
}

// app/api/orders/[orderNumber]/verify-payment/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;

        // Find the order
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if payment screenshot exists and status is "awaiting_verification"
        if (!order.paymentScreenshot) {
            return NextResponse.json(
                { success: false, error: 'No payment screenshot uploaded' },
                { status: 400 }
            );
        }

        if (order.paymentStatus !== 'awaiting_verification') {
            return NextResponse.json(
                { success: false, error: 'Payment not awaiting verification' },
                { status: 400 }
            );
        }

        // Calculate random delay between 10-30 seconds
        const delaySeconds = Math.floor(Math.random() * 21) + 10; // 10-30 seconds

        console.log(`⏳ Verifying payment for ${orderNumber} in ${delaySeconds} seconds...`);

        // Wait for the delay
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));

        // Update payment status to 'paid' (matches your enum)
        order.paymentStatus = 'paid';
        order.paymentVerifiedAt = new Date();
        await order.save();

        console.log(`✅ Payment verified for ${orderNumber}`);

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            order: {
                orderNumber: order.orderNumber,
                paymentStatus: order.paymentStatus,
                paymentVerifiedAt: order.paymentVerifiedAt,
            },
        });
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
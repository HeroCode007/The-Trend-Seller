import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { sendEmailAsync } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * OPTIMIZED: Removed the 10-30 second artificial delay!
 * This route now verifies payment immediately.
 */
export async function POST(request, { params }) {
    const startTime = Date.now();
    
    try {
        const { orderNumber } = params;

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order number required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find order with minimal fields
        const order = await Order.findOne(
            { orderNumber },
            { 
                orderNumber: 1, 
                paymentScreenshot: 1, 
                paymentStatus: 1,
                shippingAddress: 1 
            }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

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

        // ❌ REMOVED: The 10-30 second artificial delay
        // const delaySeconds = Math.floor(Math.random() * 21) + 10;
        // await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));

        // ✅ Update payment status immediately
        const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber },
            { 
                $set: { 
                    paymentStatus: 'paid',
                    paymentVerifiedAt: new Date()
                }
            },
            { new: true, lean: true }
        );

        console.log(`✅ Payment verified for ${orderNumber} in ${Date.now() - startTime}ms`);

        // Send confirmation email asynchronously
        if (updatedOrder.shippingAddress?.email) {
            setImmediate(() => {
                sendEmailAsync({
                    to: updatedOrder.shippingAddress.email,
                    subject: `✅ Payment Verified #${orderNumber} - The Trend Seller`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #059669;">Payment Verified! ✅</h2>
                            <p>Your payment for order <strong>#${orderNumber}</strong> has been verified.</p>
                            <p>We'll start processing your order shortly.</p>
                            <p>Thank you for shopping with The Trend Seller!</p>
                        </div>
                    `,
                });
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            order: {
                orderNumber: updatedOrder.orderNumber,
                paymentStatus: updatedOrder.paymentStatus,
                paymentVerifiedAt: updatedOrder.paymentVerifiedAt,
            },
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        return NextResponse.json(
            { success: false, error: 'Verification failed' },
            { status: 500 }
        );
    }
}

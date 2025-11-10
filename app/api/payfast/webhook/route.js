import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { validatePayFastITN } from '@/lib/payfast';

// POST - Handle PayFast ITN (Instant Transaction Notification)
export async function POST(request) {
    try {
        await connectDB();

        // Get form data from PayFast
        const formData = await request.formData();
        const data = {};

        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Validate signature
        if (!validatePayFastITN(data)) {
            console.error('Invalid PayFast ITN signature');
            return NextResponse.json(
                { success: false, error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const orderNumber = data.m_payment_id;
        const paymentStatus = data.payment_status;
        const pfPaymentId = data.pf_payment_id;

        // Find order
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            console.error('Order not found for PayFast ITN:', orderNumber);
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order based on payment status
        if (paymentStatus === 'COMPLETE') {
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            order.payfastPaymentId = pfPaymentId;
        } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
            order.paymentStatus = 'failed';
        }

        await order.save();

        // Return success to PayFast
        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Error processing PayFast webhook:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}

// GET - Handle PayFast return/cancel (for testing)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('m_payment_id');
    const paymentStatus = searchParams.get('payment_status');

    if (orderNumber) {
        return NextResponse.redirect(new URL(`/orders/${orderNumber}?payment=${paymentStatus === 'COMPLETE' ? 'success' : 'cancelled'}`, request.url));
    }

    return NextResponse.json({ message: 'PayFast webhook endpoint' });
}



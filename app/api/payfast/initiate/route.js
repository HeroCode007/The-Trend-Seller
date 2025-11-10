import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';
import { createPayFastPaymentData, getPayFastUrl, isPayFastConfigured } from '@/lib/payfast';

// POST - Initiate PayFast payment
export async function POST(request) {
    try {
        if (!isPayFastConfigured()) {
            return NextResponse.json(
                { success: false, error: 'PayFast is not configured. Please set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY in environment variables.' },
                { status: 500 }
            );
        }

        await connectDB();
        const sessionId = await getSessionId();
        const body = await request.json();
        const { orderNumber } = body;

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order number is required' },
                { status: 400 }
            );
        }

        // Get order
        const order = await Order.findOne({ orderNumber, sessionId });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.paymentMethod !== 'payfast') {
            return NextResponse.json(
                { success: false, error: 'Order is not using PayFast payment method' },
                { status: 400 }
            );
        }

        // Build URLs
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const returnUrl = `${baseUrl}/orders/${orderNumber}?payment=success`;
        const cancelUrl = `${baseUrl}/orders/${orderNumber}?payment=cancelled`;
        const notifyUrl = `${baseUrl}/api/payfast/webhook`;

        // Create PayFast payment data
        const paymentData = createPayFastPaymentData(order, returnUrl, cancelUrl, notifyUrl);
        const payfastUrl = getPayFastUrl();

        return NextResponse.json({
            success: true,
            paymentUrl: payfastUrl,
            paymentData,
        });
    } catch (error) {
        console.error('Error initiating PayFast payment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to initiate PayFast payment' },
            { status: 500 }
        );
    }
}



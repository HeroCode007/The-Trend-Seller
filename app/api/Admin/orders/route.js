import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 100;
        const status = searchParams.get('status');
        const paymentStatus = searchParams.get('paymentStatus');

        const query = {};
        if (status && status !== 'all') query.status = status;
        if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus;

        const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();

        return NextResponse.json({ success: true, orders: orders || [] });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}

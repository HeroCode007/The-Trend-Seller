import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;
        const order = await Order.findOne({ orderNumber }).lean();

        if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;
        const body = await request.json();
        const { status, paymentStatus } = body;

        const update = {};
        if (status) update.status = status;
        if (paymentStatus) {
            update.paymentStatus = paymentStatus;
            if (paymentStatus === 'paid') update.paymentVerifiedAt = new Date();
        }

        const order = await Order.findOneAndUpdate({ orderNumber }, { $set: update }, { new: true }).lean();

        if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;
        const result = await Order.findOneAndDelete({ orderNumber });

        if (!result) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
    }
}

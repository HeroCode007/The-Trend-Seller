import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;

        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                items: order.items,
                shippingAddress: order.shippingAddress,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                paymentNote: order.paymentNote,
                paymentScreenshot: order.paymentScreenshot,
                paymentScreenshotUploadedAt: order.paymentScreenshotUploadedAt,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

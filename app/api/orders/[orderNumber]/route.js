import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const { orderNumber } = params;

    const order = await Order.findOne({ orderNumber, sessionId }).select('-__v');
    if (!order)
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// ✅ Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// -------------------------
// ✅ GET Order by Order Number
// -------------------------
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;

        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }
            );
        }

        // ✅ Return response with no-cache headers
        return NextResponse.json(
            {
                success: true,
                order: {
                    orderNumber: order.orderNumber,
                    items: order.items,
                    shippingAddress: order.shippingAddress,
                    totalAmount: order.totalAmount,
                    deliveryCharges: order.deliveryCharges,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    paymentNote: order.paymentNote,
                    paymentScreenshot: order.paymentScreenshot,
                    paymentScreenshotUploadedAt: order.paymentScreenshotUploadedAt,
                    paymentVerifiedAt: order.paymentVerifiedAt,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                },
            },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
    }
}

// -------------------------
// ✅ PUT - Update Order (Status + Payment Status)
// -------------------------
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { orderNumber } = params;
        const body = await request.json();

        const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber },
            {
                status: body.status,
                paymentStatus: body.paymentStatus,
            },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
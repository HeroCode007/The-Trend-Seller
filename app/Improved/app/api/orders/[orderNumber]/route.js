import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET Order by Order Number - Optimized
export async function GET(request, { params }) {
    const startTime = Date.now();
    
    try {
        const { orderNumber } = params;

        // Validate order number format quickly
        if (!orderNumber || !orderNumber.startsWith('ORD-')) {
            return NextResponse.json(
                { success: false, error: 'Invalid order number' },
                { status: 400 }
            );
        }

        await connectDB();

        // Use lean() for faster queries - returns plain JS object
        // Select only needed fields
        const order = await Order.findOne(
            { orderNumber },
            {
                orderNumber: 1,
                items: 1,
                shippingAddress: 1,
                totalAmount: 1,
                deliveryCharges: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                paymentNote: 1,
                paymentScreenshot: 1,
                paymentScreenshotUploadedAt: 1,
                paymentVerifiedAt: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        ).lean();

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { 
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0',
                    }
                }
            );
        }

        console.log(`✅ Order ${orderNumber} fetched in ${Date.now() - startTime}ms`);

        // Return with appropriate cache headers
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
                    // Don't send full screenshot in GET - it's huge!
                    hasPaymentScreenshot: !!order.paymentScreenshot,
                    paymentScreenshotUploadedAt: order.paymentScreenshotUploadedAt,
                    paymentVerifiedAt: order.paymentVerifiedAt,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                },
            },
            {
                headers: {
                    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT - Update Order Status
export async function PUT(request, { params }) {
    try {
        const { orderNumber } = params;
        const body = await request.json();

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order number required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Build update object dynamically
        const updateFields = {};
        if (body.status) updateFields.status = body.status;
        if (body.paymentStatus) {
            updateFields.paymentStatus = body.paymentStatus;
            if (body.paymentStatus === 'paid') {
                updateFields.paymentVerifiedAt = new Date();
            }
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber },
            { $set: updateFields },
            { new: true, lean: true }
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

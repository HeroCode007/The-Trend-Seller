import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';
import {
    sendEmailAsync,
    newOrderAdminEmail,
    orderConfirmationCustomerEmail
} from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 10; // 10 second timeout max

export async function POST(request) {
    const startTime = Date.now();
    
    try {
        // Parse request body first (fast operation)
        const body = await request.json();
        const { shippingAddress, paymentMethod } = body;

        // Validate inputs BEFORE database operations
        if (!shippingAddress) {
            return NextResponse.json(
                { success: false, error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { success: false, error: 'Payment method is required' },
                { status: 400 }
            );
        }

        const validMethods = ['cod', 'jazzcash', 'easypaisa', 'bank-transfer'];
        if (!validMethods.includes(paymentMethod)) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Now connect to database
        const [, sessionId] = await Promise.all([
            connectDB(),
            getSessionId()
        ]);

        // Fetch cart
        const cart = await Cart.findOne({ sessionId }).lean();
        
        if (!cart || !cart.items || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const deliveryCharges = subtotal >= 7000 ? 0 : 250;
        const totalAmount = subtotal + deliveryCharges;

        // Determine payment status
        let paymentStatus = 'pending';
        let paymentNote = '';

        switch (paymentMethod) {
            case 'cod':
                paymentNote = 'Cash to be paid upon delivery.';
                break;
            case 'jazzcash':
                paymentStatus = 'awaiting_verification';
                paymentNote = 'Please upload your JazzCash payment screenshot.';
                break;
            case 'easypaisa':
                paymentStatus = 'awaiting_verification';
                paymentNote = 'Please upload your EasyPaisa payment screenshot.';
                break;
            case 'bank-transfer':
                paymentStatus = 'awaiting_verification';
                paymentNote = 'Please upload your bank transfer screenshot.';
                break;
        }

        // Create order and clear cart in parallel
        const orderData = {
            items: cart.items.map((item) => ({
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
            })),
            shippingAddress,
            totalAmount,
            deliveryCharges,
            paymentMethod,
            paymentStatus,
            paymentNote,
            sessionId,
            status: 'pending',
        };

        // Create order
        const order = await Order.create(orderData);

        // Clear cart (don't await - fire and forget)
        Cart.updateOne(
            { sessionId },
            { $set: { items: [], updatedAt: new Date() } }
        ).exec().catch(err => console.error('Cart clear error:', err));

        // Send emails asynchronously (DON'T WAIT)
        // This is the key optimization - respond immediately
        setImmediate(() => {
            sendEmailAsync({
                to: process.env.ADMIN_EMAIL,
                subject: `🛒 New Order #${order.orderNumber} - ${paymentMethod.toUpperCase()} - Rs. ${totalAmount.toLocaleString()}`,
                html: newOrderAdminEmail(order, shippingAddress),
            });

            sendEmailAsync({
                to: shippingAddress.email,
                subject: `✅ Order Confirmed #${order.orderNumber} - The Trend Seller`,
                html: orderConfirmationCustomerEmail(order, shippingAddress),
            });
        });

        console.log(`✅ Order ${order.orderNumber} created in ${Date.now() - startTime}ms`);

        // Return response immediately
        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order: {
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                deliveryCharges: order.deliveryCharges,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                paymentNote: order.paymentNote,
                items: order.items,
                shippingAddress: order.shippingAddress,
                createdAt: order.createdAt,
            },
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}

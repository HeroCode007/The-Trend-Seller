import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';
import {
  sendEmail,
  newOrderAdminEmail,
  orderConfirmationCustomerEmail
} from '@/lib/email';

export async function POST(request) {
  try {
    // Parallel operations for better performance
    const [_, sessionId, body] = await Promise.all([
      connectDB(),
      getSessionId(),
      request.json()
    ]);

    const { shippingAddress, paymentMethod } = body;

    // 🧾 Validate inputs
    if (!shippingAddress)
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );

    if (!paymentMethod)
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      );

    const validMethods = ['cod', 'jazzcash', 'easypaisa', 'bank-transfer'];
    if (!validMethods.includes(paymentMethod))
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      );

    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // 🛒 Get user cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0)
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });

    // 💰 Calculate total
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate delivery charges (free for orders ≥ 7000)
    const deliveryCharges = subtotal >= 7000 ? 0 : 250;
    const totalAmount = subtotal + deliveryCharges;

    // 💳 Determine payment status and URL
    let paymentStatus = 'pending';
    let paymentNote = '';
    let paymentUrl = '';

    switch (paymentMethod) {
      case 'cod':
        paymentStatus = 'pending';
        paymentNote = 'Cash to be paid upon delivery.';
        break;

      case 'jazzcash':
        paymentStatus = 'awaiting_verification';
        paymentNote = 'Please upload your JazzCash payment screenshot for verification.';
        break;

      case 'easypaisa':
        paymentStatus = 'awaiting_verification';
        paymentNote = 'Please upload your EasyPaisa payment screenshot for verification.';
        break;

      case 'bank-transfer':
        paymentStatus = 'awaiting_verification';
        paymentNote = 'Please transfer payment to the listed bank account and upload the screenshot for verification.';
        break;

      default:
        paymentStatus = 'pending';
    }

    // 📦 Create the order and clear cart in parallel for better performance
    const [order] = await Promise.all([
      Order.create({
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
        paymentUrl,
        sessionId,
        status: 'pending',
      }),
      // 🧹 Clear the cart in parallel
      Cart.updateOne(
        { sessionId },
        { $set: { items: [], updatedAt: new Date() } }
      )
    ]);

    // 📧 Send professional email notifications
    const emailPromises = [];

    // 1️⃣ Email to Admin - Professional template
    if (process.env.ADMIN_EMAIL) {
      emailPromises.push(
        sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🛒 New Order #${order.orderNumber} - ${paymentMethod.toUpperCase()} - Rs. ${totalAmount.toLocaleString()}`,
          html: newOrderAdminEmail(order, shippingAddress),
        }).catch(err => {
          console.error('Failed to send admin email:', err);
          return { error: err.message };
        })
      );
    }

    // 2️⃣ Email to Customer - Professional template
    emailPromises.push(
      sendEmail({
        to: shippingAddress.email,
        subject: `✅ Order Confirmed #${order.orderNumber} - The Trend Seller`,
        html: orderConfirmationCustomerEmail(order, shippingAddress),
      }).catch(err => {
        console.error('Failed to send customer email:', err);
        return { error: err.message };
      })
    );

    // Send all emails in parallel
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentNote: order.paymentNote,
        paymentUrl: order.paymentUrl,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
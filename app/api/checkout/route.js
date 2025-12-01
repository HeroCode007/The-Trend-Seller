import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';

import { sendEmail } from '@/lib/email';



export async function POST(request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const body = await request.json();
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
        paymentStatus = 'pending'; // Cash on delivery
        paymentNote = 'Cash to be paid upon delivery.';
        break;

      case 'jazzcash':
        paymentStatus = 'awaiting_verification';
        paymentNote = 'Redirecting to JazzCash for payment';
        paymentUrl = `https://sandbox.jazzcash.com.pk/Checkout?orderId=${Date.now()}&amount=${totalAmount}`;
        break;

      case 'easypaisa':
        paymentStatus = 'awaiting_verification';
        paymentNote = 'Redirecting to Easypaisa for payment';
        paymentUrl = `https://sandbox.easypaisa.com.pk/Checkout?orderId=${Date.now()}&amount=${totalAmount}`;
        break;

      case 'bank-transfer':
        paymentStatus = 'awaiting_verification';
        paymentNote =
          'Please transfer payment To Listed Bank Account and Upload the ScreenShot We will verify your Order';
        break;

      default:
        paymentStatus = 'pending';
    }

    // 📦 Create the order
    // 📦 Create the order
    const order = await Order.create({
      items: cart.items.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount,          // ✅ Total including delivery
      deliveryCharges,      // ✅ Add this line
      paymentMethod,
      paymentStatus,
      paymentNote,
      paymentUrl,
      sessionId,
      status: 'pending',
    });

    // 🧹 Clear the cart
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    // 📧 Send email notifications

    // 1️⃣ Email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received: ${order.orderNumber}`,
      html: `
    <h2>New Order Received</h2>
    <p>Order Number: <strong>${order.orderNumber}</strong></p>
    <p>Payment Method: ${order.paymentMethod}</p>
    <p>Payment Status: ${order.paymentStatus}</p>
    <hr>
    <h3>Customer Details:</h3>
    <p>Name: ${shippingAddress.fullName}</p>
    <p>Email: ${shippingAddress.email}</p>
    <p>Phone: ${shippingAddress.phone}</p>
    <p>Address: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}</p>
    <hr>
    <h3>Order Items:</h3>
    <ul>
      ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
    </ul>
    <p><strong>Subtotal:</strong> ₨${subtotal.toFixed(2)}</p>
    <p><strong>Delivery Charges:</strong> ${deliveryCharges === 0 ? 'FREE' : `₨${deliveryCharges.toFixed(2)}`}</p>
    <p style="font-size: 18px; color: #059669;"><strong>Total Amount: ₨${totalAmount.toFixed(2)}</strong></p>
    <hr>
    <p>Status: <strong>${order.status}</strong></p>
  `,
    });

    // 2️⃣ Email to Customer
    await sendEmail({
      to: shippingAddress.email,
      subject: `Your Order Confirmation: ${order.orderNumber}`,
      html: `
    <h2>Thank you for your order!</h2>
    <p>Order Number: <strong>${order.orderNumber}</strong></p>
    <p>Payment Method: ${order.paymentMethod}</p>
    <p>Payment Status: ${order.paymentStatus}</p>
    <hr>
    <h3>Shipping Address:</h3>
    <p>${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}</p>
    <hr>
    <h3>Order Items:</h3>
    <ul>
      ${order.items.map(item => `<li>${item.name} × ${item.quantity} - ₨${item.price}</li>`).join('')}
    </ul>
    <p><strong>Subtotal:</strong> ₨${subtotal.toFixed(2)}</p>
    <p><strong>Delivery Charges:</strong> ${deliveryCharges === 0 ? 'FREE' : `₨${deliveryCharges.toFixed(2)}`}</p>
    <p style="font-size: 18px; color: #059669;"><strong>Total Amount: ₨${totalAmount.toFixed(2)}</strong></p>
    <hr>
    <p>We will notify you once your order is shipped.</p>
    <p>Thank you for shopping with The Trend Seller!</p>
  `,
    });


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
        paymentUrl: order.paymentUrl, // send URL to frontend
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

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getSessionId } from '@/lib/session';

// 🧾 Create new order
export async function POST(request) {
  try {
    await connectDB();

    const sessionId = await getSessionId();
    const body = await request.json();
    const { shippingAddress, paymentMethod } = body;

    // 🧩 Validate required inputs
    if (!shippingAddress)
      return NextResponse.json({ success: false, error: 'Shipping address is required' }, { status: 400 });

    if (!paymentMethod)
      return NextResponse.json({ success: false, error: 'Payment method is required' }, { status: 400 });

    const validMethods = ['cod', 'card', 'bank-transfer', 'jazzcash', 'easypaisa', 'payfast'];
    if (!validMethods.includes(paymentMethod))
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });

    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // 🛒 Fetch cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0)
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });

    // 💰 Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 💳 Payment status
    const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';

    // 📦 Create new order
    const order = await Order.create({
      sessionId,
      items: cart.items.map((item) => ({
        productId: item.productId, // ✅ Number, matches Cart model
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status: 'pending',
    });

    // 🧹 Clear the cart after order is placed
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    console.log('✅ Order created successfully:', order.orderNumber);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// 📜 Get all orders for a session
export async function GET() {
  try {
    await connectDB();
    const sessionId = await getSessionId();

    const orders = await Order.find({ sessionId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

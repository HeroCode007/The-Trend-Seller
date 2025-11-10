import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { getSessionId } from '@/lib/session';

// POST - Clear entire cart
export async function POST() {
  try {
    await connectDB();
    const sessionId = getSessionId();

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        total: 0,
      },
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}


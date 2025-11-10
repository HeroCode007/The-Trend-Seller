import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { getSessionId } from '@/lib/session';

// GET - Get cart items
export async function GET() {
  try {
    await connectDB();
    const sessionId = await getSessionId();

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }

    return NextResponse.json({
      success: true,
      cart: {
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const body = await request.json();
    const { productId, slug, name, price, image, quantity = 1 } = body;

    if (!productId || !slug || !name || !price || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        slug,
        name,
        price,
        image,
        quantity,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add item to cart',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      cart: {
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const { searchParams } = new URL(request.url);
    const productId = parseInt(searchParams.get('productId'));

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}


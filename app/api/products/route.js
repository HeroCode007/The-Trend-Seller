import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET /api/products - Get all products (public API)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build query
    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    // Fetch products
    const products = await Product.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products: products.map(p => ({
        id: p._id.toString(),
        slug: p.slug,
        name: p.name,
        productCode: p.productCode,
        price: p.price,
        image: p.image,
        images: p.images || [],
        description: p.description || '',
        features: p.features || [],
        category: p.category,
        inStock: p.inStock,
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

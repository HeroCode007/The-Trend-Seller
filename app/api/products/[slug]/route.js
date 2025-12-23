import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET /api/products/[slug] - Get single product by slug (public API)
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = params;

    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product._id.toString(),
        slug: product.slug,
        name: product.name,
        productCode: product.productCode,
        price: product.price,
        image: product.image,
        images: product.images || [],
        description: product.description || '',
        features: product.features || [],
        category: product.category,
        inStock: product.inStock,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

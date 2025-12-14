import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET - Fetch single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check for duplicates
    if (body.slug && body.slug !== existingProduct.slug) {
      body.slug = body.slug.toLowerCase().trim();
      const duplicateSlug = await Product.findOne({
        slug: body.slug,
        _id: { $ne: id }
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: 'A product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // If productCode is being changed, check for duplicates
    if (body.productCode && body.productCode !== existingProduct.productCode) {
      body.productCode = body.productCode.toUpperCase().trim();
      const duplicateCode = await Product.findOne({
        productCode: body.productCode,
        _id: { $ne: id }
      });
      if (duplicateCode) {
        return NextResponse.json(
          { success: false, error: 'A product with this product code already exists' },
          { status: 409 }
        );
      }
    }

    // Ensure slug is lowercase if provided
    if (body.slug) {
      body.slug = body.slug.toLowerCase().trim();
    }

    // Ensure productCode is uppercase if provided
    if (body.productCode) {
      body.productCode = body.productCode.toUpperCase().trim();
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `A product with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update product', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product', message: error.message },
      { status: 500 }
    );
  }
}
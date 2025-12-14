import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, item: product });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    if (body.slug) {
      body.slug = String(body.slug).toLowerCase().trim();
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, item: product });
  } catch (error) {
    const status = error?.code === 11000 ? 409 : 400;
    return Response.json({ success: false, message: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

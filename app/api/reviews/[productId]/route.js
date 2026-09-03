import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Helper to resolve real Product ObjectId
async function resolveProductId(param) {
  if (!param) return null;
  if (mongoose.isValidObjectId(param)) {
    return param;
  }
  const product = await Product.findOne({
    $or: [
      { slug: param },
      { productCode: param }
    ]
  }).select('_id').lean();

  return product ? product._id.toString() : null;
}

// GET - Fetch reviews for a product
export async function GET(request, { params }) {
  try {
    await connectDB();
    const rawProductId = params?.productId;
    const targetProductId = (await resolveProductId(rawProductId)) || rawProductId;

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sort = searchParams.get('sort') || 'recent'; // recent, helpful, rating-high, rating-low

    if (!mongoose.isValidObjectId(targetProductId)) {
      return NextResponse.json({
        success: true,
        reviews: [],
        stats: { averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        pagination: { page: 1, limit, total: 0, pages: 0 }
      });
    }

    // Build query
    const query = {
      productId: new mongoose.Types.ObjectId(targetProductId),
      isApproved: true // Only show approved reviews
    };

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'helpful':
        sortObj = { helpful: -1, createdAt: -1 };
        break;
      case 'rating-high':
        sortObj = { rating: -1, createdAt: -1 };
        break;
      case 'rating-low':
        sortObj = { rating: 1, createdAt: -1 };
        break;
      default: // recent
        sortObj = { createdAt: -1 };
    }

    // Execute query
    const skip = (page - 1) * limit;
    const [reviews, totalReviews, allRatings] = await Promise.all([
      Review.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
      Review.find(query, 'rating').lean()
    ]);

    // Calculate rating stats safely
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let averageRating = 0;
    if (allRatings.length > 0) {
      let sum = 0;
      allRatings.forEach(r => {
        sum += r.rating;
        if (distribution[r.rating] !== undefined) {
          distribution[r.rating]++;
        }
      });
      averageRating = parseFloat((sum / allRatings.length).toFixed(1));
    }

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        averageRating,
        totalReviews,
        distribution
      },
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews', message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request, { params }) {
  try {
    await connectDB();
    const rawProductId = params?.productId;
    const targetProductId = (await resolveProductId(rawProductId)) || rawProductId;

    if (!mongoose.isValidObjectId(targetProductId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product identifier' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { name, email, rating, title, comment, images } = body;

    // Validation
    if (!name || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'Name, rating, title, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      productId: new mongoose.Types.ObjectId(targetProductId),
      name,
      email,
      rating: parseInt(rating),
      title,
      comment,
      images: images || [],
      isApproved: false // Needs admin approval
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! It will be published after approval.',
      review
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review', message: error.message },
      { status: 500 }
    );
  }
}

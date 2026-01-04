import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

// GET - Fetch reviews for a product
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { productId } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sort = searchParams.get('sort') || 'recent'; // recent, helpful, rating-high, rating-low

    // Build query
    const query = {
      productId,
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
    const [reviews, totalReviews, stats, distribution] = await Promise.all([
      Review.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
      Review.getAverageRating(productId),
      Review.getRatingDistribution(productId)
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        averageRating: stats.averageRating || 0,
        totalReviews: stats.totalReviews || 0,
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
      { success: false, error: 'Failed to fetch reviews', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { productId } = params;
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
      productId,
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

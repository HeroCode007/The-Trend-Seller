import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import '@/models/Product'; // Import to ensure model is registered for populate()

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Fetch all reviews for admin
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status') || 'all'; // all, pending, approved

    // Build query
    let query = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const [reviews, totalReviews] = await Promise.all([
      Review.find(query)
        .populate({
          path: 'productId',
          select: 'name slug',
          // Handle case where product doesn't exist
          options: { strictPopulate: false }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query)
    ]);

    // Filter out reviews with null productId (deleted products)
    // and format reviews with product info or placeholder
    const formattedReviews = reviews.map(review => ({
      ...review,
      productId: review.productId || {
        _id: null,
        name: 'Product Deleted',
        slug: null
      }
    }));

    const response = NextResponse.json({
      success: true,
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      }
    });

    // Add cache control headers to prevent mobile caching issues
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

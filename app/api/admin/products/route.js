import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET - Fetch all products with filtering and pagination
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        // Query parameters
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const inStock = searchParams.get('inStock');
        const isActive = searchParams.get('isActive');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { productCode: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (inStock !== null && inStock !== undefined && inStock !== 'all') {
            query.inStock = inStock === 'true';
        }

        if (isActive !== null && isActive !== undefined && isActive !== 'all') {
            query.isActive = isActive === 'true';
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products', message: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new product
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'productCode', 'price', 'image', 'category'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Generate slug if not provided
        if (!body.slug) {
            body.slug = body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Ensure slug is lowercase
        body.slug = body.slug.toLowerCase().trim();

        // Check for duplicate slug
        const existingSlug = await Product.findOne({ slug: body.slug });
        if (existingSlug) {
            return NextResponse.json(
                { success: false, error: 'A product with this slug already exists' },
                { status: 409 }
            );
        }

        // Check for duplicate product code
        const existingCode = await Product.findOne({ productCode: body.productCode.toUpperCase() });
        if (existingCode) {
            return NextResponse.json(
                { success: false, error: 'A product with this product code already exists' },
                { status: 409 }
            );
        }

        // Ensure productCode is uppercase
        body.productCode = body.productCode.toUpperCase().trim();

        // Create product
        const product = await Product.create(body);

        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            product
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);

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
            { success: false, error: 'Failed to create product', message: error.message },
            { status: 500 }
        );
    }
}
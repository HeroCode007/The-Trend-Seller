import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
        // Removed index: true since we define it below with schema.index()
    },
    productCode: {
        type: String,
        required: [true, 'Product code is required'],
        unique: true,
        uppercase: true,
        trim: true
        // Removed index: true since we define it below with schema.index()
    },

    // Pricing
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
        type: Number,
        default: null,
        min: [0, 'Compare at price cannot be negative']
    },

    // Images
    image: {
        type: String,
        required: [true, 'Main image is required']
    },
    images: [{
        type: String
    }],

    // Description & Details
    description: {
        type: String,
        default: ''
    },
    features: [{
        type: String
    }],

    // Category - matches your existing structure
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'premium-watches',
            'casual-watches',
            'stylish-watches',
            'women-watches',
            'belts',
            'wallets'
        ]
    },

    // Inventory
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },

    // SEO
    metaTitle: {
        type: String,
        default: ''
    },
    metaDescription: {
        type: String,
        default: ''
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },

    // Sorting
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
// Note: slug and productCode already have unique:true which creates an index
// So we only add additional composite indexes here
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, category: 1 });
ProductSchema.index({ price: 1 });

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function () {
    return `Rs. ${this.price.toLocaleString('en-PK')}`;
});

// Pre-save middleware to generate slug from name if not provided
ProductSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Static method to get products by category
ProductSchema.statics.getByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

// Ensure virtuals are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
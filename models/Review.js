import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  // Product reference
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },

  // Reviewer information
  name: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },

  // Review content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },

  // Helpful votes
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },

  // Verification status
  verified: {
    type: Boolean,
    default: false
  },

  // Moderation
  isApproved: {
    type: Boolean,
    default: false // Reviews need approval before showing
  },

  // Metadata
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ isApproved: 1, productId: 1 });

// Virtual for formatted date
ReviewSchema.virtual('formattedDate').get(function () {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return this.createdAt.toLocaleDateString('en-US', options);
});

// Static method to get average rating for a product
ReviewSchema.statics.getAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Static method to get rating distribution
ReviewSchema.statics.getRatingDistribution = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  // Initialize all ratings to 0
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result.forEach(item => {
    distribution[item._id] = item.count;
  });

  return distribution;
};

// Ensure virtuals are included in JSON output
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);

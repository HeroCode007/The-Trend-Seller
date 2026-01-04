'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Check, AlertCircle } from 'lucide-react';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${productId}?sort=${sortBy}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({ type: 'success', text: data.message });
        setFormData({ name: '', rating: 5, title: '', comment: '' });
        setShowWriteReview(false);
        // Don't fetch reviews immediately since they need approval
      } else {
        setSubmitMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to submit review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, interactive = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600 w-8">{rating} ★</span>
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-neutral-500 w-12 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Customer Reviews</h2>
        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
        >
          {showWriteReview ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            submitMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitMessage.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{submitMessage.text}</p>
        </div>
      )}

      {/* Write Review Form */}
      {showWriteReview && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Write Your Review</h3>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={formData.rating}
                interactive
                onChange={(rating) => setFormData({ ...formData, rating })}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="Your name"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="Summarize your experience"
                maxLength={200}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                placeholder="Tell us about your experience with this product"
                minLength={10}
                maxLength={2000}
              />
              <p className="text-xs text-neutral-500 mt-1">
                {formData.comment.length}/2000 characters (minimum 10)
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-300 text-white font-semibold rounded-xl transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <p className="text-xs text-neutral-500 text-center">
              Your review will be published after admin approval
            </p>
          </div>
        </form>
      )}

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-neutral-200">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
            <div className="text-5xl font-bold text-neutral-900">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
            </div>
            <div>
              <StarRating rating={Math.round(stats.averageRating)} />
              <p className="text-sm text-neutral-500 mt-1">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={stats.distribution[rating] || 0}
              total={stats.totalReviews}
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      {stats.totalReviews > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-neutral-900">
            {stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No reviews yet</h3>
          <p className="text-neutral-500 mb-4">Be the first to review this product!</p>
          <button
            onClick={() => setShowWriteReview(true)}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
          >
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-700 font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-neutral-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h5 className="font-semibold text-neutral-900 mb-2">{review.title}</h5>
              <p className="text-neutral-600 leading-relaxed mb-3">{review.comment}</p>

              <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

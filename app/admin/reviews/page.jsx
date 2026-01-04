'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Search,
    Star,
    ThumbsUp,
    Check,
    X,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MessageSquare,
    RefreshCw,
    Filter,
    AlertTriangle,
    Eye,
    Calendar,
    User
} from 'lucide-react';

export default function AdminReviewsPage() {
    // State
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending'); // all, pending, approved
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, review: null });
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);

    const ITEMS_PER_PAGE = 20;

    // Fetch reviews
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });

            if (statusFilter !== 'all') params.append('status', statusFilter);

            const res = await fetch(`/api/admin/reviews?${params}`);
            const data = await res.json();

            if (data.success) {
                setReviews(data.reviews || []);
                setPagination(data.pagination);
            } else {
                showToast('error', data.error || 'Failed to fetch reviews');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showToast('error', 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    // Toast notification
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Handle approve review
    const handleApprove = async (review) => {
        setActionLoading(review._id);
        try {
            const res = await fetch(`/api/admin/reviews/${review._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: true })
            });
            const data = await res.json();

            if (data.success) {
                showToast('success', 'Review approved successfully');
                fetchReviews();
            } else {
                showToast('error', data.error || 'Failed to approve review');
            }
        } catch (error) {
            console.error('Error approving review:', error);
            showToast('error', 'Failed to approve review');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle reject review
    const handleReject = async (review) => {
        setActionLoading(review._id);
        try {
            const res = await fetch(`/api/admin/reviews/${review._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: false })
            });
            const data = await res.json();

            if (data.success) {
                showToast('success', 'Review rejected');
                fetchReviews();
            } else {
                showToast('error', data.error || 'Failed to reject review');
            }
        } catch (error) {
            console.error('Error rejecting review:', error);
            showToast('error', 'Failed to reject review');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle delete
    const handleDelete = async (review) => {
        setActionLoading(review._id);
        try {
            const res = await fetch(`/api/admin/reviews/${review._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                showToast('success', 'Review deleted successfully');
                fetchReviews();
            } else {
                showToast('error', data.error || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            showToast('error', 'Failed to delete review');
        } finally {
            setActionLoading(null);
            setDeleteModal({ open: false, review: null });
        }
    };

    // Filter reviews by search query
    const filteredReviews = reviews.filter(review => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            review.name?.toLowerCase().includes(query) ||
            review.title?.toLowerCase().includes(query) ||
            review.comment?.toLowerCase().includes(query) ||
            review.productId?.name?.toLowerCase().includes(query)
        );
    });

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Star rating display
    const StarRating = ({ rating }) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    const pendingCount = reviews.filter(r => !r.isApproved).length;
    const approvedCount = reviews.filter(r => r.isApproved).length;

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
                    <p className="text-neutral-500 mt-1">
                        {pagination?.total || 0} total reviews
                        {pendingCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                {pendingCount} pending
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={fetchReviews}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by reviewer name, product, or review content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${statusFilter === 'all'
                                    ? 'bg-neutral-900 text-white'
                                    : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                                }`}
                        >
                            All ({reviews.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${statusFilter === 'pending'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                                }`}
                        >
                            Pending ({pendingCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('approved')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${statusFilter === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                                }`}
                        >
                            Approved ({approvedCount})
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {filteredReviews.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No reviews found</h3>
                        <p className="text-neutral-500">
                            {searchQuery ? 'Try adjusting your search query' : 'Reviews will appear here once customers submit them'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filteredReviews.map((review) => (
                            <div key={review._id} className="p-6 hover:bg-neutral-50 transition-colors">
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                <span className="text-amber-700 font-semibold text-sm">
                                                    {review.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-neutral-900">{review.name}</h4>
                                                    {review.verified && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StarRating rating={review.rating} />
                                                    <span className="text-xs text-neutral-500">
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        {review.productId && (
                                            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                                                <Eye className="w-4 h-4" />
                                                <span>Product: </span>
                                                <Link
                                                    href={`/watches/${review.productId.slug}`}
                                                    target="_blank"
                                                    className="text-amber-600 hover:text-amber-700 font-medium"
                                                >
                                                    {review.productId.name}
                                                </Link>
                                            </div>
                                        )}

                                        {/* Review Content */}
                                        <h5 className="font-semibold text-neutral-900 mb-2">{review.title}</h5>
                                        <p className="text-neutral-600 leading-relaxed mb-3">{review.comment}</p>

                                        {/* Helpful Count */}
                                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{review.helpful || 0} people found this helpful</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="ml-4">
                                        {review.isApproved ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                <Check className="w-4 h-4" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                                <AlertTriangle className="w-4 h-4" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                                    {!review.isApproved ? (
                                        <>
                                            <button
                                                onClick={() => handleApprove(review)}
                                                disabled={actionLoading === review._id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {actionLoading === review._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(review)}
                                                disabled={actionLoading === review._id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleReject(review)}
                                            disabled={actionLoading === review._id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {actionLoading === review._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <X className="w-4 h-4" />
                                            )}
                                            Unapprove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setDeleteModal({ open: true, review })}
                                        disabled={actionLoading === review._id}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">
                            Page {currentPage} of {pagination.pages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || loading}
                                className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            disabled={loading}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-amber-500 text-white'
                                                    : 'hover:bg-neutral-100 text-neutral-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={currentPage === pagination.pages || loading}
                                className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">Delete Review</h3>
                                <p className="text-sm text-neutral-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete this review by <strong>"{deleteModal.review?.name}"</strong>? This will permanently remove the review.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal({ open: false, review: null })}
                                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.review)}
                                disabled={actionLoading === deleteModal.review?._id}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {actionLoading === deleteModal.review?._id && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

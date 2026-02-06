'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Package,
    RefreshCw,
    Filter,
    X,
    AlertTriangle,
    Check,
    Copy,
    MoreVertical,
    ArrowUpDown,
    Star,
    StarOff
} from 'lucide-react';

export default function AdminProductsPage() {
    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
    const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);

    const ITEMS_PER_PAGE = 20;

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'premium-watches', label: 'Premium Watches' },
        { value: 'casual-watches', label: 'Casual Watches' },
        { value: 'stylish-watches', label: 'Stylish Watches' },
        { value: 'belts', label: 'Belts' },
        { value: 'wallets', label: 'Wallets' }
    ];

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                sortBy,
                sortOrder,
            });

            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (stockFilter !== 'all') params.append('inStock', stockFilter);
            if (statusFilter !== 'all') params.append('isActive', statusFilter);
            if (searchQuery) params.append('search', searchQuery);

            const res = await fetch(`/api/admin/products?${params}`);
            const data = await res.json();

            if (data.success) {
                setProducts(data.products || []);
                setPagination(data.pagination);
            } else {
                showToast('error', data.error || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('error', 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [currentPage, categoryFilter, stockFilter, statusFilter, sortBy, sortOrder, searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryFilter, stockFilter, statusFilter, searchQuery]);

    // Toast notification
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Handle delete
    const handleDelete = async (product) => {
        setActionLoading(product._id);
        try {
            const res = await fetch(`/api/admin/products/${product._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                showToast('success', `"${product.name}" deleted successfully`);
                fetchProducts();
            } else {
                showToast('error', data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('error', 'Failed to delete product');
        } finally {
            setActionLoading(null);
            setDeleteModal({ open: false, product: null });
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        setActionLoading('bulk');
        try {
            const deletePromises = selectedProducts.map(id =>
                fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
            );
            await Promise.all(deletePromises);
            showToast('success', `${selectedProducts.length} products deleted successfully`);
            setSelectedProducts([]);
            fetchProducts();
        } catch (error) {
            console.error('Error bulk deleting:', error);
            showToast('error', 'Failed to delete some products');
        } finally {
            setActionLoading(null);
            setBulkDeleteModal(false);
        }
    };

    // Toggle product status
    const toggleStatus = async (product, field) => {
        setActionLoading(product._id);
        try {
            const res = await fetch(`/api/admin/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: !product[field] })
            });
            const data = await res.json();

            if (data.success) {
                showToast('success', `Product ${field === 'isActive' ? 'status' : 'stock'} updated`);
                fetchProducts();
            } else {
                showToast('error', data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            showToast('error', 'Failed to update product');
        } finally {
            setActionLoading(null);
        }
    };

    // Copy product code
    const copyProductCode = (code) => {
        navigator.clipboard.writeText(code);
        showToast('success', 'Product code copied to clipboard');
    };

    // Select all products on current page
    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p._id));
        }
    };

    // Toggle single product selection
    const toggleSelectProduct = (id) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Handle sort
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Format currency
    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;

    // Get category label
    const getCategoryLabel = (category) => {
        return categories.find(c => c.value === category)?.label || category;
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'premium-watches': 'bg-amber-100 text-amber-700 border-amber-200',
            'casual-watches': 'bg-stone-100 text-stone-700 border-stone-200',
            'stylish-watches': 'bg-neutral-100 text-neutral-700 border-neutral-200',
            'belts': 'bg-rose-100 text-rose-700 border-rose-200',
            'wallets': 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setStockFilter('all');
        setStatusFilter('all');
        setSortBy('createdAt');
        setSortOrder('desc');
    };

    const hasActiveFilters = categoryFilter !== 'all' || stockFilter !== 'all' || statusFilter !== 'all' || searchQuery;

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
                    <p className="text-neutral-500 mt-1">
                        {pagination?.totalCount || 0} total products
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchProducts}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by name, code, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-medium transition-all ${showFilters || hasActiveFilters
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full">
                                {[categoryFilter !== 'all', stockFilter !== 'all', statusFilter !== 'all', searchQuery].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear all
                        </button>
                    )}
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Stock Status</label>
                            <div className="relative">
                                <select
                                    value={stockFilter}
                                    onChange={(e) => setStockFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="all">All Stock</option>
                                    <option value="true">In Stock</option>
                                    <option value="false">Out of Stock</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Visibility</label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Hidden</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
                            <div className="relative">
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="w-full appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="createdAt-asc">Oldest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name-asc">Name: A to Z</option>
                                    <option value="name-desc">Name: Z to A</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-amber-700 font-medium">
                        {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedProducts([])}
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                            Clear Selection
                        </button>
                        <button
                            onClick={() => setBulkDeleteModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Products Table / Cards */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No products found</h3>
                        <p className="text-neutral-500 mb-6">
                            {hasActiveFilters
                                ? 'Try adjusting your filters or search query'
                                : 'Get started by adding your first product'}
                        </p>
                        {hasActiveFilters ? (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
                            >
                                Clear Filters
                            </button>
                        ) : (
                            <Link
                                href="/admin/products/new"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-neutral-100">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className={`p-4 ${selectedProducts.includes(product._id) ? 'bg-amber-50/50' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={() => toggleSelectProduct(product._id)}
                                                className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                                            />
                                            <div className="relative w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-neutral-300" />
                                                    </div>
                                                )}
                                                {product.isFeatured && (
                                                    <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                        <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/admin/products/${product._id}`}
                                                className="font-medium text-neutral-900 hover:text-amber-600 transition-colors line-clamp-2 text-sm"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(product.category)}`}>
                                                    {getCategoryLabel(product.category)}
                                                </span>
                                                <button
                                                    onClick={() => copyProductCode(product.productCode)}
                                                    className="text-[10px] font-mono text-neutral-500 hover:text-amber-600 flex items-center gap-1"
                                                >
                                                    {product.productCode}
                                                    <Copy className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div>
                                                    <span className="font-semibold text-neutral-900 text-sm">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                        <span className="text-[10px] text-neutral-400 line-through ml-1">
                                                            {formatCurrency(product.compareAtPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                                <button
                                                    onClick={() => toggleStatus(product, 'inStock')}
                                                    disabled={actionLoading === product._id}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${product.inStock
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    {product.inStock ? 'In Stock' : 'Out'}
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(product, 'isActive')}
                                                    disabled={actionLoading === product._id}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${product.isActive
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-neutral-100 text-neutral-500'
                                                        }`}
                                                >
                                                    {product.isActive ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                                                    {product.isActive ? 'Active' : 'Hidden'}
                                                </button>
                                                <div className="flex items-center gap-0.5 ml-auto">
                                                    <Link
                                                        href={`/admin/products/${product._id}`}
                                                        className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleStatus(product, 'isFeatured')}
                                                        disabled={actionLoading === product._id}
                                                        className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-amber-500' : 'text-neutral-400'}`}
                                                    >
                                                        {product.isFeatured ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, product })}
                                                        disabled={actionLoading === product._id}
                                                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.length === products.length && products.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                                            <button
                                                onClick={() => handleSort('productCode')}
                                                className="flex items-center gap-1 hover:text-neutral-700"
                                            >
                                                Code
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                                            <button
                                                onClick={() => handleSort('price')}
                                                className="flex items-center gap-1 hover:text-neutral-700"
                                            >
                                                Price
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Stock</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {products.map((product) => (
                                        <tr
                                            key={product._id}
                                            className={`hover:bg-neutral-50 transition-colors ${selectedProducts.includes(product._id) ? 'bg-amber-50/50' : ''
                                                }`}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => toggleSelectProduct(product._id)}
                                                    className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-14 h-14 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-6 h-6 text-neutral-300" />
                                                            </div>
                                                        )}
                                                        {product.isFeatured && (
                                                            <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                                <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/admin/products/${product._id}`}
                                                            className="font-medium text-neutral-900 hover:text-amber-600 transition-colors line-clamp-1"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                                                            /{product.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => copyProductCode(product.productCode)}
                                                    className="flex items-center gap-1.5 text-sm font-mono text-neutral-600 hover:text-amber-600 transition-colors"
                                                >
                                                    {product.productCode}
                                                    <Copy className="w-3 h-3 opacity-50" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(product.category)}`}>
                                                    {getCategoryLabel(product.category)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-semibold text-neutral-900">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                    <span className="text-xs text-neutral-400 line-through ml-2">
                                                        {formatCurrency(product.compareAtPrice)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleStatus(product, 'inStock')}
                                                    disabled={actionLoading === product._id}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${product.inStock
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleStatus(product, 'isActive')}
                                                    disabled={actionLoading === product._id}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${product.isActive
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                                                        }`}
                                                >
                                                    {product.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Hidden
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/products/${product._id}`}
                                                        className="p-2 text-neutral-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleStatus(product, 'isFeatured')}
                                                        disabled={actionLoading === product._id}
                                                        className={`p-2 rounded-lg transition-colors ${product.isFeatured
                                                                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                                                : 'text-neutral-400 hover:text-amber-500 hover:bg-amber-50'
                                                            }`}
                                                        title={product.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                                                    >
                                                        {product.isFeatured ? (
                                                            <Star className="w-4 h-4 fill-current" />
                                                        ) : (
                                                            <StarOff className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, product })}
                                                        disabled={actionLoading === product._id}
                                                        className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="px-4 sm:px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-neutral-500">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalCount)} of {pagination.totalCount}
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={!pagination.hasPrevPage || loading}
                                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    disabled={loading}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
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
                                        onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={!pagination.hasNextPage || loading}
                                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
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
                                <h3 className="text-lg font-semibold text-neutral-900">Delete Product</h3>
                                <p className="text-sm text-neutral-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete <strong>"{deleteModal.product?.name}"</strong>? This will permanently remove the product from your store.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal({ open: false, product: null })}
                                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.product)}
                                disabled={actionLoading === deleteModal.product?._id}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {actionLoading === deleteModal.product?._id && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Modal */}
            {bulkDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">Delete Multiple Products</h3>
                                <p className="text-sm text-neutral-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete <strong>{selectedProducts.length} products</strong>? This will permanently remove them from your store.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setBulkDeleteModal(false)}
                                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={actionLoading === 'bulk'}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {actionLoading === 'bulk' && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete {selectedProducts.length} Products
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
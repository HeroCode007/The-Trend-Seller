'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Edit, Trash2, Package, Loader2, ChevronDown, AlertCircle, X } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (data.success) setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.product) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${deleteModal.product.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p.id !== deleteModal.product.id));
                setMessage({ type: 'success', text: 'Product deleted successfully!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to delete product' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete product' });
        } finally {
            setDeleting(false);
            setDeleteModal({ open: false, product: null });
        }
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;

    const getCategoryLabel = (category) => {
        const labels = { 'premium-watches': 'Premium Watches', 'casual-watches': 'Casual Watches', 'stylish-watches': 'Stylish Watches', 'belts': 'Belts', 'wallets': 'Wallets' };
        return labels[category] || category;
    };

    const getCategoryColor = (category) => {
        const colors = { 'premium-watches': 'bg-amber-100 text-amber-700', 'casual-watches': 'bg-blue-100 text-blue-700', 'stylish-watches': 'bg-purple-100 text-purple-700', 'belts': 'bg-orange-100 text-orange-700', 'wallets': 'bg-green-100 text-green-700' };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const categories = [...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || product.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) || product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
                    <p className="text-neutral-500 mt-1">{products.length} total products</p>
                </div>
                <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
                    <Plus className="w-5 h-5" /> Add Product
                </Link>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4" /></button>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
                    </div>
                    <div className="relative">
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer">
                            <option value="all">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">No products found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="aspect-square relative bg-neutral-100">
                                {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-neutral-300" /></div>}
                                {product.inStock === false && <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">Out of Stock</div>}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link href={`/admin/products/${product.id}`} className="p-2.5 bg-white rounded-xl hover:bg-neutral-100 transition-colors" title="Edit"><Edit className="w-5 h-5 text-neutral-700" /></Link>
                                    <button onClick={() => setDeleteModal({ open: true, product })} className="p-2.5 bg-white rounded-xl hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-5 h-5 text-red-600" /></button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>{getCategoryLabel(product.category)}</span>
                                    <span className="text-xs text-neutral-400">{product.productCode}</span>
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-lg font-bold text-amber-600">{formatCurrency(product.price)}</p>
                                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                                    <span className={`text-sm ${product.inStock === false ? 'text-red-500' : 'text-green-600'}`}>{product.inStock === false ? 'Out of Stock' : 'In Stock'}</span>
                                    <Link href={`/admin/products/${product.id}`} className="text-sm text-amber-600 hover:text-amber-700 font-medium">Edit →</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModal({ open: false, product: null })} />
                    <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                            <div><h3 className="text-lg font-semibold text-neutral-900">Delete Product</h3><p className="text-neutral-500 text-sm">This action cannot be undone.</p></div>
                        </div>
                        <p className="text-neutral-600 mb-6">Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ open: false, product: null })} className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  FileText,
  Search,
  Plus,
  X,
  Eye,
  EyeOff,
  Star,
  Check,
  AlertCircle,
  Watch,
  Crown,
  Sparkles,
  Wallet,
  CircleDot,
  Loader2,
  Trash2
} from 'lucide-react';

const categories = [
  { value: 'premium-watches', label: 'Premium Watches', icon: Crown },
  { value: 'casual-watches', label: 'Casual Watches', icon: Watch },
  { value: 'stylish-watches', label: 'Stylish Watches', icon: Sparkles },
  { value: 'belts', label: 'Belts', icon: CircleDot },
  { value: 'wallets', label: 'Wallets', icon: Wallet },
];

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Package },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'seo', label: 'SEO', icon: Search },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    productCode: '',
    category: 'premium-watches',
    price: '',
    compareAtPrice: '',
    image: '',
    images: [],
    description: '',
    features: [],
    stockQuantity: 10,
    sortOrder: 0,
    isActive: true,
    inStock: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        productCode: data.productCode || '',
        category: data.category || 'premium-watches',
        price: data.price?.toString() || '',
        compareAtPrice: data.compareAtPrice?.toString() || '',
        image: data.image || '',
        images: data.images || [],
        description: data.description || '',
        features: data.features || [],
        stockQuantity: data.stockQuantity || 0,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
        inStock: data.inStock ?? true,
        isFeatured: data.isFeatured ?? false,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
      });
    } catch (error) {
      showToast(error.message, 'error');
      setTimeout(() => router.push('/admin/products'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.productCode.trim()) newErrors.productCode = 'Product code is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.image.trim()) newErrors.image = 'Main image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          stockQuantity: parseInt(formData.stockQuantity),
          sortOrder: parseInt(formData.sortOrder),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      showToast('Product updated successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      showToast('Product deleted successfully!');
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (error) {
      showToast(error.message, 'error');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Rs. 0';
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-zinc-400">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Product</h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete "{formData.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 rounded-lg transition-colors flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products"
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Edit Product</h1>
                <p className="text-sm text-zinc-400">{formData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-amber-600 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-zinc-700'
                          }`}
                        placeholder="Enter product name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${errors.slug ? 'border-red-500' : 'border-zinc-700'
                          }`}
                        placeholder="product-slug"
                      />
                      {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Product Code *
                      </label>
                      <input
                        type="text"
                        name="productCode"
                        value={formData.productCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors uppercase ${errors.productCode ? 'border-red-500' : 'border-zinc-700'
                          }`}
                        placeholder="TTS-001"
                      />
                      {errors.productCode && <p className="mt-1 text-sm text-red-500">{errors.productCode}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Category *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${formData.category === cat.value
                                ? 'bg-amber-600 border-amber-500 text-white'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                              }`}
                          >
                            <cat.icon className="w-4 h-4" />
                            <span className="text-xs">{cat.label.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${errors.price ? 'border-red-500' : 'border-zinc-700'
                          }`}
                        placeholder="2999"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Compare at Price (Rs.)
                      </label>
                      <input
                        type="number"
                        name="compareAtPrice"
                        value={formData.compareAtPrice}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="3999"
                      />
                      <p className="mt-1 text-xs text-zinc-500">Original price before discount</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
                    Product Media
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Main Image URL *
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${errors.image ? 'border-red-500' : 'border-zinc-700'
                        }`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                    {formData.image && (
                      <div className="mt-4">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-lg border border-zinc-700"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Additional Images
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="https://example.com/image.jpg"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                              onError={(e) => e.target.src = '/placeholder.png'}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Product Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-zinc-700'
                        }`}
                      placeholder="Describe your product..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Features
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {formData.features.length > 0 && (
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-lg"
                          >
                            <span className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="p-1 hover:bg-zinc-700 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-zinc-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      />
                      <p className="mt-1 text-xs text-zinc-500">Lower numbers appear first</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-500" />
                    SEO Settings
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="SEO optimized title"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Brief description for search engines"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  {/* Search Preview */}
                  <div className="border border-zinc-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Search Preview</h3>
                    <div className="space-y-1">
                      <p className="text-blue-400 text-lg hover:underline cursor-pointer">
                        {formData.metaTitle || formData.name || 'Product Title'}
                      </p>
                      <p className="text-green-500 text-sm">
                        thetrendseller.com/product/{formData.slug || 'product-slug'}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        {formData.metaDescription || formData.description?.substring(0, 160) || 'Product description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300">Active</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-600' : 'bg-zinc-700'
                      }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300">In Stock</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${formData.inStock ? 'bg-green-600' : 'bg-zinc-700'
                      }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.inStock ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Featured
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-amber-600' : 'bg-zinc-700'
                      }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.isFeatured ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Card */}
            {showPreview && formData.name && (
              <div className="bg-zinc-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Product Preview</h3>
                <div className="space-y-4">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full aspect-square object-cover rounded-lg"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <div>
                    <p className="text-xs text-amber-500 uppercase tracking-wide mb-1">
                      {categories.find(c => c.value === formData.category)?.label}
                    </p>
                    <h4 className="font-semibold text-lg">{formData.name}</h4>
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                      {formData.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xl font-bold text-amber-500">
                        {formatPrice(formData.price)}
                      </span>
                      {formData.compareAtPrice && (
                        <span className="text-sm text-zinc-500 line-through">
                          {formatPrice(formData.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Product Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Product ID</dt>
                  <dd className="text-zinc-300 font-mono text-xs">{productId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Product Code</dt>
                  <dd className="text-zinc-300">{formData.productCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Category</dt>
                  <dd className="text-zinc-300">{categories.find(c => c.value === formData.category)?.label}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    productCode: '',
    price: '',
    image: '',
    images: '',
    description: '',
    features: '',
    category: 'premium-watches',
    inStock: true,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();

      if (!data.success) {
        setError('Product not found');
        return;
      }

      const product = data.item;
      setFormData({
        name: product.name,
        slug: product.slug,
        productCode: product.productCode,
        price: product.price,
        image: product.image,
        images: (product.images || []).join('\n'),
        description: product.description || '',
        features: (product.features || []).join('\n'),
        category: product.category,
        inStock: product.inStock,
      });
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images
          .split('\n')
          .map((img) => img.trim())
          .filter((img) => img),
        features: formData.features
          .split('\n')
          .map((feat) => feat.trim())
          .filter((feat) => feat),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to update product');
        return;
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to delete product');
        setDeleting(false);
        return;
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'An error occurred');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
        <p className="text-neutral-500 mt-1">Update product details</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Rolex Daytona"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., rolex-daytona"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Code *</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., TTS-PW-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., 4899"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="premium-watches">Premium Watches</option>
                <option value="casual-watches">Casual Watches</option>
                <option value="stylish-watches">Stylish Watches</option>
                <option value="belts">Belts</option>
                <option value="wallets">Wallets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Main Image URL *</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., /images/product.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Features (one per line)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Additional Images (one URL per line)</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="/images/img1.jpg&#10;/images/img2.jpg"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="inStock"
              id="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-neutral-700">
              In Stock
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium inline-flex items-center justify-center gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? 'Deleting...' : <><Trash2 className="w-4 h-4" /> Delete</>}
            </button>
            <Link
              href="/admin/products"
              className="flex-1 bg-neutral-200 text-neutral-900 py-2 rounded-lg hover:bg-neutral-300 font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

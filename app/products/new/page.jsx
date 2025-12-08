'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, Upload, X, Plus } from 'lucide-react';

export default function AddProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '', productCode: '', price: '', category: 'premium-watches', description: '', image: '', images: [], features: [''], inStock: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeFeature = (index) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));

    const handleImageUpload = async (e, isGallery = false) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setMessage({ type: 'error', text: 'Please upload an image file' }); return; }
        if (file.size > 5 * 1024 * 1024) { setMessage({ type: 'error', text: 'Image must be less than 5MB' }); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
            if (isGallery) setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
            else setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const removeGalleryImage = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        if (!formData.name || !formData.price || !formData.category) { setMessage({ type: 'error', text: 'Please fill in all required fields' }); setSaving(false); return; }
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, price: parseFloat(formData.price), features: formData.features.filter(f => f.trim() !== '') })
            });
            const data = await res.json();
            if (data.success) { setMessage({ type: 'success', text: 'Product created successfully!' }); setTimeout(() => router.push('/admin/products'), 1000); }
            else setMessage({ type: 'error', text: data.error || 'Failed to create product' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create product' });
        } finally { setSaving(false); }
    };

    const categories = [
        { value: 'premium-watches', label: 'Premium Watches' },
        { value: 'casual-watches', label: 'Casual Watches' },
        { value: 'stylish-watches', label: 'Stylish Watches' },
        { value: 'belts', label: 'Belts' },
        { value: 'wallets', label: 'Wallets' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-neutral-600" /></Link>
                <div><h1 className="text-2xl font-bold text-neutral-900">Add New Product</h1><p className="text-neutral-500 mt-1">Create a new product for your store</p></div>
            </div>

            {message.text && <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Royal Square Titanium" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Product Code</label>
                            <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} placeholder="e.g., TTS-PW-001" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Price (Rs.) *</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 4599" min="0" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required>
                                {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Stock Status</label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500" />
                                <span className="text-neutral-700">In Stock</span>
                            </label>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Enter product description..." className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Product Images</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Main Image</label>
                        <div className="flex items-start gap-4">
                            {formData.image ? (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-neutral-200">
                                    <Image src={formData.image} alt="Main product image" fill className="object-cover" />
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <label className="w-32 h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50">
                                    <Upload className="w-6 h-6 text-neutral-400 mb-1" /><span className="text-xs text-neutral-500">Upload</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                                </label>
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-neutral-600 mb-2">Or enter image URL:</p>
                                <input type="text" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="/images/product.png" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Gallery Images (optional)</label>
                        <div className="flex flex-wrap gap-3">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200">
                                    <Image src={img} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                                    <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50">
                                <Plus className="w-5 h-5 text-neutral-400" />
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Product Features</h2>
                    <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="e.g., Water Resistant" className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                                {formData.features.length > 1 && <button type="button" onClick={() => removeFeature(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl"><X className="w-5 h-5" /></button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addFeature} className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-xl"><Plus className="w-4 h-4" /> Add Feature</button>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={saving} className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
                        {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Creating...</> : <><Save className="w-5 h-5" />Create Product</>}
                    </button>
                    <Link href="/admin/products" className="px-6 py-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

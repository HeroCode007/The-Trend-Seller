'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, Upload, X, Plus, AlertCircle } from 'lucide-react';

export default function EditProductPage({ params }) {
    const { id } = params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '', productCode: '', price: '', category: 'premium-watches', description: '', image: '', images: [], features: [''], inStock: true
    });

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${id}`);
            const data = await res.json();
            if (data.success && data.product) {
                const p = data.product;
                setFormData({ name: p.name || '', productCode: p.productCode || '', price: p.price?.toString() || '', category: p.category || 'premium-watches', description: p.description || '', image: p.image || '', images: p.images || [], features: p.features?.length > 0 ? p.features : [''], inStock: p.inStock !== false });
            } else setMessage({ type: 'error', text: 'Product not found' });
        } catch (e) { setMessage({ type: 'error', text: 'Failed to load product' }); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
    const handleFeatureChange = (i, v) => { const f = [...formData.features]; f[i] = v; setFormData(prev => ({ ...prev, features: f })); };
    const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeFeature = (i) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));
    const removeGalleryImage = (i) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

    const handleImageUpload = (e, isGallery = false) => {
        const file = e.target.files?.[0]; if (!file) return;
        if (!file.type.startsWith('image/')) { setMessage({ type: 'error', text: 'Please upload an image' }); return; }
        if (file.size > 5 * 1024 * 1024) { setMessage({ type: 'error', text: 'Max 5MB' }); return; }
        const reader = new FileReader();
        reader.onloadend = () => { isGallery ? setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] })) : setFormData(prev => ({ ...prev, image: reader.result })); };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
        if (!formData.name || !formData.price) { setMessage({ type: 'error', text: 'Fill required fields' }); setSaving(false); return; }
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, price: parseFloat(formData.price), features: formData.features.filter(f => f.trim()) }) });
            const data = await res.json();
            data.success ? setMessage({ type: 'success', text: 'Updated!' }) : setMessage({ type: 'error', text: data.error || 'Failed' });
        } catch (e) { setMessage({ type: 'error', text: 'Failed to update' }); }
        finally { setSaving(false); }
    };

    const categories = [{ value: 'premium-watches', label: 'Premium Watches' }, { value: 'casual-watches', label: 'Casual Watches' }, { value: 'stylish-watches', label: 'Stylish Watches' }, { value: 'belts', label: 'Belts' }, { value: 'wallets', label: 'Wallets' }];

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
    if (message.text === 'Product not found') return <div className="text-center py-12"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-semibold">Product not found</h2><Link href="/admin/products" className="text-amber-600 mt-2 inline-block">← Back</Link></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-neutral-600" /></Link>
                <div><h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1><p className="text-neutral-500 mt-1">Update product information</p></div>
            </div>

            {message.text && message.text !== 'Product not found' && <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" required /></div>
                        <div><label className="block text-sm font-medium text-neutral-700 mb-2">Product Code</label><input type="text" name="productCode" value={formData.productCode} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" /></div>
                        <div><label className="block text-sm font-medium text-neutral-700 mb-2">Price (Rs.) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} min="0" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" required /></div>
                        <div><label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">{categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-neutral-700 mb-2">Stock</label><label className="flex items-center gap-3"><input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 rounded text-amber-500" /><span>In Stock</span></label></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-neutral-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl resize-none" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Images</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Main Image</label>
                        <div className="flex items-start gap-4">
                            {formData.image ? <div className="relative w-32 h-32 rounded-xl overflow-hidden border"><Image src={formData.image} alt="Main" fill className="object-cover" /><button type="button" onClick={() => setFormData(p => ({ ...p, image: '' }))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button></div> : <label className="w-32 h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500"><Upload className="w-6 h-6 text-neutral-400" /><input type="file" accept="image/*" onChange={e => handleImageUpload(e, false)} className="hidden" /></label>}
                            <div className="flex-1"><p className="text-sm text-neutral-600 mb-2">Or URL:</p><input type="text" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" /></div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Gallery</label>
                        <div className="flex flex-wrap gap-3">
                            {formData.images.map((img, i) => <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border"><Image src={img} alt="" fill className="object-cover" /><button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button></div>)}
                            <label className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-amber-500"><Plus className="w-5 h-5 text-neutral-400" /><input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="hidden" /></label>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Features</h2>
                    <div className="space-y-3">
                        {formData.features.map((f, i) => <div key={i} className="flex items-center gap-2"><input type="text" value={f} onChange={e => handleFeatureChange(i, e.target.value)} className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" />{formData.features.length > 1 && <button type="button" onClick={() => removeFeature(i)} className="p-2.5 text-red-500"><X className="w-5 h-5" /></button>}</div>)}
                    </div>
                    <button type="button" onClick={addFeature} className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600"><Plus className="w-4 h-4" /> Add</button>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={saving} className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">{saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />Save</>}</button>
                    <Link href="/admin/products" className="px-6 py-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

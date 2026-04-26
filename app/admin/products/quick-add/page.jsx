'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Upload, X, Check, AlertCircle, Sparkles, Loader2, Zap, Plus
} from 'lucide-react';

const CATEGORIES = [
  { value: 'premium-watches', label: 'Premium Watches', emoji: '👑' },
  { value: 'casual-watches', label: 'Casual Watches', emoji: '⌚' },
  { value: 'stylish-watches', label: 'Stylish Watches', emoji: '✨' },
  { value: 'women-watches', label: "Women's Watches", emoji: '💗' },
  { value: 'belts', label: 'Belts', emoji: '🔗' },
  { value: 'wallets', label: 'Wallets', emoji: '👜' },
];

const CODE_PREFIXES = {
  'premium-watches': 'PW',
  'casual-watches': 'CW',
  'stylish-watches': 'SW',
  'women-watches': 'WW',
  'belts': 'BLT',
  'wallets': 'WLT',
};

async function uploadImage(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error('Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', preset);
  fd.append('folder', 'trendseller');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.secure_url;
}

export default function QuickAddPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('premium-watches');
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [images, setImages] = useState([]); // { id, file, preview, url, uploading }
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState(null); // null|uploading|generating|saving|done|error
  const [error, setError] = useState('');

  const addFeature = () => {
    const val = featureInput.trim();
    if (!val) return;
    // support comma-separated paste: "Lock,Strap,Dial" → 3 features
    const parts = val.split(',').map(s => s.trim()).filter(Boolean);
    setFeatures(prev => [...prev, ...parts.filter(p => !prev.includes(p))]);
    setFeatureInput('');
  };

  const removeFeature = (idx) => setFeatures(prev => prev.filter((_, i) => i !== idx));

  const addFiles = useCallback((files) => {
    const slots = 6 - images.length;
    if (slots <= 0) return;
    const next = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, slots)
      .map(file => ({
        id: Math.random().toString(36).slice(2),
        file,
        preview: URL.createObjectURL(file),
        url: null,
        uploading: false,
      }));
    setImages(prev => [...prev, ...next]);
  }, [images]);

  const removeImage = (id) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const busy = phase === 'uploading' || phase === 'generating' || phase === 'saving' || phase === 'done';

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) return setError('Product name is required');
    if (!price || parseFloat(price) <= 0) return setError('Enter a valid price');
    if (images.length === 0) return setError('Add at least one image');

    try {
      // ── 1. Upload images ──────────────────────────────────────
      setPhase('uploading');
      const urls = [];
      for (const img of images) {
        if (img.url) { urls.push(img.url); continue; }
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, uploading: true } : i));
        const url = await uploadImage(img.file);
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, uploading: false, url } : i));
        urls.push(url);
      }

      // ── 2. AI generate ────────────────────────────────────────
      setPhase('generating');
      let ai = {};
      try {
        const aiRes = await fetch('/api/admin/generate-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), category, price }),
        });
        if (aiRes.ok) ai = await aiRes.json();
      } catch {
        // silently continue without AI
      }

      // ── 3. Save product ───────────────────────────────────────
      setPhase('saving');
      const prefix = CODE_PREFIXES[category] || 'TTS';
      const productCode = ai.productCode || `${prefix}-${Date.now().toString().slice(-6)}`;

      const payload = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        image: urls[0],
        images: urls.slice(1),
        productCode,
        description: ai.description || `${name.trim()} — premium quality from The Trend Seller.`,
        features: features.length > 0 ? features : (ai.features || []),
        metaTitle: ai.metaTitle || name.trim(),
        metaDescription: ai.metaDescription || '',
        inStock: true,
        isActive: true,
        stockQuantity: 10,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setPhase('done');
      setTimeout(() => router.push('/admin/products'), 1800);

    } catch (err) {
      setPhase('error');
      setError(err.message);
    }
  };

  const phaseLabel = {
    uploading: 'Uploading images…',
    generating: 'Writing description with AI…',
    saving: 'Saving to database…',
    done: '✓ Product added! Redirecting…',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h1 className="text-lg font-bold">Quick Add</h1>
            </div>
            <p className="text-xs text-zinc-400">Name + Price + Images → Live on site</p>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-7">

        {/* ── Name ───────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Product Name <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={busy}
            autoFocus
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-base focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-colors"
            placeholder="e.g. Slim Leather Bifold Wallet"
          />
        </div>

        {/* ── Price ──────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Price <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">₨</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              disabled={busy}
              min="1"
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-base focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-colors"
              placeholder="1999"
            />
          </div>
        </div>

        {/* ── Category ───────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">Category <span className="text-amber-500">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                disabled={busy}
                onClick={() => setCategory(cat.value)}
                className={`py-3 px-2 rounded-xl border transition-all disabled:opacity-50 text-center ${
                  category === cat.value
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <div className="text-xl mb-1">{cat.emoji}</div>
                <div className="text-xs leading-tight font-medium">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Features ───────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Features
            <span className="text-zinc-500 font-normal ml-1">(optional — AI fills these if left empty)</span>
          </label>

          {/* Input row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              disabled={busy}
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-colors"
              placeholder="e.g. Genuine Leather Strap — press Enter or +"
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={busy || !featureInput.trim()}
              className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-zinc-500 mt-1.5">
            Tip: paste comma-separated — <span className="text-zinc-400">Lock,Leather Strap,Date Feature</span> — adds all at once
          </p>

          {/* Feature tags */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-amber-950/50 border border-amber-800/50 text-amber-300 text-sm px-3 py-1 rounded-full"
                >
                  {f}
                  {!busy && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-amber-500 hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Images ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Images <span className="text-amber-500">*</span>
            <span className="text-zinc-500 font-normal ml-1">(first = main photo)</span>
          </label>

          {images.length < 6 && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !busy && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-950/20'
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'
              } ${busy ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <p className="text-zinc-200 font-medium">Drop images here or tap to browse</p>
              <p className="text-zinc-500 text-sm mt-1">JPG · PNG · WEBP — up to 6 photos</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => addFiles(e.target.files)}
              />
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map((img, i) => (
                <div key={img.id} className="relative group aspect-square">
                  <img
                    src={img.preview}
                    alt=""
                    className="w-full h-full object-cover rounded-xl border border-zinc-700"
                  />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Main
                    </span>
                  )}
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    </div>
                  )}
                  {img.url && !img.uploading && (
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!busy && (
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── AI notice ──────────────────────────────────────────── */}
        <div className="flex gap-3 bg-violet-950/30 border border-violet-800/30 rounded-xl px-4 py-3">
          <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
          <p className="text-sm text-violet-300">
            AI automatically writes the description and SEO. If you add features above, yours are used — otherwise AI generates them.
          </p>
        </div>

        {/* ── Error ──────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* ── Progress ───────────────────────────────────────────── */}
        {phase && phase !== 'error' && (
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            phase === 'done'
              ? 'bg-green-950/40 border border-green-800/40 text-green-300'
              : 'bg-zinc-800 border border-zinc-700 text-zinc-200'
          }`}>
            {phase === 'done'
              ? <Check className="w-5 h-5 text-green-400" />
              : <Loader2 className="w-5 h-5 animate-spin text-amber-400" />}
            {phaseLabel[phase]}
          </div>
        )}

        {/* ── Submit ─────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
        >
          {busy ? 'Working…' : 'Add Product →'}
        </button>

        <p className="text-center text-xs text-zinc-600 pb-4">
          Want full control?{' '}
          <Link href="/admin/products/new" className="text-zinc-400 hover:text-white underline">
            Use the full form
          </Link>
        </p>
      </div>
    </div>
  );
}

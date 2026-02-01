'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Check,
    Heart,
    Share2,
    ShieldCheck,
    Truck,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Star,
    Minus,
    Plus,
    Package,
    Clock,
    Award,
    Sparkles,
    X
} from 'lucide-react';
import { premiumWatches, casualWatches, stylishWatches } from '@/lib/products';
import AddToCartButton from '@/components/AddToCartButton';
import ReviewSection from '@/components/ReviewSection';

const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches];

export default function WatchDetailClient({ product }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showLightbox, setShowLightbox] = useState(false);
    const [activeTab, setActiveTab] = useState('features');
    const [isLoaded, setIsLoaded] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const allImages = product.images
        ? [product.image, ...product.images.filter(img => img !== product.image)]
        : [product.image];

    const getCategoryInfo = (category) => {
        switch (category) {
            case 'premium-watches':
                return { path: '/watches/premium', name: 'Premium Watches', shortName: 'Premium' };
            case 'casual-watches':
                return { path: '/watches/casual', name: 'Casual Watches', shortName: 'Casual' };
            case 'stylish-watches':
                return { path: '/watches/stylish', name: 'Stylish Watches', shortName: 'Stylish' };
            case 'women-watches':
                return { path: '/watches/women', name: "Women's Watches", shortName: "Women's" };
            default:
                return { path: '/watches', name: 'Watches', shortName: 'Watches' };
        }
    };

    const categoryInfo = getCategoryInfo(product.category);
    const isOutOfStock = product.inStock === false;
    const isPremium = product.category === 'premium-watches';

    const relatedProducts = allWatches
        .filter(w => w.category === product.category && w.slug !== product.slug)
        .slice(0, 4);

    const nextImage = useCallback(() => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback(() => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showLightbox) {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'Escape') setShowLightbox(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLightbox, nextImage, prevImage]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
    const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            {/* Lightbox */}
            {showLightbox && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                    onClick={() => setShowLightbox(false)}
                >
                    <button
                        onClick={() => setShowLightbox(false)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div
                        className="relative w-full max-w-4xl aspect-square mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={allImages[selectedImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                                        className={`h-2 rounded-full transition-all ${selectedImageIndex === index
                                                ? 'bg-white w-8'
                                                : 'bg-white/40 w-2 hover:bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Premium Banner */}
            {isPremium && (
                <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white text-center py-3 px-4">
                    <p className="text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        PREMIUM COLLECTION — Free Gift Packaging & Priority Shipping
                        <Sparkles className="w-4 h-4" />
                    </p>
                </div>
            )}

            {/* Sticky Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <ol className="flex items-center gap-2 text-sm text-stone-500">
                        <li><Link href="/" className="hover:text-stone-900 transition-colors">Home</Link></li>
                        <li className="text-stone-300">/</li>
                        <li><Link href="/watches" className="hover:text-stone-900 transition-colors">Watches</Link></li>
                        <li className="text-stone-300 hidden sm:block">/</li>
                        <li className="hidden sm:block"><Link href={categoryInfo.path} className="hover:text-stone-900 transition-colors">{categoryInfo.shortName}</Link></li>
                        <li className="text-stone-300 hidden md:block">/</li>
                        <li className="hidden md:block text-stone-900 font-medium truncate max-w-[200px]">{product.name}</li>
                    </ol>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Back Button */}
                <Link
                    href={categoryInfo.path}
                    className="inline-flex items-center gap-3 text-stone-600 hover:text-stone-900 mb-8 transition-colors group"
                >
                    <span className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                    </span>
                    <span className="font-medium">Back to {categoryInfo.shortName}</span>
                </Link>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div
                            className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-stone-100 to-white border border-stone-200 shadow-2xl shadow-stone-200/50 cursor-pointer group"
                            onClick={() => setShowLightbox(true)}
                        >
                            {/* Badges */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                {isPremium && (
                                    <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5" />
                                        PREMIUM
                                    </span>
                                )}
                                {isOutOfStock && (
                                    <span className="px-4 py-2 bg-stone-900 text-white text-xs font-bold tracking-wider rounded-full">
                                        SOLD OUT
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
                                    className={`w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-all ${isWishlisted ? 'ring-2 ring-red-400' : ''}`}
                                >
                                    <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-500'}`} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleShare(); }}
                                    className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-all relative"
                                >
                                    <Share2 className="w-6 h-6 text-stone-500" />
                                    {copied && (
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-stone-900 text-white px-2 py-1 rounded whitespace-nowrap">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full h-full p-8 lg:p-12 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={allImages[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>

                            {/* Nav Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-stone-700" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6 text-stone-700" />
                                    </button>
                                </>
                            )}

                            {/* Counter */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-stone-900/80 backdrop-blur text-white text-sm font-medium rounded-full">
                                    {selectedImageIndex + 1} / {allImages.length}
                                </div>
                            )}

                            {/* Mobile hint */}
                            <div className="md:hidden absolute bottom-4 right-4 px-3 py-1.5 bg-stone-900/70 backdrop-blur text-white text-xs rounded-full">
                                Tap to zoom
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                                                : 'border-stone-200 hover:border-stone-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            fill
                                            className="object-contain p-2 bg-stone-50"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Desktop Info Cards */}
                        <div className="hidden lg:grid grid-cols-2 gap-4 pt-4">
                            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100/50">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900">100% Authentic</h4>
                                        <p className="text-sm text-stone-600 mt-1">Genuine product with warranty</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-emerald-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900">Premium Packaging</h4>
                                        <p className="text-sm text-stone-600 mt-1">Elegant gift-ready box</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
                        {/* Category & SKU */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`text-xs font-bold px-4 py-2 rounded-full tracking-wide ${isPremium
                                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                                }`}>
                                {categoryInfo.shortName} Collection
                            </span>
                            <span className="text-xs text-stone-400 font-mono">SKU: {product.productCode}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <span className="text-sm text-stone-500 font-medium">4.8 (124 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-baseline gap-4">
                            <span className="text-4xl sm:text-5xl font-bold text-stone-900">
                                Rs. {product.price.toLocaleString()}
                            </span>
                            {isPremium && (
                                <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                                    Premium Quality
                                </span>
                            )}
                        </div>

                        {/* Stock */}
                        <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold ${isOutOfStock
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                            {isOutOfStock ? 'Currently Unavailable' : 'In Stock — Ready to Ship'}
                        </div>

                        {/* Description */}
                        <p className="text-stone-600 text-lg leading-relaxed">
                            {product.description}
                        </p>

                        {/* Quantity & Cart */}
                        {!isOutOfStock && (
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-stone-700">Quantity:</span>
                                    <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-40"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-14 text-center font-bold text-lg text-stone-900">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= 10}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-40"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <AddToCartButton product={product} quantity={quantity} />
                            </div>
                        )}

                        {/* Out of Stock */}
                        {isOutOfStock && (
                            <div className="space-y-3 pt-2">
                                <button disabled className="w-full py-4 bg-stone-200 text-stone-500 font-bold rounded-xl cursor-not-allowed text-lg">
                                    Currently Unavailable
                                </button>
                                <button className="w-full py-4 border-2 border-stone-900 text-stone-900 font-bold rounded-xl hover:bg-stone-900 hover:text-white transition-all text-lg">
                                    Notify When Available
                                </button>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 p-5 bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl border border-stone-200">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-sm">
                                    <Truck className="w-6 h-6 text-amber-700" />
                                </div>
                                <p className="text-sm font-bold text-stone-900">Free Delivery</p>
                                <p className="text-xs text-stone-500 mt-0.5">Above Rs. 5,000</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm">
                                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                                </div>
                                <p className="text-sm font-bold text-stone-900">2 Year Warranty</p>
                                <p className="text-xs text-stone-500 mt-0.5">Official Coverage</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                                    <RotateCcw className="w-6 h-6 text-blue-700" />
                                </div>
                                <p className="text-sm font-bold text-stone-900">14-Day Returns</p>
                                <p className="text-xs text-stone-500 mt-0.5">Easy Exchange</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <div className="flex border-b border-stone-200">
                                {['features', 'shipping', 'warranty'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 text-sm font-semibold capitalize transition-all relative ${activeTab === tab
                                                ? 'text-stone-900 bg-white'
                                                : 'text-stone-500 bg-stone-50 hover:text-stone-700'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                {activeTab === 'features' && (
                                    <ul className="space-y-3">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="h-3.5 w-3.5 text-amber-700" />
                                                </div>
                                                <span className="text-stone-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {activeTab === 'shipping' && (
                                    <ul className="space-y-3 text-stone-600">
                                        <li className="flex items-start gap-3">
                                            <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span>Free shipping on orders above Rs. 5,000</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span>Standard delivery: 3-5 business days</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Package className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span>Express delivery available in major cities</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span>COD available (confirmation call before dispatch)</span>
                                        </li>
                                    </ul>
                                )}

                                {activeTab === 'warranty' && (
                                    <ul className="space-y-3 text-stone-600">
                                        <li className="flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span>2-year official manufacturer warranty</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span>Covers all manufacturing defects</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <RotateCcw className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span>Free servicing during warranty period</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span>Warranty card included with purchase</span>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Mobile Info Cards */}
                        <div className="lg:hidden grid grid-cols-2 gap-3">
                            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900 text-sm">100% Authentic</h4>
                                        <p className="text-xs text-stone-600">Genuine Product</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900 text-sm">Gift Ready</h4>
                                        <p className="text-xs text-stone-600">Premium Box</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <section className="mt-20 lg:mt-28">
                    <ReviewSection productId={product.id || product._id} />
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20 lg:mt-28 pt-12 border-t border-stone-200">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-xs font-bold text-amber-700 tracking-widest uppercase mb-2 block">
                                    Discover More
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">You May Also Like</h2>
                                <p className="text-stone-500 mt-2">More from our {categoryInfo.shortName} collection</p>
                            </div>
                            <Link
                                href={categoryInfo.path}
                                className="hidden sm:inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors group"
                            >
                                View All
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/watches/${item.slug}`}
                                    className="group bg-white rounded-2xl lg:rounded-3xl overflow-hidden border border-stone-200 hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-white overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-4 lg:p-6 group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.category === 'premium-watches' && (
                                            <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold tracking-wider rounded-full flex items-center gap-1">
                                                <Award className="w-3 h-3" />
                                                PREMIUM
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 py-2 bg-white rounded-full text-xs font-bold text-stone-900 shadow-xl transform scale-90 group-hover:scale-100">
                                                Quick View
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 lg:p-5">
                                        <h3 className="font-semibold text-stone-900 line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="font-bold text-lg text-stone-900">
                                            Rs. {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={categoryInfo.path}
                            className="sm:hidden mt-8 w-full py-4 border-2 border-stone-900 text-stone-900 font-bold rounded-xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            View All {categoryInfo.shortName} Watches
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </section>
                )}
            </main>

            {/* Mobile Sticky Bottom Bar */}
            {!isOutOfStock && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs text-stone-500">Total Price</p>
                            <p className="text-xl font-bold text-stone-900">Rs. {(product.price * quantity).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${isWishlisted ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-400'}`} />
                        </button>
                        <AddToCartButton product={product} quantity={quantity} className="flex-1" />
                    </div>
                </div>
            )}
        </div>
    );
}

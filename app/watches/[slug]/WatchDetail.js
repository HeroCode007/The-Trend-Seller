'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { premiumWatches, casualWatches, stylishWatches } from '@/lib/products';
import AddToCartButton from '@/components/AddToCartButton';

// Combine all watches for related items
const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches];

export default function WatchDetailClient({ product }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Get all images (main image + gallery if exists)
    const allImages = product.images
        ? [product.image, ...product.images.filter(img => img !== product.image)]
        : [product.image];

    // Determine category info
    const getCategoryInfo = (category) => {
        switch (category) {
            case 'premium-watches':
                return { path: '/watches/premium', name: 'Premium Watches', shortName: 'Premium', color: 'amber' };
            case 'casual-watches':
                return { path: '/watches/casual', name: 'Casual Watches', shortName: 'Casual', color: 'stone' };
            case 'stylish-watches':
                return { path: '/watches/stylish', name: 'Stylish Watches', shortName: 'Stylish', color: 'neutral' };
            default:
                return { path: '/watches', name: 'Watches', shortName: 'Watches', color: 'neutral' };
        }
    };

    const categoryInfo = getCategoryInfo(product.category);
    const isOutOfStock = product.inStock === false;
    const isPremium = product.category === 'premium-watches';

    // Get related products (same category, excluding current)
    const relatedProducts = allWatches
        .filter(w => w.category === product.category && w.slug !== product.slug)
        .slice(0, 4);

    // Navigation functions for gallery
    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Share function
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
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Breadcrumb */}
            <nav className="max-w-7xl mx-auto px-4 py-4 border-b border-neutral-200 bg-white">
                <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
                    <li>
                        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                    </li>
                    <li className="text-neutral-300">/</li>
                    <li>
                        <Link href="/watches" className="hover:text-neutral-900 transition-colors">Watches</Link>
                    </li>
                    <li className="text-neutral-300">/</li>
                    <li>
                        <Link href={categoryInfo.path} className="hover:text-neutral-900 transition-colors">
                            {categoryInfo.shortName}
                        </Link>
                    </li>
                    <li className="text-neutral-300">/</li>
                    <li className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</li>
                </ol>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Back Button */}
                <Link
                    href={categoryInfo.path}
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to {categoryInfo.shortName} Watches</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 border border-neutral-200 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            {/* Badges */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                {isPremium && (
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        PREMIUM
                                    </span>
                                )}
                                {isOutOfStock && (
                                    <span className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-full">
                                        OUT OF STOCK
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWishlisted(!isWishlisted);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart
                                        className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-neutral-500'}`}
                                    />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShare();
                                    }}
                                    className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                                    aria-label="Share product"
                                >
                                    <Share2 className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            {/* Main Image */}
                            <div className={`relative w-full h-full p-8 transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
                                <Image
                                    src={allImages[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-neutral-700" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5 text-neutral-700" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                    {selectedImageIndex + 1} / {allImages.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-amber-500 shadow-md'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${index + 1}`}
                                            fill
                                            className="object-contain p-2 bg-neutral-50"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Zoom hint */}
                        <p className="text-center text-xs text-neutral-400">
                            Click image to {isZoomed ? 'zoom out' : 'zoom in'}
                        </p>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        {/* Category Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isPremium
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : product.category === 'casual-watches'
                                    ? 'bg-stone-100 text-stone-700 border border-stone-200'
                                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                                }`}>
                                {categoryInfo.shortName} Collection
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">{product.productCode}</span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl md:text-4xl font-bold text-neutral-900">
                                Rs. {product.price.toLocaleString()}
                            </span>
                            {isPremium && (
                                <span className="text-sm text-amber-600 font-medium">Premium Quality</span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${isOutOfStock
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                        </div>

                        {/* Description */}
                        <p className="text-neutral-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Features */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Key Features</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 bg-neutral-50 rounded-xl p-3">
                                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="h-3 w-3 text-amber-600" />
                                        </div>
                                        <span className="text-sm text-neutral-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4 mb-8">
                            {isOutOfStock ? (
                                <div className="space-y-3">
                                    <button
                                        disabled
                                        className="w-full py-4 bg-neutral-200 text-neutral-500 font-semibold rounded-xl cursor-not-allowed"
                                    >
                                        Out of Stock
                                    </button>
                                    <button className="w-full py-3 border-2 border-neutral-900 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-900 hover:text-white transition-colors">
                                        Notify When Available
                                    </button>
                                </div>
                            ) : (
                                <AddToCartButton product={product} />
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-xs font-medium text-neutral-900">Free Delivery</p>
                                <p className="text-[10px] text-neutral-500">Above Rs. 5,000</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-xs font-medium text-neutral-900">2 Year Warranty</p>
                                <p className="text-[10px] text-neutral-500">Official Coverage</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                                    <RotateCcw className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-xs font-medium text-neutral-900">14-Day Exchange</p>
                                <p className="text-[10px] text-neutral-500">Easy Returns</p>
                            </div>
                        </div>

                        {/* Info Accordions */}
                        <div className="mt-6 space-y-3">
                            <details className="group bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <span className="font-medium text-neutral-900">Shipping Information</span>
                                    <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                                    <ul className="space-y-2">
                                        <li>• Free shipping on orders above Rs. 5,000</li>
                                        <li>• Standard delivery: 3-5 business days</li>
                                        <li>• Express delivery available in major cities</li>
                                        <li>• COD available (confirm call before dispatch)</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="group bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <span className="font-medium text-neutral-900">Return & Exchange Policy</span>
                                    <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                                    <ul className="space-y-2">
                                        <li>• 14-day hassle-free exchange window</li>
                                        <li>• Product must be unused with original packaging</li>
                                        <li>• All tags must be intact</li>
                                        <li>• Refund processed within 5-7 business days</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="group bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <span className="font-medium text-neutral-900">Warranty Details</span>
                                    <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                                    <ul className="space-y-2">
                                        <li>• 2-year official manufacturer warranty</li>
                                        <li>• Covers manufacturing defects</li>
                                        <li>• Free servicing during warranty period</li>
                                        <li>• Warranty card included with purchase</li>
                                    </ul>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-neutral-200">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">You May Also Like</h2>
                                <p className="text-neutral-500 mt-1">More from our {categoryInfo.shortName} collection</p>
                            </div>
                            <Link
                                href={categoryInfo.path}
                                className="hidden sm:inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/watches/${item.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-lg hover:border-neutral-300 transition-all duration-300"
                                >
                                    <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {item.category === 'premium-watches' && (
                                            <span className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold rounded-full">
                                                PREMIUM
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-neutral-900 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="font-bold text-neutral-900">
                                            Rs. {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={categoryInfo.path}
                            className="sm:hidden mt-6 w-full py-3 border-2 border-neutral-900 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            View All {categoryInfo.shortName} Watches
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </section>
                )}
            </div>
        </div>
    );
}
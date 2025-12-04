'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ImageOff } from 'lucide-react';

export default function ProductGallery({ product }) {
    // Use the `images` array, but fall back to the single `image` for safety
    const imageSources = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    // State management
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Check stock status
    const isOutOfStock = product.inStock === false;

    // Navigation handlers
    const goToPrevious = () => {
        setActiveIndex((prev) => (prev === 0 ? imageSources.length - 1 : prev - 1));
        setIsLoading(true);
        setHasError(false);
    };

    const goToNext = () => {
        setActiveIndex((prev) => (prev === imageSources.length - 1 ? 0 : prev + 1));
        setIsLoading(true);
        setHasError(false);
    };

    const handleThumbnailClick = (index) => {
        setActiveIndex(index);
        setIsLoading(true);
        setHasError(false);
    };

    // Dynamic grid columns based on image count
    const getGridCols = () => {
        const count = imageSources.length;
        if (count === 1) return 'grid-cols-1 max-w-[100px]';
        if (count === 2) return 'grid-cols-2 max-w-[200px]';
        if (count === 3) return 'grid-cols-3 max-w-[300px]';
        if (count === 4) return 'grid-cols-4 max-w-[400px]';
        return 'grid-cols-5';
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="relative bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                {/* Aspect ratio container */}
                <div className="relative aspect-square flex items-center justify-center">

                    {/* Loading skeleton */}
                    {isLoading && !hasError && (
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-neutral-300 border-t-amber-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Error state */}
                    {hasError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                            <ImageOff className="w-16 h-16 mb-2" />
                            <p className="text-sm">Failed to load image</p>
                        </div>
                    ) : (
                        <Image
                            src={imageSources[activeIndex]}
                            alt={`${product.name} - View ${activeIndex + 1}`}
                            fill
                            className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                                } ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                            quality={95}
                            priority={activeIndex === 0}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setHasError(true);
                            }}
                            onClick={() => setIsZoomed(!isZoomed)}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    )}

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <span className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-lg">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Zoom hint */}
                    {!isOutOfStock && !hasError && !isLoading && (
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
                            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                        >
                            <ZoomIn className="w-5 h-5 text-neutral-700" />
                        </button>
                    )}

                    {/* Navigation Arrows (only show if multiple images) */}
                    {imageSources.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5 text-neutral-700" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5 text-neutral-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Image counter */}
                {imageSources.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                        {activeIndex + 1} / {imageSources.length}
                    </div>
                )}
            </div>

            {/* Thumbnails (only show if multiple images) */}
            {imageSources.length > 1 && (
                <div className={`grid ${getGridCols()} gap-3`}>
                    {imageSources.map((image, index) => (
                        <button
                            key={`${image}-${index}`}  {/* Safe key with index fallback */}
                            onClick={() => handleThumbnailClick(index)}
                            className={`aspect-square relative rounded-md overflow-hidden border-2 transition-all duration-200 ${activeIndex === index
                                    ? 'border-amber-600 ring-2 ring-amber-500/50'
                                    : 'border-transparent hover:border-neutral-300'
                                }`}
                            aria-label={`View image ${index + 1}`}
                            aria-current={activeIndex === index ? 'true' : 'false'}
                        >
                            <Image
                                src={image}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                className={`object-cover transition-opacity ${activeIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                    }`}
                                sizes="100px"
                                quality={70}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
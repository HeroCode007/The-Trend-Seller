'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ product }) {
    // Use the `images` array, but fall back to the single `image` for safety
    const imageSources = product.images && product.images.length > 0 ? product.images : [product.image];

    // State to track the currently selected image
    const [activeImage, setActiveImage] = useState(imageSources[0]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
                <Image
                    src={activeImage}
                    alt={`${product.name} - Main View`}
                    width={600} // ✅ set explicit width
                    height={600} // ✅ set explicit height
                    className="object-contain" // ✅ use contain to avoid cropping
                    quality={95}
                    priority
                />
            </div>


            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
                {imageSources.map((image, index) => (
                    <button
                        key={image} // Use the unique image URL for the key
                        onClick={() => setActiveImage(image)}
                        className={`aspect-square relative rounded-md overflow-hidden border-2 transition-all duration-200 ${activeImage === image ? 'border-amber-600 ring-2 ring-amber-500/50' : 'border-transparent hover:border-neutral-300'
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover w-full h-full"
                            sizes="20vw" // Thumbnails are smaller, so this is fine
                            quality={80} // ✅ Quality for thumbnails can be slightly lower
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

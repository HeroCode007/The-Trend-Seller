'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { stylishWatches as staticStylishWatches } from '@/lib/products';

export default function StylishWatchesPage() {
    const [stylishWatches, setStylishWatches] = useState(staticStylishWatches);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch products from database
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?category=stylish-watches', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.products.length > 0) {
                        setStylishWatches(data.products);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products from database:', error);
                // Falls back to staticStylishWatches
            } finally {
                setIsLoadingProducts(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        Stylish Watches
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-3xl">
                        Make a statement with our collection of stylish timepieces. From minimalist elegance to bold fashion-forward designs, these watches are perfect for those who appreciate both form and function.
                    </p>
                    {isLoadingProducts && (
                        <p className="text-sm text-neutral-500 mt-2">Loading latest products...</p>
                    )}
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stylishWatches.map((watch) => (
                        <ProductCard
                            key={watch.id || watch._id}
                            product={watch}
                            imageObject="contain"
                            imagePaddingClass="p-6"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

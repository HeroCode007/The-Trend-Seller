'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { womensWatches as staticWomensWatches } from '@/lib/products';

export default function WomensWatchesPage() {
    const [womensWatches, setWomensWatches] = useState(staticWomensWatches);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch products from database
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?category=women-watches', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.products.length > 0) {
                        setWomensWatches(data.products);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products from database:', error);
                // Falls back to staticWomensWatches
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
                        Women's Watches
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-3xl">
                        Discover our curated collection of elegant timepieces designed for women. From sleek minimalist dials to sparkling statement pieces, find the perfect watch to complement your style.
                    </p>
                    {isLoadingProducts && (
                        <p className="text-sm text-neutral-500 mt-2">Loading latest products...</p>
                    )}
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                    {womensWatches.map((watch) => (
                        <ProductCard
                            key={watch.id || watch._id}
                            product={watch}
                            imageObject="contain"
                            imagePaddingClass="p-6"
                        />
                    ))}
                </div>

                {womensWatches.length === 0 && !isLoadingProducts && (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-lg">No women's watches available yet.</p>
                        <p className="text-neutral-400 mt-2">Check back soon — new pieces are being added regularly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

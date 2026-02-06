'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { stylishWatches as staticStylishWatches } from '@/lib/products';

export default function StylishWatchesPage() {
    const [stylishWatches, setStylishWatches] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch products from database with static fallback
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?category=stylish-watches', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.products?.length > 0) {
                        setStylishWatches(data.products);
                    } else {
                        setStylishWatches(staticStylishWatches);
                    }
                } else {
                    setStylishWatches(staticStylishWatches);
                }
            } catch (error) {
                console.error('Failed to fetch products from database:', error);
                setStylishWatches(staticStylishWatches);
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

                {isLoadingProducts ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-neutral-200 border-t-amber-500 rounded-full animate-spin"></div>
                        <p className="text-neutral-500">Loading stylish watches...</p>
                    </div>
                ) : stylishWatches.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                        {stylishWatches.map((watch) => (
                            <ProductCard
                                key={watch.id || watch._id}
                                product={watch}
                                imageObject="contain"
                                imagePaddingClass="p-6"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-lg">No stylish watches available yet.</p>
                        <p className="text-neutral-400 mt-2">Check back soon — new pieces are being added regularly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

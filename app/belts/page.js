'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { belts as staticBelts } from '@/lib/products';

export default function BeltsPage() {
  const [belts, setBelts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products from database with static fallback
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?category=belts', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products?.length > 0) {
            setBelts(data.products);
          } else {
            setBelts(staticBelts);
          }
        } else {
          setBelts(staticBelts);
        }
      } catch (error) {
        console.error('Failed to fetch products from database:', error);
        setBelts(staticBelts);
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
            Premium Leather Belts
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Handcrafted leather belts made from premium materials. Each belt is designed to complement your style while providing lasting quality.
          </p>
          {isLoadingProducts && (
            <p className="text-sm text-neutral-500 mt-2">Loading latest products...</p>
          )}
        </header>

        {belts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {belts.map((belt) => (
              <ProductCard key={belt.id || belt._id} product={belt} />
            ))}
          </div>
        ) : !isLoadingProducts ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">No belts available yet.</p>
            <p className="text-neutral-400 mt-2">Check back soon — new products are being added regularly.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

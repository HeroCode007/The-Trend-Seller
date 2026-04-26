'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { wallets as staticWallets } from '@/lib/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

function PulseBar() {
  return (
    <motion.div
      className="h-1 w-24 rounded-full bg-amber-400 mt-4"
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-2xl bg-neutral-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        >
          <div className="aspect-square bg-neutral-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-amber-100 rounded w-1/3 mt-3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?category=wallets', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products?.length > 0) {
            setWallets(data.products);
          } else {
            setWallets(staticWallets);
          }
        } else {
          setWallets(staticWallets);
        }
      } catch {
        setWallets(staticWallets);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.header
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            New Collection
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3 leading-tight">
            Premium Wallets
          </h1>

          <PulseBar />

          <p className="text-lg text-neutral-500 max-w-2xl mt-5">
            Handcrafted leather wallets designed for style and functionality.
            Slim profiles, RFID protection, and timeless craftsmanship.
          </p>
        </motion.header>

        {/* ── Product Grid ───────────────────────────────────── */}
        {isLoadingProducts ? (
          <LoadingSkeleton />
        ) : wallets.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerGrid}
            initial="hidden"
            animate="show"
          >
            {wallets.map((wallet) => (
              <motion.div key={wallet.id || wallet._id} variants={cardReveal}>
                <ProductCard product={wallet} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-24"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="text-5xl mb-4">👜</div>
            <p className="text-neutral-500 text-lg font-medium">No wallets available yet.</p>
            <p className="text-neutral-400 mt-2 text-sm">
              Check back soon — new products are being added regularly.
            </p>
          </motion.div>
        )}

        {/* ── Count badge ────────────────────────────────────── */}
        {!isLoadingProducts && wallets.length > 0 && (
          <motion.p
            className="text-center text-neutral-400 text-sm mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Showing {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
          </motion.p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  ChevronDown,
  Wallet,
  Shield,
  Heart,
  Eye,
  CreditCard,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { wallets } from '@/lib/products';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Product Card Component
function WalletCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isOutOfStock = product.inStock === false;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/wallets/${product.slug}`}>
        <div className={`relative bg-white rounded-xl overflow-hidden transition-all duration-400 ${isHovered
          ? 'shadow-xl shadow-amber-900/10 -translate-y-1'
          : 'shadow-md shadow-neutral-200/50'
          } ${isOutOfStock ? 'opacity-70' : ''}`}>

          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(180,130,80,0.15) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
              {product.features?.some(f => f.toLowerCase().includes('rfid')) && (
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  RFID Safe
                </span>
              )}
              {isOutOfStock && (
                <span className="px-2.5 py-1 bg-neutral-600 text-white text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Code */}
            <div className="absolute top-3 right-12 z-20">
              <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-amber-800/70 text-[10px] font-mono rounded border border-amber-200/50">
                {product.productCode}
              </span>
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-amber-100 hover:border-amber-300 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-amber-600 fill-amber-600' : 'text-neutral-400'}`}
              />
            </motion.button>

            {/* Product Image */}
            <div className="relative w-full h-full p-6">
              <motion.div
                className="relative w-full h-full"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
            </div>

            {/* View Details Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-amber-900/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-900 font-semibold rounded-lg shadow-lg text-sm">
                <Eye className="w-4 h-4" />
                View Details
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.features?.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-amber-100/60 text-amber-800 text-[10px] font-medium rounded"
                >
                  {feature.length > 20 ? feature.substring(0, 20) + '...' : feature}
                </span>
              ))}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-neutral-800 text-sm mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug min-h-[2.25rem]">
              {product.name}
            </h3>

            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${isOutOfStock
                ? 'bg-neutral-100 text-neutral-500'
                : 'bg-emerald-50 text-emerald-600'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-neutral-400' : 'bg-emerald-500'}`} />
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </Link>
    </motion.div>
  );
}

// Main Page Component
export default function WalletsPage() {
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  // Filter and sort wallets
  const filteredWallets = useMemo(() => {
    let items = [...wallets];

    // Price filter
    switch (priceRange) {
      case 'under-1500':
        items = items.filter(w => w.price < 1500);
        break;
      case '1500-2500':
        items = items.filter(w => w.price >= 1500 && w.price <= 2500);
        break;
      case 'above-2500':
        items = items.filter(w => w.price > 2500);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return items;
  }, [sortBy, priceRange]);

  const hasActiveFilters = priceRange !== 'all';

  // Calculate stats
  const stats = useMemo(() => {
    const prices = wallets.map(w => w.price);
    const rfidCount = wallets.filter(w =>
      w.features?.some(f => f.toLowerCase().includes('rfid'))
    ).length;
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: wallets.length,
      rfidCount
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-800 via-stone-700 to-yellow-900">
        {/* Subtle leather texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ol className="flex items-center gap-2 text-sm text-stone-300/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li className="text-stone-500/50">/</li>
              <li className="text-stone-200 font-medium">Wallets</li>
            </ol>
          </motion.nav>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Text Content */}
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-5">
                <Wallet className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-stone-200">Premium Leather Collection</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Premium
                <span className="block text-yellow-600">Wallets</span>
              </h1>

              <p className="text-stone-300/80 text-lg max-w-md mb-8 leading-relaxed mx-auto md:mx-0">
                Crafted from premium leather with modern features. Slim designs, RFID protection, and timeless style.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{stats.count}</p>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">Styles</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-yellow-600">Rs. {stats.min.toLocaleString()}</p>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">Starting</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{stats.rfidCount}</p>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">RFID Protected</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-yellow-700/20 rounded-full blur-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Wallet className="w-28 h-28 md:w-36 md:h-36 text-yellow-600/60" strokeWidth={1} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: Shield, label: 'RFID Protection', desc: 'Secure your cards' },
            { icon: Layers, label: 'Slim Design', desc: 'Pocket-friendly' },
            { icon: CreditCard, label: 'Multi-Card Slots', desc: 'Stay organized' },
            { icon: Lock, label: 'Premium Leather', desc: 'Built to last' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-100 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-semibold text-neutral-800 text-sm">{feature.label}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border border-amber-100 rounded-xl shadow-sm mb-8 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium text-sm transition-all ${showFilters
                  ? 'bg-amber-700 border-amber-700 text-white'
                  : 'bg-white border-amber-200 hover:border-amber-300 text-neutral-700'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full">
                    1
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={() => setPriceRange('all')}
                  className="text-sm text-neutral-500 hover:text-amber-700 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500 hidden sm:inline">
                Showing <strong className="text-neutral-800">{filteredWallets.length}</strong> wallets
              </span>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name-az">Name: A → Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <motion.div
            initial={false}
            animate={{
              height: showFilters ? 'auto' : 0,
              opacity: showFilters ? 1 : 0
            }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-amber-100">
              <label className="block text-sm font-semibold text-neutral-700 mb-3">Price Range</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under-1500', label: 'Under Rs. 1,500' },
                  { value: '1500-2500', label: 'Rs. 1,500 - 2,500' },
                  { value: 'above-2500', label: 'Above Rs. 2,500' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriceRange(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === option.value
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-amber-50 text-neutral-600 hover:bg-amber-100'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        {filteredWallets.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredWallets.map((wallet) => (
              <WalletCard key={wallet.id} product={wallet} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-amber-100 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No wallets found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => setPriceRange('all')}
              className="px-6 py-2.5 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Back Link */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 text-white font-semibold rounded-xl hover:bg-amber-900 transition-colors shadow-lg shadow-amber-900/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Cross-sell Section */}
        <section className="mt-16 pt-10 border-t border-amber-200/50">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Complete Your Look</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Explore More</h2>
            <p className="text-neutral-500">Discover our other premium collections</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/watches"
              className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 hover:shadow-xl transition-all"
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative z-10">
                <span className="text-4xl mb-3 block">⌚</span>
                <h3 className="text-xl font-bold text-white mb-1">Premium Watches</h3>
                <p className="text-neutral-400 text-sm mb-3">Timeless elegance for every occasion</p>
                <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-sm group-hover:gap-3 transition-all">
                  Shop Now →
                </span>
              </div>
            </Link>

            <Link
              href="/belts"
              className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 p-6 hover:shadow-xl transition-all"
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative z-10">
                <span className="text-4xl mb-3 block">🔗</span>
                <h3 className="text-xl font-bold text-white mb-1">Leather Belts</h3>
                <p className="text-amber-200/70 text-sm mb-3">Complete your professional look</p>
                <span className="inline-flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
                  Shop Now →
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
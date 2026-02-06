'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { premiumWatches as staticPremiumWatches, casualWatches as staticCasualWatches, stylishWatches as staticStylishWatches, womensWatches as staticWomensWatches } from '@/lib/products';

// Define product type based on Product.js structure
interface Product {
  id: number | string;
  slug: string;
  name: string;
  productCode: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  category: string;
  inStock?: boolean;
}

interface WatchWithCategory extends Product {
  watchCategory: 'premium' | 'casual' | 'stylish' | 'women';
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za';
type CategoryFilter = 'all' | 'premium' | 'casual' | 'stylish' | 'women';
type PriceRange = 'all' | 'under-2000' | '2000-4000' | '4000-4500' | 'above-4500';
type StockFilter = 'all' | 'in-stock' | 'out-of-stock';

export default function WatchesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State for dynamic data from database - start empty to avoid stale data flash
  const [premiumWatches, setPremiumWatches] = useState<Product[]>([]);
  const [casualWatches, setCasualWatches] = useState<Product[]>([]);
  const [stylishWatches, setStylishWatches] = useState<Product[]>([]);
  const [womensWatches, setWomensWatches] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products from database with static fallback
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const [premiumRes, casualRes, stylishRes, womensRes] = await Promise.all([
          fetch('/api/products?category=premium-watches', { cache: 'no-store' }),
          fetch('/api/products?category=casual-watches', { cache: 'no-store' }),
          fetch('/api/products?category=stylish-watches', { cache: 'no-store' }),
          fetch('/api/products?category=women-watches', { cache: 'no-store' })
        ]);

        if (premiumRes.ok) {
          const data = await premiumRes.json();
          setPremiumWatches(data.success && data.products?.length > 0 ? data.products : staticPremiumWatches);
        } else {
          setPremiumWatches(staticPremiumWatches);
        }

        if (casualRes.ok) {
          const data = await casualRes.json();
          setCasualWatches(data.success && data.products?.length > 0 ? data.products : staticCasualWatches);
        } else {
          setCasualWatches(staticCasualWatches);
        }

        if (stylishRes.ok) {
          const data = await stylishRes.json();
          setStylishWatches(data.success && data.products?.length > 0 ? data.products : staticStylishWatches);
        } else {
          setStylishWatches(staticStylishWatches);
        }

        if (womensRes.ok) {
          const data = await womensRes.json();
          setWomensWatches(data.success && data.products?.length > 0 ? data.products : staticWomensWatches);
        } else {
          setWomensWatches(staticWomensWatches);
        }
      } catch (error) {
        console.error('Failed to fetch products from database:', error);
        // Fallback to static data on error
        setPremiumWatches(staticPremiumWatches);
        setCasualWatches(staticCasualWatches);
        setStylishWatches(staticStylishWatches);
        setWomensWatches(staticWomensWatches);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchAllProducts();
  }, []);

  // Combine all watches with category tags
  const allWatches: WatchWithCategory[] = useMemo(() => [
    ...premiumWatches.map((w: Product) => ({ ...w, watchCategory: 'premium' as const })),
    ...casualWatches.map((w: Product) => ({ ...w, watchCategory: 'casual' as const })),
    ...stylishWatches.map((w: Product) => ({ ...w, watchCategory: 'stylish' as const })),
    ...womensWatches.map((w: Product) => ({ ...w, watchCategory: 'women' as const })),
  ], [premiumWatches, casualWatches, stylishWatches, womensWatches]);

  // Filter and sort watches
  const filteredWatches = useMemo(() => {
    let watches = [...allWatches];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      watches = watches.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.productCode.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.features.some(f => f.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      watches = watches.filter(w => w.watchCategory === activeCategory);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      watches = watches.filter(w => w.inStock !== false);
    } else if (stockFilter === 'out-of-stock') {
      watches = watches.filter(w => w.inStock === false);
    }

    // Price range filter (adjusted to match your actual prices)
    switch (priceRange) {
      case 'under-2000':
        watches = watches.filter(w => w.price < 2000);
        break;
      case '2000-4000':
        watches = watches.filter(w => w.price >= 2000 && w.price < 4000);
        break;
      case '4000-4500':
        watches = watches.filter(w => w.price >= 4000 && w.price <= 4500);
        break;
      case 'above-4500':
        watches = watches.filter(w => w.price > 4500);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        watches.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        watches.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        watches.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        watches.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured - premium first, then by price descending
        watches.sort((a, b) => {
          if (a.watchCategory === 'premium' && b.watchCategory !== 'premium') return -1;
          if (b.watchCategory === 'premium' && a.watchCategory !== 'premium') return 1;
          return b.price - a.price;
        });
    }

    return watches;
  }, [allWatches, searchQuery, activeCategory, priceRange, sortBy, stockFilter]);

  const clearFilters = () => {
    setActiveCategory('all');
    setPriceRange('all');
    setStockFilter('all');
    setSortBy('featured');
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || priceRange !== 'all' || stockFilter !== 'all' || searchQuery.trim() !== '';

  // Calculate price stats
  const priceStats = useMemo(() => {
    if (allWatches.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    const prices = allWatches.map(w => w.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    };
  }, [allWatches]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-neutral-900 to-neutral-950" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <p className="text-amber-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
                The Trend Seller Collection
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                Timepieces That
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  Define You
                </span>
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
                Discover our curated collection of {isLoadingProducts ? '...' : allWatches.length} exceptional watches.
                From luxury statements to everyday elegance.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12">
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold text-amber-400">{isLoadingProducts ? '...' : premiumWatches.length}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">Premium</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold text-amber-400">{isLoadingProducts ? '...' : casualWatches.length}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">Casual</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold text-amber-400">{isLoadingProducts ? '...' : stylishWatches.length}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">Stylish</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold text-amber-400">{isLoadingProducts ? '...' : womensWatches.length}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">Women's</p>
                </div>
              </div>
            </div>

            {/* Featured Watch Visual */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute inset-4 rounded-full border border-amber-500/20" />
              <div className="absolute inset-8 rounded-full border border-amber-500/10" />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Watch SVG Icon */}
                <svg className="w-40 h-40 md:w-52 md:h-52 text-amber-500/70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  {/* Watch case */}
                  <circle cx="50" cy="50" r="40" />
                  <circle cx="50" cy="50" r="36" strokeWidth="0.5" />
                  {/* Watch crown */}
                  <rect x="88" y="46" width="8" height="8" rx="1" />
                  {/* Hour markers */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x1 = 50 + 32 * Math.cos(angle);
                    const y1 = 50 + 32 * Math.sin(angle);
                    const x2 = 50 + (i % 3 === 0 ? 28 : 30) * Math.cos(angle);
                    const y2 = 50 + (i % 3 === 0 ? 28 : 30) * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 1.5 : 0.75} />;
                  })}
                  {/* Watch hands */}
                  <line x1="50" y1="50" x2="50" y2="24" strokeWidth="1.5" strokeLinecap="round" /> {/* Hour */}
                  <line x1="50" y1="50" x2="72" y2="50" strokeWidth="1" strokeLinecap="round" /> {/* Minute */}
                  <line x1="50" y1="50" x2="50" y2="60" strokeWidth="0.5" className="text-amber-400" /> {/* Second */}
                  <circle cx="50" cy="50" r="2" fill="currentColor" />
                  {/* Band hints */}
                  <path d="M35 10 L35 4 Q50 0 65 4 L65 10" strokeWidth="0.5" />
                  <path d="M35 90 L35 96 Q50 100 65 96 L65 90" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 border-b border-neutral-200">
        <ol className="flex items-center gap-2 text-sm text-neutral-500">
          <li>
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          </li>
          <li className="text-neutral-300">/</li>
          <li className="text-neutral-900 font-medium">Watches</li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Category Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            {
              name: 'Premium',
              slug: 'premium',
              count: premiumWatches.length,
              description: 'Luxury timepieces for the distinguished',
              gradient: 'from-amber-600 via-amber-700 to-amber-800',
              icon: '👑',
              priceRange: premiumWatches.length > 0 ? `Rs. ${Math.min(...premiumWatches.map(w => w.price)).toLocaleString()} - ${Math.max(...premiumWatches.map(w => w.price)).toLocaleString()}` : '...'
            },
            {
              name: 'Casual',
              slug: 'casual',
              count: casualWatches.length,
              description: 'Everyday elegance and comfort',
              gradient: 'from-stone-600 via-stone-700 to-stone-800',
              icon: '⌚',
              priceRange: casualWatches.length > 0 ? `Rs. ${Math.min(...casualWatches.map(w => w.price)).toLocaleString()} - ${Math.max(...casualWatches.map(w => w.price)).toLocaleString()}` : '...'
            },
            {
              name: 'Stylish',
              slug: 'stylish',
              count: stylishWatches.length,
              description: 'Fashion-forward statement pieces',
              gradient: 'from-neutral-700 via-neutral-800 to-neutral-900',
              icon: '✨',
              priceRange: stylishWatches.length > 0 ? `Rs. ${Math.min(...stylishWatches.map(w => w.price)).toLocaleString()} - ${Math.max(...stylishWatches.map(w => w.price)).toLocaleString()}` : '...'
            },
            {
              name: "Women's",
              slug: 'women',
              count: womensWatches.length,
              description: 'Elegant timepieces for women',
              gradient: 'from-rose-600 via-rose-700 to-rose-800',
              icon: '💎',
              priceRange: womensWatches.length > 0 ? `Rs. ${Math.min(...womensWatches.map(w => w.price)).toLocaleString()} - ${Math.max(...womensWatches.map(w => w.price)).toLocaleString()}` : 'No products yet'
            },
          ].map((category) => (
            <Link
              key={category.slug}
              href={`/watches/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl p-6 md:p-8 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

              {/* Decorative circle */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />

              <div className="relative">
                <span className="text-4xl mb-4 block filter drop-shadow-lg">{category.icon}</span>
                <h3 className="text-xl md:text-2xl font-bold mb-1">{category.name} Watches</h3>
                <p className="text-white/70 text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold">{isLoadingProducts ? '...' : category.count} pieces</span>
                    <span className="block text-xs text-white/50 mt-0.5">{isLoadingProducts ? 'Loading...' : category.priceRange}</span>
                  </div>
                  <span className="text-white/70 group-hover:translate-x-2 transition-transform duration-300 text-xl">→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Filters Bar */}
        <div className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-neutral-200 -mx-4 px-4 py-4 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches by name, brand, or features... (e.g., Rolex Yacht Master)"
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Filter Toggle & Active Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 ${showFilters
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filters</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full">
                    {[searchQuery.trim() !== '', activeCategory !== 'all', priceRange !== 'all', stockFilter !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Right: Results Count, Sort & View Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500 hidden sm:inline">
                {searchQuery.trim() ? (
                  <>
                    Found <strong className="text-neutral-900">{filteredWatches.length}</strong> {filteredWatches.length === 1 ? 'watch' : 'watches'} for "{searchQuery}"
                  </>
                ) : (
                  <>
                    Showing <strong className="text-neutral-900">{filteredWatches.length}</strong> of {allWatches.length} watches
                  </>
                )}
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-az">Name: A → Z</option>
                <option value="name-za">Name: Z → A</option>
              </select>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-neutral-200' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Watches' },
                    { value: 'premium', label: `Premium (${premiumWatches.length})` },
                    { value: 'casual', label: `Casual (${casualWatches.length})` },
                    { value: 'stylish', label: `Stylish (${stylishWatches.length})` },
                    { value: 'women', label: `Women's (${womensWatches.length})` },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setActiveCategory(option.value as CategoryFilter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === option.value
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-2000', label: 'Under Rs. 2,000' },
                    { value: '2000-4000', label: 'Rs. 2,000 - 4,000' },
                    { value: '4000-4500', label: 'Rs. 4,000 - 4,500' },
                    { value: 'above-4500', label: 'Above Rs. 4,500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPriceRange(option.value as PriceRange)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${priceRange === option.value
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Items' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'out-of-stock', label: 'Out of Stock' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStockFilter(option.value as StockFilter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${stockFilter === option.value
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Products Grid */}
        {isLoadingProducts ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-neutral-200 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-neutral-500">Loading watches...</p>
          </div>
        ) : filteredWatches.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredWatches.map((watch, index) => (
              <div
                key={watch.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                {viewMode === 'grid' ? (
                  <GridProductCard product={watch} />
                ) : (
                  <ListProductCard product={watch} />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {searchQuery.trim() ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {searchQuery.trim() ? `No results for "${searchQuery}"` : 'No watches found'}
            </h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              {searchQuery.trim()
                ? `We couldn't find any watches matching "${searchQuery}". Try different keywords or check the spelling.`
                : 'We couldn\'t find any watches matching your current filters. Try adjusting your selection.'}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              {searchQuery.trim() ? 'Clear Search & Filters' : 'Clear All Filters'}
            </button>
          </div>
        )}

        {/* Cross-sell Section */}
        <section className="mt-20 pt-12 border-t border-neutral-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Complete Your Look</h2>
            <p className="text-neutral-500">Pair your timepiece with our premium accessories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/belts"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 p-8 text-white hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">🎗️</span>
                <h3 className="text-2xl font-bold mb-2">Premium Belts</h3>
                <p className="text-white/60 mb-4">Genuine leather craftsmanship</p>
                <span className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                  Shop Belts <span className="text-xl">→</span>
                </span>
              </div>
            </Link>
            <Link
              href="/wallets"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 text-white hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">👝</span>
                <h3 className="text-2xl font-bold mb-2">Luxury Wallets</h3>
                <p className="text-white/60 mb-4">Sophisticated storage solutions</p>
                <span className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                  Shop Wallets <span className="text-xl">→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

// Grid Product Card Component
function GridProductCard({ product }: { product: WatchWithCategory }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = product.inStock === false;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${isOutOfStock ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.watchCategory === 'premium' && (
          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
            PREMIUM
          </span>
        )}
        {isOutOfStock && (
          <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-bold rounded-full">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Product Code Badge */}
      <div className="absolute top-3 right-12 z-10">
        <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-mono rounded">
          {product.productCode}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-neutral-400'}`}
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image Container */}
      <Link href={`/watches/${product.slug}`}>
        <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
          <div className={`relative w-full h-full p-6 transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Quick View Overlay */}
          {!isOutOfStock && (
            <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button className="w-full py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors">
                Quick View
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.watchCategory === 'premium'
            ? 'bg-amber-50 text-amber-700'
            : product.watchCategory === 'casual'
              ? 'bg-stone-100 text-stone-600'
              : product.watchCategory === 'women'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
            {product.watchCategory.charAt(0).toUpperCase() + product.watchCategory.slice(1)}
          </span>
        </div>

        {/* Name */}
        <Link href={`/watches/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 hover:text-amber-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Features Preview */}
        <p className="text-xs text-neutral-500 mb-3 line-clamp-1">
          {product.features.slice(0, 2).join(' • ')}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-neutral-900">
            Rs. {product.price.toLocaleString()}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={isOutOfStock}
          className={`w-full py-3 font-medium rounded-xl transition-all duration-200 ${isOutOfStock
            ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
            }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// List View Product Card
function ListProductCard({ product }: { product: WatchWithCategory }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = product.inStock === false;

  return (
    <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Image */}
      <Link href={`/watches/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-full sm:w-48 h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, 200px"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.watchCategory === 'premium' && (
              <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full">
                PREMIUM
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2 py-1 bg-neutral-800 text-white text-xs font-bold rounded-full">
                OUT OF STOCK
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 ${product.watchCategory === 'premium'
                ? 'bg-amber-50 text-amber-700'
                : product.watchCategory === 'casual'
                  ? 'bg-stone-100 text-stone-600'
                  : product.watchCategory === 'women'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                {product.watchCategory.charAt(0).toUpperCase() + product.watchCategory.slice(1)}
              </span>
              <span className="ml-2 text-xs text-neutral-400 font-mono">{product.productCode}</span>
            </div>
          </div>

          <Link href={`/watches/${product.slug}`}>
            <h3 className="text-lg font-semibold text-neutral-900 hover:text-amber-600 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-neutral-500 text-sm line-clamp-2 mb-3">{product.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features.slice(0, 4).map((feature, idx) => (
              <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">
                {feature}
              </span>
            ))}
            {product.features.length > 4 && (
              <span className="text-xs text-neutral-400">+{product.features.length - 4} more</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-100">
          {/* Price */}
          <span className="text-2xl font-bold text-neutral-900">
            Rs. {product.price.toLocaleString()}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-neutral-400'}`}
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              disabled={isOutOfStock}
              className={`px-6 py-2.5 font-medium rounded-xl transition-all ${isOutOfStock
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
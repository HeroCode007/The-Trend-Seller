'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ArrowRight, Truck, Banknote, ShieldCheck } from 'lucide-react';
import { watchCategories } from '@/lib/watchCategories';

const trustBadges = [
    { icon: Truck, label: 'Free delivery over Rs. 7,000' },
    { icon: Banknote, label: 'Cash on Delivery available' },
    { icon: ShieldCheck, label: 'Secure checkout' },
];

// ── Animation presets ───────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ── Product Card ────────────────────────────────────────────────────────────
function WatchCard({ product, category }) {
    const [imgSrc, setImgSrc] = useState(product.image || '/TTS.png');
    const outOfStock = product.inStock === false;
    const BadgeIcon = category.icon;
    const theme = category.theme;

    return (
        <motion.div variants={cardAnim}>
            <Link href={`/watches/${product.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all duration-300">

                    {/* Image */}
                    <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                        <motion.div
                            className="relative w-full h-full p-6"
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <Image
                                src={imgSrc}
                                alt={product.name}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                onError={() => setImgSrc('/TTS.png')}
                            />
                        </motion.div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className={`badge-shimmer relative overflow-hidden inline-flex items-center gap-1 px-2.5 py-1 ${theme.ribbonBg} text-white text-[10px] font-bold uppercase tracking-wider rounded-full`}>
                                <BadgeIcon className="w-2.5 h-2.5" />
                                {category.name}
                            </span>
                            {outOfStock && (
                                <span className="px-2.5 py-1 bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        {/* Hover CTA */}
                        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-full">
                                View Details <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-neutral-100">
                        {/* Features */}
                        {product.features?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2.5">
                                {product.features.slice(0, 2).map((f, i) => (
                                    <span key={i} className={`px-2 py-0.5 ${theme.featureTag} text-[10px] font-medium rounded-full`}>
                                        {f.length > 14 ? f.slice(0, 14) + '…' : f}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Name */}
                        <h3 className={`text-sm font-semibold text-neutral-900 leading-snug mb-3 line-clamp-2 ${theme.nameHover} transition-colors duration-200`}>
                            {product.name}
                        </h3>

                        {/* Price & stock */}
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-neutral-900">
                                Rs.&nbsp;{product.price.toLocaleString()}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${outOfStock
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                {outOfStock ? 'Sold out' : 'In stock'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CategoryWatchesPage({ category, staticWatches }) {
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [showFilter, setShowFilter] = useState(false);
    const [watches, setWatches] = useState(staticWatches);

    const BadgeIcon = category.icon;
    const theme = category.theme;
    const otherCategories = watchCategories.filter((c) => c.slug !== category.slug);

    useEffect(() => {
        fetch(`/api/products?category=${category.apiCategory}`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => { if (d.success && d.products?.length) setWatches(d.products); })
            .catch(() => { });
        // Re-fetch whenever the category itself changes (e.g. client-side nav between pages using this template)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category.apiCategory]);

    const filtered = useMemo(() => {
        let list = [...watches];
        const band = category.priceBands.find((b) => b.value === priceRange);
        if (band) list = list.filter((w) => band.test(w.price));
        if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
        if (sortBy === 'name-az') list.sort((a, b) => a.name.localeCompare(b.name));
        return list;
    }, [watches, sortBy, priceRange, category.priceBands]);

    const hasFilter = priceRange !== 'all';

    const stats = useMemo(() => {
        if (!watches.length) return { count: 0, min: 0 };
        return { count: watches.length, min: Math.min(...watches.map((w) => w.price)) };
    }, [watches]);

    const heroProduct = useMemo(() => {
        if (!watches.length) return null;
        if (category.featuredSlug) {
            const pinned = watches.find((w) => w.slug === category.featuredSlug);
            if (pinned) return pinned;
        }
        return [...watches].sort((a, b) => b.price - a.price)[0];
    }, [watches, category.featuredSlug]);

    return (
        <div className="min-h-screen bg-neutral-50">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="bg-white border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

                    {/* Breadcrumb */}
                    <motion.nav
                        className="flex items-center gap-2 text-sm text-neutral-400 mb-10"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/watches" className="hover:text-neutral-700 transition-colors">Watches</Link>
                        <span>/</span>
                        <span className="text-neutral-700 font-medium">{category.name}</span>
                    </motion.nav>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-8">
                        <div className="max-w-2xl">
                            <motion.div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full mb-5 ${theme.pillBg}`}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <BadgeIcon className={`w-3.5 h-3.5 ${theme.pillIcon}`} />
                                <span className={`text-xs font-semibold uppercase tracking-widest ${theme.pillText}`}>{category.heroBadgeLabel}</span>
                            </motion.div>

                            <motion.h1
                                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-tight mb-5"
                                variants={fadeUp} initial="hidden" animate="show"
                            >
                                {category.name}
                                <span className={`block ${theme.headlineAccent}`}>{category.headingLine2}</span>
                            </motion.h1>

                            <motion.p
                                className="text-neutral-500 text-lg leading-relaxed mb-8"
                                variants={fadeUp} initial="hidden" animate="show"
                                transition={{ delay: 0.15 }}
                            >
                                {category.tagline}
                            </motion.p>

                            {/* Stats row */}
                            <motion.div
                                className="flex items-center gap-8 mb-8"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                            >
                                <div>
                                    <p className="text-2xl font-bold text-neutral-900">{stats.count}</p>
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Pieces</p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200" />
                                <div>
                                    <p className={`text-2xl font-bold ${theme.statAccent}`}>Rs.&nbsp;{stats.min.toLocaleString()}</p>
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Starting From</p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200" />
                                <div>
                                    <p className="text-2xl font-bold text-neutral-900">2 Yr</p>
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Warranty</p>
                                </div>
                            </motion.div>

                            {/* Trust strip */}
                            <motion.div
                                className="flex flex-wrap items-center gap-x-6 gap-y-2"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {trustBadges.map((badge) => (
                                    <span key={badge.label} className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                                        <badge.icon className="w-3.5 h-3.5 text-neutral-400" />
                                        {badge.label}
                                    </span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Featured product visual */}
                        {heroProduct && (
                            <motion.div
                                className="relative mx-auto lg:mx-0 w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} to-transparent rounded-full blur-3xl`} />
                                <div className={`absolute inset-6 rounded-full border ${theme.ring}`} />
                                <Link href={`/watches/${heroProduct.slug}`} className="group block relative w-full h-full">
                                    <motion.div
                                        className="relative w-full h-full p-10"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Image
                                            src={heroProduct.image || '/TTS.png'}
                                            alt={heroProduct.name}
                                            fill
                                            className="object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                                            sizes="320px"
                                            priority
                                        />
                                    </motion.div>
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-full whitespace-nowrap shadow-lg">
                                        Featured — Rs.&nbsp;{heroProduct.price.toLocaleString()}
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Content ──────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-neutral-200 px-5 py-4 mb-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">

                        {/* Left */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${showFilter
                                        ? `${theme.filledBtn} text-white`
                                        : `bg-white border-neutral-200 text-neutral-600 ${theme.hoverBorder}`
                                    }`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Filter
                                {hasFilter && <span className="w-5 h-5 flex items-center justify-center bg-white/30 rounded-full text-[10px] font-bold">1</span>}
                            </button>

                            {hasFilter && (
                                <button
                                    onClick={() => setPriceRange('all')}
                                    className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-400 hidden sm:block">
                                {filtered.length} timepiece{filtered.length !== 1 ? 's' : ''}
                            </span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`appearance-none pl-4 pr-8 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-700 focus:outline-none cursor-pointer ${theme.focusBorder}`}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name-az">Name A–Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Price filter pills */}
                    {showFilter && (
                        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                            <button
                                onClick={() => setPriceRange('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${priceRange === 'all'
                                        ? `${theme.filledBtn} text-white`
                                        : `bg-white border-neutral-200 text-neutral-600 ${theme.hoverBorder}`
                                    }`}
                            >
                                All Prices
                            </button>
                            {category.priceBands.map((band) => (
                                <button
                                    key={band.value}
                                    onClick={() => setPriceRange(band.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${priceRange === band.value
                                            ? `${theme.filledBtn} text-white`
                                            : `bg-white border-neutral-200 text-neutral-600 ${theme.hoverBorder}`
                                        }`}
                                >
                                    {band.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                    >
                        {filtered.map((watch) => (
                            <WatchCard key={watch.id || watch._id} product={watch} category={category} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-24"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.emptyIconBg} flex items-center justify-center`}>
                            <BadgeIcon className={`w-7 h-7 ${theme.emptyIconText}`} />
                        </div>
                        <p className="text-neutral-500 text-lg mb-6">No watches match your filter.</p>
                        <button
                            onClick={() => setPriceRange('all')}
                            className={`px-6 py-2.5 text-white font-medium rounded-full transition-colors ${theme.emptyBtn}`}
                        >
                            Clear Filter
                        </button>
                    </motion.div>
                )}

                {/* Divider */}
                <div className="mt-16 mb-12 flex items-center gap-4">
                    <div className="flex-1 h-px bg-neutral-200" />
                    <span className="font-display italic text-sm text-neutral-400 tracking-wide">Explore More</span>
                    <div className="flex-1 h-px bg-neutral-200" />
                </div>

                {/* Other collections */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {otherCategories.map((cat) => (
                        <Link key={cat.slug} href={`/watches/${cat.slug}`}
                            className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${cat.tileColor}`}
                        >
                            <span className="text-3xl">{cat.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors">{cat.name} Watches</p>
                                <p className="text-sm text-neutral-400">{cat.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all duration-200" />
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    SlidersHorizontal,
    X,
    ChevronDown,
    Watch,
    Crown,
    Gem,
    Shield,
    Heart,
    Eye,
    Sparkles,
    Award,
    Star,
    Clock,
    BadgeCheck,
    Fingerprint,
    Timer,
    Settings2,
    Loader2
} from 'lucide-react';
import { premiumWatches as staticPremiumWatches } from '@/lib/products';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const shimmer = {
    hidden: { x: '-100%' },
    visible: {
        x: '100%',
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
            repeatDelay: 3
        }
    }
};

// Feature icon mapping for premium watches
const getFeatureIcon = (feature) => {
    const lower = feature.toLowerCase();
    if (lower.includes('swiss') || lower.includes('automatic')) return Settings2;
    if (lower.includes('sapphire') || lower.includes('crystal')) return Gem;
    if (lower.includes('water') || lower.includes('atm')) return Shield;
    if (lower.includes('chronograph') || lower.includes('timer')) return Timer;
    if (lower.includes('leather') || lower.includes('steel') || lower.includes('gold')) return Award;
    if (lower.includes('luminous') || lower.includes('glow')) return Sparkles;
    return Clock;
};

// Premium Product Card Component
function PremiumProductCard({ product }) {
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
            <Link href={`/watches/${product.slug}`}>
                <div className={`relative bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 rounded-sm overflow-hidden transition-all duration-700 ${isHovered
                    ? 'shadow-[0_25px_60px_-15px_rgba(212,175,55,0.3)]'
                    : 'shadow-xl shadow-black/20'
                    } ${isOutOfStock ? 'opacity-70' : ''}`}>

                    {/* Gold accent top border */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                    {/* Shimmer effect on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHovered ? '200%' : '-100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />

                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                        {/* Subtle radial gradient background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />

                        {/* Corner decorations */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-500/30" />
                        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-500/30" />
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-500/30" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-500/30" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 ml-6">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg flex items-center gap-1.5"
                            >
                                <Crown className="w-3 h-3" />
                                Premium
                            </motion.span>
                            {isOutOfStock && (
                                <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        {/* Product Code */}
                        <div className="absolute top-4 right-12 z-20 mr-2">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-amber-400/80 text-[10px] font-mono tracking-wider rounded-sm border border-amber-500/20">
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
                            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm border border-amber-500/20 hover:border-amber-500/50 transition-colors"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'
                                    }`}
                            />
                        </motion.button>

                        {/* Product Image */}
                        <div className="relative w-full h-full p-10">
                            <motion.div
                                className="relative w-full h-full"
                                animate={{
                                    scale: isHovered ? 1.05 : 1,
                                    rotateY: isHovered ? 5 : 0
                                }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </motion.div>
                        </div>

                        {/* View Details Overlay */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-900 font-bold uppercase tracking-wider rounded-sm"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{
                                    y: isHovered ? 0 : 20,
                                    opacity: isHovered ? 1 : 0
                                }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 border-t border-amber-500/10">
                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {product.features?.slice(0, 2).map((feature, idx) => {
                                const FeatureIcon = getFeatureIcon(feature);
                                return (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400/80 text-[10px] font-medium uppercase tracking-wider rounded-sm border border-amber-500/10"
                                    >
                                        <FeatureIcon className="w-3 h-3" />
                                        {feature.length > 18 ? feature.substring(0, 18) + '...' : feature}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-neutral-100 text-base mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300 leading-snug min-h-[2.5rem]">
                            {product.name}
                        </h3>

                        {/* Price & Stock */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-0.5">Price</span>
                                <span className="text-2xl font-light text-amber-400 tracking-wide">
                                    Rs. {product.price.toLocaleString()}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider ${isOutOfStock
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-emerald-400'
                                    }`} />
                                {isOutOfStock ? 'Sold Out' : 'Available'}
                            </div>
                        </div>
                    </div>

                    {/* Bottom gold accent */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"
                        initial={{ width: '0%' }}
                        animate={{ width: isHovered ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
            </Link>
        </motion.div>
    );
}

// Extract dynamic features from premium watches
const extractPremiumFeatures = (watches) => {
    const categories = {
        movement: { count: 0, icon: Settings2, label: 'Swiss Movement', desc: '' },
        sapphire: { count: 0, icon: Gem, label: 'Sapphire Crystal', desc: '' },
        waterproof: { count: 0, icon: Shield, label: 'Water Resistant', desc: '' },
        chronograph: { count: 0, icon: Timer, label: 'Chronograph', desc: '' },
        materials: { count: 0, icon: Award, label: 'Premium Materials', desc: '' },
        certified: { count: 0, icon: BadgeCheck, label: 'Certified Authentic', desc: '' },
    };

    watches.forEach(watch => {
        watch.features?.forEach(feature => {
            const lower = feature.toLowerCase();
            if (lower.includes('swiss') || lower.includes('automatic') || lower.includes('movement')) categories.movement.count++;
            if (lower.includes('sapphire') || lower.includes('crystal')) categories.sapphire.count++;
            if (lower.includes('water') || lower.includes('atm')) categories.waterproof.count++;
            if (lower.includes('chronograph') || lower.includes('timer')) categories.chronograph.count++;
            if (lower.includes('leather') || lower.includes('steel') || lower.includes('gold') || lower.includes('titanium')) categories.materials.count++;
        });
    });

    // Always show certified as it applies to all premium watches
    categories.certified.count = watches.length;

    const sorted = Object.values(categories)
        .filter(cat => cat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    sorted.forEach(cat => {
        cat.desc = `${cat.count} ${cat.count === 1 ? 'timepiece' : 'timepieces'}`;
    });

    return sorted;
};

// Main Page Component
export default function PremiumWatchesPage() {
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState('all');
    const [premiumWatches, setPremiumWatches] = useState(staticPremiumWatches);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch products from database
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?category=premium-watches', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.products.length > 0) {
                        setPremiumWatches(data.products);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products from database:', error);
                // Falls back to staticPremiumWatches
            } finally {
                setIsLoadingProducts(false);
            }
        }
        fetchProducts();
    }, []);

    // Filter and sort watches
    const filteredWatches = useMemo(() => {
        let watches = [...premiumWatches];

        // Price filter
        switch (priceRange) {
            case 'under-4000':
                watches = watches.filter(w => w.price < 4000);
                break;
            case '4000-6000':
                watches = watches.filter(w => w.price >= 4000 && w.price <= 6000);
                break;
            case 'above-6000':
                watches = watches.filter(w => w.price > 6000);
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
        }

        return watches;
    }, [premiumWatches, sortBy, priceRange]);

    const hasActiveFilters = priceRange !== 'all';

    // Calculate stats
    const priceStats = useMemo(() => {
        if (premiumWatches.length === 0) {
            return { min: 0, max: 0, count: 0 };
        }
        const prices = premiumWatches.map(w => w.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            count: premiumWatches.length
        };
    }, [premiumWatches]);

    // Dynamic features
    const dynamicFeatures = useMemo(() => extractPremiumFeatures(premiumWatches), [premiumWatches]);

    return (
        <div className="min-h-screen bg-neutral-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Luxurious background */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[80px]"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Decorative lines */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/10 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/10 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <ol className="flex items-center gap-3 text-sm">
                            <li>
                                <Link href="/" className="text-neutral-500 hover:text-amber-400 transition-colors">Home</Link>
                            </li>
                            <li className="text-neutral-700">—</li>
                            <li>
                                <Link href="/watches" className="text-neutral-500 hover:text-amber-400 transition-colors">Watches</Link>
                            </li>
                            <li className="text-neutral-700">—</li>
                            <li className="text-amber-400 font-medium">Premium</li>
                        </ol>
                    </motion.nav>

                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Text Content */}
                        <motion.div
                            className="flex-1 text-center lg:text-left"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            {/* Luxury Badge */}
                            <motion.div
                                className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-amber-500/10 to-transparent backdrop-blur-sm rounded-sm border-l-2 border-amber-500 mb-8"
                                whileHover={{ x: 5 }}
                            >
                                <Crown className="w-5 h-5 text-amber-400" />
                                <span className="text-sm font-medium text-amber-400/90 uppercase tracking-[0.2em]">Luxury Collection</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-6 tracking-tight leading-[1.1]">
                                Premium
                                <span className="block font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                                    Timepieces
                                </span>
                            </h1>

                            <p className="text-neutral-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0 font-light">
                                Discover the pinnacle of horological craftsmanship. Each timepiece is a
                                masterwork of precision engineering and timeless elegance.
                            </p>

                            {/* Elegant Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-12">
                                <div className="text-center lg:text-left">
                                    <p className="text-4xl font-extralight text-white tracking-wider">{priceStats.count}</p>
                                    <p className="text-xs text-neutral-600 uppercase tracking-[0.25em] mt-1">Exclusive Pieces</p>
                                </div>
                                <div className="text-center lg:text-left relative">
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-amber-500/20" />
                                    <p className="text-4xl font-extralight text-amber-400 tracking-wider">Rs. {priceStats.min.toLocaleString()}</p>
                                    <p className="text-xs text-neutral-600 uppercase tracking-[0.25em] mt-1">Starting From</p>
                                </div>
                                <div className="text-center lg:text-left relative">
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-amber-500/20" />
                                    <p className="text-4xl font-extralight text-white tracking-wider">2 Yr</p>
                                    <p className="text-xs text-neutral-600 uppercase tracking-[0.25em] mt-1">Warranty</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Visual - Elegant Watch Display */}
                        <motion.div
                            className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex-shrink-0"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Outer decorative ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full border border-amber-500/20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Inner decorative ring */}
                            <motion.div
                                className="absolute inset-8 rounded-full border border-amber-500/10"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Center glow */}
                            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 blur-xl" />

                            {/* Central Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="relative">
                                        <Watch className="w-36 h-36 md:w-44 md:h-44 text-amber-500/50" strokeWidth={0.5} />
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <Crown className="w-14 h-14 text-amber-400" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating luxury badges */}
                            <motion.div
                                className="absolute top-8 right-12 px-4 py-2 bg-black/40 backdrop-blur-md rounded-sm border border-amber-500/20"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Gem className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-amber-400/80 uppercase tracking-wider">Sapphire</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-12 left-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-sm border border-amber-500/20"
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-amber-400/80 uppercase tracking-wider">Swiss</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute top-1/2 -right-4 px-4 py-2 bg-black/40 backdrop-blur-md rounded-sm border border-amber-500/20"
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 0.8 }}
                            >
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-amber-400/80 uppercase tracking-wider">Certified</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Elegant bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                {/* Luxury Feature Highlights */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {dynamicFeatures.map((feature, idx) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                className="relative p-5 bg-neutral-900/50 rounded-sm border border-amber-500/10 hover:border-amber-500/30 transition-all duration-500 text-center group overflow-hidden"
                                whileHover={{ y: -3 }}
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-sm bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                                        <IconComponent className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h3 className="font-medium text-neutral-200 text-sm uppercase tracking-wider">{feature.label}</h3>
                                    <p className="text-xs text-neutral-500 mt-1">{feature.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Filters Bar */}
                <motion.div
                    className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border border-amber-500/10 rounded-sm mb-10 p-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-2.5 border rounded-sm font-medium uppercase tracking-wider text-sm transition-all duration-300 ${showFilters
                                    ? 'bg-amber-500 border-amber-500 text-neutral-900'
                                    : 'bg-transparent border-amber-500/30 hover:border-amber-500/60 text-neutral-300'
                                    }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="w-5 h-5 flex items-center justify-center bg-neutral-900 text-amber-400 text-xs font-bold rounded-full">
                                        1
                                    </span>
                                )}
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={() => setPriceRange('all')}
                                    className="text-sm text-neutral-500 hover:text-amber-400 transition-colors flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <X className="w-3 h-3" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-500 hidden sm:inline">
                                Showing <strong className="text-amber-400">{filteredWatches.length}</strong> timepieces
                            </span>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-neutral-800/50 border border-amber-500/20 rounded-sm text-sm text-neutral-300 focus:outline-none focus:border-amber-500/50 cursor-pointer uppercase tracking-wider"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low → High</option>
                                    <option value="price-high">Price: High → Low</option>
                                    <option value="name-az">Name: A → Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-5 mt-5 border-t border-amber-500/10">
                                    <label className="block text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Price Range</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { value: 'all', label: 'All Prices' },
                                            { value: 'under-4000', label: 'Under Rs. 4,000' },
                                            { value: '4000-6000', label: 'Rs. 4,000 - 6,000' },
                                            { value: 'above-6000', label: 'Above Rs. 6,000' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setPriceRange(option.value)}
                                                className={`px-5 py-2.5 rounded-sm text-sm font-medium uppercase tracking-wider transition-all duration-300 ${priceRange === option.value
                                                    ? 'bg-amber-500 text-neutral-900'
                                                    : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-amber-500/10'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Products Grid */}
                {filteredWatches.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredWatches.map((watch) => (
                            <PremiumProductCard
                                key={watch.id}
                                product={watch}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-24"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center border border-amber-500/20">
                            <Watch className="w-12 h-12 text-amber-500/30" />
                        </div>
                        <h3 className="text-xl font-light text-neutral-200 mb-2">No timepieces found</h3>
                        <p className="text-neutral-500 mb-8">Adjust your filters to explore our collection</p>
                        <button
                            onClick={() => setPriceRange('all')}
                            className="px-8 py-3 bg-amber-500 text-neutral-900 font-medium uppercase tracking-wider rounded-sm hover:bg-amber-400 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}

                {/* Back to All Watches */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link
                        href="/watches"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-amber-500/30 text-amber-400 font-medium uppercase tracking-wider rounded-sm hover:bg-amber-500 hover:text-neutral-900 hover:border-amber-500 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        View All Collections
                    </Link>
                </motion.div>

                {/* Cross-sell Section */}
                <section className="mt-24 pt-16 border-t border-amber-500/10">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2 border-l-2 border-amber-500 bg-amber-500/5 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-400/80 uppercase tracking-[0.2em]">Explore More</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extralight text-white mb-4">Other Collections</h2>
                        <p className="text-neutral-500 font-light">Discover our casual and stylish watch collections</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Link
                                href="/watches/casual"
                                className="group relative block overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-10 hover:shadow-2xl hover:shadow-stone-900/50 transition-all duration-500 border border-stone-700/30"
                            >
                                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-stone-700/10" />
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-stone-600/50 via-stone-500/20 to-transparent" />
                                <div className="relative z-10">
                                    <span className="text-5xl mb-6 block">⌚</span>
                                    <h3 className="text-2xl font-light text-white mb-2">Casual Watches</h3>
                                    <p className="text-stone-400 mb-6 font-light">Perfect for everyday adventures</p>
                                    <span className="inline-flex items-center gap-2 text-stone-300 font-medium uppercase tracking-wider text-sm group-hover:text-white group-hover:gap-4 transition-all">
                                        Explore <span className="text-lg">→</span>
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Link
                                href="/watches/stylish"
                                className="group relative block overflow-hidden rounded-sm bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-10 hover:shadow-2xl hover:shadow-neutral-900/50 transition-all duration-500 border border-neutral-700/30"
                            >
                                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-neutral-700/10" />
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-neutral-600/50 via-neutral-500/20 to-transparent" />
                                <div className="relative z-10">
                                    <span className="text-5xl mb-6 block">✨</span>
                                    <h3 className="text-2xl font-light text-white mb-2">Stylish Watches</h3>
                                    <p className="text-neutral-400 mb-6 font-light">Fashion-forward statement pieces</p>
                                    <span className="inline-flex items-center gap-2 text-neutral-300 font-medium uppercase tracking-wider text-sm group-hover:text-white group-hover:gap-4 transition-all">
                                        Explore <span className="text-lg">→</span>
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
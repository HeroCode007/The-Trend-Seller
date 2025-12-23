'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    SlidersHorizontal,
    X,
    ChevronDown,
    Watch,
    Activity,
    Mountain,
    Zap,
    Shield,
    Heart,
    Eye,
    Sparkles,
    Droplets,
    Timer,
    Gauge,
    Sun,
    Moon,
    Calendar,
    Compass,
    Battery,
    Bluetooth,
    Wifi,
    Footprints,
    Flame,
    Target,
    HeartPulse,
    Loader2
} from 'lucide-react';
import { casualWatches as staticCasualWatches } from '@/lib/products';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

// Feature icon mapping - maps common feature keywords to icons
const featureIconMap = {
    // Water related
    'water': Droplets,
    'waterproof': Droplets,
    'water resistant': Droplets,
    'swimming': Droplets,
    'dive': Droplets,
    'atm': Droplets,

    // Activity & Fitness
    'fitness': Activity,
    'activity': Activity,
    'sport': Activity,
    'exercise': Activity,
    'workout': Activity,
    'step': Footprints,
    'steps': Footprints,
    'pedometer': Footprints,
    'heart rate': HeartPulse,
    'heartrate': HeartPulse,
    'pulse': HeartPulse,
    'calorie': Flame,
    'calories': Flame,

    // Time features
    'chronograph': Timer,
    'stopwatch': Timer,
    'timer': Timer,
    'alarm': Timer,
    'date': Calendar,
    'calendar': Calendar,
    'day': Calendar,

    // Durability
    'shock': Shield,
    'scratch': Shield,
    'durable': Shield,
    'rugged': Shield,
    'military': Shield,
    'tough': Shield,
    'stainless': Shield,
    'steel': Shield,

    // Power
    'battery': Battery,
    'solar': Sun,
    'automatic': Gauge,
    'quartz': Zap,
    'kinetic': Zap,

    // Smart features
    'bluetooth': Bluetooth,
    'smart': Wifi,
    'notification': Wifi,
    'gps': Compass,
    'compass': Compass,
    'altimeter': Mountain,
    'barometer': Mountain,

    // Display
    'luminous': Moon,
    'glow': Moon,
    'backlight': Moon,
    'led': Sun,
    'display': Target,

    // Default
    'default': Watch
};

// Function to get icon for a feature
const getFeatureIcon = (feature) => {
    const lowerFeature = feature.toLowerCase();
    for (const [keyword, icon] of Object.entries(featureIconMap)) {
        if (lowerFeature.includes(keyword)) {
            return icon;
        }
    }
    return Watch; // default icon
};

// Function to extract and aggregate features from all watches
const extractUniqueFeatures = (watches) => {
    const featureCount = {};
    const featureExamples = {};

    watches.forEach(watch => {
        watch.features?.forEach(feature => {
            // Get the icon type for this feature
            const icon = getFeatureIcon(feature);
            const iconName = icon.displayName || icon.name || 'Watch';

            if (!featureCount[iconName]) {
                featureCount[iconName] = 0;
                featureExamples[iconName] = feature;
            }
            featureCount[iconName]++;
        });
    });

    // Get top features by count
    const sortedFeatures = Object.entries(featureCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    return sortedFeatures.map(([iconName, count]) => ({
        icon: Object.values(featureIconMap).find(i => (i.displayName || i.name) === iconName) || Watch,
        label: featureExamples[iconName]?.split(' ').slice(0, 2).join(' ') || iconName,
        desc: `${count} watches`,
        feature: featureExamples[iconName]
    }));
};

// Product Card Component - Without Add to Cart
function EnhancedProductCard({ product }) {
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
                <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ${isHovered
                    ? 'shadow-2xl shadow-stone-300/50 scale-[1.02]'
                    : 'shadow-lg shadow-stone-200/30'
                    } ${isOutOfStock ? 'opacity-75' : ''}`}>

                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-white">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-stone-200/30 to-transparent rounded-tr-full" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-3 py-1.5 bg-gradient-to-r from-stone-700 to-stone-800 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5"
                            >
                                <Activity className="w-3 h-3" />
                                Casual
                            </motion.span>
                            {isOutOfStock && (
                                <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Product Code */}
                        <div className="absolute top-3 right-12 z-20">
                            <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-stone-500 text-[10px] font-mono rounded-md border border-stone-200/50">
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
                            className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-100 hover:border-stone-200 transition-colors"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-400'
                                    }`}
                            />
                        </motion.button>

                        {/* Product Image */}
                        <div className="block relative w-full h-full p-8">
                            <motion.div
                                className="relative w-full h-full"
                                animate={{
                                    scale: isHovered ? 1.08 : 1,
                                    y: isHovered ? -5 : 0
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-xl"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </motion.div>
                        </div>

                        {/* Quick View Overlay */}
                        <motion.div
                            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 20
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-center gap-2 py-2.5 bg-white text-stone-900 font-semibold rounded-xl hover:bg-stone-100 transition-colors text-sm">
                                <Eye className="w-4 h-4" />
                                View Details
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                        {/* Features Tags with Icons */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {product.features?.slice(0, 2).map((feature, idx) => {
                                const FeatureIcon = getFeatureIcon(feature);
                                return (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-medium rounded-full"
                                    >
                                        <FeatureIcon className="w-3 h-3" />
                                        {feature.length > 18 ? feature.substring(0, 18) + '...' : feature}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-stone-900 text-base mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug min-h-[2.5rem]">
                            {product.name}
                        </h3>

                        {/* Price & Stock */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-stone-900">
                                    Rs. {product.price.toLocaleString()}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isOutOfStock
                                ? 'bg-red-50 text-red-600'
                                : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'
                                    }`} />
                                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Accent Line */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-stone-600 via-amber-500 to-stone-600"
                        initial={{ width: '0%' }}
                        animate={{ width: isHovered ? '100%' : '0%' }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </Link>
        </motion.div>
    );
}

// Main Page Component
export default function CasualWatchesPage() {
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState('all');
    const [casualWatches, setCasualWatches] = useState(staticCasualWatches);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch products from database
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?category=casual-watches', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.products.length > 0) {
                        setCasualWatches(data.products);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products from database:', error);
                // Falls back to staticCasualWatches
            } finally {
                setIsLoadingProducts(false);
            }
        }
        fetchProducts();
    }, []);

    // Filter and sort watches
    const filteredWatches = useMemo(() => {
        let watches = [...casualWatches];

        // Price filter
        switch (priceRange) {
            case 'under-2000':
                watches = watches.filter(w => w.price < 2000);
                break;
            case '2000-3500':
                watches = watches.filter(w => w.price >= 2000 && w.price <= 3500);
                break;
            case 'above-3500':
                watches = watches.filter(w => w.price > 3500);
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
    }, [casualWatches, sortBy, priceRange]);

    const hasActiveFilters = priceRange !== 'all';

    // Calculate stats
    const priceStats = useMemo(() => {
        if (casualWatches.length === 0) {
            return { min: 0, max: 0, count: 0 };
        }
        const prices = casualWatches.map(w => w.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            count: casualWatches.length
        };
    }, [casualWatches]);

    // Extract dynamic features from actual watch data
    const dynamicFeatures = useMemo(() => {
        if (casualWatches.length === 0) {
            return [];
        }
        // Collect all features from watches
        const allFeatures = [];
        casualWatches.forEach(watch => {
            watch.features?.forEach(feature => {
                allFeatures.push(feature);
            });
        });

        // Count feature categories
        const categories = {
            water: { count: 0, icon: Droplets, label: 'Water Resistant', desc: '' },
            fitness: { count: 0, icon: Activity, label: 'Fitness Tracking', desc: '' },
            durable: { count: 0, icon: Shield, label: 'Durable Build', desc: '' },
            battery: { count: 0, icon: Zap, label: 'Long Battery', desc: '' },
            chronograph: { count: 0, icon: Timer, label: 'Chronograph', desc: '' },
            luminous: { count: 0, icon: Moon, label: 'Luminous Dial', desc: '' },
            outdoor: { count: 0, icon: Mountain, label: 'Outdoor Ready', desc: '' },
            smart: { count: 0, icon: Wifi, label: 'Smart Features', desc: '' },
        };

        allFeatures.forEach(feature => {
            const lower = feature.toLowerCase();
            if (lower.includes('water') || lower.includes('atm') || lower.includes('swim')) {
                categories.water.count++;
            }
            if (lower.includes('fitness') || lower.includes('step') || lower.includes('heart') || lower.includes('activity') || lower.includes('sport')) {
                categories.fitness.count++;
            }
            if (lower.includes('steel') || lower.includes('stainless') || lower.includes('durable') || lower.includes('shock') || lower.includes('scratch')) {
                categories.durable.count++;
            }
            if (lower.includes('battery') || lower.includes('quartz') || lower.includes('solar') || lower.includes('power')) {
                categories.battery.count++;
            }
            if (lower.includes('chronograph') || lower.includes('stopwatch') || lower.includes('timer')) {
                categories.chronograph.count++;
            }
            if (lower.includes('luminous') || lower.includes('glow') || lower.includes('backlight') || lower.includes('led')) {
                categories.luminous.count++;
            }
            if (lower.includes('outdoor') || lower.includes('compass') || lower.includes('altimeter') || lower.includes('adventure')) {
                categories.outdoor.count++;
            }
            if (lower.includes('smart') || lower.includes('bluetooth') || lower.includes('notification') || lower.includes('gps')) {
                categories.smart.count++;
            }
        });

        // Get top 4 features by count
        const sortedCategories = Object.values(categories)
            .filter(cat => cat.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

        // Update descriptions with counts
        sortedCategories.forEach(cat => {
            cat.desc = `${cat.count} ${cat.count === 1 ? 'watch' : 'watches'}`;
        });

        // If we don't have 4 features, add defaults
        const defaultFeatures = [
            { icon: Activity, label: 'Active Lifestyle', desc: 'Everyday wear', count: 0 },
            { icon: Shield, label: 'Quality Build', desc: 'Premium materials', count: 0 },
            { icon: Zap, label: 'Reliable', desc: 'Trusted performance', count: 0 },
            { icon: Mountain, label: 'Versatile', desc: 'Any occasion', count: 0 },
        ];

        while (sortedCategories.length < 4) {
            const defaultFeature = defaultFeatures[sortedCategories.length];
            if (defaultFeature) {
                sortedCategories.push(defaultFeature);
            } else {
                break;
            }
        }

        return sortedCategories;
    }, [casualWatches]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900" />

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -left-32 w-80 h-80 bg-stone-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <ol className="flex items-center gap-2 text-sm text-stone-400">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            </li>
                            <li className="text-stone-600">/</li>
                            <li>
                                <Link href="/watches" className="hover:text-white transition-colors">Watches</Link>
                            </li>
                            <li className="text-stone-600">/</li>
                            <li className="text-amber-400 font-medium">Casual</li>
                        </ol>
                    </motion.nav>

                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Text Content */}
                        <motion.div
                            className="flex-1 text-center lg:text-left"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            {/* Badge */}
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-6"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Activity className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-medium text-stone-300">Active Lifestyle Collection</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                                Casual
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                                    Watches
                                </span>
                            </h1>

                            <p className="text-stone-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
                                Perfect for your active lifestyle and everyday adventures.
                                Combining functionality with comfort for the modern explorer.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-bold text-white">{priceStats.count}</p>
                                    <p className="text-sm text-stone-500 uppercase tracking-wider">Styles</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-bold text-amber-400">Rs. {priceStats.min.toLocaleString()}</p>
                                    <p className="text-sm text-stone-500 uppercase tracking-wider">Starting From</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-bold text-white">2 Yr</p>
                                    <p className="text-sm text-stone-500 uppercase tracking-wider">Warranty</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Visual */}
                        <motion.div
                            className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0"
                            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-stone-500/20 rounded-full blur-3xl" />

                            {/* Decorative Rings */}
                            <motion.div
                                className="absolute inset-4 rounded-full border border-amber-500/20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-8 rounded-full border border-stone-500/10"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Central Icon/Visual */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="relative">
                                        <Watch className="w-32 h-32 md:w-40 md:h-40 text-amber-500/70" strokeWidth={0.75} />
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Activity className="w-12 h-12 text-amber-400" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating Feature Icons - Using Dynamic Features */}
                            {dynamicFeatures.slice(0, 3).map((feature, idx) => {
                                const positions = [
                                    { className: "top-4 right-8", animation: { y: [0, -8, 0] }, delay: 0.5 },
                                    { className: "bottom-8 left-4", animation: { y: [0, 8, 0] }, delay: 1 },
                                    { className: "top-1/2 -right-2", animation: { x: [0, 8, 0] }, delay: 0.8 },
                                ];
                                const pos = positions[idx];
                                const IconComponent = feature.icon;

                                return (
                                    <motion.div
                                        key={idx}
                                        className={`absolute ${pos.className} p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10`}
                                        animate={pos.animation}
                                        transition={{ duration: 3 + idx * 0.5, repeat: Infinity, delay: pos.delay }}
                                    >
                                        <IconComponent className="w-6 h-6 text-amber-400" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                {/* Wave Separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
                        <path
                            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="url(#gradient)"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f5f5f4" />
                                <stop offset="100%" stopColor="#fafaf9" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Dynamic Feature Highlights - Based on Actual Watch Features */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {dynamicFeatures.map((feature, idx) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 text-center group hover:border-amber-200"
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center group-hover:from-amber-100 group-hover:to-amber-50 transition-colors">
                                    <IconComponent className="w-6 h-6 text-stone-600 group-hover:text-amber-600 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-stone-900 text-sm">{feature.label}</h3>
                                <p className="text-xs text-stone-500 mt-1">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Filters Bar */}
                <motion.div
                    className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-lg mb-8 p-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-medium transition-all duration-200 ${showFilters
                                    ? 'bg-stone-900 border-stone-900 text-white'
                                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
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
                                    className="text-sm text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-stone-500 hidden sm:inline">
                                Showing <strong className="text-stone-900">{filteredWatches.length}</strong> watches
                            </span>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low → High</option>
                                    <option value="price-high">Price: High → Low</option>
                                    <option value="name-az">Name: A → Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
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
                        <div className="pt-4 mt-4 border-t border-stone-200">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-3">Price Range</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'All Prices' },
                                        { value: 'under-2000', label: 'Under Rs. 2,000' },
                                        { value: '2000-3500', label: 'Rs. 2,000 - 3,500' },
                                        { value: 'above-3500', label: 'Above Rs. 3,500' },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setPriceRange(option.value)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${priceRange === option.value
                                                ? 'bg-stone-900 text-white shadow-md'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Products Grid */}
                {isLoadingProducts ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <p className="text-stone-600 font-medium">Loading watches...</p>
                    </div>
                ) : filteredWatches.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredWatches.map((watch) => (
                            <EnhancedProductCard
                                key={watch.id || watch._id}
                                product={watch}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                            <Watch className="w-12 h-12 text-stone-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-stone-900 mb-2">No watches found</h3>
                        <p className="text-stone-500 mb-6">Try adjusting your filters</p>
                        <button
                            onClick={() => setPriceRange('all')}
                            className="px-6 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}

                {/* Back to All Watches */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link
                        href="/watches"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Watches
                    </Link>
                </motion.div>

                {/* Cross-sell Section */}
                <section className="mt-20 pt-12 border-t border-stone-200">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-stone-600">Explore More</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">Other Collections</h2>
                        <p className="text-stone-500">Discover our premium and stylish watch collections</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                href="/watches/premium"
                                className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-8 text-white hover:shadow-2xl transition-shadow"
                            >
                                <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10" />
                                <div className="relative z-10">
                                    <span className="text-5xl mb-4 block">👑</span>
                                    <h3 className="text-2xl font-bold mb-2">Premium Watches</h3>
                                    <p className="text-amber-100/70 mb-4">Luxury timepieces for the distinguished</p>
                                    <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                                        Explore <span className="text-xl">→</span>
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                href="/watches/stylish"
                                className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 p-8 text-white hover:shadow-2xl transition-shadow"
                            >
                                <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10" />
                                <div className="relative z-10">
                                    <span className="text-5xl mb-4 block">✨</span>
                                    <h3 className="text-2xl font-bold mb-2">Stylish Watches</h3>
                                    <p className="text-neutral-300/70 mb-4">Fashion-forward statement pieces</p>
                                    <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                                        Explore <span className="text-xl">→</span>
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
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Shield, Award, ChevronDown, Watch, Wallet, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

interface CategoryCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    href: string;
    gradient: string;
    accentColor: string;
    icon: React.ReactNode;
    imageUrl?: string;
}

// ============================================
// TEXT SCRAMBLE HOOK
// ============================================
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function useTextScramble(text: string, delay: number = 0) {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let interval: NodeJS.Timeout;
        let iteration = 0;

        timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split('')
                        .map((char, index) => {
                            if (char === ' ') return ' ';
                            if (index < iteration) return text[index];
                            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        })
                        .join('')
                );

                iteration += 0.5;

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setDisplayText(text);
                    setIsComplete(true);
                }
            }, 40);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay]);

    return { displayText, isComplete };
}

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { damping: 20, stiffness: 200 });
    const springY = useSpring(y, { damping: 20, stiffness: 200 });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set((e.clientX - centerX) * 0.2);
        y.set((e.clientY - centerY) * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={buttonRef}
            href={href}
            style={isMobile ? {} : { x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={isMobile ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center gap-2 sm:gap-3 
                 px-6 sm:px-8 py-3 sm:py-4 
                 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600
                 text-black font-semibold text-base sm:text-lg rounded-full
                 shadow-[0_0_20px_rgba(212,175,55,0.2)] sm:shadow-[0_0_30px_rgba(212,175,55,0.3)]
                 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] sm:hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]
                 active:shadow-[0_0_30px_rgba(212,175,55,0.4)]
                 transition-shadow duration-300 overflow-hidden"
        >
            <span className="relative z-10">{children}</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />

            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full hidden sm:block">
                <div className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] 
                        transition-transform duration-700
                        bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
        </motion.a>
    );
}

// ============================================
// ANIMATED GRADIENT TEXT
// ============================================
function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <span
            className={`bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 
                  bg-clip-text text-transparent animate-gradient-x ${className}`}
            style={{
                backgroundSize: '200% auto',
                animation: 'gradient-x 3s linear infinite',
            }}
        >
            {children}
        </span>
    );
}

// ============================================
// BELT ICON (Custom SVG)
// ============================================
function BeltIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="9" width="20" height="6" rx="1" />
            <rect x="8" y="8" width="8" height="8" rx="1" />
            <circle cx="12" cy="12" r="1.5" />
        </svg>
    );
}

// ============================================
// CSS ANIMATED WATCH
// ============================================
function AnimatedWatch() {
    return (
        <motion.div
            className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px]"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
            {/* Glow behind watch */}
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />

            {/* Floating animation wrapper */}
            <motion.div
                className="relative w-full h-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Watch SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                    <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.3" />
                        </filter>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f5d742" />
                            <stop offset="50%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#b8960c" />
                        </linearGradient>
                        <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1a1a1a" />
                            <stop offset="100%" stopColor="#0a0a0a" />
                        </linearGradient>
                    </defs>

                    {/* Watch case */}
                    <circle cx="100" cy="100" r="85" fill="#111" filter="url(#shadow)" />
                    <circle cx="100" cy="100" r="82" fill="url(#faceGradient)" stroke="url(#goldGradient)" strokeWidth="4" />

                    {/* Inner bezel */}
                    <circle cx="100" cy="100" r="72" fill="none" stroke="#222" strokeWidth="1" />

                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const isMain = i % 3 === 0;
                        const innerR = isMain ? 54 : 58;
                        const outerR = 66;
                        return (
                            <line
                                key={i}
                                x1={100 + innerR * Math.cos(angle)}
                                y1={100 + innerR * Math.sin(angle)}
                                x2={100 + outerR * Math.cos(angle)}
                                y2={100 + outerR * Math.sin(angle)}
                                stroke={isMain ? "url(#goldGradient)" : "#444"}
                                strokeWidth={isMain ? 3 : 1.5}
                                strokeLinecap="round"
                            />
                        );
                    })}

                    {/* Brand text */}
                    <text x="100" y="68" textAnchor="middle" fill="#d4af37" fontSize="7" fontFamily="serif" letterSpacing="1">
                        THE TREND SELLER
                    </text>
                    <text x="100" y="135" textAnchor="middle" fill="#666" fontSize="5" fontFamily="sans-serif">
                        PREMIUM
                    </text>

                    {/* Hour hand */}
                    <line
                        x1="100" y1="100" x2="100" y2="60"
                        stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round"
                        style={{
                            transformOrigin: '100px 100px',
                            animation: 'rotate-hour 43200s linear infinite',
                        }}
                    />

                    {/* Minute hand */}
                    <line
                        x1="100" y1="100" x2="100" y2="45"
                        stroke="#fff" strokeWidth="2.5" strokeLinecap="round"
                        style={{
                            transformOrigin: '100px 100px',
                            animation: 'rotate-minute 3600s linear infinite',
                        }}
                    />

                    {/* Second hand */}
                    <g style={{
                        transformOrigin: '100px 100px',
                        animation: 'rotate-second 60s linear infinite',
                    }}>
                        <line x1="100" y1="115" x2="100" y2="38" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
                        <circle cx="100" cy="115" r="3" fill="#ef4444" />
                    </g>

                    {/* Center */}
                    <circle cx="100" cy="100" r="6" fill="url(#goldGradient)" />
                    <circle cx="100" cy="100" r="2.5" fill="#0a0a0a" />

                    {/* Crown */}
                    <rect x="180" y="95" width="10" height="10" rx="2" fill="url(#goldGradient)" />

                    {/* Glass reflection */}
                    <ellipse cx="70" cy="70" rx="30" ry="20" fill="rgba(255,255,255,0.03)" transform="rotate(-30 70 70)" />
                </svg>
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-60"
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
                className="absolute -bottom-1 -left-4 sm:-bottom-2 sm:-left-6 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-40"
                animate={{ y: [0, 8, 0], scale: [1, 0.9, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.div
                className="hidden sm:block absolute top-1/2 -right-6 md:-right-8 w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/30"
                animate={{ x: [0, 5, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
            />
        </motion.div>
    );
}

// ============================================
// CATEGORY CARD COMPONENT
// ============================================
function CategoryCard({ card, index }: { card: CategoryCard; index: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });
    const [isMobile, setIsMobile] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={cardRef}
            href={card.href}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900/50 
                       border border-white/5 backdrop-blur-sm
                       hover:border-amber-500/30 active:border-amber-500/30 
                       transition-all duration-500"
        >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                            group-active:opacity-100 transition-opacity duration-500 ${card.gradient}`} />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
                                transition-transform duration-1000 ease-out
                                bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>

            {/* Card content */}
            <div className="relative z-10 p-5 sm:p-6 md:p-8 lg:p-10 h-full flex flex-col min-h-[280px] sm:min-h-[320px] md:min-h-[380px]">
                {/* Icon container */}
                <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl 
                                flex items-center justify-center mb-4 sm:mb-5 md:mb-6
                                bg-gradient-to-br ${card.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8">
                        {card.icon}
                    </span>
                </motion.div>

                {/* Subtitle */}
                <span className={`text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] 
                                 uppercase mb-1.5 sm:mb-2 ${card.accentColor}`}>
                    {card.subtitle}
                </span>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 
                              group-hover:text-amber-100 group-active:text-amber-100 transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {card.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 md:mb-8 flex-grow 
                             line-clamp-3 sm:line-clamp-none">
                    {card.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-amber-400 font-medium text-sm sm:text-base
                               group-hover:gap-3 sm:group-hover:gap-4 transition-all duration-300">
                    <span>Explore Collection</span>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 
                                            group-active:translate-x-1 group-active:-translate-y-1
                                            transition-transform duration-300" />
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 
                               opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div className={`w-full h-full ${card.gradient} blur-2xl`} />
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 group-hover:w-full 
                                group-active:w-full transition-all duration-500 ${card.gradient}`} />
            </div>

            {/* 3D depth shadow - hidden on mobile */}
            <div className="hidden sm:block absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 
                           transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: `linear-gradient(135deg, ${card.accentColor.replace('text-', '')}22, transparent)` }} />
        </motion.a>
    );
}

// ============================================
// CATEGORIES SECTION
// ============================================
function CategoriesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const categories: CategoryCard[] = [
        {
            id: 'watches',
            title: 'Watches',
            subtitle: 'Timeless Precision',
            description: 'Discover our curated collection of premium timepieces that blend masterful craftsmanship with contemporary design. From classic elegance to modern sophistication.',
            href: '/watches',
            gradient: 'from-amber-500/20 via-amber-600/10 to-transparent',
            accentColor: 'text-amber-400',
            icon: <Watch className="w-full h-full text-white" />,
        },
        {
            id: 'belts',
            title: 'Belts',
            subtitle: 'Refined Details',
            description: 'Elevate every outfit with our handcrafted leather belts. Meticulously designed buckles meet premium materials for the perfect finishing touch.',
            href: '/belts',
            gradient: 'from-rose-500/20 via-rose-600/10 to-transparent',
            accentColor: 'text-rose-400',
            icon: <BeltIcon className="w-full h-full text-white" />,
        },
        {
            id: 'wallets',
            title: 'Wallets',
            subtitle: 'Everyday Luxury',
            description: 'Compact sophistication meets functional design. Our wallets feature premium leathers and thoughtful organization for the modern gentleman.',
            href: '/wallets',
            gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
            accentColor: 'text-emerald-400',
            icon: <Wallet className="w-full h-full text-white" />,
        },
    ];

    return (
        <section ref={sectionRef} className="relative py-16 sm:py-20 md:py-28 lg:py-32 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                           w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] 
                           bg-amber-900/5 rounded-full blur-[100px] sm:blur-[150px]" />

            {/* Grid pattern overlay - hidden on mobile for performance */}
            <div className="hidden sm:block absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-amber-500/10 
                                   border border-amber-500/20 text-amber-400 
                                   text-xs sm:text-sm font-medium tracking-wide mb-4 sm:mb-6"
                    >
                        Shop by Category
                    </motion.span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Curated <GradientText>Collections</GradientText>
                    </h2>

                    <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-4 sm:px-0">
                        Three pillars of modern masculine style. Each piece carefully selected
                        to complement your unique aesthetic.
                    </p>
                </motion.div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} card={category} index={index} />
                    ))}
                </div>


            </div>
        </section>
    );
}

// ============================================
// MAIN HERO COMPONENT WITH CATEGORIES
// ============================================
export default function EnhancedHeroWithCategories() {
    const heroRef = useRef<HTMLElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

    const { displayText: title1, isComplete: title1Complete } = useTextScramble('Elevate Your', 300);
    const { displayText: title2 } = useTextScramble('Style', title1Complete ? 0 : 1500);

    // Generate particles on mount
    useEffect(() => {
        const pts: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: 6 + Math.random() * 6,
            delay: Math.random() * 4,
        }));
        setParticles(pts);
    }, []);

    return (
        <>
            {/* CSS Keyframes */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
                
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 200% center; }
                }
                @keyframes rotate-hour {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotate-minute {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotate-second {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float-particle {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    50% { opacity: 0.8; }
                    100% { opacity: 0; transform: translateY(-100px); }
                }
            `}</style>

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                className="relative w-full min-h-screen flex items-center overflow-hidden bg-black"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />

                {/* Ambient glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] rounded-full 
                               bg-amber-900/20 blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse"
                    style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 right-1/3 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] rounded-full 
                               bg-blue-900/10 blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"
                    style={{ animationDuration: '10s', animationDelay: '2s' }} />

                {/* Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute rounded-full bg-amber-400/50"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                                animation: `float-particle ${p.duration}s ease-in-out infinite`,
                                animationDelay: `${p.delay}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

                {/* Main Content */}
                <motion.div
                    style={{ y, opacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 
                               pt-20 sm:pt-24 md:pt-0
                               flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12"
                >
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 max-w-xl text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full 
                                       bg-amber-500/10 border border-amber-400/30"
                        >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                            <span className="text-xs sm:text-sm font-medium text-amber-200">Premium Collection</span>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-white">
                            <span className="block font-mono tracking-tight">{title1}</span>
                            <span className="block font-mono tracking-tight">{title2}</span>
                            <GradientText className="block mt-1 sm:mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                                Modern Luxury
                            </GradientText>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="text-base sm:text-lg text-neutral-400 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0"
                        >
                            Discover premium watches, belts & wallets crafted for those who demand
                            excellence in every detail.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
                        >
                            <MagneticButton href="/watches">
                                Shop Collection
                            </MagneticButton>

                            <a
                                href="/about"
                                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 
                                           border border-white/20 text-white font-medium rounded-full
                                           hover:bg-white/5 active:bg-white/10 transition-colors duration-300"
                            >
                                Our Story
                            </a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className="flex gap-4 sm:gap-6 mt-6 sm:mt-8 justify-center lg:justify-start"
                        >
                            {[
                                { icon: Shield, text: 'Premium Quality' },
                                { icon: Award, text: 'Secure Checkout' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-neutral-500">
                                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="text-xs sm:text-sm">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Animated Watch */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex-1 flex justify-center lg:justify-end mt-4 sm:mt-0"
                    >
                        <AnimatedWatch />
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <span className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500/50" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Categories Section */}
            <CategoriesSection />
        </>
    );
}
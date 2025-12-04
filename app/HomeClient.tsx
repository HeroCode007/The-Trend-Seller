"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Award, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

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
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { damping: 20, stiffness: 200 });
    const springY = useSpring(y, { damping: 20, stiffness: 200 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
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
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-3 px-8 py-4 
                 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600
                 text-black font-semibold text-lg rounded-full
                 shadow-[0_0_30px_rgba(212,175,55,0.3)]
                 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]
                 transition-shadow duration-300 overflow-hidden"
        >
            <span className="relative z-10">{children}</span>
            <ArrowRight className="h-5 w-5 relative z-10" />

            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
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
// CSS ANIMATED WATCH (No Three.js!)
// ============================================
function AnimatedWatch() {
    return (
        <motion.div
            className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px]"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
            {/* Glow behind watch */}
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Floating animation wrapper */}
            <motion.div
                className="relative w-full h-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Watch SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                    {/* Outer shadow */}
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
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-60"
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
                className="absolute -bottom-2 -left-6 w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-40"
                animate={{ y: [0, 8, 0], scale: [1, 0.9, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.div
                className="absolute top-1/2 -right-8 w-3 h-3 rounded-full bg-white/30"
                animate={{ x: [0, 5, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
            />
        </motion.div>
    );
}

// ============================================
// MAIN HERO COMPONENT (OPTIMIZED - NO THREE.JS)
// ============================================
export default function EnhancedHero() {
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

    // Generate particles on mount (limited count for performance)
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

            <motion.section
                ref={heroRef}
                className="relative w-full h-screen flex items-center overflow-hidden bg-black"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />

                {/* Ambient glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full 
                       bg-amber-900/20 blur-[120px] animate-pulse"
                    style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full 
                       bg-blue-900/10 blur-[100px] animate-pulse"
                    style={{ animationDuration: '10s', animationDelay: '2s' }} />

                {/* Particles (CSS-only animation) */}
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
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 
                     flex flex-col lg:flex-row items-center justify-between gap-12"
                >
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 max-w-xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                         bg-amber-500/10 border border-amber-400/30"
                        >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-200">Premium Collection</span>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                            <span className="block font-mono tracking-tight">{title1}</span>
                            <span className="block font-mono tracking-tight">{title2}</span>
                            <GradientText className="block mt-2 text-5xl md:text-6xl lg:text-7xl">
                                Modern Luxury
                            </GradientText>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="text-lg text-neutral-400 mb-8 max-w-md"
                        >
                            Discover premium watches, belts & wallets crafted for those who demand
                            excellence in every detail.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <MagneticButton href="/watches">
                                Shop Collection
                            </MagneticButton>

                            <a
                                href="/about"
                                className="inline-flex items-center gap-2 px-8 py-4 
                           border border-white/20 text-white font-medium rounded-full
                           hover:bg-white/5 transition-colors duration-300"
                            >
                                Our Story
                            </a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className="flex gap-6 mt-8"
                        >
                            {[
                                { icon: Shield, text: 'Premium Quality' },
                                { icon: Award, text: 'Secure Checkout' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-neutral-500">
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Animated Watch */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex-1 flex justify-center lg:justify-end"
                    >
                        <AnimatedWatch />
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <span className="text-xs text-neutral-600 uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="h-4 w-4 text-amber-500/50" />
                    </motion.div>
                </motion.div>
            </motion.section>
        </>
    );
}
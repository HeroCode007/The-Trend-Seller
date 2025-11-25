"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Watch, Package, Wallet, Sparkles, Shield, Award } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ⭐ Add Particle type
interface Particle {
    x: number;
    y: number;
    drift: number;
    delay: number;
    duration: number;
}

export default function Home() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    // ⭐ FIX — Type the state correctly
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const pts: Particle[] = Array.from({ length: 20 }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            drift: Math.random() * -200,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 4,
        }));

        setParticles(pts);
    }, []);


    return (
        <div className="overflow-hidden">
            {/* 🎬 CINEMATIC PARALLAX HERO */}
            <motion.section
                ref={heroRef}
                className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden bg-black"
            >
                {/* Background */}
                <motion.div
                    style={{ scale, opacity: 0.4 }}
                    className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />

                {/* ✨ Floating Particles */}
                <div className="pointer-events-none absolute inset-0">
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                            initial={{
                                x: p.x,
                                y: p.y,
                                opacity: 0,
                            }}
                            animate={{
                                y: [p.y, p.y + p.drift],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ y, opacity }}
                    className="relative z-20 px-8 md:px-12 py-12 md:py-16 rounded-2xl 
                     backdrop-blur-2xl bg-white/10 border border-white/20 
                     shadow-2xl max-w-3xl text-center text-white"
                >
                    {/* Aura */}
                    <motion.div
                        className="pointer-events-none absolute -inset-2 rounded-2xl 
                       bg-gradient-to-br from-amber-500/20 via-transparent to-sky-500/20 
                       blur-2xl"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                       bg-white-500/20 border border-amber-400/30 backdrop-blur-sm"
                    >
                        <Sparkles className="h-4 w-4 text-white-300" />
                        <span className="text-sm font-medium text-amber-100">Premium Collection</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold leading-tight mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {["Elevate", "Your", "Style"].map((word, i) => (
                            <motion.span
                                key={i}
                                className="inline-block mr-4"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.5 + i * 0.15,
                                    ease: "easeOut",
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                        <br />
                        <motion.span
                            className="bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 
                         bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            Modern Luxury
                        </motion.span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-lg md:text-xl mb-8"
                    >
                        Discover premium watches, belts & wallets crafted for timeless elegance.
                    </motion.p>

                    {/* Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/watches"
                            className="group relative px-8 py-4 rounded-xl 
       bg-gradient-to-r from-gray-600 via-gray-400 to-white 
       text-gray-900 font-semibold 
       shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50
       transition-all duration-300 
       inline-flex items-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10">Shop Collection</span>
                            <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />

                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent 
                           via-white/30 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6 }}
                            />
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                        className="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm"
                    >
                        {[{ icon: Shield, text: "Premium Quality" }, { icon: Award, text: "Secure Checkout" }].map((badge, i) => (
                            <motion.span
                                key={i}
                                className="inline-flex items-center gap-2"
                                whileHover={{ scale: 1.1, color: "#fbbf24" }}
                            >
                                <badge.icon className="h-4 w-4" />
                                {badge.text}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* FEATURED CATEGORIES */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Featured Categories
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Watches",
                                image: "/images/Premium3.png",
                                icon: Watch,
                                desc: "Precision timepieces for every occasion",
                                href: "/watches",
                                color: "from-black-500/20 to-gray-500/20"
                            },
                            {
                                title: "Belts",
                                image: "/images/Belt4.png",
                                icon: Package,
                                desc: "Handcrafted leather belts",
                                href: "/belts",
                                color: "from-gray-500/20 to-red-500/20"
                            },
                            {
                                title: "Wallets",
                                image: "/images/Wallet1.png",
                                icon: Wallet,
                                desc: "Slim designs, premium materials",
                                href: "/wallets",
                                color: "from-emerald-500/20 to-teal-500/20"
                            }
                        ].map((category, i) => (
                            <CategoryCard key={i} {...category} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-20 px-4 bg-gradient-to-b from-neutral-50 to-white">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">
                            Why Choose The Trend Seller
                        </h2>
                        <p className="text-lg text-neutral-600 mb-12 max-w-2xl mx-auto">
                            We're committed to offering only the finest accessories that combine style, quality, and lasting value.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { emoji: "✓", title: "Premium Quality", desc: "Every product is carefully selected for exceptional craftsmanship and durability." },
                            { emoji: "✓", title: "Timeless Design", desc: "Classic styles that never go out of fashion, suitable for any occasion." },
                            { emoji: "✓", title: "Great Value", desc: "Competitive pricing without compromising on quality or service." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                                }}
                                className="bg-white p-8 rounded-xl border border-neutral-200 transition-shadow"
                            >
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 
                             rounded-full flex items-center justify-center mx-auto mb-4"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <span className="text-3xl">{feature.emoji}</span>
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-3 text-neutral-900">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// 🎨 Category Card Component
// 🎨 Category Card Component

interface CategoryCardProps {
    title: string;
    image: string;
    icon: React.ElementType;
    desc: string;
    href: string;
    color: string;
    index: number;
}

function CategoryCard({ title, image, icon: Icon, desc, href, color, index }: CategoryCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className="group relative"
        >
            <Link href={href} className="block rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-[380px] overflow-hidden bg-neutral-100">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                        <Image
                            src={image}
                            alt={`${title} Collection`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <motion.div
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm 
                           flex items-center justify-center shadow-lg"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                        <Icon className="h-6 w-6 text-neutral-700" />
                    </motion.div>
                </div>

                <div className="p-6 text-center relative">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                    >
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h3>
                        <p className="text-neutral-600 text-sm mb-4">{desc}</p>

                        <motion.span
                            className="text-amber-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                            whileHover={{ x: 5 }}
                        >
                            Explore {title}
                            <ArrowRight className="h-5 w-5" />
                        </motion.span>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
}


"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HorologyMasterpieceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, margin: "-50px" });

    // Smooth continuous fluid animation progress (0 = Assembled, 1 = Exploded)
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // 3D Parallax & Gyroscopic Cursor Tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 120 };
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), springConfig);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Continuous smooth sinusoidal fluid motion loop
    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        let animationFrameId: number;
        const cycleDuration = 7000; // 7 seconds per complete fluid cycle

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            
            // Smooth sinusoidal oscillation between 0 and 1
            const normalized = (elapsed % cycleDuration) / cycleDuration;
            const eased = 0.5 - 0.5 * Math.cos(normalized * 2 * Math.PI);
            
            setProgress(eased);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isInView]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <section 
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full py-12 sm:py-16 md:py-20 bg-black text-white overflow-hidden border-y border-amber-500/20 select-none flex flex-col items-center justify-center"
            style={{ perspective: 1400 }}
        >
            {/* Ambient Lighting & Atmospheric Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Center Volumetric Golden Halo */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[600px] md:w-[750px] h-[450px] sm:h-[600px] md:h-[750px] rounded-full bg-gradient-to-tr from-amber-600/25 via-yellow-500/15 to-transparent blur-[120px] pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: 0.6 + progress * 0.4 }}
                />
                
                {/* Secondary Accent Aura Halos */}
                <div className="absolute -top-24 left-1/3 w-[350px] h-[350px] rounded-full bg-amber-400/10 blur-[100px]" />
                <div className="absolute -bottom-24 right-1/3 w-[400px] h-[400px] rounded-full bg-yellow-600/10 blur-[110px]" />
                
                {/* Minimalist Architectural Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            </div>

            {/* Header Title & Badge */}
            <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mb-6 sm:mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 mb-3 backdrop-blur-md shadow-md shadow-amber-500/5"
                >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase">
                        Haute Horlogerie // Deconstructed
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    The Architecture of{' '}
                    <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent italic">
                        Time
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.7 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-neutral-400 text-xs sm:text-sm tracking-widest uppercase font-mono"
                >
                    Fluid Multi-Layer Tourbillon Anatomy
                </motion.p>
            </div>

            {/* Scaled Proportional Viewport Stage */}
            <motion.div
                style={isMobile ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] aspect-square flex items-center justify-center my-2 sm:my-4"
            >
                {/* Dynamic Volumetric Glow Behind Watch */}
                <div 
                    className="absolute inset-2 rounded-full bg-gradient-to-b from-amber-500/30 via-yellow-500/10 to-transparent blur-3xl pointer-events-none transition-all duration-700"
                    style={{
                        transform: `scale(${0.9 + progress * 0.25})`,
                        opacity: 0.5 + progress * 0.5
                    }}
                />

                {/* Seamless Blending Container with Feathred Radial Mask & Screen Blend */}
                <div className="relative w-full h-full flex items-center justify-center [mask-image:radial-gradient(ellipse_closest-side_at_center,black_75%,transparent_100%)]">
                    
                    {/* Frame 1: Assembled 8K Tourbillon Masterpiece */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all ease-out"
                        style={{
                            opacity: Math.max(0, 1 - progress * 1.3),
                            transform: `scale(${1 - progress * 0.08}) translateY(${progress * 20}px)`,
                            filter: `brightness(${1 + (1 - progress) * 0.1})`,
                            mixBlendMode: 'screen',
                            transitionDuration: '100ms'
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/masterpiece-assembled-8k.jpg"
                                alt="Assembled 8K Haute Horlogerie Tourbillon Watch"
                                fill
                                sizes="(max-width: 768px) 90vw, 540px"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Frame 2: Exploded 8K 3D Floating Tourbillon Anatomy Layers */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all ease-out"
                        style={{
                            opacity: Math.min(1, progress * 1.3),
                            transform: `scale(${0.92 + progress * 0.08}) translateY(${(1 - progress) * -20}px)`,
                            filter: `brightness(${0.95 + progress * 0.15})`,
                            mixBlendMode: 'screen',
                            transitionDuration: '100ms'
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/masterpiece-exploded-8k.jpg"
                                alt="8K Deconstructed Exploded Tourbillon Watch Anatomy"
                                fill
                                sizes="(max-width: 768px) 90vw, 540px"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Bottom Status & Technical Register Indicator */}
            <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between text-neutral-500 font-mono text-[10px] sm:text-xs uppercase pt-4">
                <span className="hidden sm:inline-block">
                    Jacob & Co. Style Haute Horlogerie
                </span>

                <div className="mx-auto sm:mx-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-amber-300">
                        {progress < 0.2 ? 'Assembled Tourbillon' : progress > 0.8 ? 'Exploded Anatomy' : 'Fluid Mechanical Disassembly'}
                    </span>
                </div>

                <span className="hidden sm:inline-block">
                    Calibre 7001-A // 28,800 VPH
                </span>
            </div>

        </section>
    );
}

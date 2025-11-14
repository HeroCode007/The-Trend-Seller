import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Watch, Package, Wallet } from 'lucide-react';

export const metadata = {
  title: 'The Trend Seller - Premium Watches, Belts & Wallets',
  description: 'Shop our curated collection of premium watches, genuine leather belts, and luxury wallets. Quality craftsmanship meets timeless style.',
  openGraph: {
    title: 'The Trend Seller - Premium Watches, Belts & Wallets',
    description: 'Shop our curated collection of premium watches, genuine leather belts, and luxury wallets. Quality craftsmanship meets timeless style.',
  },
};

export default function Home() {
  return (
    <div>
      {/* PARALLAX HERO SECTION (Enhanced) */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Deep overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

        {/* Floating bokeh particles - Increased + softer */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          {/* Big soft particles */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/5 blur-[40px] animate-[float_12s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-white/10 blur-[50px] animate-[float_10s_ease-in-out_infinite]" />

          {/* Medium */}
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-white/25 blur-[6px] animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 right-1/4 w-5 h-5 rounded-full bg-white/30 blur-[7px] animate-[float_7s_ease-in-out_infinite]" />

          {/* Small premium particles */}
          <div className="absolute top-10 left-1/2 w-2 h-2 rounded-full bg-white/40 blur-[2px] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-1/3 w-2 h-2 rounded-full bg-white/30 blur-[2px] animate-[float_5s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 rounded-full bg-white/20 blur-[2px] animate-[float_6s_ease-in-out_infinite]" />
        </div>

        {/* Glass Card */}
        <div
          className="
      relative z-10 px-6 md:px-10 py-10 md:py-12 
      rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 
      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] 
      max-w-lg md:max-w-2xl mx-auto text-center text-white
    "
        >
          {/* Smoother glow halo */}
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-white/10 blur-xl opacity-60" />

          <h1
            className="relative text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg 
      opacity-0 animate-fade-in-up"
          >
            Timeless Style,
            <br /> Modern Craftsmanship
          </h1>

          <p
            className="relative text-base md:text-lg mt-4 md:mt-5 opacity-90 drop-shadow-md 
      opacity-0 animate-fade-in-up [animation-delay:150ms]"
          >
            Discover premium watches, belts, and wallets designed to elevate your everyday look.
          </p>

          {/* Button */}
          <div className="relative mt-6 md:mt-8 flex items-center justify-center">
            <Link
              href="/watches"
              className="group relative px-6 md:px-8 py-3 rounded-xl bg-white/15 border border-white/30 
        text-white font-semibold shadow-lg backdrop-blur-2xl 
        hover:bg-white/25 transition-colors inline-flex items-center gap-2 overflow-hidden 
        opacity-0 animate-fade-in-up [animation-delay:300ms]"
            >
              {/* Shine effect */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full 
          bg-gradient-to-r from-transparent via-white/40 to-transparent 
          group-hover:translate-x-full transition-transform duration-700"
              />
              Shop Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="mt-5 md:mt-6 flex items-center justify-center gap-4 md:gap-5 
      text-white/80 text-xs md:text-sm 
      opacity-0 animate-fade-in-up [animation-delay:450ms]"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Premium Shopping
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Secure Checkout
            </span>
          </div>
        </div>

        {/* Keyframes */}
        <style>{`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }

    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0px); }
    }
  `}</style>
      </section>



      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900">
            Featured Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* WATCHES */}
            <Link
              href="/watches"
              className="group block rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative h-[380px] bg-neutral-100">
                <Image
                  src="/images/Premium3.png"
                  alt="Premium Watches Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              <div className="p-6 text-center">
                <Watch className="h-8 w-8 mx-auto text-gray-500 mb-3" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-1">Watches</h3>
                <p className="text-neutral-600 text-sm mb-4">Precision timepieces for every occasion</p>
                <span className="text-gray-600 font-medium inline-flex items-center justify-center gap-1 hover:gap-2 transition-all">
                  Explore Watches
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* BELTS */}
            <Link
              href="/belts"
              className="group block rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative h-[380px] bg-neutral-100 flex items-center justify-center">
                <Image
                  src="/images/Belt4.png"
                  alt="Premium Belts Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto text-gray-500 mb-3" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-1">Belts</h3>
                <p className="text-neutral-600 text-sm mb-4">Handcrafted leather belts</p>
                <span className="text-gray-600 font-medium inline-flex items-center justify-center gap-1 hover:gap-2 transition-all">
                  Explore Belts
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* WALLETS */}
            <Link
              href="/wallets"
              className="group block rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative h-[380px] bg-neutral-100">
                <Image
                  src="/images/Wallet1.png"
                  alt="Premium Wallets Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 text-center">
                <Wallet className="h-8 w-8 mx-auto text-gray-500 mb-3" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-1">Wallets</h3>
                <p className="text-neutral-600 text-sm mb-4">Slim designs, premium materials</p>
                <span className="text-grayss-600 font-medium inline-flex items-center justify-center gap-1 hover:gap-2 transition-all">
                  Explore Wallets
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>


      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">
            Why Choose The Trend Seller
          </h2>
          <p className="text-lg text-neutral-600 mb-12 max-w-2xl mx-auto">
            We're committed to offering only the finest accessories that combine style, quality, and lasting value.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Premium Quality</h3>
              <p className="text-neutral-600">
                Every product is carefully selected for exceptional craftsmanship and durability.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Timeless Design</h3>
              <p className="text-neutral-600">
                Classic styles that never go out of fashion, suitable for any occasion.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Great Value</h3>
              <p className="text-neutral-600">
                Competitive pricing without compromising on quality or service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Timeless Style,<br />Modern Craftsmanship
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-200 max-w-2xl mx-auto">
            Discover premium watches, belts, and wallets designed for those who appreciate quality and elegance.
          </p>
          <Link
            href="/watches"
            className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-colors text-lg"
          >
            Shop Collection
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
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

import { Watch, Shield, Heart, Truck, Award, Users, Package, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | The Trend Seller Pakistan',
  description:
    'Discover The Trend Seller Pakistan — your destination for premium watches, genuine leather wallets, and stylish accessories that define modern Pakistani fashion.',
  openGraph: {
    title: 'About Us | The Trend Seller Pakistan',
    description:
      'Discover The Trend Seller Pakistan — your destination for premium watches, genuine leather wallets, and stylish accessories that define modern Pakistani fashion.',
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-amber-500">The Trend Seller</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Pakistan's premier destination for premium watches, genuine leather accessories,
            and stylish fashion that combines timeless craftsmanship with modern aesthetics.
          </p>
        </div>
      </section>

      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Our Story */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Watch className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Story</h2>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <p className="text-neutral-600 leading-relaxed mb-4 text-lg">
                Founded with a vision to make luxury accessible in Pakistan, The Trend Seller was built
                on a simple idea — everyone deserves to own premium-quality accessories without paying
                sky-high prices. What started as a small passion project soon grew into a trusted name
                for stylish individuals across Pakistan.
              </p>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Each product in our collection reflects careful attention to detail, from the stitching
                of a leather belt to the polish of a steel watch. We collaborate with expert
                manufacturers and trusted suppliers to bring you quality you can feel — and style that
                lasts.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Quality & Authenticity
                </h3>
                <p className="text-neutral-600">
                  Every piece is crafted with premium materials — from stainless steel and genuine
                  leather to durable watch mechanisms. We never compromise on authenticity and quality.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Modern Pakistani Style
                </h3>
                <p className="text-neutral-600">
                  Our designs reflect the vibrant, confident, and modern fashion sense of Pakistan —
                  elegant yet practical, bold yet timeless.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Customer-Centered Approach
                </h3>
                <p className="text-neutral-600">
                  We build trust through excellent service, responsive communication, and smooth
                  delivery — because our customers deserve the best at every step.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Affordable Luxury
                </h3>
                <p className="text-neutral-600">
                  Luxury doesn't have to be overpriced. We keep our pricing fair and transparent,
                  making premium fashion accessible to everyone in Pakistan.
                </p>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Commitment</h2>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <p className="text-neutral-700 leading-relaxed mb-4 text-lg">
                All over Pakistan, our goal is to bring world-class quality and style right to
                your doorstep. Every product goes through careful quality checks before it reaches you.
                Whether it's a watch that completes your business look or a wallet that speaks elegance,
                we promise durability, comfort, and design excellence.
              </p>
              <p className="text-neutral-700 leading-relaxed text-lg">
                We take pride in being a Pakistani brand with global standards — serving customers who
                value sophistication, reliability, and authenticity.
              </p>
            </div>
          </section>

          {/* Why Shop With Us */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Why Shop With Us?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Package, text: 'Premium quality products with elegant packaging' },
                { icon: Truck, text: 'Nationwide delivery across Pakistan' },
                { icon: Shield, text: 'Cash on Delivery & secure payment options' },
                { icon: Award, text: 'Hassle-free exchanges and returns' },
                { icon: Users, text: 'Friendly support via WhatsApp & Email' },
                { icon: Star, text: '100% authentic products guaranteed' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-neutral-200">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-neutral-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-neutral-900 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
              Explore our collection of premium watches, belts, and wallets crafted for the modern individual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/watches"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-neutral-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Shop Watches
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

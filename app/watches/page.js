import Link from 'next/link';
import { premiumWatches, casualWatches, stylishWatches } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Watches Collection',
  description: 'Explore our complete collection of watches. From premium luxury timepieces to casual everyday watches and stylish fashion pieces.',
  openGraph: {
    title: 'Watches Collection | The Trend Seller',
    description: 'Explore our complete collection of watches. From premium luxury timepieces to casual everyday watches and stylish fashion pieces.',
  },
};

export default function WatchesPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Watches Collection
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mb-8">
            Discover our complete collection of timepieces. From premium luxury watches to casual everyday pieces and stylish fashion accessories.
          </p>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/watches/premium"
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Premium Watches ({premiumWatches.length})
            </Link>
            <Link
              href="/watches/casual"
              className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Casual Watches ({casualWatches.length})
            </Link>
            <Link
              href="/watches/stylish"
              className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Stylish Watches ({stylishWatches.length})
            </Link>
          </div>
        </header>

        {/* Premium Watches Preview */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Premium Watches</h2>
            <Link
              href="/watches/premium"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {premiumWatches.slice(0, 4).map((watch) => (
              <ProductCard
                key={watch.id}
                product={watch}
                imageObject="contain"
                imagePaddingClass="p-6"
              />
            ))}
          </div>
        </section>

        {/* Casual Watches Preview */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Casual Watches</h2>
            <Link
              href="/watches/casual"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {casualWatches.slice(0, 4).map((watch) => (
              <ProductCard
                key={watch.id}
                product={watch}
                imageObject="contain"
                imagePaddingClass="p-6"
              />
            ))}
          </div>
        </section>

        {/* Stylish Watches Preview */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Stylish Watches</h2>
            <Link
              href="/watches/stylish"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stylishWatches.slice(0, 4).map((watch) => (
              <ProductCard
                key={watch.id}
                product={watch}
                imageObject="contain"
                imagePaddingClass="p-6"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

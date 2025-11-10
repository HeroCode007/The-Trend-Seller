import ProductCard from '@/components/ProductCard';
import { belts } from '@/lib/products';

export const metadata = {
  title: 'Premium Leather Belts',
  description: 'Browse our selection of handcrafted leather belts. From classic dress belts to casual styles, find quality craftsmanship in every piece.',
  openGraph: {
    title: 'Premium Leather Belts | The Trend Seller',
    description: 'Browse our selection of handcrafted leather belts. From classic dress belts to casual styles, find quality craftsmanship in every piece.',
  },
};

export default function BeltsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Premium Leather Belts
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Handcrafted leather belts made from premium materials. Each belt is designed to complement your style while providing lasting quality.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {belts.map((belt) => (
            <ProductCard key={belt.id} product={belt} />
          ))}
        </div>
      </div>
    </div>
  );
}

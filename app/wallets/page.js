import ProductCard from '@/components/ProductCard';
import { wallets } from '@/lib/products';

export const metadata = {
  title: 'Premium Wallets',
  description: 'Shop our collection of premium wallets. From minimalist card holders to travel organizers, find the perfect wallet with RFID protection.',
  openGraph: {
    title: 'Premium Wallets | The Trend Seller',
    description: 'Shop our collection of premium wallets. From minimalist card holders to travel organizers, find the perfect wallet with RFID protection.',
  },
};

export default function WalletsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Premium Wallets
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Discover wallets crafted from premium leather with modern features. Slim designs, RFID protection, and timeless style in every piece.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wallets.map((wallet) => (
            <ProductCard key={wallet.id} product={wallet} />
          ))}
        </div>
      </div>
    </div>
  );
}

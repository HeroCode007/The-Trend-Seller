import ProductCard from '@/components/ProductCard';
import { premiumWatches } from '@/lib/products';

export const metadata = {
    title: 'Premium Watches',
    description: 'Explore our collection of premium luxury watches. From tourbillon masterpieces to grand complications, find the perfect high-end timepiece.',
    openGraph: {
        title: 'Premium Watches | The Trend Seller',
        description: 'Explore our collection of premium luxury watches. From tourbillon masterpieces to grand complications, find the perfect high-end timepiece.',
    },
};

export default function PremiumWatchesPage() {
    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        Premium Watches
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-3xl">
                        Discover our exclusive collection of premium luxury timepieces. Each watch represents the pinnacle of horological craftsmanship, featuring intricate complications, precious materials, and timeless elegance.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {premiumWatches.map((watch) => (
                        <ProductCard
                            key={watch.id}
                            product={watch}
                            imageObject="contain"
                            imagePaddingClass="p-6"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import ProductCard from '@/components/ProductCard';
import { casualWatches } from '@/lib/products';

export const metadata = {
    title: 'Casual Watches',
    description: 'Explore our collection of casual watches perfect for everyday wear and active lifestyles. From fitness trackers to outdoor adventure watches.',
    openGraph: {
        title: 'Casual Watches | The Trend Seller',
        description: 'Explore our collection of casual watches perfect for everyday wear and active lifestyles. From fitness trackers to outdoor adventure watches.',
    },
};

export default function CasualWatchesPage() {
    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        Casual Watches
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-3xl">
                        Perfect for your active lifestyle and everyday adventures. Our casual watch collection combines functionality with comfort, featuring fitness tracking, outdoor capabilities, and modern smart features.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {casualWatches.map((watch) => (
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

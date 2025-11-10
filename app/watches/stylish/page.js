import ProductCard from '@/components/ProductCard';
import { stylishWatches } from '@/lib/products';

export const metadata = {
    title: 'Stylish Watches',
    description: 'Explore our collection of stylish watches that make a fashion statement. From minimalist designs to contemporary art pieces, find your perfect style companion.',
    openGraph: {
        title: 'Stylish Watches | The Trend Seller',
        description: 'Explore our collection of stylish watches that make a fashion statement. From minimalist designs to contemporary art pieces, find your perfect style companion.',
    },
};

export default function StylishWatchesPage() {
    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        Stylish Watches
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-3xl">
                        Make a statement with our collection of stylish timepieces. From minimalist elegance to bold fashion-forward designs, these watches are perfect for those who appreciate both form and function.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stylishWatches.map((watch) => (
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

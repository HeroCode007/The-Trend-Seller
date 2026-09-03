import Link from 'next/link';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { wallets } from '@/lib/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import ReviewSection from '@/components/ReviewSection';

// ----------------------------
// ✅ Generate Static Paths
// ----------------------------
export async function generateStaticParams() {
  return wallets.map((wallet) => ({
    slug: wallet.slug,
  }));
}

// ----------------------------
// ✅ SEO Metadata
// ----------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = wallets.find((w) => w.slug === resolvedParams.slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | The Trend Seller`,
      description: product.description,
      images: product.images || [product.image],
    },
  };
}

// ----------------------------
// ✅ Wallet Detail Page
// ----------------------------
export default async function WalletDetailPage({ params }) {
  const resolvedParams = await params;
  const product = wallets.find((w) => w.slug === resolvedParams.slug);

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/wallets"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* ✅ Product Image Gallery */}
          <ProductGallery product={product} />

          {/* ✅ Product Info */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
              <span>SKU: {product.productCode}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-3">
              {product.name}
            </h1>

            {/* Social Proof */}
            <a href="#customer-reviews" className="inline-flex items-center gap-2 mb-4 group">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors">
                4.9 <span className="text-neutral-500 font-normal underline decoration-neutral-300">Verified Customer Reviews</span>
              </span>
            </a>

            <p className="text-3xl font-bold text-neutral-900 mb-6">
              Rs. {product.price.toLocaleString()}
            </p>

            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AddToCartButton product={product} />

            <div className="mt-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">
                Shipping & Warranty
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                All our wallets feature RFID protection, genuine leather craftsmanship, and gift-ready packaging. Free shipping on orders above Rs. 6,000. 1-Year Official Manufacturer Warranty with 7-day checking guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="mt-16 pt-12 border-t border-neutral-200">
          <ReviewSection productId={product.slug} />
        </section>
      </div>
    </>
  );
}

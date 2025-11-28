import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { premiumWatches, casualWatches, stylishWatches, getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

// Combine all watches for static generation
const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches];

export async function generateStaticParams() {
  return allWatches.map((watch) => ({
    slug: watch.slug,
  }));
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | The Trend Seller`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function WatchDetailPage({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Determine which category this watch belongs to
  const getCategoryPath = (category) => {
    switch (category) {
      case 'premium-watches':
        return '/watches/premium';
      case 'casual-watches':
        return '/watches/casual';
      case 'stylish-watches':
        return '/watches/stylish';
      default:
        return '/watches';
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
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

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href={getCategoryPath(product.category)}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {product.category === 'premium-watches' ? 'Premium' : product.category === 'casual-watches' ? 'Casual' : product.category === 'stylish-watches' ? 'Stylish' : ''} Watches
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`relative aspect-square rounded-lg overflow-hidden bg-neutral-100 ${product.name === 'Royal Square Titanium' ? 'p-8' : ''}`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`${product.name === 'Royal Square Titanium' ? 'object-contain' : 'object-cover'}`}
                priority
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              <p className="text-sm text-black-500 mb-2">
                Product Code: <span className="font-semibold">{product.productCode}</span>
              </p>

              <p className="text-2xl font-bold text-neutral-900 mb-6">
                ₨{product.price}
              </p>

              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {product.description}
              </p>


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

              <div className="mt-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Product & Delivery Information
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Every timepiece in our collection comes with an official 2‑year manufacturer’s warranty and complimentary doorstep delivery across Pakistan on all orders above ₨ 5,000.
                </p>
                <p className="text-sm text-neutral-600">
                  We offer a hassle‑free 14‑day exchange window if the watch is unused, in original packaging, and tags intact. For COD orders, please confirm your phone call before dispatch.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { belts } from '@/lib/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export async function generateStaticParams() {
  return belts.map((belt) => ({
    slug: belt.slug,
  }));
}

export async function generateMetadata({ params }) {
  const product = belts.find((b) => b.slug === params.slug);

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

export default function BeltDetailPage({ params }) {
  const product = belts.find((b) => b.slug === params.slug);

  if (!product) {
    notFound();
  }

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
        <div className="max-w-7xl mx-auto">
          <Link
            href="/belts"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Belts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-neutral-900 mb-6">
                ₨{product.price}
              </p>
              <p className="text-sm text-black-500 mb-2">
                Product Code: <span className="font-semibold">{product.productCode}</span>
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
                  Product Information
                </h3>
                <p className="text-sm text-neutral-600">
                  All our belts are handcrafted from premium leather. Free shipping on orders over ₨10,000. Returns accepted within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { premiumWatches, casualWatches, stylishWatches, getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';
import WatchDetailClient from './WatchDetail';

// Combine all watches for static generation
const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches];

export async function generateStaticParams() {
  return allWatches.map((watch) => ({
    slug: watch.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Watch Not Found',
    };
  }

  return {
    title: `${product.name} | The Trend Seller`,
    description: product.description,
    openGraph: {
      title: `${product.name} | The Trend Seller`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function WatchDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.productCode,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.inStock === false
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WatchDetailClient product={product} />
    </>
  );
}
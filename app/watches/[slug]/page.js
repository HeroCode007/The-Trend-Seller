import { premiumWatches, casualWatches, stylishWatches, womensWatches, getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';
import WatchDetailClient from './WatchDetail';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// Combine all watches for static generation
const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches, ...womensWatches];

// Fetch product from database or fallback to static
async function getProduct(slug) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (product) {
      return {
        id: product._id.toString(),
        slug: product.slug,
        name: product.name,
        productCode: product.productCode,
        price: product.price,
        image: product.image,
        images: product.images || [],
        description: product.description || '',
        features: product.features || [],
        category: product.category,
        inStock: product.inStock,
      };
    }
  } catch (error) {
    console.error('Failed to fetch product from database:', error);
  }

  // Fallback to static product
  return getProductBySlug(slug);
}

export async function generateStaticParams() {
  return allWatches.map((watch) => ({
    slug: watch.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

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
  const product = await getProduct(slug);

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
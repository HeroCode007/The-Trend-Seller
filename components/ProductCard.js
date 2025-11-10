import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, imageObject = 'cover', imagePaddingClass = '' }) {
  // Generate the correct URL based on product category
  const getProductUrl = (product) => {
    if (
      product.category === 'premium-watches' ||
      product.category === 'casual-watches' ||
      product.category === 'stylish-watches'
    ) {
      return `/watches/${product.slug}`;
    }
    return `/${product.category}/${product.slug}`;
  };

  return (
    <Link
      href={getProductUrl(product)}
      className="group block bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow"
    >
      {/* Image container */}
      <div className={`aspect-square relative overflow-hidden bg-neutral-100 ${imagePaddingClass}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Optional feature badges */}
        {product.features && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-neutral-900">
            ₨{product.price.toLocaleString('en-PK')}
          </span>
          <span className="text-sm text-amber-600 font-medium group-hover:text-amber-700">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

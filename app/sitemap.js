import { allProducts } from '@/lib/products';

const BASE_URL = 'https://thetrendseller.com';

export default function sitemap() {
  // 1️⃣ Get unique categories from all products
  const categories = Array.from(new Set(allProducts.map(p => p.category)));

  // 2️⃣ Map product URLs
  const productUrls = allProducts.map(product => ({
    url: `${BASE_URL}/${product.category}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3️⃣ Map category URLs dynamically
  const categoryUrls = categories.map(category => ({
    url: `${BASE_URL}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 4️⃣ Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 5️⃣ Combine all URLs
  return [...staticPages, ...categoryUrls, ...productUrls];
}

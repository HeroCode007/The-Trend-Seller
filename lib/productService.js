/**
 * Product Service - Unified product fetching
 * Fetches products from database (admin-added) and falls back to static products
 */

import {
  premiumWatches,
  casualWatches,
  stylishWatches,
  belts,
  wallets,
  allProducts as staticProducts,
} from './products';

/**
 * Fetch all products (database + static)
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of products
 */
export async function getAllProducts(category = null) {
  try {
    // Try to fetch from database
    const url = category
      ? `/api/products?category=${category}`
      : '/api/products';

    const response = await fetch(url, {
      cache: 'no-store', // Always get fresh data
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.products.length > 0) {
        return data.products;
      }
    }
  } catch (error) {
    console.warn('Database fetch failed, using static products:', error.message);
  }

  // Fallback to static products
  if (category) {
    return getStaticProductsByCategory(category);
  }
  return staticProducts;
}

/**
 * Fetch single product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object|null>} Product or null
 */
export async function getProductBySlug(slug) {
  try {
    // Try database first
    const response = await fetch(`/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.product) {
        return data.product;
      }
    }
  } catch (error) {
    console.warn('Database fetch failed, using static product:', error.message);
  }

  // Fallback to static
  return staticProducts.find(p => p.slug === slug) || null;
}

/**
 * Get static products by category (fallback)
 */
function getStaticProductsByCategory(category) {
  switch (category) {
    case 'premium-watches':
      return premiumWatches;
    case 'casual-watches':
      return casualWatches;
    case 'stylish-watches':
      return stylishWatches;
    case 'belts':
      return belts;
    case 'wallets':
      return wallets;
    default:
      return staticProducts;
  }
}

/**
 * Server-side product fetching (for use in Server Components)
 */
export async function getProductsServer(category = null) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = category
      ? `${baseUrl}/api/products?category=${category}`
      : `${baseUrl}/api/products`;

    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.products;
      }
    }
  } catch (error) {
    console.warn('Server fetch failed, using static products:', error.message);
  }

  // Fallback
  return category ? getStaticProductsByCategory(category) : staticProducts;
}

export async function getProductBySlugServer(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.product;
      }
    }
  } catch (error) {
    console.warn('Server fetch failed, using static product:', error.message);
  }

  return staticProducts.find(p => p.slug === slug) || null;
}

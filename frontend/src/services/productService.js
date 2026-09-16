// ==============================================================================
// Product Service Layer
// Abstracts catalog queries, search filtering, and price comparison operations.
// Readily swappable with FastAPI backend endpoints (/api/products/...)
// ==============================================================================

import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '../data/mockProducts';

export const productService = {
  /**
   * Search and filter product catalog
   */
  async getProducts({
    query = '',
    category = 'all',
    brand = '',
    minPrice = 0,
    maxPrice = 10000,
    sortBy = 'lowest_price',
    inStockOnly = false
  } = {}) {
    // Simulate slight network latency
    await new Promise((resolve) => setTimeout(resolve, 80));

    let results = [...MOCK_PRODUCTS];

    // Query filter (searches title, brand, description, and specs)
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.upc.includes(q) ||
        p.modelNumber.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      results = results.filter((p) => p.category === category);
    }

    // Brand filter
    if (brand) {
      results = results.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Price range filter
    results = results.filter(
      (p) => p.lowestPrice >= minPrice && p.lowestPrice <= maxPrice
    );

    // In-stock only filter
    if (inStockOnly) {
      results = results.filter((p) =>
        p.offers.some((o) => o.availability.toLowerCase().includes('in stock'))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'lowest_price':
        results.sort((a, b) => a.lowestPrice - b.lowestPrice);
        break;
      case 'highest_price':
        results.sort((a, b) => b.lowestPrice - a.lowestPrice);
        break;
      case 'top_rated':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'biggest_drop':
        results.sort((a, b) => (b.priceDropPct || 0) - (a.priceDropPct || 0));
        break;
      case 'most_retailers':
        results.sort((a, b) => b.offers.length - a.offers.length);
        break;
      default:
        break;
    }

    return results;
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  },

  /**
   * Get top price drops
   */
  async getTopPriceDrops() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return [...MOCK_PRODUCTS].sort((a, b) => (b.priceDropPct || 0) - (a.priceDropPct || 0)).slice(0, 4);
  },

  /**
   * Get recommended / similar products
   */
  async getRecommendations(currentProductId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const current = MOCK_PRODUCTS.find((p) => p.id === currentProductId);
    if (!current) return MOCK_PRODUCTS.slice(0, 3);

    // Return products in same category, or highest rated
    return MOCK_PRODUCTS
      .filter((p) => p.id !== currentProductId)
      .sort((a, b) => (a.category === current.category ? -1 : 1))
      .slice(0, 3);
  },

  /**
   * Get all categories and brands
   */
  getCategories() {
    return MOCK_CATEGORIES;
  },

  getBrands() {
    return MOCK_BRANDS;
  }
};

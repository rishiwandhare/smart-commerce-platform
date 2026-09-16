import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { FilterSidebar } from '../../components/products/FilterSidebar';
import { SortDropdown } from '../../components/products/SortDropdown';
import { ProductGrid } from '../../components/products/ProductGrid';
import { IconSearch, IconSliders } from '../../components/common/Icons';

export function SearchResultsPage({ onNavigate, queryParams = {} }) {
  const [query, setQuery] = useState(queryParams.q || '');
  const [category, setCategory] = useState(queryParams.category || 'all');
  const [brand, setBrand] = useState(queryParams.brand || '');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [sortBy, setSortBy] = useState(queryParams.sortBy || 'lowest_price');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [seller, setSeller] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if queryParams prop changes
  useEffect(() => {
    if (queryParams.q !== undefined) setQuery(queryParams.q);
    if (queryParams.category !== undefined) setCategory(queryParams.category);
    if (queryParams.sortBy !== undefined) setSortBy(queryParams.sortBy);
  }, [queryParams.q, queryParams.category, queryParams.sortBy]);

  // Load filtered products
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const results = await productService.getProducts({
          query,
          category,
          brand,
          minPrice,
          maxPrice,
          sortBy,
          inStockOnly,
          minRating,
          pickupOnly,
          discountOnly,
          seller
        });
        setProducts(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, category, brand, minPrice, maxPrice, sortBy, inStockOnly, minRating, pickupOnly, discountOnly, seller]);

  const handleResetFilters = () => {
    setQuery('');
    setCategory('all');
    setBrand('');
    setMinPrice(0);
    setMaxPrice(4000);
    setSortBy('lowest_price');
    setInStockOnly(false);
    setMinRating(0);
    setPickupOnly(false);
    setDiscountOnly(false);
    setSeller('');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Search Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {query ? `Search Results for "${query}"` : 'Compare All Products & Prices'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
            Showing <strong>{products.length}</strong> products with live retailer offers
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="search-results-layout">
        {/* Filter Sidebar */}
        <FilterSidebar
          category={category}
          onCategoryChange={setCategory}
          brand={brand}
          onBrandChange={setBrand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          minRating={minRating}
          onRatingChange={setMinRating}
          pickupOnly={pickupOnly}
          onPickupChange={setPickupOnly}
          discountOnly={discountOnly}
          onDiscountChange={setDiscountOnly}
          seller={seller}
          onSellerChange={setSeller}
          onReset={handleResetFilters}
        />

        {/* Product Results */}
        <div>
          <ProductGrid
            products={products}
            loading={loading}
            onNavigate={onNavigate}
            onClearFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}

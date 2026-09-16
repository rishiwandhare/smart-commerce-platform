// ==============================================================================
// Product Comparison Context
// Manages pinned items for side-by-side spec and price comparison
// ==============================================================================

import React, { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCompare = (product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        // Max 4 items allowed
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    setIsDrawerOpen(true);
  };

  const isCompared = (productId) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  const removeFromCompare = (productId) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setComparedProducts([]);
    setIsDrawerOpen(false);
    setIsModalOpen(false);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        isDrawerOpen,
        setIsDrawerOpen,
        isModalOpen,
        setIsModalOpen,
        toggleCompare,
        isCompared,
        removeFromCompare,
        clearCompare,
        count: comparedProducts.length
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}

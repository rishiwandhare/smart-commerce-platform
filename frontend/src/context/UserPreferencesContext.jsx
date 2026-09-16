// ==============================================================================
// User Preferences Context
// Handles Wishlist, Price Drop Alerts, Local Pickup Orders, and Toast alerts
// ==============================================================================

import React, { createContext, useContext, useState } from 'react';
import { MOCK_PERSONAS } from '../data/mockUsers';

const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  // Initialize with Customer persona's data
  const [wishlistIds, setWishlistIds] = useState(MOCK_PERSONAS.customer.wishlist);
  const [alerts, setAlerts] = useState(MOCK_PERSONAS.customer.alerts);
  const [orders, setOrders] = useState(MOCK_PERSONAS.customer.orders);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleWishlist = (productId, productTitle = 'Product') => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast(`Removed "${productTitle}" from Wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${productTitle}" to Wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const addPriceAlert = ({ productId, productTitle, targetPrice, currentPrice }) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      productId,
      productTitle,
      targetPrice: parseFloat(targetPrice),
      currentPrice: parseFloat(currentPrice),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Price alert set for $${targetPrice}! We'll notify you.`, 'success');
  };

  const removePriceAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Price alert removed', 'info');
  };

  const createPickupOrder = ({ productId, productTitle, retailerName, storeName, pickupAddress, price }) => {
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      productId,
      productTitle,
      retailerName,
      storeName,
      pickupAddress,
      pickupCode: `PU-${Math.floor(1000 + Math.random() * 9000)}`,
      pricePaid: parseFloat(price),
      status: 'Ready for Pickup (Payment at counter)',
      date: new Date().toISOString().split('T')[0]
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order reserved! Pickup code: ${newOrder.pickupCode}`, 'success');
    return newOrder;
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
        alerts,
        addPriceAlert,
        removePriceAlert,
        alertCount: alerts.length,
        orders,
        createPickupOrder,
        toastMessage,
        showToast
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

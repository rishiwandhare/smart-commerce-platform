// ==============================================================================
// Store Service Layer
// Handles nearby store geolocation, stock queries, and local pickup reservations
// ==============================================================================

import { MOCK_STORES } from '../data/mockStores';

export const storeService = {
  /**
   * Find nearby stores with optional product availability filter
   */
  async getNearbyStores({ productId = null, maxDistanceMiles = 25 } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    let stores = [...MOCK_STORES].filter((s) => s.distanceMiles <= maxDistanceMiles);

    if (productId) {
      stores = stores.map((store) => {
        const itemInfo = store.inventory[productId];
        return {
          ...store,
          hasItem: Boolean(itemInfo && itemInfo.stock > 0),
          stockCount: itemInfo ? itemInfo.stock : 0,
          localPrice: itemInfo ? itemInfo.price : null,
          aisleLocation: itemInfo ? itemInfo.aisle : null
        };
      });
    }

    return stores.sort((a, b) => a.distanceMiles - b.distanceMiles);
  },

  /**
   * Fetch specific store details
   */
  async getStoreById(storeId) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const store = MOCK_STORES.find((s) => s.id === storeId);
    if (!store) throw new Error(`Store ${storeId} not found`);
    return store;
  }
};

// ==============================================================================
// Admin Service Layer
// Platform oversight, retailer feeds health, catalog deduplication queue
// ==============================================================================

export const adminService = {
  async getPlatformStats() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      totalIntegratedRetailers: 6,
      totalActiveProducts: 1420,
      totalDailyPriceUpdates: 18450,
      totalUsers: 95400,
      feedHealthScore: '99.4%',
      pendingStoreVerifications: 2,
      priceAnomaliesDetected: 3
    };
  },

  async getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { id: 'usr-1', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Customer', status: 'Active', joined: '2025-01-12' },
      { id: 'usr-2', name: 'Elena Rostova', email: 'elena@metrotechexpress.com', role: 'Shopkeeper', status: 'Verified Store', joined: '2025-02-04' },
      { id: 'usr-3', name: 'Marcus Sterling', email: 'marcus@apextech.com', role: 'Shopkeeper', status: 'Pending Verification', joined: '2026-03-10' },
      { id: 'usr-4', name: 'Devon Vance', email: 'devon.v@example.com', role: 'Customer', status: 'Active', joined: '2026-02-28' },
      { id: 'usr-5', name: 'Sarah Chen', email: 'admin@pricecomparator.io', role: 'Administrator', status: 'Active', joined: '2024-11-01' }
    ];
  },

  async getStores() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { id: 'ret-1', name: 'Amazon US', type: 'Online Feed API', status: 'Connected', syncInterval: '15 mins', lastSync: '2 mins ago', itemsIndexed: 1420 },
      { id: 'ret-2', name: 'Best Buy Official', type: 'Partner REST API', status: 'Connected', syncInterval: '30 mins', lastSync: '14 mins ago', itemsIndexed: 1105 },
      { id: 'ret-3', name: 'Walmart Storefeed', type: 'Licensed Feed', status: 'Connected', syncInterval: '1 hour', lastSync: '42 mins ago', itemsIndexed: 980 },
      { id: 'ret-4', name: 'Target US', type: 'API Feed', status: 'Connected', syncInterval: '30 mins', lastSync: '18 mins ago', itemsIndexed: 740 },
      { id: 'ret-5', name: 'B&H Photo Video', type: 'Affiliate Catalog API', status: 'Connected', syncInterval: '1 hour', lastSync: '55 mins ago', itemsIndexed: 450 },
      { id: 'ret-6', name: 'MetroTech Express', type: 'Local Merchant Portal', status: 'Verified Partner', syncInterval: 'Realtime', lastSync: 'Just now', itemsIndexed: 148 }
    ];
  },

  async getProductMatchingQueue() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      {
        id: 'match-1',
        candidateTitle: 'Apple iPhone 15 Pro Max 256GB Blk Titanium (Ref: MU773LL/A)',
        retailerName: 'MetroTech Express',
        suggestedMatch: 'Apple iPhone 15 Pro Max - 256GB Titanium Blue',
        confidenceScore: 0.96,
        status: 'Auto-Matched (Needs Audit)'
      },
      {
        id: 'match-2',
        candidateTitle: 'Sony XM-5 Noise Cancel Over Ear Hdpns Slv',
        retailerName: 'Target US',
        suggestedMatch: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones - Silver',
        confidenceScore: 0.98,
        status: 'Auto-Matched (Approved)'
      }
    ];
  }
};

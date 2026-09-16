// ==============================================================================
// Mock Users, Personas, and Seeded Accounts
// ==============================================================================

export const MOCK_PERSONAS = {
  customer: {
    id: 'usr-customer-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA 94105',
    memberSince: 'January 2025',
    savedSavings: 428.50,
    wishlist: ['prod-1', 'prod-3'],
    alerts: [
      {
        id: 'alt-1',
        productId: 'prod-1',
        productTitle: 'Apple iPhone 15 Pro Max',
        targetPrice: 1100.00,
        currentPrice: 1129.00,
        createdAt: '2026-02-15'
      },
      {
        id: 'alt-2',
        productId: 'prod-2',
        productTitle: 'Apple MacBook Pro 16-inch M3 Max',
        targetPrice: 3100.00,
        currentPrice: 3199.00,
        createdAt: '2026-03-01'
      }
    ],
    orders: [
      {
        id: 'ord-9021',
        productId: 'prod-6',
        productTitle: 'Sony PlayStation 5 Console (Slim Disc Edition)',
        retailerName: 'MetroTech Express',
        storeName: 'MetroTech Express - Downtown Hub',
        pickupAddress: '452 Market St, Suite 100, San Francisco',
        pickupCode: 'PU-7829',
        pricePaid: 459.00,
        status: 'Ready for Pickup',
        date: '2026-03-15'
      }
    ]
  },
  shopkeeper: {
    id: 'usr-shop-1',
    name: 'Elena Rostova',
    storeName: 'MetroTech Express',
    email: 'elena@metrotechexpress.com',
    role: 'shopkeeper',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    storeId: 'store-1',
    retailerId: 'metrotech',
    address: '452 Market St, Suite 100, San Francisco, CA 94105',
    verified: true,
    totalSalesThisMonth: 38450.00,
    activeListingsCount: 148,
    pendingPickupsCount: 3,
    competitiveScore: '94% Match with Online Giants'
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Sarah Chen',
    email: 'admin@pricecomparator.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    department: 'Platform Operations & Compliance',
    systemMetrics: {
      totalIntegratedRetailers: 6,
      totalActiveProducts: 1420,
      totalDailyPriceUpdates: 18450,
      totalUsers: 95400,
      systemHealth: '100% Operational'
    }
  }
};

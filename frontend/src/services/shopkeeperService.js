// ==============================================================================
// Shopkeeper Service Layer
// Inventory management, competitor pricing benchmark, and AI demand forecast
// ==============================================================================

import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_STORES } from '../data/mockStores';

// In-memory store state for live edits during the session
let shopInventoryState = [
  {
    productId: 'prod-1',
    productTitle: 'Apple iPhone 15 Pro Max - 256GB Titanium Blue',
    sku: 'MT-IP15PM-256',
    category: 'smartphones',
    currentPrice: 1139.00,
    onlineMinPrice: 1129.00, // Amazon
    onlineAvgPrice: 1146.00,
    competitiveness: 'Highly Competitive ($10 from lowest)',
    stock: 5,
    minThreshold: 3,
    status: 'In Stock',
    demandTrend: '+18% High Demand',
    forecastNextMonth: 22
  },
  {
    productId: 'prod-3',
    productTitle: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    sku: 'MT-SONY-XM5',
    category: 'audio',
    currentPrice: 335.00,
    onlineMinPrice: 328.00, // Amazon
    onlineAvgPrice: 337.66,
    competitiveness: 'Below Market Average (Great Deal)',
    stock: 8,
    minThreshold: 4,
    status: 'In Stock',
    demandTrend: '+8% Steady',
    forecastNextMonth: 15
  },
  {
    productId: 'prod-6',
    productTitle: 'Sony PlayStation 5 Console (Slim Disc Edition)',
    sku: 'MT-PS5-SLIM-1TB',
    category: 'gaming',
    currentPrice: 459.00,
    onlineMinPrice: 449.00, // Amazon
    onlineAvgPrice: 452.66,
    competitiveness: 'Competitive with Local Delivery',
    stock: 4,
    minThreshold: 5,
    status: 'Low Stock Alert',
    demandTrend: '+32% Surge Expected',
    forecastNextMonth: 30
  }
];

export const shopkeeperService = {
  /**
   * Get store inventory items
   */
  async getInventory() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...shopInventoryState];
  },

  /**
   * Update item price
   */
  async updatePrice(productId, newPrice) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const index = shopInventoryState.findIndex((item) => item.productId === productId);
    if (index !== -1) {
      shopInventoryState[index].currentPrice = parseFloat(newPrice);
    }
    return shopInventoryState[index];
  },

  /**
   * Update item stock level
   */
  async updateStock(productId, newStock) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const index = shopInventoryState.findIndex((item) => item.productId === productId);
    if (index !== -1) {
      const stock = parseInt(newStock, 10);
      shopInventoryState[index].stock = stock;
      shopInventoryState[index].status = stock === 0 ? 'Out of Stock' : (stock < shopInventoryState[index].minThreshold ? 'Low Stock' : 'In Stock');
    }
    return shopInventoryState[index];
  },

  /**
   * Add new product to shop's active inventory
   */
  async addProductToInventory(productData) {
    await new Promise((resolve) => setTimeout(resolve, 70));
    const newItem = {
      productId: productData.productId || `prod-custom-${Date.now()}`,
      productTitle: productData.productTitle,
      sku: productData.sku || `SKU-${Date.now()}`,
      category: productData.category || 'general',
      currentPrice: parseFloat(productData.price),
      onlineMinPrice: parseFloat(productData.price) * 0.95,
      onlineAvgPrice: parseFloat(productData.price),
      competitiveness: 'Market Parity',
      stock: parseInt(productData.stock, 10) || 1,
      minThreshold: 2,
      status: 'In Stock',
      demandTrend: 'New Listing',
      forecastNextMonth: 10
    };
    shopInventoryState.unshift(newItem);
    return newItem;
  },

  /**
   * Get sales analytics and performance
   */
  async getAnalytics() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      monthlyRevenue: 38450.00,
      monthlyOrders: 84,
      avgOrderValue: 457.73,
      pickupFulfillmentRate: '98.5%',
      weeklySalesTrend: [
        { day: 'Mon', revenue: 4200 },
        { day: 'Tue', revenue: 5600 },
        { day: 'Wed', revenue: 6100 },
        { day: 'Thu', revenue: 4900 },
        { day: 'Fri', revenue: 7800 },
        { day: 'Sat', revenue: 9850 },
        { day: 'Sun', revenue: 6400 }
      ]
    };
  }
};

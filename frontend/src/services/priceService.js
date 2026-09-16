import { productService } from './productService';

export const priceService = {
  async getProductOffers(productId) {
    const product = await productService.getProductById(productId);
    return product.offers || [];
  },

  async getPriceHistory(productId, range = 'all') {
    const product = await productService.getProductById(productId);
    const history = product.priceHistory || [];
    if (range === '30d') return history.slice(-2);
    if (range === '90d') return history.slice(-4);
    return history;
  }
};

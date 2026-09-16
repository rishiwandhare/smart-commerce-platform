import { MOCK_PERSONAS } from '../data/mockUsers';

let orders = [...MOCK_PERSONAS.customer.orders];

export const orderService = {
  async getOrders() {
    return [...orders];
  },

  async createPickupOrder(order) {
    const created = {
      ...order,
      id: `ord-${Date.now()}`,
      status: 'Ready for Pickup'
    };
    orders = [created, ...orders];
    return created;
  }
};

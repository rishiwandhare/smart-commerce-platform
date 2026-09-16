import { MOCK_PERSONAS } from '../data/mockUsers';

export const authService = {
  async login({ role = 'customer' } = {}) {
    return MOCK_PERSONAS[role] || MOCK_PERSONAS.customer;
  },

  async getCurrentUser(role = 'customer') {
    return MOCK_PERSONAS[role] || MOCK_PERSONAS.customer;
  }
};

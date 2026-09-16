import { MOCK_PERSONAS } from '../data/mockUsers';

let alerts = [...MOCK_PERSONAS.customer.alerts];

export const alertService = {
  async getAlerts() {
    return [...alerts];
  },

  async createPriceAlert(alert) {
    const created = { ...alert, id: `alt-${Date.now()}` };
    alerts = [created, ...alerts];
    return created;
  },

  async deletePriceAlert(alertId) {
    alerts = alerts.filter((alert) => alert.id !== alertId);
  }
};

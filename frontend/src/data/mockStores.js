// ==============================================================================
// Mock Physical Stores & Local Inventory
// ==============================================================================

export const MOCK_STORES = [
  {
    id: 'store-1',
    name: 'MetroTech Express - Downtown Hub',
    retailerId: 'metrotech',
    address: '452 Market St, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    distanceMiles: 1.2,
    rating: 4.9,
    reviewsCount: 420,
    phone: '(415) 555-0199',
    hours: 'Open Today: 9:00 AM – 8:00 PM',
    curbsidePickup: true,
    pickupEstimate: 'Ready in 30 minutes',
    coordinates: { lat: 37.7891, lng: -122.4014 },
    inventory: {
      'prod-1': { stock: 5, price: 1139.00, aisle: 'Aisle 3, Shelf B' },
      'prod-3': { stock: 8, price: 335.00, aisle: 'Audio Bay 1' },
      'prod-6': { stock: 4, price: 459.00, aisle: 'Gaming Counter' }
    }
  },
  {
    id: 'store-2',
    name: 'Best Buy - SF South / Potrero',
    retailerId: 'bestbuy',
    address: '1717 Harrison St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    distanceMiles: 2.4,
    rating: 4.6,
    reviewsCount: 1850,
    phone: '(415) 555-0142',
    hours: 'Open Today: 10:00 AM – 9:00 PM',
    curbsidePickup: true,
    pickupEstimate: 'Ready in 1 hour',
    coordinates: { lat: 37.7699, lng: -122.4133 },
    inventory: {
      'prod-1': { stock: 18, price: 1149.99, aisle: 'Mobile Phone Desk' },
      'prod-2': { stock: 8, price: 3299.99, aisle: 'Apple Store-within-a-Store' },
      'prod-4': { stock: 15, price: 1249.99, aisle: 'Samsung Display' },
      'prod-5': { stock: 10, price: 1549.99, aisle: 'Home Theater' }
    }
  },
  {
    id: 'store-3',
    name: 'Target - Metreon City Center',
    retailerId: 'target',
    address: '789 Mission St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    distanceMiles: 3.5,
    rating: 4.5,
    reviewsCount: 920,
    phone: '(415) 555-0188',
    hours: 'Open Today: 8:00 AM – 10:00 PM',
    curbsidePickup: true,
    pickupEstimate: 'Ready in 2 hours',
    coordinates: { lat: 37.7844, lng: -122.4042 },
    inventory: {
      'prod-3': { stock: 12, price: 349.99, aisle: 'Electronics A14' },
      'prod-6': { stock: 16, price: 449.99, aisle: 'Gaming Section' }
    }
  },
  {
    id: 'store-4',
    name: 'Walmart Supercenter - Bay Area West',
    retailerId: 'walmart',
    address: '3055 Osgood Rd',
    city: 'Fremont',
    state: 'CA',
    zip: '94539',
    distanceMiles: 4.1,
    rating: 4.3,
    reviewsCount: 3100,
    phone: '(510) 555-0123',
    hours: 'Open Today: 6:00 AM – 11:00 PM',
    curbsidePickup: true,
    pickupEstimate: 'Ready Tomorrow Morning',
    coordinates: { lat: 37.5255, lng: -121.9482 },
    inventory: {
      'prod-1': { stock: 9, price: 1159.00, aisle: 'Dept 72 Wireless' },
      'prod-5': { stock: 7, price: 1496.99, aisle: 'Dept 7 TV Wall' }
    }
  }
];

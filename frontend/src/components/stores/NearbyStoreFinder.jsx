import React, { useState, useEffect } from 'react';
import { storeService } from '../../services/storeService';
import { StoreMapVisualizer } from './StoreMapVisualizer';
import { IconMapPin, IconStore, IconCheck, IconX } from '../common/Icons';

export function NearbyStoreFinder({ product, onReservePickup }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    async function loadStores() {
      setLoading(true);
      try {
        const data = await storeService.getNearbyStores({ productId: product?.id });
        setStores(data);
        if (data.length > 0) setSelectedStoreId(data[0].id);
      } catch (err) {
        console.error("Error loading stores:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, [product?.id]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        Finding nearby retail stores...
      </div>
    );
  }

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <StoreMapVisualizer
        stores={stores}
        selectedStoreId={selectedStoreId}
        onSelectStore={setSelectedStoreId}
        onReservePickup={onReservePickup}
        productTitle={product?.title}
      />
    </section>
  );
}

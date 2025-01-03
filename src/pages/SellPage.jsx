import React from 'react';
import { CreateTrade } from '../components/CreateTrade';
import { EnergyStorageWidget } from '../components/widgets/EnergyStorageWidget';

export const SellPage = () => {
  return (
    <div className="sales-grid">
      <CreateTrade />
      <EnergyStorageWidget />
    </div>
  );
};

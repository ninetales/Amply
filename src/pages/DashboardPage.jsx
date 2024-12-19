import React from 'react';
import { BalanceWidget } from '../components/dashboard/BalanceWidget';
import { GridManager } from '../components/GridManager';
import { GridManagerStatusWidget } from '../components/widgets/GridManagerStatusWidget';

const DashboardPage = () => {
  return (
    <div>
      <BalanceWidget />
      <GridManagerStatusWidget />
      <GridManager />
    </div>
  );
};

export default DashboardPage;

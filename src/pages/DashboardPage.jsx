import React from 'react';
import { BalanceWidget } from '../components/dashboard/BalanceWidget';
import { GridManager } from '../components/GridManager';
import { GridManagerStatusWidget } from '../components/widgets/GridManagerStatusWidget';
import { SetContract } from '../components/SetContract';

const DashboardPage = () => {
  return (
    <>
      <div className="dashboard-grid">
        <BalanceWidget />
        <GridManagerStatusWidget />
      </div>
      <GridManager />
    </>
  );
};

export default DashboardPage;

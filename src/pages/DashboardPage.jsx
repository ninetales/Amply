import React, { useContext } from 'react';
import { BalanceWidget } from '../components/dashboard/BalanceWidget';
import { GridManager } from '../components/GridManager';
import { GridManagerStatusWidget } from '../components/widgets/GridManagerStatusWidget';
import { SetContract } from '../components/SetContract';
import UserContext from '../context/UserContext';
import { EnergyStatusWidget } from '../components/widgets/EnergyStatusWidget';

const DashboardPage = () => {
  const { gridData } = useContext(UserContext);

  return (
    <>
      <div className="dashboard-grid">
        <BalanceWidget />
        <GridManagerStatusWidget />
        <EnergyStatusWidget />
      </div>
      {!gridData && <GridManager />}
    </>
  );
};

export default DashboardPage;

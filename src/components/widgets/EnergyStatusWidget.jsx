import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { BatteryWarning, BatteryCharging } from 'iconoir-react';
import { PuffLoader } from 'react-spinners';

export const EnergyStatusWidget = () => {
  const { energyData } = useContext(UserContext);

  return (
    <div className="widget widget-energy-status component-shadow">
      <div className="widget__header">
        {energyData === 0 ? <BatteryWarning /> : <BatteryCharging />}
        <span>Excess energy</span>
      </div>
      <div className="widget__content widget-grid-status__content">
        {energyData === 0 ? <PuffLoader /> : <h2>{energyData} kWh</h2>}
      </div>
    </div>
  );
};

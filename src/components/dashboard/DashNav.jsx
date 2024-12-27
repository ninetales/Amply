import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { StatsUpSquare, EvStation, EvPlugCharging } from 'iconoir-react';
import UserContext from '../../context/UserContext';

export const DashNav = () => {
  const { gridData } = useContext(UserContext);

  return (
    <ul className="dashboard-nav component-shadow">
      <li>
        <NavLink to="/dashboard" end>
          <StatsUpSquare />
          <span>Dashboard</span>
        </NavLink>
      </li>

      {gridData && (
        <>
          <li>
            <NavLink to="/dashboard/buying">
              <EvPlugCharging />
              <span>Buy electricity</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/selling">
              <EvStation />
              <span>Sell electricity</span>
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
};

import React, { useContext } from 'react';
import { WalletStatus } from './wallet/WalletStatus';
import { NavLink } from 'react-router-dom';
import { DashboardDots, ShopFourTiles } from 'iconoir-react';
import UserContext from '../context/UserContext';

export const Header = () => {
  const { isConnected } = useContext(UserContext);

  return (
    <div className="container">
      <header>
        <span className="logo">Amply</span>
        <nav>
          <ul>
            <li>
              <NavLink to="/">
                <ShopFourTiles />
                <span>Home</span>
              </NavLink>
            </li>
            {isConnected && (
              <li>
                <NavLink to="/dashboard">
                  <DashboardDots />
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}

            <li>
              <WalletStatus />
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

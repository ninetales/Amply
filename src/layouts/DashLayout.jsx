import React from 'react';
import { DashNav } from '../components/dashboard/DashNav';
import { Outlet, useMatches } from 'react-router-dom';

export const DashLayout = () => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const currentRouteHandle = currentRoute?.handle;

  return (
    <div className="dash-layout">
      <aside>
        <DashNav />
      </aside>
      <main className="dash-content">
        <h2>{currentRouteHandle?.title}</h2>
        <Outlet />
      </main>
    </div>
  );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Toolbar } from '../components/Toolbar';

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Toolbar />
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

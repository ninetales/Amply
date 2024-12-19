import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Toolbar = () => {
  return (
    <div className="toolbar">
      <div className="container">
        <div className="toolbar-content">
          <span></span>
          <nav className="toolbar-nav">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </div>
  );
};

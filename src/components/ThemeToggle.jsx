import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import { SunLight, HalfMoon } from 'iconoir-react';

export const ThemeToggle = () => {
  const { switchTheme, theme } = useContext(ThemeContext);
  return (
    <button onClick={switchTheme} className="component-shadow">
      {theme === 'dark' ? <SunLight /> : <HalfMoon />}
    </button>
  );
};

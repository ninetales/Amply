import React, { createContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.querySelector('body').setAttribute('data-theme', 'dark');
      setTheme('dark');
    }
  }, []);

  const switchTheme = () => {
    if (localStorage.getItem('theme')) {
      localStorage.removeItem('theme');
      document.querySelector('body').removeAttribute('data-theme');
      setTheme('');
      return;
    }

    localStorage.setItem('theme', 'dark');
    document.querySelector('body').setAttribute('data-theme', 'dark');
    setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ switchTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

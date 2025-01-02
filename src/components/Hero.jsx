import React from 'react';

export const Hero = ({ src, children }) => {
  return (
    <div className="hero">
      <img src={src} alt="" />
      <div className="hero__content">{children}</div>
    </div>
  );
};

import React from 'react';
import Wind from '../assets/wind.jpg';
import { Hero } from '../components/Hero';

const HomePage = () => {
  return (
    <>
      <Hero src={Wind}>
        <h1>Electrifying the way</h1>
      </Hero>
    </>
  );
};

export default HomePage;

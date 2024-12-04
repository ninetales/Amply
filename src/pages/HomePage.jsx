import React from 'react';
import { ConntectWalletBtn } from '../components/wallet/ConntectWalletBtn';
import { WalletStatus } from '../components/wallet/WalletStatus';

const HomePage = () => {
  return (
    <>
      <h2>Home Page 🎄</h2>
      <WalletStatus />
      <ConntectWalletBtn />
    </>
  );
};

export default HomePage;

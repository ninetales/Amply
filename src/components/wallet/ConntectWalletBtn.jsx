import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';

export const ConntectWalletBtn = () => {
  const { connectWallet } = useContext(UserContext);

  return (
    <button onClick={() => connectWallet()}>Connect MetaMask Wallet</button>
  );
};

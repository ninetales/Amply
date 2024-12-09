import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';

export const ConnectWalletBtn = () => {
  const { connectWallet } = useContext(UserContext);

  return <button onClick={() => connectWallet()}>Connect MetaMask</button>;
};

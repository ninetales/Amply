import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';

export const WalletStatus = () => {
  const { isConnected, walletAddress } = useContext(UserContext);

  return (
    <span>
      Current wallet:
      {walletAddress
        ? ` ${walletAddress.slice(0, 7)}...${walletAddress.slice(-5)}`
        : ' No wallet connected'}
    </span>
  );
};

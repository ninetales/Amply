import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { Wallet } from 'iconoir-react';
import { ConnectWalletBtn } from './ConnectWalletBtn';

export const WalletStatus = () => {
  const { isConnected, walletAddress } = useContext(UserContext);

  return (
    <div>
      <Wallet />
      {walletAddress ? (
        `${walletAddress.slice(0, 7)}...${walletAddress.slice(-5)}`
      ) : (
        <ConnectWalletBtn />
      )}
    </div>
  );
};

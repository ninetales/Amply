import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    isConnected: false,
    walletAddress: '',
  };
  const [userData, setUserData] = useState(initialState);

  const accountSwitch = async () => {
    console.log('Account switch fired...');
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        // User has connected accounts
        setUserData({ isConnected: true, walletAddress: accounts[0] });
        console.log('Account switched to:', accounts[0]);
      } else {
        // No accounts connected, reset to initial state
        setUserData(initialState);
        console.log('No accounts connected. State reset to initialState.');
      }
    } catch (error) {
      console.error('Error switching accounts:', error.message);
    }
  };

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    if (window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('the accounts', accounts);
        setUserData({ isConnected: true, walletAddress: accounts[0] });
      } catch (error) {
        console.log(`Unable to connect to MetaMask: ${error.message}`);
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  const connectionStatus = async () => {
    console.log('Checking connection status...');
    if (window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setUserData({ isConnected: true, walletAddress });
        console.log('Wallet already connected:', walletAddress);
      } else {
        console.log('No wallet connected. User needs to connect.');
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  useEffect(() => {
    connectionStatus();

    window.ethereum.on('accountsChanged', accountSwitch);
    return () => {
      window.ethereum.removeListener('accountsChanged', accountSwitch);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        connectWallet,
        isConnected: userData.isConnected,
        walletAddress: userData.walletAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    isConnected: false,
    walletAddress: '',
  };
  const [userData, setUserData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      return accounts;
    } catch (error) {
      console.log('Error fetching accounts', error.message);
      return [];
    }
  };

  const connectWallet = async () => {
    if (window.ethereum?.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setUserData({ isConnected: true, walletAddress: accounts[0] });
      } catch (error) {
        console.log(`Unable to connect to MetaMask: ${error.message}`);
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  const updateConnectionState = async () => {
    setIsLoading(true);
    const accounts = await fetchAccounts(); // Utility function
    if (accounts.length > 0) {
      setUserData({ isConnected: true, walletAddress: accounts[0] });
    } else {
      setUserData(initialState);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    updateConnectionState();

    window.ethereum.on('accountsChanged', updateConnectionState);
    return () => {
      window.ethereum.removeListener('accountsChanged', updateConnectionState);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        connectWallet,
        isLoading,
        isConnected: userData.isConnected,
        walletAddress: userData.walletAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

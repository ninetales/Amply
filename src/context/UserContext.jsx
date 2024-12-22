import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../../config.mjs';
import { createContract } from '../utilities/web3Handler.mjs';
import GridManagerABI from '../abi/GridManagerABI.json';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    isConnected: false,
    walletAddress: '',
    gridData: null,
  };
  const [userData, setUserData] = useState(initialState);
  const [browserProvider, setBrowserProvider] = useState(null);
  const [infuraProvider, setInfuraProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeInfuraProvider = () => {
    const _provider = new ethers.JsonRpcProvider(config.api.infura.url);
    setInfuraProvider(_provider);
  };

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
    const accounts = await fetchAccounts();
    if (accounts.length > 0) {
      setUserData({ isConnected: true, walletAddress: accounts[0] });
    } else {
      setUserData(initialState);
      setBrowserProvider(null);
      setSigner(null);
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

  useEffect(() => {
    if (userData.isConnected && window.ethereum?.isMetaMask) {
      const _browserProvider = new ethers.BrowserProvider(window.ethereum);
      setBrowserProvider(_browserProvider);

      try {
        const getSigner = async () => {
          const _signer = await _browserProvider.getSigner();
          setSigner(_signer);
        };
        getSigner();
      } catch (error) {
        console.error('Error initializing signer', error);
      }
    }
  }, [userData.isConnected]);

  useEffect(() => {
    const gridContract = async () => {
      const { address } = config.contracts.gridManager;
      const gridManagerContract = createContract(
        address,
        GridManagerABI,
        signer
      );

      try {
        const response = await gridManagerContract.getUserGridData(
          userData.walletAddress
        );

        const [gridId, name, countryCode, countryName, userCount, createdBy] =
          response;

        setUserData((prevData) => ({
          ...prevData,
          gridData: {
            gridId: gridId.toString(),
            name,
            countryCode,
            countryName,
            userCount: Number(userCount),
            createdBy,
          },
        }));
      } catch (error) {
        console.error('Unexpected error:', error.message || error);
      }
    };

    if (userData?.walletAddress && signer) {
      gridContract();
    }
  }, [userData?.walletAddress, signer]);

  return (
    <UserContext.Provider
      value={{
        connectWallet,
        isLoading,
        isConnected: userData.isConnected,
        walletAddress: userData.walletAddress,
        gridData: userData.gridData,
        browserProvider,
        infuraProvider,
        signer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

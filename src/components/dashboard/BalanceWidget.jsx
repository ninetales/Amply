import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import { ethers } from 'ethers';
import { Coins } from 'iconoir-react';
import currencyMapping from '../../utilities/currencyMapping';
import PuffLoader from 'react-spinners/PuffLoader';

export const BalanceWidget = () => {
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState('');
  const { walletAddress, browserProvider } = useContext(UserContext);

  useEffect(() => {
    {
      console.log('network', browserProvider.getNetwork());
    }
    if (browserProvider && walletAddress) {
      try {
        const init = async () => {
          const balanceInWei = await browserProvider.getBalance(walletAddress);
          const network = await browserProvider.getNetwork();
          setNetwork(network.name);
          const balanceInEth = ethers.formatEther(balanceInWei);
          const formatedBalance = parseFloat(balanceInEth).toFixed(4);
          setBalance(formatedBalance);
        };
        init();
      } catch (error) {
        console.log('Unable to load balance...');
      }
    }
  }, [browserProvider, walletAddress]);

  return (
    <div className="widget widget-balance component-shadow">
      <div className="widget__header">
        <Coins />
        <span>Balance</span>
      </div>
      <div className="widget__content widget-balance__content">
        <span className="widget-balance__numbers">{balance}</span>
        <span className="widget-balance__currency">
          {balance ? (
            currencyMapping[network] ? (
              currencyMapping[network]
            ) : (
              network
            )
          ) : (
            <PuffLoader />
          )}
        </span>
      </div>
    </div>
  );
};

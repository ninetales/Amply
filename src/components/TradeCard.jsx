import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import useTrading from '../hooks/useTrading.mjs';
import useEnergyStorage from '../hooks/useEnergyStorage.mjs';
import { ethers } from 'ethers';

export const TradeCard = ({ data }) => {
  const { walletAddress, gridData } = useContext(UserContext);
  const { tradingContract } = useTrading();
  const { gridId, kWh, pricePerKWh, tradeId, seller, sourceTypeIds } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seller.toLowerCase() === walletAddress) {
      cancelTrade();
    } else {
      buyTrade();
    }
  };

  const buyTrade = async () => {
    console.log('Buying!');
    try {
      const totalCost = BigInt(kWh) * BigInt(pricePerKWh);

      const txResponse = await tradingContract.buyTrade(gridId, tradeId, {
        value: totalCost,
      });

      const receipt = await txResponse.wait();

      if (receipt.status !== 1) console.log('failed...');

      receipt.logs.forEach((log) => {
        try {
          const parsedLog = tradingContract.interface.parseLog(log);
          console.log('Event:', parsedLog);
        } catch (e) {
          console.log('Failed to parse log:', log);
        }
      });
    } catch (error) {
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        try {
          const errorData = tradingContract.interface.parseError(error.data);
          console.log('errordata', errorData);
        } catch (parseError) {
          console.log('parseerror', error);
        }
      }
    }
  };

  const cancelTrade = async () => {
    console.log('Cancel trade!');
    try {
      const response = await tradingContract.cancelTrade(gridId, tradeId);
      console.log('cancel res', response);
    } catch (error) {
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        try {
          const errorData = tradingContract.interface.parseError(error.data);
          console.log('errordata', errorData);
        } catch (parseError) {
          console.log('parseerror', error);
        }
      }
    }
  };

  return (
    <div className="trade-card">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <span className={`fi fi-${gridData.countryCode.toLowerCase()}`} />
        <span>Area: {gridData.name}</span>
        <span>kWh: {kWh}</span>
        <span>
          Price: {ethers.formatEther(Number(kWh) * Number(pricePerKWh))} ETH
        </span>
        <button>
          {seller.toLowerCase() === walletAddress ? 'Cancel Trade' : 'Buy'}
        </button>
      </form>
    </div>
  );
};

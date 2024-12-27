import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import useTrading from '../hooks/useTrading.mjs';
import useEnergyStorage from '../hooks/useEnergyStorage.mjs';
import { ethers } from 'ethers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';

export const TradeCard = ({ data, updateTradeList }) => {
  const [feedback, setFeedback] = useState('');
  const { walletAddress, gridData } = useContext(UserContext);
  const { tradingContract } = useTrading();
  const { gridId, kWh, pricePerKWh, tradeId, seller, sourceTypeIds } = data;
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log('card data', data);
    if (seller.toLowerCase() === walletAddress) {
      //await cancelTrade();
    } else {
      await buyTrade();
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

      if (receipt.status !== 1)
        setFeedback({
          message: 'Was unable to complete the trade. Please try again later.',
          type: 'error',
        });

      receipt.logs.forEach((log) => {
        try {
          const parsedLog = tradingContract.interface.parseLog(log);
          console.log('Event:', parsedLog);
        } catch (e) {
          console.log('Failed to parse log:', log);
        }
      });

      setFeedback({
        message: 'Successfully bought the offer',
        type: 'success',
      });

      setIsPurchaseComplete(true);

      setTimeout(() => {
        updateTradeList();
      }, 1500);
    } catch (error) {
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        if (error.code === 'CALL_EXCEPTION' && error.data) {
          try {
            const errorData = tradingContract.interface.parseError(error.data);
            console.log('ERROR DATA', errorData);
            if (errorData.name === 'TradeIsInactive') {
              setFeedback({
                message: 'The offer is no longer available.',
                type: 'error',
              });
            } else if (errorData.name === 'IncorrectPayment') {
              setFeedback({
                message: 'Incorrect payment. Please try again.',
                type: 'error',
              });
            } else if (errorData.name === 'TransferFailed') {
              setFeedback({
                message: 'The transfer failed.',
                type: 'error',
              });
            }
          } catch (error) {}
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__header">
          {feedback.message && (
            <div className={`notification notification-${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </div>
        <span className={`fi fi-${gridData.countryCode.toLowerCase()}`} />
        <span>Area: {gridData.name}</span>
        <span>kWh: {kWh}</span>
        <span>
          Price:{' '}
          {ethers.formatEther((BigInt(kWh) * BigInt(pricePerKWh)).toString())}{' '}
          ETH
        </span>
        <button type="submit" disabled={isSubmitting || isPurchaseComplete}>
          {isSubmitting ? (
            <ClipLoader />
          ) : !isPurchaseComplete ? (
            seller.toLowerCase() === walletAddress ? (
              'Cancel Trade'
            ) : (
              'Buy'
            )
          ) : (
            'Purchased'
          )}
        </button>
      </form>
    </div>
  );
};

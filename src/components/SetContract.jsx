import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import useTrading from '../hooks/useTrading.mjs';
import useEnergyStorage from '../hooks/useEnergyStorage.mjs';

export const SetContract = () => {
  const { tradingContract } = useTrading();
  const { energyStorageContract } = useEnergyStorage();
  const { walletAddress } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('FETCHING...');
    try {
      const response = await energyStorageContract.setTradingContract(
        '0xe7C2EcF0c416836A43Ca40771168EfdA2F292559'
      );
      console.log('THE RESPONSE', response);
    } catch (error) {
      console.log('the error', error);
    }
  };

  return (
    <form action="" onSubmit={(e) => handleSubmit(e)}>
      <button>Set contract</button>
    </form>
  );
};

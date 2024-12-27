import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import useTrading from '../../hooks/useTrading.mjs';
import useEnergyStorage from '../../hooks/useEnergyStorage.mjs';
import { ethers } from 'ethers';

export const EnergyStorageWidget = () => {
  const { tradingContract } = useTrading();
  const { energyStorageContract } = useEnergyStorage();
  const { walletAddress, gridData } = useContext(UserContext);
  const [userEnergy, setUserEnergy] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('FETCHING...');
    try {
      const response = await energyStorageContract.addEnergy(
        walletAddress,
        200
      );
      console.log('THE RESPONSE', response);
    } catch (error) {
      console.log('the error', error);
    }
  };

  useEffect(() => {
    const fetchEnergy = async () => {
      try {
        console.log('Fetching energy');
        const response =
          await energyStorageContract.getEnergySupply(walletAddress);

        console.log('ener res', response.toString());
        setUserEnergy(response.toString());
      } catch (error) {
        console.log('Unable to fetch energy', error);
      }
    };
    fetchEnergy();
  }, [walletAddress]);

  return (
    <div className="widget-energy component-shadow">
      <h2>
        <span>Battery storage: </span>
        <span>{userEnergy} kWh</span>
      </h2>
      <p>
        As part of this concept, we will simulate electricity storage to
        demonstrate how energy could be managed in a decentralized system. In
        real life, this process would be automated by an IoT device, seamlessly
        tracking energy levels and enabling efficient usage or trade without
        manual intervention.
      </p>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <button>Add 200 kWh</button>
      </form>
    </div>
  );
};

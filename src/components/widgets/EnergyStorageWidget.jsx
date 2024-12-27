import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import useTrading from '../../hooks/useTrading.mjs';
import useEnergyStorage from '../../hooks/useEnergyStorage.mjs';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';

export const EnergyStorageWidget = () => {
  const { tradingContract } = useTrading();
  const { energyStorageContract } = useEnergyStorage();
  const { walletAddress, gridData } = useContext(UserContext);
  const [userEnergy, setUserEnergy] = useState(null);
  const [feedback, setFeedback] = useState('');

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const txResponse = await energyStorageContract.addEnergy(
        walletAddress,
        20
      );

      const receipt = await txResponse.wait();

      if (receipt.status !== 1)
        setFeedback({
          message:
            'Was unable to add electricity to storage. Please try again later.',
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
        message: 'Successfully added electricity',
        type: 'success',
      });

      // Update users energy
      fetchEnergy();
    } catch (error) {
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        try {
          const errorData = tradingContract.interface.parseError(error.data);
          console.log('ERROR DATA', errorData);
          if (errorData.name === 'ToLowkWh') {
            setFeedback({
              message: 'To low kWh. Increase it.',
              type: 'error',
            });
          }
        } catch (parseError) {
          console.log(parseError.data);
          setFeedback({
            message: 'Ops...Something went wrong.',
            type: 'error',
          });
        }
      }
    }
  };

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

  useEffect(() => {
    fetchEnergy();
  }, [walletAddress]);

  return (
    <div className="widget-energy component-shadow">
      <div>
        {feedback.message && (
          <div className={`notification notification-${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>
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
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <ClipLoader /> : 'Add 20 kWh'}
        </button>
      </form>
    </div>
  );
};

import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import useTrading from '../hooks/useTrading.mjs';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseUnits } from 'ethers';
import { useForm } from 'react-hook-form';
import tradeSchema from '../validation/schemas/tradeSchema.mjs';
import { ClipLoader } from 'react-spinners';
import { WateringSoil, Wind, SunLight } from 'iconoir-react';

export const CreateTrade = () => {
  const { tradingContract } = useTrading();
  const { gridData, updateEnergyStorage } = useContext(UserContext);
  const [sourceTypeOptions, setSourceTypeOptions] = useState([]);
  const [feedback, setFeedback] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { kWh: '', sourceTypes: [] },
    resolver: yupResolver(tradeSchema),
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      sourceTypes: Array.isArray(data.sourceTypes)
        ? data.sourceTypes.map(Number)
        : [],
    };
    console.log('Submitted data:', formattedData);
    try {
      // Example contract interaction
      const txResponse = await tradingContract.createTrade(
        gridData.gridId,
        parseInt(formattedData.kWh),
        parseUnits('0.001', 'ether'),
        formattedData.sourceTypes
      );

      const receipt = await txResponse.wait();

      if (receipt.status !== 1)
        setFeedback({
          message: 'Was unable to create the offer. Please try again later.',
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
        message: 'Successfully created the offer.',
        type: 'success',
      });

      // Update user energy storage
      updateEnergyStorage();

      // Reset the form
      reset();
    } catch (error) {
      // Check for specific custom error
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        try {
          const errorData = tradingContract.interface.parseError(error.data);
          console.log('ERROR DATA', errorData);
          if (errorData.name === 'ToLowPrice') {
            setFeedback({
              message: 'You cannot set that price. It is too low.',
              type: 'error',
            });
          } else if (errorData.name === 'ToLowkWh') {
            setFeedback({
              message: 'You cannot set such low kWh. Please increase it.',
              type: 'error',
            });
          } else if (
            errorData.name === 'InsufficientEnergy' ||
            errorData.name === 'EnergySupplyToLow'
          ) {
            setFeedback({
              message:
                'You have not enough energy to sell. Generate some more or decrease the amount for sale.',
              type: 'error',
            });
          }
        } catch (parseError) {
          setFeedback({ message: 'Error connecting to grid.', type: 'error' });
        }
      }
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      const types = [];
      let index = 1;
      while (true) {
        try {
          const response = await tradingContract.getSourceType(index);
          if (!response.name) break;
          types.push({
            id: index,
            name: response.name,
            description: response.description,
          });
          index++;
        } catch (error) {
          break;
        }
      }
      setSourceTypeOptions(types);
    };

    fetchTypes();
  }, [tradingContract]);

  const sourceIcons = (name) => {
    switch (name.toLowerCase()) {
      case 'wind':
        return <Wind />;
      case 'solar':
        return <SunLight />;
      case 'water':
        return <WateringSoil />;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="trade-creator  component-shadow"
    >
      <div className="form__header">
        <h2>New offer</h2>
        {feedback.message && (
          <div className={`notification notification-${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>
      <span>Flat rate: 0.001 ETH/kWh</span>
      <label>
        <span>Amount kWh:</span>
        <input type="text" {...register('kWh')} disabled={isSubmitting} />
        {errors.kWh && (
          <span className="form-message">{errors.kWh.message}</span>
        )}
      </label>

      <div className="trade-creator__section">
        <span>Source type options:</span>
        <div className="source-options">
          {sourceTypeOptions.map((sourceType) => (
            <label key={sourceType.id} className="source-options__button">
              <input
                type="checkbox"
                {...register('sourceTypes')}
                value={Number(sourceType.id)}
                disabled={isSubmitting}
              />
              <div className="source-options__icon">
                {sourceIcons(sourceType.name)}
                <span>{sourceType.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {errors.sourceTypes && (
        <span className="form-message">{errors.sourceTypes.message}</span>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <ClipLoader /> : 'Create offer'}
      </button>
    </form>
  );
};

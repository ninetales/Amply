import React, { useEffect, useState, useContext } from 'react';
import useGridManager from '../hooks/useGridManager.mjs';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import gridManagerSchema from '../validation/schemas/gridManagerSchema.mjs';
import { ClipLoader } from 'react-spinners';
import { MapPin, HomeAlt } from 'iconoir-react';

export const GridManager = () => {
  const { gridManagerContract } = useGridManager();
  const [grids, setGrids] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(gridManagerSchema),
  });

  const handleOptionChange = (event) => {
    const value = event.target.value;
    console.log('Before state change:', selectedOption);
    setSelectedOption(value);
    console.log('After state change:', value);
  };

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        const response = await gridManagerContract.listGrids();
        setGrids(response);
      } catch (error) {
        console.log('No grids to load...');
        setFeedback({ message: 'No grids to load.', type: 'info' });
      }
    };
    fetchGrids();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log('Submit', data.radio);

      const txResponse = await gridManagerContract.addUserToGrid(data.radio);
      const receipt = await txResponse.wait();

      if (receipt.status !== 1)
        setFeedback({ message: 'Transaction failed.', type: 'error' });

      receipt.logs.forEach((log) => {
        try {
          const parsedLog = gridManagerContract.interface.parseLog(log);
          console.log('Event:', parsedLog);
        } catch (e) {
          console.log('Failed to parse log:', log);
        }
      });

      setFeedback({
        message: 'Successfully connected to grid.',
        type: 'success',
      });

      // Reload page
      window.location.reload();
    } catch (error) {
      // Check for specific custom error
      if (error.code === 'CALL_EXCEPTION' && error.data) {
        try {
          const errorData = gridManagerContract.interface.parseError(
            error.data
          );
          if (errorData.name === 'UserAlreadyInGrid') {
            setFeedback({
              message: 'You are already connected to a grid.',
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
    if (errors.radio) {
      setFeedback({ message: errors.radio.message, type: 'error' });
    } else {
      setFeedback('');
    }
  }, [errors.radio]);

  return (
    <div className="grid-manager">
      <h3>Available Grids:</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__header">
          {feedback.message && (
            <div className={`notification notification-${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </div>

        {grids.length > 0 ? (
          <ul className="grid-manager__list">
            <Controller
              name="radio"
              control={control}
              render={({ field }) =>
                grids.map((grid) => (
                  <li key={grid.id}>
                    <label
                      className={`component-shadow ${selectedOption === String(grid.id) ? 'active' : ''}`}
                      htmlFor={String(grid.id)}
                    >
                      <input
                        type="radio"
                        name="grids"
                        id={String(grid.id)}
                        value={String(grid.id)}
                        checked={selectedOption === String(grid.id)}
                        onChange={(e) => {
                          field.onChange(e);
                          handleOptionChange(e);
                        }}
                        disabled={isSubmitting}
                      />
                      <span
                        className={`fi fi-${grid.countryCode.toLowerCase()}`}
                      ></span>
                      <span>{grid.countryName}</span>
                      <ul className="grid-manager__details-list">
                        <li>{`Location: ${grid.name}`}</li>
                        <li>
                          {`Connected users: ${grid.userCount.toString()}`}
                        </li>
                      </ul>
                    </label>
                  </li>
                ))
              }
            />
          </ul>
        ) : (
          <p>No grids found.</p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <ClipLoader /> : 'Connect to grid'}
        </button>
      </form>
    </div>
  );
};

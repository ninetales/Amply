import React, { useEffect, useState } from 'react';
import useGridManager from '../hooks/useGridManager.mjs';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import gridManagerSchema from '../validation/schemas/gridManagerSchema';

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
        const grids = await gridManagerContract.listGrids();
        setGrids(grids);
      } catch (error) {
        console.log('No grids to load...');
      }
    };
    fetchGrids();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log('Submit', data);

      // Your submission logic here
      setFeedback({ message: 'Grid connected successfully!', type: 'success' });
    } catch (error) {
      setFeedback({ message: 'Error connecting to grid.', type: 'error' });
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
      <h2>Grid Manager</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Available Grids:</h3>

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
                      />
                      <span
                        className={`fi fi-${grid.countryCode.toLowerCase()}`}
                      ></span>
                      <span>{grid.countryName}</span>
                      <span>Area: {grid.name}</span>
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
          Connect to grid
        </button>
      </form>
    </div>
  );
};

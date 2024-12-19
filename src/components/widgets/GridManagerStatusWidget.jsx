import React, { useEffect, useState, useContext } from 'react';
import { MapPinXmark, User } from 'iconoir-react';
import { PuffLoader } from 'react-spinners';
import useGridManager from '../../hooks/useGridManager.mjs';
import UserContext from '../../context/UserContext';

export const GridManagerStatusWidget = () => {
  const { walletAddress } = useContext(UserContext);
  const { gridManagerContract } = useGridManager();
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await gridManagerContract.isUserConnected(walletAddress);
        setIsConnected(status);
      } catch (error) {
        if (error.message?.includes('NoUserInGrid')) {
          setIsConnected(false);
        } else {
          // Handle other unexpected errors
          console.error('Unexpected error:', error.message || error);
        }
      }
    };
    fetchStatus();
  }, [isConnected]);

  return (
    <div className="widget widget-grid-status component-shadow">
      <div className="widget__header">
        <MapPinXmark />
        <span>Grid status</span>
      </div>
      <div className="widget__content widget-grid-status__content">
        {isConnected === null ? (
          <PuffLoader />
        ) : isConnected ? (
          'Connected'
        ) : (
          <>
            <span>Not connected</span>
            <button>Join grid</button>
          </>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState, useContext } from 'react';
import { MapPinXmark, MapPin, User } from 'iconoir-react';
import { PuffLoader } from 'react-spinners';
import useGridManager from '../../hooks/useGridManager.mjs';
import UserContext from '../../context/UserContext';

export const GridManagerStatusWidget = () => {
  const { gridData } = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(null);

  return (
    <div className="widget widget-grid-status component-shadow">
      <div className="widget__header">
        {gridData ? <MapPin /> : <MapPinXmark />}
        <span>Grid status</span>
      </div>
      <div className="widget__content widget-grid-status__content">
        {gridData === null ? (
          <span>Not connected</span>
        ) : gridData ? (
          <>
            <span
              className={`fi fi-${gridData.countryCode.toLowerCase()}`}
            ></span>

            <span>{gridData.name}</span>
          </>
        ) : (
          <>
            <span>Not connected</span>
          </>
        )}
      </div>
    </div>
  );
};

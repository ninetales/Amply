import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export const ProtectedRoute = () => {
  const { isConnected } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) navigate('/');
  }, [isConnected]);

  if (!isConnected) return <div>Loading...</div>;

  if (isConnected) return <Outlet />;
};

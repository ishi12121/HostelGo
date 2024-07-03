import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getRefreshToken } from '../utils/tokenManager';

const ProtectedRoute = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return accessToken && refreshToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectedRoute;

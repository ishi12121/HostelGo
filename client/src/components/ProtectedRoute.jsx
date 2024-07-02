import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getRefreshToken } from '../utils/tokenManager'; // Adjust the path to match your project structure

const ProtectedRoute = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return accessToken && refreshToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectedRoute;

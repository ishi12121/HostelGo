// src/components/withAuth.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, refreshAccessToken } from '../utils/tokenManager';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          let token = getAccessToken();
          if (!token) {
            console.log('No access token found, redirecting to login');
            navigate('/login');
            return;
          }

          // Attempt to refresh the token
          await refreshAccessToken();
          console.log('Authentication successful');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication failed:', error);
          navigate('/login');
        }
      };

      checkAuth();
    }, [navigate]);

    if (!isAuthenticated) {
      return <div>Loading...</div>; // Or any loading indicator
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
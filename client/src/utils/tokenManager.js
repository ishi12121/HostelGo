export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    // Store refreshToken in an HTTP-only cookie (this should be done server-side for security)
    document.cookie = `refreshToken=${refreshToken}; path=/; HttpOnly; Secure; SameSite=Strict`;
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };
  
  export const refreshAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:3030/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // This is important to include cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearTokens();
      throw error;
    }
  };
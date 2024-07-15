export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  // Store refreshToken in an HTTP-only cookie (this should be done server-side for security)
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
}

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId")
  localStorage.removeItem("role")
};
  // function formatDateToMMMDDYYYY(dateString) {
  //   const date = new Date(dateString);
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
  //   const month = months[date.getMonth()];
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const year = date.getFullYear();
    
  //   return `${month}-${day}-${year}`;
  // }
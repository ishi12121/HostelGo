import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenManager";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    }
  }, [navigate]);


  
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>If you can see this, you're authenticated!</p>
    </div>
  );
};

export default Home;

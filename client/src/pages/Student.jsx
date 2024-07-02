import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenManager";

const Student = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    }
  }, [navigate]);

  return <div>student page congo authenticated</div>;
};

export default Student;

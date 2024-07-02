import React from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenManager";

const Staff = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    }
  }, [navigate]);
  return <div>Staff page congo u are authenticated</div>;
};

export default Staff;

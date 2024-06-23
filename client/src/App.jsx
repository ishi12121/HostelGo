import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import SecurityCheck from "./components/SecurityCheck";

import Selectperson from "./index";

import Stdhome from "./stdhome";
import Wardenpage from "./wardenpage";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const history = useNavigate();
  useEffect(() => {
    async function render() {
      const val = await axios.get("http://localhost:3030/login/cookdata", {
        withCredentials: true,
      });
      if (val.data !== "notexist") {
        history(`${val.data}/`);
      }
    }
    render();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Selectperson />}></Route>
        <Route path="student/" element={<Stdhome />}></Route>
        <Route path="warden/" element={<Wardenpage />}></Route>
        <Route path="clerk/" element={<Wardenpage />}></Route>
        <Route path="security/" element={<SecurityCheck />}></Route>
      </Routes>
    </>
  );
}

export default App;

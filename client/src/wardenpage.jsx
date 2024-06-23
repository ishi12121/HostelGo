import Wardennav from "./components/wardennav";
import ApprovalForm from "./components/ApprovalForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Menubar from "./components/menubar";
import StdRequest from "./components/stdrequest";

export default function Wardenpage() {
  const history = useNavigate();
  const [open, setopen] = useState(false);
  function navopen(val) {
    setopen(val);
  }
  useEffect(() => {
    async function checkcook() {
      const val = await axios.get("http://localhost:3030/login/cookdata", {
        withCredentials: true,
      });
      const data = val.data;
      if (data !== "warden") {
        history("/");
      }
    }
    checkcook();
  }, []);
  return (
    <>
      <div className=" overflow-x-hidden">
        {open ? <Menubar navopen={navopen} /> : <Wardennav navopen={navopen} />}
        <StdRequest />
      </div>
    </>
  );
}

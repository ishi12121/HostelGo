import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./loginnav";
import Menubar from "./menubar";
import { CgMenuGridR } from "react-icons/cg";
import { useState } from "react";

export default function Wardennav(props) {
  const history = useNavigate();
  const { navopen } = props;
  async function removecookie() {
    const val = await axios.delete("http://localhost:3030/login/logout", {
      withCredentials: true,
    });
    if (val.data == "removed") {
      history("/");
    }
  }

  return (
    <>
      <nav className="w-100% h-[70px] bg-[#82c7e4] flex justify-between items-center">
        <div className="w-[40px] h-[40px] bg-no-repeat bg-cover ml-[40px] bg-logoimg"></div>

        <div className="mr-[40px]">
          <ul className=" sm:flex sm:gap-[20px] hidden">
            <li className="cursor-pointer">requests</li>
            <li className="cursor-pointer">Accepted</li>
            <li className="cursor-pointer">rejected</li>
            <li
              className="cursor-pointer text-blue-600"
              onClick={() => {
                removecookie();
              }}>
              logout
            </li>
          </ul>
        </div>
        <CgMenuGridR
          className=" text-[30px] mr-[30px]  sm:hidden"
          onClick={() => {
            navopen(true);
          }}
        />
      </nav>
    </>
  );
}

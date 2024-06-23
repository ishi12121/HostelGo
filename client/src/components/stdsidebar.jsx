import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Stdmenubar(props) {
  const history = useNavigate();
  const { navopen } = props;
  async function clearcookie() {
    await axios.delete("http://localhost:3030/login/logout", {
      withCredentials: true,
    });
    history("/");
  }

  const slide = (
    <div className=" w-[100%] h-[100%]  fixed">
      <div className="w-[250px] h-[100%]  absolute right-0 bg-white opacity-[1] z-10">
        <AiOutlineCloseCircle
          className=" absolute cursor-pointer text-black text-[30px] right-[10px] top-[20px]"
          onClick={() => {
            navopen(false);
          }}
        />
        <ul className="w-[100%] top-[60px] flex flex-col absolute">
          <li className="pt-[15px] border-b-[1px] hover:bg-gray-200 border-black pb-[15px] pl-[12px] ">
            outpass
          </li>
          <li className="pt-[15px] border-b-[1px] hover:bg-gray-200 border-black pb-[15px] pl-[12px] ">
            leaveform
          </li>
          <li className="pt-[15px] border-b-[1px] hover:bg-gray-200 border-black pb-[15px] pl-[12px] ">
            accepted
          </li>
          <li className="pt-[15px] border-b-[1px] hover:bg-gray-200 border-black pb-[15px] pl-[12px] ">
            rejected
          </li>
          <li
            className="pt-[15px] border-b-[1px] hover:bg-gray-200 border-black pb-[15px] pl-[12px] cursor-pointer text-blue-600"
            onClick={() => {
              clearcookie();
            }}>
            logout
          </li>
        </ul>
      </div>
      <div className="w-[100%] h-[100%] bg-black  opacity-[0.4] z-[1]"></div>
    </div>
  );
  return slide;
}

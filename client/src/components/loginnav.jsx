import { Link } from "react-router-dom";
import { useState } from "react";
import Loginpage from "./login";
import Selectperson from "..";
export default function Navbar(props) {
  const { Selper } = props;
  const color = {
    stle: "text-center border-b-[4px] p-[5px] pb-[20px] pt-[20px] border-b-white",
  };
  const [person, setperson] = useState("student");
  return (
    <>
      <nav>
        <ul className="w-[100%] h-[70px] text-white capitalize opacity-[0.7] bg-gray-950 fixed flex justify-around items-center">
          <li className={person == "student" ? color.stle : ""}>
            <Link
              to=""
              onClick={() => {
                setperson("student");

                Selper("student");
              }}>
              student
            </Link>
          </li>
          <li className={person == "warden" ? color.stle : ""}>
            <Link
              to=""
              onClick={() => {
                setperson("warden");
                Selper("warden");
              }}>
              warden
            </Link>
          </li>
          <li className={person == "clerk" ? color.stle : ""}>
            <Link
              to=""
              onClick={() => {
                setperson("clerk");
                Selper("clerk");
              }}>
              clerk
            </Link>
          </li>
          <li className={person == "security" ? color.stle : ""}>
            <Link
              to=""
              onClick={() => {
                setperson("security");
                Selper("security");
              }}>
              security
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

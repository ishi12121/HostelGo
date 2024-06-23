import axios from "axios";
import { useEffect, useState } from "react";
import { CgMenuGridR } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";

export default function Stdnav(props) {
  const history = useNavigate();
  const color = {
    stle: "border-b-[4px] p-[5px] pb-[20px] pt-[20px] border-b-white",
  };
  const [person, setperson] = useState("outpass");
  const { navopen, selectpage } = props;

  async function clearcookie() {
    await axios.delete("http://localhost:3030/login/logout", {
      withCredentials: true,
    });
    history("/");
  }

  function Createnav() {
    // const [navo, setnavo] = useState(false);
    return (
      <>
        <nav className="w-100%  h-[70px]   bg-[#82c7e4] flex justify-between items-center">
          <div className="w-[40px] h-[40px] bg-no-repeat bg-cover ml-[40px] bg-logoimg"></div>

          <div className="mr-[40px]">
            <ul className=" sm:flex sm:gap-[20px] items-center hidden">
              <li className={person == "outpass" ? color.stle : ""}>
                <Link
                  to=""
                  onClick={() => {
                    setperson("outpass");
                    selectpage("outpass");
                  }}>
                  outpass
                </Link>
              </li>
              <li className={person == "leaveform" ? color.stle : ""}>
                <Link
                  to=""
                  onClick={() => {
                    setperson("leaveform");
                    selectpage("leaveform");
                  }}>
                  leaveform
                </Link>
              </li>
              <li className={person == "status" ? color.stle : ""}>
                <Link
                  to=""
                  onClick={() => {
                    setperson("status");
                    selectpage("status");
                  }}>
                  status
                </Link>
              </li>

              <li
                className="cursor-pointer text-blue-600"
                onClick={() => {
                  clearcookie();
                }}>
                logout
              </li>
            </ul>
          </div>
          <CgMenuGridR
            className=" text-[30px] mr-[30px]  sm:hidden"
            onClick={() => {
              navopen(true);
              //setnavo(true);
            }}
          />
        </nav>
      </>
    );
  }
  return <Createnav />;
}

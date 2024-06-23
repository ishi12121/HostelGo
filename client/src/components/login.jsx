import { useState } from "react";

import Navbar from "./loginnav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Loginpage() {
  const history = useNavigate();

  const [err, seterr] = useState({ error: false, errormsg: "" });
  const [person, setperson] = useState("student");
  const [orginalrole, setorginalrole] = useState("student");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  function SelectPerson(val) {
    if (val == "student") setperson(val);
    else {
      setperson("staff");
    }
    setorginalrole(val);
  }
  async function submit() {
    if (email == "" || password == "") {
      seterr({ error: true, errormsg: "Fill the email or password" });
      setTimeout(() => {
        seterr({ error: false, errormsg: "" });
      }, 2000);
    } else {
      const res = await axios.post(
        `http://localhost:3030/login/${person}`,
        {
          role: `${orginalrole}`,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data == "Exist") {
        seterr({ error: true, errormsg: "login successfully" });
        setTimeout(() => {
          seterr({ error: false, errormsg: "" });
          history(`${orginalrole}/`);
        }, 2000);
      } else {
        seterr({ error: true, errormsg: "Incorrect email or password" });
        setTimeout(() => {
          seterr({ error: false, errormsg: "" });
        }, 2000);
      }
    }
  }
  return (
    <>
      <Navbar Selper={SelectPerson} />
      <div className="w-screen bg-backimg bg-center bg-cover bg-no-repeat h-screen flex justify-center items-center">
        <div className="w-[400px] h-100 loginanim  relative p-5 bg-[rgba(0,0,0,0.5)] flex flex-col items-center rounded-2xl">
          <div className=" w-[70px] h-[70px] rounded-full bg-no-repeat bg-cover absolute bg-studentimg bg-slate-100 top-[-45px]"></div>
          <div className="w-full text-center py-2 font-bold text-4xl">
            <h2 className="text-[white] capitalize">{orginalrole} login</h2>
          </div>
          <div className="w-[80%] relative mt-[30px]">
            <input
              type="text"
              id="mail"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              className="w-[100%] outline-none bg-transparent text-white px-1 border-b-2 border-[white] focus:border-emerald-600 peer"
              required
            />
            <label
              htmlFor="mail"
              className="pointer-events-none absolute bottom-[8px] text-white left-[3px] peer-focus:bottom-[23px] peer-valid:bottom-[23px]">
              email
            </label>
          </div>
          <div className="w-[80%] relative mt-[30px]">
            <input
              type="password"
              id="pass"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              className="w-[100%] text-white border-[white] focus:border-emerald-600 outline-none bg-transparent px-1 border-b-2 peer"
              required
            />
            <label
              htmlFor="pass"
              className="pointer-events-none text-white absolute bottom-[8px] left-[3px] peer-focus:bottom-[23px] peer-valid:bottom-[23px]">
              password
            </label>
          </div>
          <div className=" text-center mt-[40px] active:shadow-xl active:scale-[1.2] ">
            <button
              onClick={() => {
                submit();
              }}
              className="rounded-2xl pl-[20px] pt-[7px] pb-[7px] pr-[20px] bg-green-700 hover:bg-green-600  transition-all w-40">
              login
            </button>
          </div>
          {err && <h1 className="text-white">{err.errormsg}</h1>}
        </div>
      </div>
    </>
  );
}

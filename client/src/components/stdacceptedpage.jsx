import axios from "axios";

import { useEffect, useState } from "react";
import Stdrandominfo from "./std-randominfo";
export default function Stdacceptedpage(props) {
  let list;
  const [html, sethtml] = useState(<></>);
  const { req } = props;

  async function getEmailid() {
    const val = await axios.get("http://localhost:3030/getEmailid", {
      withCredentials: true,
    });
    const data = val.data;
    // console.log(data);
    getData(data);
  }

  async function getData(data) {
    const val = await axios.post(
      `http://localhost:3030/info/data`,
      {
        rollno: data,
      },
      {
        withCredentials: true,
      }
    );

    list = val.data;
    setdata([list]);
  }

  useEffect(() => {
    getEmailid();
  }, []);

  function setdata(data) {
    console.log(data);
    if (data[0].data.length <= 0) {
      let val = (
        <div className="w-screen h-screen grid place-content-center">
          <h1 className="w-[500px] flex justify-center items-center uppercase rounded-[12px] shadow-2xl h-[300px] bg-white text-blue-700 font-bold text-[20px]">
            no rejected {req} found!!
          </h1>
        </div>
      );
      sethtml(val);
    } else {
      let val = data.map((val, i) => {
        return (
          <div key={val}>
            <Stdrandominfo data={val} />
          </div>
        );
      });
      sethtml(val);
    }
  }

  return (
    <>
      <nav className="w-100%  bg-[#82c7e4] flex justify-between items-center"></nav>

      {html}
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

let opDatas;
export default function StdRequest() {
  const [data, setData] = useState([]);
  const [reRender, setRender] = useState(true);

  async function doRender() {
    if (reRender) await setRender(false);
    else await setRender(true);
    //console.log(reRender);
  }

  useEffect(() => {
    console.log("hiii");
    axios
      .get("http://localhost:3030/OpDetails")
      .then((result) => {
        setData(result.data.data);
        //console.log("fasdf");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function acceptOP(rollno) {
    try {
      const isOk = confirm("Are you sure to Approve ?");
      if (isOk) {
        const data = await axios.post("http://localhost:3030/acceptRequest", {
          rollno: rollno,
        });
        removeRequest(rollno);
        setData([data]);
        //console.log(data);
      } else return;
    } catch (error) {
      console.log(error.message);
    }
    doRender();
    // console.log(rollno);
  }

  async function rejectOP(rollno) {
    try {
      // console.log(rollno);
      const val = prompt("Please Enter the reason to reject ...");
      console.log(val);

      if (val) {
        const data = await axios.post("http://localhost:3030/rejectRequest", {
          rollno: rollno,
          val: val,
        });
        removeRequest(rollno);
        doRender();
        //console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function removeRequest(rollno) {
    try {
      const data = await axios.post("http://localhost:3030/removeRequest", {
        rollno: rollno,
      });
      // console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  function CreateUl() {
    const Lis = data.map((dat) => {
      if (dat.isWait) {
        return (
          <li
            key={dat.rollno}
            className="relative mx-auto mt-10 w-[80%] rounded-[12px] bg-[rgba(0,0,0,0.1)] p-[20px] last:mb-8 sm:w-[63%]">
            <div className="absolute -top-[25px] left-[calc(50%-2.5rem)]   h-20 w-20 rounded-full bg-blue-300 bg-studentimg bg-cover bg-center bg-no-repeat"></div>
            <div className="  mt-10 flex w-[100%] items-center   ">
              <div className="ml-[20px] flex w-full flex-col gap-y-1.5 font-semibold text-violet-900  sm:ml-[20px] md:ml-[20px]">
                <div className="mt-[10px] flex  ">
                  <p className=" ">
                    Name :{" "}
                    <span className="pl-2 text-blue-500"> {dat.name}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 md:flex-nowrap">
                  <h1>{"Date ->"}</h1>
                  <div className="flex  gap-5">
                    <div className="flex flex-wrap">
                      <span>From :</span>
                      <span className="pl-1 text-blue-500 md:pl-2">
                        {dat.dateFrom}
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      <span>To :</span>
                      <span className=" pl-1 text-blue-500 md:pl-2">
                        {dat.dateTo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 md:flex-nowrap">
                  <h1>{"Time ->"}</h1>
                  <div className="flex  gap-5">
                    <div className="flex flex-wrap">
                      <span>From :</span>
                      <span className="pl-1 text-blue-500 md:pl-2">
                        {dat.timeFrom}
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      <span>To :</span>
                      <span className=" pl-1 text-blue-500 md:pl-2">
                        {dat.timeTo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className=" flex  ">
                  <p>
                    Rollno :
                    <span className="pl-2 text-blue-500 ">{dat.rollno}</span>
                  </p>
                </div>

                <div className=" flex  ">
                  <p>
                    Department :
                    <span className="pl-2 text-blue-500 ">
                      {dat.department}
                    </span>
                  </p>
                </div>

                <div className=" flex  ">
                  <p>
                    Year :
                    <span className="pl-2 text-blue-500 ">{dat.year}</span>
                  </p>
                </div>

                <div className=" flex  ">
                  <p>
                    City :{" "}
                    <span className="pl-2 text-blue-500 ">{dat.city}</span>
                  </p>
                </div>
                <div className=" flex  ">
                  <p>
                    Phonenumber:
                    <span className="pl-2 text-blue-500 ">{dat.phNo}</span>
                  </p>
                </div>

                <div className=" flex  ">
                  <p>
                    Parent Phonenumber:
                    <span className="pl-2 text-blue-500 ">
                      {dat.parentPhNo}
                    </span>
                  </p>
                </div>

                <div className=" flex gap-5 rounded-lg bg-slate-300 p-1 px-2 shadow-sm shadow-black">
                  <p>Reason:</p>
                  <p className=" text-blue-500 ">{dat.reason}</p>
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex w-[100%] justify-around">
              <button
                onClick={() => acceptOP(dat.rollno)}
                className="w-[90px] rounded-[8px] border-2 border-[green] font-semibold text-[green] transition-all  duration-200 hover:scale-110 hover:bg-[green] hover:text-[white] hover:shadow-sm hover:shadow-black hover:transition-all hover:duration-200 active:scale-105">
                Approve
              </button>
              <button
                onClick={() => rejectOP(dat.rollno)}
                className="w-[90px] rounded-[8px] border-2 border-[red] font-semibold text-[red] transition-all  duration-200 hover:scale-110 hover:bg-[red] hover:text-[white] hover:shadow-sm hover:shadow-black hover:transition-all hover:duration-200 active:scale-105">
                Reject
              </button>
            </div>
          </li>
        );
      } else
        return (
          <>
            <div className="w-screen h-screen grid place-content-center">
              <h1 className="w-[500px] flex justify-center items-center uppercase rounded-[12px] shadow-2xl h-[300px] bg-white text-blue-700 font-bold text-[20px]">
                no requests were found!!
              </h1>
            </div>
          </>
        );
    });
    return <ul className="flex w-[100%] flex-col justify-center">{Lis}</ul>;
  }

  return (
    <>
      <div className="">
        <CreateUl />
      </div>
    </>
  );
}

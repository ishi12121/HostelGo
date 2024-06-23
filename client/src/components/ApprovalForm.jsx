import acceptImg from "../image/acceptImg.png";
import rejectImg from "../image/rejectImg.png";

import { useEffect, useState } from "react";

export default function ApprovalForm(props) {
  const [html, sethtml] = useState(<></>);
  const { data } = props;
  useEffect(() => {
    let list = data.map((data, i) => {
      return (
        <section
          key={i}
          className="bg-gradien-to-br relative flex   h-screen w-screen items-center justify-center bg-sbgImg from-gray-700 to-gray-900   bg-cover bg-no-repeat p-5 md:bg-mbgImg lg:bg-bbgImg">
          <div className="relative flex h-auto w-11/12 flex-col gap-y-1 rounded-md bg-[rgba(255,255,255,0.12)] p-3 hover:shadow-sm hover:shadow-gray-300 md:w-8/12 md:p-5 lg:w-6/12">
            <div className="text-center text-3xl font-bold text-teal-300">
              Approval Form
            </div>

            <img
              src={data.isAccept ? acceptImg : rejectImg}
              className={` mx-auto mt-2  h-28 w-28 rounded-full ${
                data.isAccept ? "bg-green-200" : "bg-red-200"
              }`}
              alt=""
            />

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center">
              <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                <span>Name</span>
                <span className="absolute right-0">:</span>
              </div>
              <h1 className=" borde w-full border-white text-[1.1rem] font-semibold text-white">
                {data.name}
              </h1>
            </div>

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center">
              <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                <span>Roll No</span>
                <span className="absolute right-0">:</span>
              </div>
              <h1 className=" borde w-full border-white text-[1.1rem] font-semibold text-white">
                {data.rollno}
              </h1>
            </div>

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center">
              <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                <span>Department</span>
                <span className="absolute right-0">:</span>
              </div>
              <h1 className=" borde w-full border-white text-[1.1rem] font-semibold  text-white">
                {data.department}
              </h1>
            </div>

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center ">
              <h1 className="borde relative my-auto w-full border-white text-[1.1rem] font-semibold text-teal-300">
                <span>Date</span>
                <span className="absolute right-0">:</span>
              </h1>
              <div>
                <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                  <h1>
                    From : <span className="text-white">{data.dateFrom}</span>
                  </h1>
                </div>

                <div className=" borde w-full border-white text-[1.1rem] font-semibold text-teal-300">
                  <h1>
                    to : <span className="text-white">{data.dateTo}</span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center ">
              <h1 className="borde relative my-auto w-full border-white text-[1.1rem] font-semibold text-teal-300">
                <span>Time</span>
                <span className="absolute right-0">:</span>
              </h1>
              <div>
                <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                  <h1>
                    From : <span className="text-white">{data.timeFrom}</span>
                  </h1>
                </div>

                <div className=" borde w-full border-white text-[1.1rem] font-semibold text-teal-300">
                  <h1>
                    To : <span className="text-white">{data.timeTo}</span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="borde mt-3 grid grid-cols-2 gap-5 border-white p-1  text-center">
              <div className="borde relative  my-auto block w-full border-white  text-[1.1rem] font-semibold text-teal-300">
                <span>Approval</span>
                <span className="absolute right-0">:</span>
              </div>
              <h1
                className={`borde mx-auto w-fit rounded-lg border-white bg-[rgb(64,180,64)] p-1 px-2 text-3xl   font-bold text-white ${
                  data.isAccept ? "bg-[rgb(64,180,64)]" : "bg-red-500"
                }`}>
                {data.isAccept ? "Accepted" : "Rejected"}
              </h1>
            </div>

            <div className="absolute -left-[3rem] -top-[4rem] -z-10 hidden h-[4rem] w-[4rem] rounded-full bg-gradient-to-tr from-red-300 to-red-500 opacity-70 md:h-[7rem] md:w-[7rem]"></div>
            <div className="absolute -bottom-[3rem] -right-[3rem] -z-10 hidden h-[6rem] w-[6rem] rounded-full bg-gradient-to-tr from-sky-300 to-sky-500 opacity-70"></div>
          </div>
        </section>
      );
    });
    sethtml(list);
  }, [data]);
  return <>{html}</>;
}

import axios from "axios";
import { useEffect, useState } from "react";

export default function Stdrandominfo({ data }) {
  function Infobox() {
    //console.log("siuva");
    const [list, setlist] = useState(data);
    async function deletereq(id) {
      console.log(data);
      const val = await axios.post(
        "http://localhost:3030/deleteReq",
        {
          id: id,
        },
        { withCredentials: true }
      );
      if (val.data.msg == "removed") {
        const data = list.data.filter((ele) => {
          return ele._id != id;
        });
        setlist({ data });

        // form ? setform(false) : setform(true);
      } else {
        alert("not");
      }
    }
    console.log(list);
    return list.data.map((ele) => {
      return (
        <>
          <div
            key={ele._id}
            className=" w-[100%] flex justify-center mt-[40px] overflow-hidden">
            <div className=" w-[390px] flex md:w-[900px] ">
              <div className=" w-[100%]  bg-slate-400 rounded-[12px] p-[20px] md:p-[30px] ">
                <ul
                  key={ele._id}
                  className="w-[100%] leading-[30px] md:leading-[40px] ">
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">name</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.name}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">roll number</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.rollno}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">year</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.year}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">department</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.department}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize">DateFrom</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.dateFrom}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize">DateTO</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.dateTo}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">Phone number</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.phNo}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize">Reason</p>
                    <p className="w-[300%] ">
                      <span>: </span>
                      {ele.reason}
                    </p>
                  </li>
                  <li className="w-[100%]  grid grid-cols-4">
                    <p className="w-[100%] capitalize ">request status</p>
                    <p
                      className={`w-[300%] font-bold ${
                        ele.isAccept ? "text-[green]" : "text-[red]"
                      }`}>
                      <span>: </span>
                      {ele.isAccept
                        ? "accepted"
                        : ele.isWait
                        ? "pending"
                        : "rejected"}
                    </p>
                  </li>
                </ul>
                <div className="w-[100%] text-center">
                  <button
                    className="w-[90px] rounded-[8px] p-[6px] bg-red-600 text-white"
                    onClick={() => {
                      const val = confirm("Are you sure to delete?");
                      val ? deletereq(ele._id) : "";
                    }}>
                    delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    });
  }
  return <Infobox />;
}

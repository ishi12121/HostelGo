import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

export default function Stddetails(props) {
  //console.log("fsadf");

  // useEffect(() => {

  //   //console.log(datael);
  // }, []);

  // useEffect(() => {
  //   Createform();
  // }, [datael]);

  function Createform() {
    const [datael, setdata] = useState(false);
    axios
      .get("http://localhost:3030/getEmailid", {
        withCredentials: true,
      })
      .then((data) => {
        // console.log(data);
        axios
          .post("http://localhost:3030/checkreqStatus", {
            rollno: data.data,
          })
          .then((data) => {
            if (data.data == "exists") {
              //console.log(data.data);

              setdata(true);
              // console.log(data.data);
            } else {
              setdata(false);
            }
          });
      })
      .catch((e) => {
        console.log(e);
      });
    let initialData = {
      name: "",
      city: "",
      rollno: "",
      department: "",
      year: "",
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
      phNo: "",
      parentPhNo: "",
      reason: "",
    };
    const intial = useRef("");

    const [err, setError] = useState(false);
    const [noerr, setNoError] = useState(false);

    function checkValue() {
      for (let key in data) {
        if (!data[key]) {
          return false;
        }
      }
      return true;
    }

    function tConvert(time) {
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? "AM" : "PM";
        time[0] = +time[0] % 12 || 12;
      }
      return time.join("");
    }
    const handleSubmit = async () => {
      //console.log("siva");
      try {
        const verify = checkValue();
        if (verify) {
          data.timeFrom = tConvert(data.timeFrom);
          data.timeTo = tConvert(data.timeTo);
          const resData = await axios.post(
            "http://localhost:3030/OpDetails",
            {
              data: data,
            },
            { withCredentials: true }
          );
          setNoError(true);
          //console.log(resData.data);
        } else {
          setError(true);
        }
        setTimeout(() => {
          setError(false);
          setNoError(false);
        }, 3000);
      } catch (err) {
        console.log(err.message);
      }
    };
    const [data, setData] = useState(initialData);
    function handleChange(e) {
      //console.log(data.name);
      setData({ ...data, [e.target.name]: e.target.value });
    }
    return (
      <div className="grid min-h-[calc(100%)] w-[100%] place-content-center">
        <div className="mx-auto mb-10 mt-8 h-auto w-[90%] rounded-[12px] bg-[rgba(143,163,218,0.53)] px-[10px] py-[20px] shadow-2xl md:w-[600px] md:px-[20px]">
          <form className="grid w-full grid-cols-1 gap-2 md:gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <label
                  htmlFor="from"
                  className="mt-1 font-semibold text-gray-700 ">
                  Name
                </label>
                <br />
                <input
                  //ref={intial}
                  type="text"
                  className=" w-full rounded-lg p-0.5 px-2  "
                  placeholder=""
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                />
              </div>

              <div className="">
                <label
                  htmlFor="from"
                  className="mt-1 font-semibold text-gray-700">
                  RollNo
                </label>
                <br />
                <input
                  type="text"
                  placeholder="9204 *******"
                  className="forminput  w-full rounded-lg p-0.5 px-2 "
                  name="rollno"
                  value={data.rollno}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col ">
              <h1 className="text-md font-bold text-blue-800">Date :</h1>
              <div className="grid grid-cols-2 gap-3">
                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    From
                  </label>
                  <br />
                  <input
                    type="date"
                    value={data.dateFrom}
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="dd/mm/yyyy"
                    name="dateFrom"
                    onChange={handleChange}
                  />
                </div>

                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    To
                  </label>
                  <br />
                  <input
                    value={data.dateTo}
                    type="date"
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="dd/mm/yyyy"
                    name="dateTo"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col ">
              <h1 className="text-md font-bold text-blue-800">Time :</h1>
              <div className="grid grid-cols-2 gap-3">
                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    From
                  </label>
                  <br />
                  <input
                    type="time"
                    value={data.timeFrom}
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="dd/mm/yyyy"
                    name="timeFrom"
                    onChange={handleChange}
                  />
                </div>

                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    To
                  </label>
                  <br />
                  <input
                    type="time"
                    value={data.timeTo}
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="dd/mm/yyyy"
                    name="timeTo"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className=" ">
              <div className="grid grid-cols-2 gap-3">
                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    Department
                  </label>
                  <br />
                  <input
                    type="text"
                    value={data.department}
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="CSE"
                    name="department"
                    onChange={handleChange}
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="from"
                    className="  font-semibold text-gray-700">
                    Year
                  </label>
                  <br />
                  <select
                    name="year"
                    value={data.year}
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    onChange={handleChange}
                    id="">
                    <option value=""></option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="">
              <div className="grid grid-cols-2 gap-3">
                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    PhoneNumber
                  </label>
                  <br />
                  <input
                    value={data.phNo}
                    type="number"
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="123457890"
                    name="phNo"
                    onChange={handleChange}
                  />
                </div>

                <div className="">
                  <label htmlFor="from" className="font-semibold text-gray-700">
                    Parent PhNo
                  </label>
                  <br />
                  <input
                    value={data.parentPhNo}
                    type="number"
                    className="forminput w-full rounded-lg p-0.5 px-2"
                    placeholder="123457890"
                    name="parentPhNo"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="">
              <label htmlFor="from" className=" font-semibold text-gray-700">
                City
              </label>
              <br />
              <input
                value={data.city}
                type="text"
                className="forminput   w-full rounded-lg p-0.5 px-2 "
                placeholder=""
                name="city"
                onChange={handleChange}
              />
            </div>

            <div className=" w-full">
              <label htmlFor="reason">Reason for leave</label>
              <textarea
                value={data.textarea}
                name="reason"
                onChange={handleChange}
                className="h-[60px] w-full resize-none rounded-[8px] border border-[black] px-[10px] py-[2px] outline-none"></textarea>
            </div>

            <div className="mt-[8px] flex gap-[3px]">
              <input type="checkbox" className="" required />
              <span className="flex flex-nowrap capitalize ">
                check if you have parent permission
              </span>
            </div>

            {err ? (
              <div className="text-center font-semibold text-[red]">
                Enter Valid Information{" "}
              </div>
            ) : (
              ""
            )}

            {noerr ? (
              <div className="text-center font-semibold text-[green]">
                Request Succefully Sent !!!
              </div>
            ) : (
              ""
            )}

            <div className="mt-[10px] w-full text-center">
              <button
                type="button"
                onClick={handleSubmit}
                className={
                  datael
                    ? "w-[90px] rounded-[8px] border-2 border-green-100 pointer-events-none bg-green-300 font-semibold text-white "
                    : "w-[90px] rounded-[8px] border-2 border-[green] bg-[green] font-semibold text-white transition-all  duration-200 hover:scale-110 hover:bg-[green] hover:text-[white] hover:shadow-sm hover:shadow-black hover:transition-all hover:duration-200 active:scale-105"
                }>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <>
      <Createform />
    </>
  );
}

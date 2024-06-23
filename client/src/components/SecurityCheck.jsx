import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApprovalForm from "./ApprovalForm";
import SmallLoader from "./SmallLoader";

export default function SecurityCheck() {
  const navigate = useNavigate();
  const [html, sethtml] = useState(<></>);
  // const [rollno, setRollno] = useState("");
  const [data, setData] = useState({});
  const [err, setErr] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [afterData, setAfterData] = useState(false);
  let val;

  //   let rollnoo;
  const handleChange = (e) => {
    val = e.target.value;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (val) {
        const resData = await axios.post(
          "http://localhost:3030/OpDetailsById",
          {
            rollno: val,
          }
        );
        const orgData = resData.data;
        //console.log(orgData);
        if (orgData.data) {
          console.log("accep");
          setData(orgData);
          setAfterData(true);
          setLoading(false);
        } else {
          setLoading(false);
          setErr(true);
          setTimeout(() => {
            setErr(false);
          }, 2000);
          setAfterData(false);
          console.log("Enter Valid Rollno");
        }
      } else {
        setLoading(false);
        setErr(true);
      }
      setTimeout(() => {
        setErr(false);
      }, 2000);
    } catch (err) {
      console.log(err.message);
    }
  };

  function InputRollno() {
    //console.log("securitycheck");
    return (
      <>
        <section className="box-border flex h-screen w-screen items-center justify-center">
          <div className="flex h-[250px] w-[300px] flex-col items-center justify-center rounded-lg bg-blue-300 shadow-md shadow-black md:w-[400px]">
            <h1 className="text-2xl font-semibold text-violet-700 ">
              Enter Student RollNo
            </h1>
            <input
              onChange={handleChange}
              type="text"
              placeholder="Rollno"
              className="mt-5 rounded-lg border-2 border-violet-700 p-3 shadow-sm shadow-black outline-none  "
            />
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="mt-5 w-[90px] rounded-[8px] border-2 border-violet-600 bg-violet-600 p-2 font-semibold text-white  transition-all duration-200 hover:scale-110 hover:bg-violet-600 hover:text-[white] hover:shadow-sm hover:shadow-black hover:transition-all hover:duration-200 active:scale-105">
              Submit
            </button>

            {isLoading && <SmallLoader />}

            {err && (
              <p className="mt-3 text-center text-lg font-bold text-[red]">
                Enter Valid RollNo
              </p>
            )}
          </div>
        </section>
      </>
    );
  }
  useEffect(() => {
    const list = afterData ? (
      <ApprovalForm data={[data.data]} />
    ) : (
      <InputRollno />
    );
    sethtml(list);
  }, [isLoading, afterData]);
  return <>{html}</>;
}

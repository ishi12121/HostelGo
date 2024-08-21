import React from "react";
import Error404Animation from "../components/lottie-files/404Error.json";
import Lottie from "react-lottie";

const ErrorAnimationOptions = {
  loop: true,
  autoplay: true,
  animationData: Error404Animation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ErrorPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="sm:h-[500px] sm:w-[600px] md:h-[600px] md:w-[800px]">
        <Lottie options={ErrorAnimationOptions} height={400} width={500} />
      </div>
    </div>
  );
};

export default ErrorPage;

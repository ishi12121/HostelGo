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
    <>
      <Lottie options={ErrorAnimationOptions} height={600} width={800} />
    </>
  );
};

export default ErrorPage;

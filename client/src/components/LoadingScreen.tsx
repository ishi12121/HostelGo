import { useEffect, useState } from "react";
import { Progress } from "../components/ui/progress";
import Lottie from "react-lottie";
import animationData from "./lottie-files/BounceLoader.json";

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  const options = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 33.33;
        if (newProgress >= 100) {
          clearInterval(timer);
        }
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center z-50 ${
        progress < 100 ? "flex" : "hidden"
      }`}
    >
      <div className="sm:h-[500px] sm:w-[600px] md:h-[600px] md:w-[800px]">
        <Lottie options={options} height={200} width={200} />
      </div>

      <div className="mt-8 w-full max-w-md px-4 sm:px-6 md:px-8">
        <Progress
          value={progress}
          className="bg-gray-300 h-6 rounded-lg overflow-hidden shadow-lg"
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </Progress>
      </div>
    </div>
  );
};

export default LoadingScreen;

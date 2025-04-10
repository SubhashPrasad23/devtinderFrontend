import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";

const Loading = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-40 w-36">
        <Lottie animationData={loadingAnimation} />
      </div>
    </div>
  );
};

export default Loading;

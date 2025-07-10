"use client"; 
import Lottie from "lottie-react";
import animationdata from "@/app/animation/bar";

const LottieAnimation = () => {
    return (
        <div className="flex justify-center items-center h-24"> 
            <Lottie animationData={animationdata} loop={true} />
        </div>
    );
};

export default LottieAnimation;

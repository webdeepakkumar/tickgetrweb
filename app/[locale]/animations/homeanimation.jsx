"use client"; 
import Lottie from "lottie-react";
import animationdata from "@/app/animation/home";

const LottieAnimation = () => {
    return <Lottie animationData={animationdata} loop={true} />;
};
export default LottieAnimation;

import React from "react";
import Transition from "@/app/[locale]/animations/transition2";
import { GoPlus } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiErrorCircle } from "react-icons/bi";

const TwoBtnPopup = ({
  iconType,
  title,
  description,
  onClose,
  onConfrim,
  onCloseText,
  onConfrimText,
}) => {
  let icon;
  switch (iconType) {
    case "logout":
      icon = <RiLogoutCircleRLine />;
      break;
    case "delete":
      icon = <FaRegTrashCan />;
      break;
    case "Error":
      icon = <BiErrorCircle />;
      break;
    default:
      icon = null;
  }

  return (
    <Transition className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
      <div className="bg-white text-center font-normal p-5 pt-10 rounded-2xl shadow-lg relative flex flex-col justify-center items-center gap-2 w-[300px] md:w-[350px]">
        <div className="bg-red-100 text-red-500 w-16 h-16 md:w-20 md:h-20 my-4 md:my-5 rounded-full flex justify-center items-center text-4xl md:text-5xl">
          {icon}
        </div>
        <h2 className="text-3xl font-oswald text-black capitalize">{title}</h2>
        <h3 className="mb-4 text-black text-sm">{description}</h3>
        <div className="w-full mt-4 space-y-2 font-medium text-base">
          <button
            className="py-3 w-full bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            onClick={onConfrim}
          >
            {onConfrimText}
          </button>
          <button
            className="py-3 w-full bg-zinc-200 text-black rounded-lg hover:bg-zinc-300 transition-all"
            onClick={onClose}
          >
            {onCloseText}
          </button>
        </div>
        <button
          className="text-3xl mt-3 mr-2 rotate-45 absolute top-0 right-0 text-zinc-400"
          onClick={onClose}
        >
          <GoPlus />
        </button>
      </div>
    </Transition>
  );
};

export default TwoBtnPopup;

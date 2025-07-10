import React from "react";
import Transition from "@/app/[locale]/animations/transition2";
import ButtonWithLoading from "./button/loadingButton";
import { GoPlus } from "react-icons/go";

const PopupForm = ({
  children,
  onClose,
  title,
  description,
  onSubmit,
  disabled,
  buttonText,
}) => {
  return (
    <Transition className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white font-normal p-5 md:p-6 rounded-2xl shadow-lg relative flex flex-col w-[300px] md:w-[400px] max-h-[600px]">
        <div className="space-y-2 border-b border-zinc-200 pb-3 mb-4">
          <h2 className="text-3xl font-oswald text-tg-orange2">{title}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
        <div className="overflow-y-auto flex flex-1 flex-col w-full no-scrollbar">
          <form className="pt-2 space-y-5" onSubmit={onSubmit}>
            {children}
            <ButtonWithLoading
              className="w-full inline-flex justify-center items-center bg-black text-white rounded-lg hover:bg-zinc-800 p-3 transition"
              isDisabled={disabled}
              buttonText={buttonText}
              isLoadingText={buttonText}
              isLoading={disabled}
            />
          </form>
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

export default PopupForm;

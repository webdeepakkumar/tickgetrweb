"use client";
import React, { useState } from "react";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import HomeBtn from "@/app/[locale]/components/homeBtn";
import TgLogo from "@/app/[locale]/components/logo";
import Transition from "@/app/[locale]/animations/transition";
import { FaArrowRight } from "react-icons/fa6";
import toast from "react-hot-toast";

import { forgetPassword } from "@/app/(Api)/firebase/firebase_auth";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const ForgotPassword = () => {
  const t = useTranslations("forgot_password");

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e) => {
    setIsLoading(true);

    e.preventDefault();
    try {
      const response = await forgetPassword(email.toLowerCase());

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setIsLoading(false);
      router.push("/login");
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white lg:bg-zinc-100 text-black">
      <HomeBtn />
      <Transition className="bg-white lg:shadow-lg rounded-xl flex flex-col items-center w-full lg:w-[450px] p-6 md:p-14">
        <TgLogo className="w-48 h-max" />
        <div className="text-center mt-12 mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-2">
            {t("title")}
          </h1>
          <h2 className="text-neutral-500 text-sm">{t("description")}</h2>
        </div>
        <form
          className="flex flex-col items-center gap-3 w-full"
          onSubmit={handleForgotPassword}
        >
          <input
            className="w-full py-3 px-4 focus:outline-none rounded-md bg-zinc-100"
            placeholder={t("email_placeholder")}
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("reset_password_button")}
            isDisabled={isLoading}
            buttonText={t("reset_password_button")}
            className="flex justify-center items-center w-full p-3 focus:outline-none rounded-md bg-tg-orange mt-2 text-white font-medium hover:bg-tg-orange-hover transition-all"
          />
        </form>
        <Link
          className="inline-flex items-center gap-2 font-medium text-neutral-600 text-sm mt-7 hover:text-tg-orange "
          href="/login"
        >
          {t("go_back_to_login")}
          <FaArrowRight />
        </Link>
      </Transition>
    </div>
  );
};

export default ForgotPassword;

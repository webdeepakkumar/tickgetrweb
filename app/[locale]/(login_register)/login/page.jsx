"use client";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import TgLogo from "@/app/[locale]/components/logo";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import Transition from "@/app/[locale]/animations/transition";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/(Api)/firebase/firebase";
import { handleGoogleSignIn } from "@/app/(Api)/firebase/firebase_auth";
import { FaGoogle } from "react-icons/fa";
import HomeBtn from "@/app/[locale]/components/homeBtn";
import {
  addUserToFirestore,
  checkUserExists,
} from "../../../(Api)/firebase/firebase_firestore";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import axios from "axios";

const Login = () => {
  const t = useTranslations("login");

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [userInfo, setuserInfo] = useState({
    uName: "",
    uEmail: "",
    ibannumber:"",
    organizationType: "",
    organizationName: "",
    organizationWebsite: "",
    organizationLogo: "",
    organizerPhoneNumber: "",
    invoiceCountry: "",
    invoicePostalCode: "",
    invoiceStreet: "",
    invoiceNumber: "",
    accountCreated: false,
  });

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const userExists = await checkUserExists(userInfo.uEmail.toLowerCase());
      if (!userExists) {
        toast.error("User Does Not Exist!");
        setIsLoading(false);
        return;
      }

      try {
        const res = await signInWithEmailAndPassword(
          userInfo.uEmail.toLowerCase(),
          password
        );
        if (res.user) {
          toast.success("Login successful!");
        } else {
          toast.error("Login UnSuccessful!");
        }
      } catch (error) {
        toast.error("Email or password incorrect!");
      }
      setIsLoading(false);
      router.push("/user/my-events");
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await handleGoogleSignIn();

      if (!userCredential) {
        return;
      }

      if (userCredential) {
        const user = userCredential.user;
        const name = user.displayName || user.email.split("@")[0];
        const { email } = user;

        const updatedUserInfo = {
          ...userInfo,
          uName: name,
          uEmail: email,
        };

        const userExists = await checkUserExists(email.toLowerCase());
        if (!userExists) {
          await addUserToFirestore(user.uid, updatedUserInfo);
          toast.success("User registered successfully!");
          try {
            await axios.post("/api/send-email", {
              to: email,
              uName: name,

              tUID: process.env.NEXT_PUBLIC_MAILTRAP_WELCOME_TID,
            });
          } catch (error) {
            toast.error(`Sending email to: ${to} unsuccessful ${error}`);
          }
        } else {
          // toast.success("Login Successfull!");
        }
      } else {
        toast.error("User credential is undefined");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white lg:bg-zinc-100 text-black">
      <HomeBtn />
      <Transition className="bg-white lg:shadow-lg rounded-xl flex flex-col items-center w-full lg:w-[450px] p-6 md:p-14">
        <TgLogo className="w-48 h-max" />
        <div className="text-center mt-12 mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-1">
            {t("welcome_back")}
          </h1>
          <h2 className="text-neutral-500 text-sm">{t("manage_events")}</h2>
        </div>
        <form
          className="flex flex-col items-center gap-3 w-full"
          onSubmit={handleLogin}
        >
          <input
            className="w-full py-3 px-4 focus:outline-none rounded-md bg-zinc-100"
            placeholder={t("email_placeholder")}
            value={userInfo.uEmail}
            required={true}
            onChange={(e) =>
              setuserInfo({
                ...userInfo,
                uEmail: e.target.value,
              })
            }
          />
          <div className="relative w-full">
            <input
              className="w-full py-3 px-4 focus:outline-none rounded-md bg-zinc-100"
              type={passwordVisible ? "text" : "password"}
              placeholder={t("password_placeholder")}
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="text-neutral-300 text-xl absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <Link
            className="text-sm my-3 text-neutral-600 hover:text-tg-orange transition-all"
            href="/forgot-password"
          >
            {t("forgot_password")}
          </Link>
          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("login_button")}
            isDisabled={isLoading}
            buttonText={t("login_button")}
            className="flex items-center justify-center w-full p-3 focus:outline-none rounded-md bg-tg-orange  text-white font-medium hover:bg-tg-orange-hover transition-all"
          />
        </form>
        <button
          className="inline-flex justify-center items-center mt-3 w-full p-3 rounded-md border-2 border-neutral-300 focus:outline-none bg-white text-neutral-500 font-medium hover:bg-black hover:text-white hover:border-black transition-all"
          onClick={handleGoogleSubmit}
        >
          <span className="inline-flex gap-4 items-center">
            <FaGoogle className="text-2xl" />
            {t("login_with_google")}
          </span>
        </button>
        <Link className="text-sm mt-7" href="/register">
          {t("no_account")}
          <span className="text-tg-orange ml-2">{t("register")}</span>
        </Link>
      </Transition>
    </div>
  );
};

export default Login;

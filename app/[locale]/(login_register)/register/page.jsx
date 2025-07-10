"use client";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa6";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import TgLogo from "@/app/[locale]/components/logo";
import Transition from "@/app/[locale]/animations/transition";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/(Api)/firebase/firebase";
import axios from "axios";
import {
  addUserToFirestore,
  checkUserExists,
} from "@/app/(Api)/firebase/firebase_firestore";
import HomeBtn from "@/app/[locale]/components/homeBtn";
import { handleGoogleSignIn } from "@/app/(Api)/firebase/firebase_auth";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const Register = () => {
  const t = useTranslations("register");

  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [userInfo, setuserInfo] = useState({
    uName: "",
    uEmail: "",
    organizationType: "",
    ibannumber:"",
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

  const handleRegister = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        userInfo.uEmail.toLowerCase(),
        password
      );

      const userExists = await checkUserExists(userInfo.uEmail.toLowerCase());
      if (userExists) {
        toast.error("User with this email already exists.");
        setIsLoading(false);
        return;
      }
      if (!res || !res.user) {
        toast.error("Error registering user!");
        setIsLoading(false);
        return;
      }
      const user = res.user;

      await addUserToFirestore(user.uid, {
        ...userInfo,
        uEmail: userInfo.uEmail.toLowerCase(),
      });
      router.push("/login")
      toast.success("User registered successfully!");
      try {
        await axios.post("/api/send-email", {
          to: userInfo.uEmail,
          uName: userInfo.uName,

          tUID: process.env.NEXT_PUBLIC_MAILTRAP_WELCOME_TID,
        });
      } catch (error) {
        toast.error(`Sending email to: ${to} unsuccessful ${error}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error registering user ", error);
    }
  };

  const LoginAndregisterWithGoogle = async (e) => {
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
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white lg:bg-zinc-100 text-black">
      <HomeBtn />
      <Transition className="bg-white lg:shadow-lg rounded-xl flex flex-col items-center w-full lg:w-[450px] p-6 md:p-14">
        <TgLogo className="w-48 h-max" />
        <div className="text-center mt-12 mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-1">
            {t("create_account")}
          </h1>
          <h2 className="text-neutral-500 text-sm">{t("join_us")}</h2>
        </div>
        <form
          className="flex flex-col items-start gap-3 w-full"
          onSubmit={handleRegister}
        >
          <input
            className="w-full py-3 px-4 focus:outline-none rounded-md bg-zinc-100"
            placeholder={t("name_placeholder")}
            value={userInfo.uName}
            required={true}
            onChange={(e) =>
              setuserInfo({
                ...userInfo,
                uName: e.target.value,
              })
            }
          />
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

          <div className="inline-flex font-normal text-xs mt-3 mb-1 gap-2 text-zinc-500">
            <div className="w-max">
              <input
                id="terms"
                type="checkbox"
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="checkbox"
              />
            </div>
            <label htmlFor="terms" className="cursor-pointer">
              {t("terms_agreement")}
              <a href="/terms" className="text-orange-400 underline">
                {t("t_c")}
              </a>
            </label>
          </div>
          <div className="inline-flex font-normal text-xs mb-1 gap-2 text-zinc-500">
            <div className="w-max">
              <input
                id="privacy"
                type="checkbox"
                onChange={(e) => setCookiesAccepted(e.target.checked)}
                className="checkbox"
              />
            </div>
            <label htmlFor="privacy" className="cursor-pointer">
              {t("cookies_accept1")}{" "}
              <a href="/privacy" className="text-orange-400 underline">
                cookies
              </a>{" "}
              {t("cookies_accept2")}
            </label>
          </div>

          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("register_button")}
            isDisabled={isLoading || !termsAgreed || !cookiesAccepted}
            buttonText={t("register_button")}
            className={`flex items-center justify-center w-full p-3 focus:outline-none rounded-md font-medium transition-all ${
              !termsAgreed || !cookiesAccepted
                ? "bg-zinc-200 cursor-not-allowed"
                : "bg-tg-orange text-white hover:bg-tg-orange-hover"
            }`}
          />
        </form>
        <button
          className={`inline-flex justify-center items-center mt-3 w-full p-3 rounded-md border-2 transition-all ${
            !termsAgreed || !cookiesAccepted
              ? "bg-zinc-200 border-neutral-200 font-medium cursor-not-allowed"
              : "border-neutral-300 focus:outline-none bg-white text-neutral-500 font-medium hover:bg-black hover:text-white hover:border-black"
          }`}
          onClick={LoginAndregisterWithGoogle}
          disabled={!termsAgreed || !cookiesAccepted}
        >
          <span className="inline-flex gap-4">
            <FaGoogle className="text-2xl" />
            {t("register_with_google")}
          </span>
        </button>
        <Link className="text-sm mt-7" href="/login">
          {t("already_have_account")}
          <span className="text-tg-orange ml-2">{t("login")}</span>
        </Link>
      </Transition>
    </div>
  );
};

export default Register;

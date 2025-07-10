"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/app/[locale]/context/adminAuthContext";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import TgLogo from "../../../components/logo";
import Transition from "../../../animations/transition";
import ButtonWithLoading from "../../../components/button/loadingButton";
import HomeBtn from "../../../components/homeBtn";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const Login = () => {
  const t = useTranslations("admin");

  const router = useRouter();

  const { setAdmin } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const admin = { email, password };
      localStorage.setItem("admin", JSON.stringify(admin));
      setAdmin(admin);
      toast.success(t("adminLogin.loginToast"));
      router.replace("/admin/dashboard");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      alert(t("adminLogin.invalidCredentials"));
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-900 md:bg-zinc-800 text-white">
      <HomeBtn colors="bg-zinc-950 hover:bg-zinc-950" />
      <Transition className="h-full w-full flex justify-center items-center">
        <div className="bg-zinc-900 lg:shadow-lg rounded-xl flex flex-col items-center w-full md:w-[450px] p-6 md:p-14">
          <TgLogo className="w-40 h-max" logoText="white" logoEmblem="white" />
          <div className="text-center mt-9 pt-7 mb-8 border-t w-full border-zinc-600">
            <h1 className="text-2xl font-oswald tracking-tight text-zinc-300">
              {t("adminLogin.adminAccess")}
            </h1>
          </div>
          <form
            className="flex flex-col items-center gap-3 w-full"
            onSubmit={handleLogin}
          >
            <input
              className="admin-form-control"
              placeholder={t("adminLogin.emailPlaceholder")}
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <input
                className="admin-form-control"
                type={passwordVisible ? "text" : "password"}
                placeholder={t("adminLogin.passwordPlaceholder")}
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="text-zinc-600 text-xl absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
            <ButtonWithLoading
              isLoading={isLoading}
              isLoadingText={t("adminLogin.loginLoadingText")}
              isDisabled={isLoading}
              buttonText={t("adminLogin.loginButton")}
              className="inline-flex justify-center items-center w-full admin-form-button"
            />
          </form>
        </div>
      </Transition>
    </div>
  );
};

export default Login;

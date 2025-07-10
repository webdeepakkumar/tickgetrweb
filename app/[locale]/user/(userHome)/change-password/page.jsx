"use client";
import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { updateUserPassword } from "@/app/(Api)/firebase/firebase_auth";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import Transition4 from "@/app/[locale]/animations/transition4";

import { useAuth } from "@/app/[locale]/context/authContext";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const ChangePassword = () => {
  const t = useTranslations("change_password");

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setNewPassword("");
  };

  const handleChangePassword = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    await updateUserPassword(email.toLowerCase(), password, newPassword);
    setIsLoading(false);
    resetFields();
  };

  return (
    <Transition4 className="flex flex-col w-full h-full gap-4 md:p-0 p-3">
      <h2 className="text-3xl font-oswald mb-5">
        {t("change_password_title")}
      </h2>
      <div className="flex flex-col items-center md:border-2 border-zinc-300 md:rounded-lg md:p-6 w-full md:w-1/2 gap-10">
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col gap-3 font-normal text-black w-full"
        >
          <div>
            <label className="form-label">{t("email_label")}</label>
            <input
              className="form-control"
              placeholder={t("email_label")}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">{t("current_password_label")}</label>
            <div className="inline-flex items-center relative w-full">
              <input
                className="form-control"
                type={passwordVisible ? "text" : "password"}
                placeholder={t("current_password_placeholder")}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="text-zinc-300 text-xl -mt-1 absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">{t("new_password_label")}</label>
            <div className="inline-flex items-center relative w-full">
              <input
                className="form-control"
                type={passwordVisible ? "text" : "password"}
                placeholder={t("new_password_placeholder")}
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="text-zinc-300 text-xl -mt-1 absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>
          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("submit_button_text")}
            isDisabled={isLoading}
            buttonText={t("submit_button_text")}
            className="flex items-center justify-center w-full p-3 focus:outline-none rounded-md bg-tg-orange text-white font-medium hover:bg-tg-orange-hover transition-all mt-3"
          />
        </form>
      </div>
    </Transition4>
  );
};

export default ChangePassword;

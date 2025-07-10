"use client";

import React, { useState } from "react";
import TwoBtnPopup from "@/app/[locale]/components/TwoBtnPopup";
import { deleteUserAccount } from "@/app/(Api)/firebase/firebase_firestore";
import Transition4 from "@/app/[locale]/animations/transition4";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { signOutUser } from "@/app/(Api)/firebase/firebase_auth";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";

const DeleteAccount = () => {
  const t = useTranslations("deleteAccount");

  const router = useRouter();
  const { user } = useAuth();

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setShowDeletePopup(false);
    setIsLoading(true);

    const result = await deleteUserAccount(user);

    if (result === false) {
      setIsLoading(false);
      setShowSessionExpiredPopup(true);
    } else {
      setIsLoading(false);
      router.replace("/");
    }
  };

  const handleReLogin = async () => {
    await signOutUser(user);
    setIsLoading(false);
    setShowSessionExpiredPopup(false);
    router.push("/login");
  };

  if (user)
    return (
      <Transition4 className="flex flex-col w-full h-full gap-4 md:p-0 p-3">
        <h2 className="text-3xl text-red-600 font-oswald mb-3">
          {t("delete_account_title")}
        </h2>
        <div className="flex flex-col md:border-2 border-zinc-300 md:rounded-lg md:p-6 w-full gap-3 pb-10">
          <p>{t("delete_account_warning")}</p>
          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("delete_account_button_text")}
            isDisabled={isLoading}
            buttonText={t("delete_account_button_text")}
            onClick={() => setShowDeletePopup(true)}
            className="w-max p-3 focus:outline-none rounded-md bg-red-400 text-white font-medium hover:bg-red-500 transition-all mt-5"
          />
        </div>
        {showDeletePopup && (
          <TwoBtnPopup
            iconType="delete"
            title={t("delete_account_title")}
            description={t("delete_account_popup_description")}
            onClose={() => setShowDeletePopup(false)}
            onConfrim={handleDeleteAccount}
            onConfrimText={t("delete_account_popup_confirm_text")}
            onCloseText={t("delete_account_popup_close_text")}
          />
        )}
        {showSessionExpiredPopup && (
          <TwoBtnPopup
            iconType="Error"
            title={t("session_expired_title")}
            description={t("session_expired_description")}
            onClose={() => setShowSessionExpiredPopup(false)}
            onConfrim={handleReLogin}
            onConfrimText={t("session_expired_confirm_text")}
            onCloseText={t("session_expired_close_text")}
          />
        )}
      </Transition4>
    );
};

export default DeleteAccount;

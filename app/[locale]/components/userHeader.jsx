"use client";

import TgLogo from "./logo";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import LanguageDropDown from "./languageDropDown";
import TwoBtnPopup from "./TwoBtnPopup";
import { useAuth } from "../context/authContext";
import { signOutUser } from "@/app/(Api)/firebase/firebase_auth";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function UserHeader({ isOpen, setIsOpen }) {
  const t = useTranslations("userHeader");

  const { user } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = async () => {
    if (user) {
      await signOutUser(user);
    }
  };

  return (
    <nav className="w-full font-medium inline-flex justify-between items-center px-5 md:px-12 h-[80px] text-black bg-zinc-800">
      <div className="inline-flex items-center gap-4">
        <button
          className="flex flex-col gap-1 lg:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <div className="h-[2px] w-[20px] bg-zinc-400 rounded-full"></div>
          <div className="h-[2px] w-[15px] bg-zinc-400 rounded-full"></div>
          <div className="h-[2px] w-[20px] bg-zinc-400 rounded-full"></div>
        </button>
        <Link href="/">
          <TgLogo
            className="w-36 md:w-32 h-max"
            logoText="white"
            logoEmblem="white"
            textDisplay="hidden md:block"
          />
        </Link>
      </div>
      <div className="relative inline-flex gap-2 text-white text-sm">
        <LanguageDropDown className="bg-zinc-900 rounded-lg inline-flex justify-center gap-1 items-center h-10 pl-3 pr-4 focus:outline-none hover:bg-zinc-950 transition-all" />
        <button
          className="bg-zinc-900 rounded-lg inline-flex items-center gap-2 h-10 px-4 hover:bg-red-500 transition-all overflow-hidden"
          onClick={() => {
            setShowLogoutPopup(true);
          }}
        >
          <FiLogOut className="text-lg md:block hidden" /> {t("logout")}
        </button>
        {showLogoutPopup && (
          <TwoBtnPopup
            iconType="logout"
            title={t("logout_confirmation_title")}
            description={t("logout_confirmation_description")}
            onClose={() => setShowLogoutPopup(false)}
            onConfrim={handleLogout}
            onConfrimText={t("confirm")}
            onCloseText={t("cancel")}
          />
        )}
      </div>
    </nav>
  );
}

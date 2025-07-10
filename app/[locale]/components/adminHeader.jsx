"use client";

import { AdminMenus } from "./adminSidebar";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import LanguageDropDown from "./languageDropDown";
import { useAdminAuth } from "../context/adminAuthContext";
import TwoBtnPopup from "./TwoBtnPopup";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

const DashHeader = () => {
  const t = useTranslations("admin");

  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

  const currentMenu = AdminMenus.find(
    (menu) => menu.path === normalizedPathname
  );
  const defaultTitle = currentMenu
    ? t(currentMenu.title)
    : t("adminDashboard.adminheader.titleNotFound");

  const title = searchParams.get("title") || defaultTitle;

  const { admin, setAdmin } = useAdminAuth();

  const handleLogout = async () => {
    if (admin) {
      localStorage.removeItem("admin");
      setAdmin(null);
      toast.success("Admin Logged Out!");
      router.replace("/admin");
    }
  };

  return (
    <div className="w-full py-1 mt-1 md:pl-20 lg:pl-0 flex md:justify-between justify-end text-white">
      <div className="text-3xl font-semibold hidden md:block">{title}</div>
      <div className="relative inline-flex gap-2 text-sm">
        <LanguageDropDown className="bg-zinc-900 rounded-lg inline-flex justify-center gap-1 items-center h-10 pl-3 pr-4 focus:outline-none hover:bg-zinc-950 transition-all" />
        <button
          className="bg-zinc-900 rounded-lg inline-flex justify-center gap-2 items-center h-10 px-4 hover:bg-red-500 transition-all"
          onClick={() => {
            setShowLogoutPopup(true);
          }}
        >
          <FiLogOut />
          {t("adminDashboard.adminheader.logout")}
        </button>
      </div>
      {showLogoutPopup && (
        <TwoBtnPopup
          iconType="logout"
          title={t("adminDashboard.adminheader.logoutConfirmationTitle")}
          description={t(
            "adminDashboard.adminheader.logoutConfirmationDescription"
          )}
          onClose={() => setShowLogoutPopup(false)}
          onConfrim={handleLogout}
          onConfrimText={t("adminDashboard.adminheader.yes")}
          onCloseText={t("adminDashboard.adminheader.no")}
        />
      )}
    </div>
  );
};

export default DashHeader;

"use client";

import { Menus } from "./dashSidebar";
import React from "react";
import LanguageDropDown from "./languageDropDown";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

const DashHeader = () => {
  const t = useTranslations("DashHeader");
  const header = useTranslations("dashSideBar");

  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

  const currentMenu = Menus.find((menu) => menu.path === normalizedPathname);

  const title = currentMenu ? header(currentMenu.title) : t("titleNotFound");

  return (
    <div className="w-full py-1 mt-1 md:pl-20 lg:pl-0 flex md:justify-between justify-end">
      <div className="text-3xl font-semibold hidden md:block">{title}</div>
      <div className="relative inline-flex gap-2 text-white text-sm">
        <Link
          className="bg-zinc-800 rounded-lg flex justify-center items-center h-10 px-4 hover:bg-zinc-900 transition-all"
          href="/user/my-events"
        >
          {t("myEvents")}
        </Link>
        <LanguageDropDown className="bg-zinc-800 rounded-lg inline-flex justify-center gap-1 items-center h-10 pl-3 pr-4 focus:outline-none hover:bg-zinc-900 transition-all" />
      </div>
    </div>
  );
};

export default DashHeader;

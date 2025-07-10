"use client";

import React, { useEffect } from "react";
import TgLogo from "./logo";
//sidebar menu icons
import { HiUsers } from "react-icons/hi2";
import { RiHome6Fill } from "react-icons/ri";
import { IoLogoFirebase } from "react-icons/io5";
import { MdPayments } from "react-icons/md";
import { IoMdAnalytics, IoMdListBox } from "react-icons/io";
import { BsPlusLg } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

const useClickOutside = (ref, callback) => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, callback]);
};

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const t = useTranslations("admin");

  const sidebarRef = React.createRef();
  useClickOutside(sidebarRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed z-40 lg:relative shadow-lg lg:shadow-none w-72 h-full bg-zinc-900 flex flex-col items-center justify-between transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="w-full ">
        <button
          className="lg:hidden absolute right-3 top-3 rotate-45 bg-white bg-opacity-10 text-lg p-1 rounded-full"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <BsPlusLg className="text-white" />
        </button>
        <div className="text-center font-oswald text-white py-3 bg-zinc-950 text-lg ">
          {t("adminDashboard.adminSideBar.adminPanel")}
        </div>
        <div className="w-full flex flex-col items-center gap-8 py-8 border-b border-zinc-700">
          <Link href="/">
            <TgLogo logoText="white" logoEmblem="white" className="w-32 h-8" />
          </Link>
        </div>
        <div className="w-full mt-6">
          <ul className="w-full">
            {AdminMenus.map((menu, index) => (
              <Link
                href={menu.path}
                key={index}
                onClick={handleLinkClick}
                className={`w-full inline-flex items-center py-3 gap-2 pl-12 font-medium text-md ${
                  normalizedPathname == menu.path
                    ? "text-orange-300 border-r-4 border-orange-300"
                    : "text-neutral-400 hover:text-zinc-900 hover:bg-zinc-300"
                } transition-all`}
              >
                <div className="text-xl">{menu.icon}</div>
                <div className="ml-2">{t(menu.title)}</div>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

export const AdminMenus = [
  {
    title: "adminDashboard.adminSideBar.overview",
    icon: <RiHome6Fill />,
    path: "/admin/dashboard",
  },
  {
    title: "adminDashboard.adminSideBar.events",
    icon: <IoMdListBox />,
    path: "/admin/dashboard/events",
  },
  {
    title: "adminDashboard.adminSideBar.organizers",
    icon: <HiUsers />,
    path: "/admin/dashboard/organizers",
  },
  {
    title: "adminDashboard.adminSideBar.database",
    icon: <IoLogoFirebase />,
    path: "/admin/dashboard/database",
  },
  {
    title: "adminDashboard.adminSideBar.payments",
    icon: <MdPayments />,
    path: "/admin/dashboard/payments",
  },
  {
    title: "adminDashboard.adminSideBar.analytics",
    icon: <IoMdAnalytics />,
    path: "/admin/dashboard/analytics",
  },
];

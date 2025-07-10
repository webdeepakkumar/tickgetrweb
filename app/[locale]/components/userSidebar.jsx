"use client";

import React, { useState, useEffect } from "react";
import { fetchOneUser } from "../../(Api)/firebase/firebase_firestore";
import { FaRectangleList } from "react-icons/fa6";
import { MdAddBox } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoMdDocument } from "react-icons/io";
import { BiSolidTrashAlt } from "react-icons/bi";
import Image from "next/image";
import { useAuth } from "../context/authContext";
import { MdOutlineHideImage } from "react-icons/md";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import TrustpilotWidget from "./TrustpilotWidget";
import { File } from "lucide-react";

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

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const t = useTranslations("userSideBar");

  const sidebarRef = React.createRef();
  useClickOutside(sidebarRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

  const { user } = useAuth();
  const [userId, setUserId] = useState();
  const [fetchUser, setFetchUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
    if (!user || user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        await fetchOneUser(userId, setFetchUser);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const userData = fetchUser[0];
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed z-40 lg:relative shadow-lg lg:shadow-none w-72 h-full bg-white flex flex-col items-center divide-y-1 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="relative py-6 px-5 inline-flex items-center w-full gap-3">
        <div className="h-14 w-14 bg-zinc-300 border-2 border-zinc-200 rounded-lg overflow-hidden flex justify-center items-center">
          {isLoading ? (
            <div className="animate-pulse bg-black/5 h-full w-full"></div>
          ) : userData && userData.organizationLogo ? (
            <img
              src={isLoading ? "" : userData?.organizationLogo}
              alt="Organization Logo"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <MdOutlineHideImage className="text-zinc-500 text-xl" />
          )}
        </div>
        <div>
          <div
            className={`font-medium ${
              isLoading && "animate-pulse bg-black/10 w-32 h-6 rounded"
            }`}
          >
            {isLoading ? "" : userData?.uName || "..."}
          </div>
          <div
            className={`text-sm text-zinc-500 ${
              isLoading && "animate-pulse bg-black/10 w-40 h-4 rounded mt-1"
            }`}
          >
            {isLoading
              ? ""
              : userData?.organizationName || t("no_organization")}
          </div>
        </div>
      </div>
      <div className="w-full pt-4">
        <ul className="w-full">
          {Menus.map((menu, index) => (
            <Link
              href={menu.path}
              key={index}
              onClick={handleLinkClick}
              className={`w-full inline-flex items-center py-3 gap-2 px-8 text-md ${
                normalizedPathname == menu.path
                  ? "text-tg-orange border-r-4 border-tg-orange"
                  : "text-neutral-400 hover:text-neutral-500 hover:bg-zinc-100"
              } transition-all`}
            >
              <div className="text-xl">{menu.icon}</div>
              <div className="ml-2">{t(menu.title)}</div>
            </Link>
          ))}
          
        </ul>
        <div className="mt-8">
          <TrustpilotWidget/>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

export const Menus = [
  {
    title: "my_events",
    icon: <FaRectangleList />,
    path: "/user/my-events",
  },
  {
    title: "create_event",
    icon: <MdAddBox />,
    path: "/user/create-event",
  },
  {
    title: "organization",
    icon: <FaAddressCard />,
    path: "/user/profile",
  },
  {
    title: "documents",
    icon: <File />,
    path: "/user/document",
  },
  {
    title: "change_password",
    icon: <BsFillShieldLockFill />,
    path: "/user/change-password",
  },
  {
    title: "delete_account",
    icon: <BiSolidTrashAlt />,
    path: "/user/delete-account",
  },
];

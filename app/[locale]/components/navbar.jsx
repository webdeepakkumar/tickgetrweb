"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/[locale]/context/authContext";
import TgLogo from "./logo";
import { motion, AnimatePresence } from "framer-motion";
import { BsPlusLg } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { signOutUser } from "../../(Api)/firebase/firebase_auth";
import TwoBtnPopup from "./TwoBtnPopup";
import LanguageDropDown from "./languageDropDown";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("navbar");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isloggedin, setIsloggedin] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");
  const { user } = useAuth();
  const isEventDetailPage = /^\/events\/[^/]+$/.test(normalizedPathname);

  useEffect(() => {
    setIsloggedin(!!user);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    if (user) {
      await signOutUser(user);
      setShowLogoutPopup(false);
    }
  };

  if (!isEventDetailPage)
    return (
      <nav
        className={`z-40 w-full inline-flex justify-between items-center px-5 md:px-8 lg:px-14 fixed top-0 left-0 transition-all duration-300 h-[80px] md:h-[90px] font-medium ${
          isScrolled
            ? " shadow-md bg-white"
            : pathname === "/solutions"
            ? " "
            : "border-b border-neutral-400"
        }`}
      >
        <Link className="w-[200px]" href="/">
          <TgLogo
            className="w-32 md:w-36 h-max"
            logoText="black"
            logoEmblem="url(#paint0_linear_212_24)"
          />
        </Link>
        <div className="text-lg uppercase lg:inline-flex gap-8 hidden font-oswald">
          {/* <Link
            className={`hover:text-tg-orange transition ${
              pathname === "/events" ? "text-tg-orange" : ""
            }`}
            href="/events"
          >
            {t("events")}
          </Link> */}
          <Link
            className={`hover:text-tg-orange transition ${
              pathname === "/solutions" ? "text-tg-orange" : ""
            }`}
            href="/solutions"
          >
            {t("solutions")}
          </Link>
          <Link
            className={`hover:text-tg-orange transition ${
              pathname === "/compare" ? "text-tg-orange" : ""
            }`}
            href="/compare"
          >
            {t("compare")}
          </Link>
          <Link
            className={`hover:text-tg-orange transition ${
              pathname === "/pricing" ? "text-tg-orange" : ""
            }`}
            href="/pricing"
          >
            {t("pricing")}
          </Link>
          <Link
            className={`hover:text-tg-orange transition ${
              pathname === "/contact" ? "text-tg-orange" : ""
            }`}
            href="/contact"
          >
            {t("contact")}
          </Link>
        </div>
        <div className="hidden lg:block">
          {isloggedin ? (
            <div className="w-max inline-flex items-center gap-5 justify-end">
              <Link
                className="hover:text-tg-orange2 transition"
                href="/user/my-events"
              >
                {t("myEvents")}
              </Link>
              <button
                className="px-5 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition"
                onClick={() => {
                  setShowLogoutPopup(true);
                }}
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="w-[200px] inline-flex items-center gap-5 justify-end">
              <Link
                className="hover:text-tg-orange2 transition"
                href="/register"
              >
                {t("register")}
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition"
              >
                {t("login")}
              </Link>
            </div>
          )}
        </div>
        <button
          className="flex flex-col items-end gap-1 lg:hidden"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <div className="h-[2px] w-[25px] bg-zinc-800 rounded-full"></div>
          <div className="h-[2px] w-[20px] bg-zinc-800 rounded-full"></div>
          <div className="h-[2px] w-[25px] bg-zinc-800 rounded-full"></div>
        </button>
        {/* responsive menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 right-0 bg-white w-full h-screen lg:hidden flex flex-col"
            >
              <div className="w-full h-[80px] md:h-[90px] flex justify-between items-center border-b p-6">
                <Link
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="w-[200px]"
                  href="/"
                >
                  <TgLogo
                    className="w-36 h-max"
                    logoText="black"
                    logoEmblem="url(#paint0_linear_212_24)"
                  />
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <BsPlusLg className="text-3xl rotate-45 -mr-2" />
                </button>
              </div>
              <div className="flex flex-col justify-between p-6 md:p-10 h-full flex-1">
                <div className="flex flex-col gap-10 pt-3">
                  <div className="flex flex-col gap-4 uppercase font-oswald text-3xl md:text-4xl">
                    <Link
                      className="transition"
                      href="/solutions"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("solutions")}
                    </Link>
                    <Link
                      className="transition"
                      href="/compare"
                      onClick={()=>{
                        setIsOpen(false)
                      }}
                    >
                      {t("compare")}
                    </Link>
                    <Link
                      className="transition"
                      href="/pricing"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("pricing")}
                    </Link>
                    <Link
                      className="transition"
                      href="/contact"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("contact")}
                    </Link>
                    <Link
                      className="transition"
                      href="/faqs"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("faqs")}
                    </Link>
                  </div>
                  {isloggedin ? (
                    <div className="inline-flex gap-2 pt-7 border-t-1">
                      <Link
                        href="/user/my-events"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="border-2 border-black py-2 px-5 rounded-xl md:text-lg"
                      >
                        {t("myEvents")}
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setShowLogoutPopup(true);
                        }}
                        className="py-2 px-5 rounded-xl text-red-500 border-2 border-red-500"
                      >
                        {t("logout")}
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex gap-2 pt-8 border-t-1">
                      <Link
                        href="/login"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="border-2 border-black py-2 px-5 rounded-xl md:text-lg"
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="py-2 px-5 rounded-xl text-tg-orange border-2 border-tg-orange"
                      >
                        {t("registerForFree")}
                      </Link>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 text-sm uppercase text-zinc-600">
                    <Link
                      className="transition"
                      href="/lost-ticket"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("lostTickets")}
                    </Link>
                    <Link
                      className="transition"
                      href="/terms"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("terms")}
                    </Link>
                    <Link
                      className="transition"
                      href="/privacy"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("privacy")}
                    </Link>
                    <Link
                      className="transition"
                      href="/refund"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {t("refund")}
                    </Link>
                  </div>
                </div>
                <div className="inline-flex justify-between items-center pb-2">
                  <div className="w-max gap-2 text-tg-orange text-lg hidden">
                    <a
                      href="https://google.com"
                      className="h-10 w-10 border bg-orange-100 rounded-xl flex items-center justify-center"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://google.com"
                      className="h-10 w-10 border bg-orange-100 rounded-xl flex items-center justify-center"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://google.com"
                      className="h-10 w-10 border bg-orange-100 rounded-xl flex items-center justify-center"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="https://google.com"
                      className="h-10 w-10 border bg-orange-100 rounded-xl flex items-center justify-center"
                    >
                      <FaXTwitter />
                    </a>
                  </div>
                  <LanguageDropDown className="bg-orange-100 rounded-lg inline-flex justify-center gap-1 items-center h-10 pl-3 pr-4 focus:outline-none text-tg-orange hover:bg-zinc-200 transition-all" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {showLogoutPopup && (
          <TwoBtnPopup
            iconType="logout"
            title={t("logout")}
            description={t("areYouSureLogout")}
            onClose={() => setShowLogoutPopup(false)}
            onConfrim={handleLogout}
            onConfrimText={t("yes")}
            onCloseText={t("no")}
          />
        )}
      </nav>
    );
}

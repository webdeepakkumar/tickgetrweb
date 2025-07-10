"use client";

import { Link } from "@/i18n/routing";
import { RxCross2 } from "react-icons/rx";
import { useTranslations } from "next-intl";

export default function CookieBanner({ setCookieConsent, cookieConsent }) {
  const t = useTranslations("cookieBanner");

  return (
    <div
      className={`md:m-10 m-5 md:w-[400px] items-center fixed bottom-0 md:right-0 z-40   ${
        cookieConsent !== null ? "hidden" : "flex"
      }  md:p-8 py-5 px-8 flex-col md:gap-7 gap-2 bg-black/70 backdrop-blur-lg text-white rounded-lg shadow`}
    >
      {/* <button
        className="absolute top-5 right-5"
        onClick={() => setCookieConsent(false)}
      >
        <RxCross2 className="text-2xl text-white" />
      </button> */}
      <div className="text-xl md:text-5xl md:mt-2">{t("title")}</div>
      <div className="text-sm md:text-lg lg:text-lg">
        {t("weUse")}{" "}
        <Link href="/privacy" className="font-medium text-orange-200">
          cookies
        </Link>{" "}
        {t("description")}{" "}
      </div>
      <div className="flex gap-3 md:text-lg text-sm">
        <button
          className="px-5 py-3 text-white rounded-md bg-zinc-950 border-gray-900"
          onClick={() => setCookieConsent(false)}
        >
          {t("declineButton")}
        </button>
        <button
          className="px-5 py-3 text-white bg-tg-orange rounded-lg"
          onClick={() => setCookieConsent(true)}
        >
          {t("acceptButton")}
        </button>
      </div>
    </div>
  );
}

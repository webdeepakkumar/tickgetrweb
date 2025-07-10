"use client";
import { useTranslations } from "next-intl";
import TgLogo from "@/app/[locale]/components/logo";
import { Link } from "@/i18n/routing";
export default function EventExpired() {
     const t = useTranslations("eventDisplay");
     const th = useTranslations("expiredevent")
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                 <Link
                     className="absolute top-0 right-0 m-3 md:m-6 flex flex-col items-end opacity-30"
                     href="/"
                   >
                     <div className="text-[10px] md:text-xs"> {t("powered_by")}</div>
                     <TgLogo
                       className=" w-24 md:w-28 h-7"
                       logoEmblem="white"
                       logoText="white"
                     />
                   </Link>
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-4">{th("eventpassed")}</h1>
          <p className="text-lg text-gray-400">{th("comebacklater")}</p>
        </div>
      </div>
    );
  }
  
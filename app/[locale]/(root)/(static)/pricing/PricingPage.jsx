"use client";
  
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import heademoji from "@/app/emoji/HeadExplodemoji.png"
import partyemoji from "@/app/emoji/PartyEmoji.png"
import Image from "next/image";

const Check = ({ listText }) => {
  return (
    <li className="inline-flex items-center gap-3 text-sm md:text-md">
      <div className="p-1 bg-white bg-opacity-20 rounded-full">
        <FaCheck className="text-white text-xs" />
      </div>
      {listText}
    </li>
  );
};

const Prices = () => {
  const t = useTranslations("pricing");

  return (
    <div className="w-full flex flex-col items-center pt-[120px] md:pt-[150px] px-5 md:px-12 lg:px-20 pb-28 md:gap-16 gap-10 bg-zinc-100">
      <div className="flex flex-col text-center items-center gap-5">
        <h1 className="text-4xl md:text-6xl font-oswald">
          {t("simplifiedPricing")}
        </h1>
        <h2 className="md:text-lg">
          {t("hostForFree")} 
          <span className="font-bold ">{t("hostForFree50%")}</span>
          <span>{t("hostForFree2")}</span>
        </h2>
      </div>

      <div className="flex flex-col-reverse justify-center md:flex-row gap-7 md:gap-5 w-full">
        {/* Left Card */}
        <div className="flex flex-col items-center gap-7 w-full md:w-[380px] bg-zinc-900 text-white rounded-2xl overflow-hidden p-6 md:p-7">
          <div className="font-oswald text-lg md:text-xl text-center mb-2 md:px-3">
            {t("getApp")}
          </div>
          <div className="w-full h-64 md:h-full bg-[url('/images/PriceMockup.png')] bg-contain bg-center bg-no-repeat"></div>
          <div className="inline-flex gap-2">
            <a
              className="inline-flex items-center bg-black hover:bg-red-400 rounded-lg p-3 pr-4 gap-2 transition-all"
              href={process.env.NEXT_PUBLIC_PLAY_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGooglePlay className="text-xl md:text-2xl" />
              <div>
                <div className="text-[10px] md:text-xs font-light">
                  {t("getItOn")}
                </div>
                <div className="leading-none text-sm md:text-md">
                  {t("googlePlay")}
                </div>
              </div>
            </a>
            <a
              className="inline-flex items-center bg-black hover:bg-red-400 rounded-lg p-3 pr-4 gap-2 transition-all"
              href={process.env.NEXT_PUBLIC_APPLE_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaApple className="text-2xl md:text-3xl" />
              <div>
                <div className="text-[10px] md:text-xs font-light">
                  {t("downloadOn")}
                </div>
                <div className="leading-none text-sm md:text-md">
                  {t("appStore")}
                </div>
              </div>
            </a>
          </div>
          <Link
            className="w-full py-3 md:py-4 text-center font-medium border-2 border-white hover:bg-transparent hover:border-white hover:text-white bg-white text-black rounded-lg cursor-pointer transition"
            href="/solutions"
          >
            {t("learnMore")}
          </Link>
        </div>

        {/* Right Card */}
        <div className="flex flex-col gap-6 w-full md:w-[380px] bg-gradient-to-br from-tg-orange to-tg-orange2 text-white rounded-2xl p-6 md:p-7">
          <div>
            <div className="text-xl font-medium">{t("fixedFee")}</div>
            <div className="text-sm text-white text-opacity-80 pt-2 pb-0">
              {t("singlePlan")}
            </div>
          </div>

          <div className="mb-2 w-full p-2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-full">
                    <div className="flex items-center justify-center relative w-full p-2">
                      <Image
                        src={partyemoji}
                        alt="Party Emoji"
                        width={80}
                        height={80}
                        className="w-14 h-14 relative top-4 md:top-6 lg:top-6 -rotate-12" 
                      />
                      <h1 className="font-bold text-5xl  md:text-6xl lg:text-7xl text-center mx-4 whitespace-nowrap">
                        € 0,35
                      </h1>
                      <Image
                        src={heademoji}
                        alt="Head Emoji"
                        width={80}
                        height={80}
                        className="w-14 h-14 rotate-12 relative -top-4 md:-top-6 lg:-top-6"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center text-sm text-white">
            <p>{t("pricing_fee")}</p>
          </div>

          <ul className="list-none w-full flex flex-col gap-2.5 my-5">
            <Check listText={t("securePaymentGateways")} />
            <Check listText={t("realTimeAnalytics")} />
            <Check listText={t("multipleTicketTypes")} />
            <Check listText={t("automatedReminders")} />
            <Check listText={t("seamlessRefundProcessing")} />
            <Check listText={t("scannerMobileApp")} />
            <Check listText={t("dataExport")} />
            <Check listText={t("supportService")} />
          </ul>

          <Link
            className="w-full py-3 md:py-4 text-center font-medium border-2 border-black hover:bg-transparent hover:border-white bg-black text-white rounded-lg cursor-pointer transition"
            href="/register"
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Prices;

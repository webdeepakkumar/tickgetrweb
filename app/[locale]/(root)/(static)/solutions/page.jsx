import React from "react";
import { Link } from "@/i18n/routing";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  LuTicket,
  LuTags,
  LuFileLineChart,
  LuSettings,
  LuSettings2,
  LuCalendarPlus,
} from "react-icons/lu";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
export async function generateMetadata({ params }) {
  const { locale } = params;
  if (locale === "nl") {
    return { 
      title: "Vergelijk Prijzen voor Evenemententickets | Tickgetr",
      description: "Vergelijk eenvoudig ticketplatforms met Tickgetr. Vind de beste prijs-kwaliteitoplossing door de prijzen van verschillende platforms naast elkaar te zetten.",
    };
  }

  return {
    title: "Online Ticket Solution | Tickgetr",
    description: "Easily compare ticket platforms with Tickgetr. Find the best price-quality solution by comparing prices from different platforms.",
  };
}

const Solutions = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  const lang = locale;

  const t = useTranslations("solutions");
  const th = useTranslations("compare")

  return (
    <div className="w-full text-black pt-[115px] md:pt-[90px]">
      {/* Hero banner */}
      <div className="w-full px-6">
        <div className="text-white bg-[url('/images/bg-texture.jpg')] md:bg-contain bg-center bg-no-repeat space-y-14 px-5 pt-5 md:pb-20 rounded-2xl relative overflow-hidden">
          <div className="absolute bg-tg-orange2 bg-opacity-95 inset-0 z-10"></div>
          <div className="flex flex-col items-center md:gap-3 gap-14 relative z-20">
            <h1 className="text-3xl md:text-5xl font-oswald text-center mb-5 leading-relaxed">
              {t("heroBanner.title")}
            </h1>
            <div className="md:flex-row flex flex-col md:gap-3 gap-5">
              <Link
                className="bg-black border-2 border-black text-white pl-5 pr-4 py-3 rounded-full hover:bg-zinc-900 hover:border-zinc-900 transition"
                href="/register"
              >
                {t("heroBanner.getStarted")}
                <span className="ml-1">&gt;</span>
              </Link>
              <Link
                className="bg-white border-2 border-white hover:text-white hover:bg-tg-orange2 pl-5 pr-4 py-3 rounded-full text-center  text-tg-orange2 transition"
                href="/pricing"
              >
                {t("heroBanner.seePricing")}
                <span className="ml-1">&gt;</span>
              </Link>
            </div>
          </div>
          <div
            className={`w-full md:h-[600px] h-[320px] mt-5 rounded-xl bg-[url('/images/laptop-mock.png')] bg-contain bg-center bg-no-repeat relative z-20`}
          />
        </div>
      </div>
      <div className="w-full lg:container mx-auto p-3">
        {/* Most trusted */}
        {/* <div className="md:flex-row flex flex-col justify-between items-center py-16 md:gap-0 gap-10 border-b border-zinc-300 rounded-lg">
          <div className="md:text-2xl text-l font-medium md:w-1/2 leading-normal text-center px-5">
            {t("mostTrusted.title")}
          </div>
          <div className={`inline-flex gap-16 ${lang === "nl" ? "px-5" : ""}`}>
            <div>
              <div className="md:text-5xl text-3xl text-tg-orange2 mb-1">
                210+
              </div>
              <div> {t("mostTrusted.eventsHosted")}</div>
            </div>
            <div>
              <div className="md:text-5xl text-3xl text-tg-orange2 mb-1">
                1500+
              </div>
              <div> {t("mostTrusted.satisfiedCustomers")}</div>
            </div>
          </div>
        </div> */}
        {/* Simplified */}
        <div className="flex flex-col items-center text-center gap-7 py-10 mt-14">
          <h3 className="font-oswald lg:text-5xl text-3xl">
            {t("simplified.title")}
          </h3>
          <p className="w-4/5 text-lg">
          <span>{t("simplified.description")}</span>
          <span className="text-red-500">{t("simplified.description2")}</span>
          <span>{t("simplified.description3")}</span>
          </p>
        </div>
        {/* first section */}
        <div className="flex flex-col items-center gap-8 pb-36 mt-10">
          {/* Level up */}
          <div className="w-full flex flex-col gap-7 items-center px-5 md:px-0">
            <img
              src="/images/dash-sol.png"
              alt="Our Dashboard"
              width={1080}
              height={1080}
              className="drop-shadow-xl mt-5 mb-3 rounded-xl w-full md:w-2/3"
            />
            <div className="flex flex-col gap-3 items-center w-full rounded-xl md:p-10">
              <h3 className="font-bebas lg:text-5xl md:text-4xl text-3xl text-tg-orange2">
                {t("levelUp.title")}
              </h3>
              <p className="text-lg text-zinc-600">
                {t("levelUp.description")}
              </p>
              <div className="w-full grid gap-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 my-10 text-lg font-medium">
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuCalendarPlus className="text-2xl" />
                  {t("levelUp.features.createEvents")}
                </div>
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuSettings2 className="text-2xl" />
                  {t("levelUp.features.manageTickets")}
                </div>
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuTags className="text-2xl" />
                  {t("levelUp.features.customizeDiscounts")}
                </div>
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuFileLineChart className="text-2xl" />
                  {t("levelUp.features.generateReports")}
                </div>
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuSettings className="text-2xl" />
                  {t("levelUp.features.automatedProcesses")}
                </div>
                <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-600 rounded-lg p-5">
                  <LuTicket className="text-2xl" />
                  {t("levelUp.features.instantETickets")}
                </div>
              </div>
            </div>
          </div>
          {/* Seamless Payout */}

          <div className="flex w-full flex-col-reverse lg:flex-row items-end bg-gradient-to-r from-zinc-100 to-zinc-200 mt-[200px] rounded-xl gap-10">
            <div className="flex flex-col justify-start gap-3 w-full p-10 lg:w-1/2">
              <h3 className="font-bebas lg:text-5xl md:text-4xl text-3xl text-tg-orange2">
                {t("securePayments.title")}
              </h3>
              <p className="text-lg">{t("securePayments.description")}</p>
              <div className="border-b border-zinc-400 my-4 w-full"></div>
              <ul className="list-none w-full flex flex-col lg:text-lg md:text-lg text-sm gap-2">
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("securePayments.features.secure_payment")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("securePayments.features.partner")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("securePayments.features.seamless_scanning")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("securePayments.features.payment_tracking")}
                </li>
              </ul>
            </div>
            <img
              src="/images/share1.png"
              alt="Secure Payments"
              width={1920}
              height={1080}
              className="w-full lg:w-1/2 drop-shadow-xl mt-[-250px] rounded-xl"
            />
          </div>
          {/* why choose section */}
          {/* <div className="mb-4 border-2 bg-gradient-to-r from-zinc-100 to-zinc-200 mt-[100px] rounded-xl p-4 w-full">
          <h3 className="font-bebas lg:text-5xl md:text-4xl text-3xl text-tg-orange2 text-center ">{th("why_to_choose")}</h3>
            <ul className="list-none w-full flex flex-col lg:text-lg md:text-lg text-sm gap-2 mt-4">
            <li className="inline-flex items-center gap-3 ">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_1")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_2")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_3")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_4")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_5")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {th("compare_text_6")}
                </li>
            </ul>

            </div> */}
            
          {/* Boost */}

          <div className="flex w-full flex-col lg:flex-row items-end bg-gradient-to-r from-zinc-100 to-zinc-200 mt-[200px] rounded-xl gap-10">
            <img
              src="/images/share.png"
              alt="Share your Event"
              width={1920}
              height={1080}
              className="w-full lg:w-1/2 drop-shadow-xl mt-[-250px] rounded-xl"
            />
            <div className="flex flex-col justify-start gap-3 w-full p-10 lg:w-1/2">
              <h3 className="font-bebas lg:text-5xl md:text-4xl text-3xl text-tg-orange2">
                {t("shareEvents.title")}
              </h3>
              <p className="text-lg">{t("shareEvents.description")}</p>
              <div className="border-b border-zinc-400 my-4 w-full"></div>
              <ul className="list-none w-full flex flex-col lg:text-lg md:text-lg text-sm gap-2">
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("shareEvents.features.share")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("shareEvents.features.audience_reach")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("shareEvents.features.share_with_qr")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("shareEvents.features.monitor_referrals")}
                </li>
              </ul>
            </div>
          </div>
          {/* Scan away */}
          <div className="flex w-full flex-col-reverse lg:flex-row items-end bg-gradient-to-r from-zinc-100 to-zinc-200 mt-[200px] rounded-xl gap-10">
            <div className="flex flex-col justify-start gap-3 w-full p-10 lg:w-1/2">
              <h3 className="font-bebas lg:text-5xl md:text-4xl text-3xl text-tg-orange2">
                {t("ticketScanning.title")}
              </h3>
              <p className="text-lg">
                <span>{t("ticketScanning.descriptiontext1")}</span>
                <span className="text-red-500">{t("ticketScanning.descriptiontextfree")}</span>
                <span>{t("ticketScanning.descriptiontextmobileapp")}</span>
              </p>
              <div className="border-b border-zinc-400 my-4 w-full"></div>
              <ul className="list-none w-full flex flex-col lg:text-lg md:text-lg text-sm gap-2">
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("ticketScanning.features.quick_and_easy")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("ticketScanning.features.device_scanner")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("ticketScanning.features.seamless_scanning")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("ticketScanning.features.flexiable")}
                </li>
              </ul>
            </div>
            <img
              src="/images/solmock.png"
              alt="Seamless Ticket Scanning"
              width={1920}
              height={1080}
              className="w-full lg:w-1/2 drop-shadow-xl mt-[-180px] rounded-xl"
            />
          </div>
        </div>
      </div>
      <div className=" relative flex flex-col gap-2 md:gap-4 items-center py-16 md:py-24 w-full bg-[url('/images/footer.jpg')] bg-no-repeat bg-center bg-cover text-white">
        <h3 className="text-lg md:text-xl font-medium">{t("footer.title")}</h3>
        <Link
          href="/login"
          className="text-3xl md:text-6xl lg:text-7xl font-bebas hover:tracking-wider transition-all"
        >
          {t("footer.cta")}
        </Link>
      </div>
    </div>
  );
};

export default Solutions;

import { Poppins } from "next/font/google";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";
import TrustpilotWidget from "../components/TrustpilotWidget";
import LottieAnimation from "../animations/homeanimation";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("homePage");
  const cheaperText = t.raw("cheaperText");

  const lang = locale;

  return (
    <div className={poppins.className}>
      <div className="bg-orange-100">
        <div className="w-full h-full flex flex-col pt-[120px] 2xl:container mx-auto md:pt-[150px] items-center text-black gap-5 md:p-12 lg:p-20 lg:pt-[150px] p-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <h1
              className={`text-7xl md:text-8xl  ${
                lang === "en" ? "xl:text-9xl" : "xl:text-8xl"
              } font-bebas lg:w-2/3 w-full`}
            >
              <span className="text-tg-orange">{t("unlock")}</span>{" "}
              {t("theDoor")}{" "}
              <span className="text-tg-orange">{t("nextEvent")}</span>
            </h1>
            {/*ticket*/}
            <Link
              href="#learn-more"
              className="hidden md:block relative bg-zinc-800 w-full lg:w-1/3 rounded-2xl p-4 hover:bg-zinc-950 transition duration-300 group"
            >
              <div className="rounded-lg h-full w-full p-2 border-2 border-dashed border-white text-white border-opacity-50 inline-flex">
                <div className="md:w-3/5 lg:w-4/5 p-5 flex md:flex-row lg:flex-col justify-between md:items-center lg:items-start">
                  <div className="font-oswald text-3xl md:text-5xl lg:mb-5">
                    {t("learnMore")}
                  </div>
                  <div className="lg:w-full inline-flex justify-end text-5xl md:text-6xl lg:text-7xl ">
                    <FaArrowRight className="transform rotate-45 group-hover:rotate-90 group-hover:text-tg-orange transition" />
                    <FaArrowRight className="transform rotate-45 group-hover:rotate-90 group-hover:text-tg-orange transition" />
                  </div>
                </div>
                <div className="md:w-2/5 lg:w-1/5 border-l-2 border-dashed border-white border-opacity-50 md:pl-4 lg:pl-3 md:px-2 lg:py-3">
                  <div className="w-full h-full md:bg-[url('/images/barcode2.png')] lg:bg-[url('/images/barcode.png')] bg-no-repeat bg-center bg-contain"></div>
                </div>
              </div>
            </Link>
          </div>
          {/* second row */}
          <div className="my-4 inline-flex w-full items-center  gap-5">
            <div
              className={`px-3 py-2 border-2 ${
                lang === "en" ? "text-sm lg:text-lg" : "text-xs md:text-lg"
              } border-black rounded-full min-w-max md:font-medium inline-flex items-center gap-2 overflow-hidden`}
            >
              <IoShieldCheckmark />
              {t("mostTrusted")}
            </div>
            <div className="h-[1px] w-full bg-zinc-400"></div>
          </div>
          {/* third row */}
          <div className="flex flex-col lg:flex-row md:justify-between w-full h-full gap-8 md:gap-16 ">
            {/* Left side */}
            <div className="flex flex-col gap-2 md:gap-3 w-full lg:w-4/6 h-full font-oswald text-lg md:text-2xl">
              <div className="inline-flex items-center w-full h-full gap-2 md:gap-3">
                {/*small issue in style */}
                <div className="w-full  md:h-14  h-14 min:h-[100px] rounded-lg lg:rounded-2xl bg-[url('/images/hero1.jpg')] bg-no-repeat bg-center bg-cover"></div>
                <Link
                  className="bg-black text-white rounded-lg lg:rounded-2xl min-w-max h-14 md:h-full p-1 md:p-3 group"
                  href="/login"
                >
                  <div className="border py-2 md:py-0 md:border-2 border-dashed border-white border-opacity-30 lg:border-opacity-0 group-hover:border-opacity-30 w-full h-12 flex justify-center items-center px-10 md:px-8 rounded-lg md:rounded-xl group-hover:px-12 transition-all duration-300">
                    {t("createEvent")}
                  </div>
                </Link>
              </div>
              <div className="inline-flex items-center w-full h-full gap-2 md:gap-3 flex-row-reverse">
                <div className="w-full md:h-14 h-14 min:h-[100px] rounded-lg lg:rounded-2xl bg-[url('/images/hero2.jpg')] bg-no-repeat bg-center bg-cover"></div>
                <Link
                  className="bg-black text-white rounded-lg lg:rounded-2xl min-w-max h-14 md:h-full p-1 md:p-3 group"
                  href="/solutions"
                >
                  <div className="border py-2 md:py-0 md:border-2 border-dashed border-white border-opacity-30 lg:border-opacity-0 group-hover:border-opacity-30 w-full h-12 flex justify-center items-center px-10 md:px-8 rounded-lg md:rounded-xl group-hover:px-12 transition-all duration-300">
                    {t("buyTickets")}
                  </div>
                </Link>
              </div>
            </div>
            {/* right side */}
            <div className="w-full gap-6 lg:w-2/6 flex flex-col h-full md:justify-between ">
              <h2 className="md:text-xl mb-2">{t("sellTickets")}</h2>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-56 h-56 flex justify-center items-center">
              <LottieAnimation className="w-52 h-52" />
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div className="px-6 md:px-14 lg:px-28 2xl:container mx-auto">
        <div
          id="learn-more"
          className="w-full flex flex-col items-center pt-16 md:pt-28 gap-10"
        >
          <h2 className="text-4xl text-center lg:text-6xl font-oswald">
            {t("empowerTitle")}
          </h2>
          <h3 className="text-center md:text-xl md:px-8">
            {t("empowerText1")}
          </h3>
          <h3 className="text-center md:text-xl md:px-8">
            {t("empowerText2")}
          </h3>
          <div className="hidden grid-cols-5 gap-2 w-full my-5">
            <div className="bg-zinc-100 text-center py-4 rounded-lg h-32">
              Partner 1
            </div>
            <div className="bg-zinc-100 text-center py-4 rounded-lg h-32">
              Partner 2
            </div>
            <div className="bg-zinc-100 text-center py-4 rounded-lg h-32">
              Partner 3
            </div>
            <div className="bg-zinc-100 text-center py-4 rounded-lg h-32">
              Partner 4
            </div>
            <div className="bg-zinc-100 text-center py-4 rounded-lg h-32">
              Partner 5
            </div>
          </div>
        </div>
        <div className="mb-16 mt-20 md:mt-28 w-full text-center text-3xl md:text-5xl tracking-wide font-bebas inline-flex items-center justify-center gap-5 text-orange-800">
          <div>
            <MdKeyboardDoubleArrowDown className="text-5xl md:text-6xl text-tg-orange" />
          </div>
          {t("howWeDominate")}
          <div>
            <MdKeyboardDoubleArrowDown className="text-5xl md:text-6xl text-tg-orange" />
          </div>
        </div>
        {/* Why us */}
        <div className="w-full flex flex-col gap-5 mb-28 text-white">
          <div className="flex flex-col md:flex-row w-full gap-5">
            <div className="rounded-xl bg-gradient-to-br from-tg-orange to-tg-orange2 overflow-hidden h-[250px] lg:h-[300px] flex flex-col justify-end group w-full md:w-1/2 lg:w-2/3">
              <div className="w-full p-6">
                <h3 className="text-3xl my-3 font-oswald">
                  {t.raw("cheaperTickets")}
                </h3>
                <p
                  className="group-hover:block text-sm border-t border-white border-opacity-40 mt-5 pt-5"
                  dangerouslySetInnerHTML={{ __html: t.raw("cheaperText") }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-950 overflow-hidden h-[250px] lg:h-[300px] flex flex-col justify-end group w-full md:w-1/2 lg:w-1/3">
              <div className="w-full p-6">
                <h3 className="text-3xl my-3 font-oswald">
                  {t("freeRefunds")}
                </h3>
                <p
                  className="group-hover:block text-sm border-t border-white border-opacity-40 mt-5 pt-5"
                  dangerouslySetInnerHTML={{ __html: t.raw("freeRefundsText") }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full gap-5">
            <div className="rounded-xl border-2 border-zinc-400 text-black overflow-hidden h-[200px] lg:h-[250px] flex flex-col justify-end group w-full lg:w-1/3">
              <div className="w-full p-6">
                <h3 className="text-2xl md:text-3xl my-3 font-oswald">
                  {t("secureTransactions")}
                </h3>
                <p className="group-hover:block text-sm border-t border-zinc-400 mt-3 pt-3 md:mt-5 md:pt-5">
                  {t("secureTransactionsText")}
                </p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-zinc-400 text-black overflow-hidden h-[200px] lg:h-[250px] flex flex-col justify-end group w-full lg:w-1/3">
              <div className="w-full p-6">
                <h3 className="text-2xl md:text-3xl my-3 font-oswald">
                  {t("analytics")}
                </h3>
                <p className="group-hover:block text-sm border-t border-zinc-400 mt-3 pt-3 md:mt-5 md:pt-5">
                  {t("analyticsText")}
                </p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-zinc-400 text-black overflow-hidden h-[200px] lg:h-[250px] flex flex-col justify-end group w-full lg:w-1/3">
              <div className="w-full p-6">
                <h3 className="text-2xl md:text-3xl my-3 font-oswald">
                  {t("mobileScanning")}
                </h3>
                <p
                  className="group-hover:block text-sm border-t border-zinc-400 mt-3 pt-3 md:mt-5 md:pt-5"
                >
                  <span dangerouslySetInnerHTML={{ __html: t.raw("mobileScanningText") }}></span>
                <span className="text-red-500 font-semibold">
                  {t("mobileScanningTextfree")}
                </span>
                <span>{t("mobileScanningText2")}</span>
                <span className="text-red-500 font-semibold">{t("mobileScanningText3")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* after why us */}
        <div className="flex flex-col gap-24 md:gap-32 pb-36 pt-6">
          {/* dashboard */}
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex flex-col gap-8 w-full lg:w-2/5">
              <h3 className="font-bebas text-5xl text-tg-orange2">
                {t("controlDashboard")}
              </h3>
              <p className="text-lg">{t("controlDashboardText")}</p>
              <ul className="mt-2 list-none w-full flex flex-col text-lg gap-2 text-neutral-800">
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />
                  {t("manageTicketSales")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />
                  {t("viewAnalytics")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />
                  {t("customizeEventPages")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />
                  {t("monitorAttendeeData")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />
                  {t("realTimeUpdates")}
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-3/5 md:pl-10">
              <img
                src="/images/dashov.jpg"
                alt="Our Dashboard"
                width={1920}
                height={1080}
                className="w-full drop-shadow-xl mt-5 rounded-xl"
              />
            </div>
          </div>
          {/* mobile app */}
          <div className="flex flex-col lg:flex-row-reverse gap-10 items-center">
            <div className="flex flex-col gap-5 w-full lg:w-1/2">
              <h3 className="font-bebas text-5xl text-tg-orange2">
                {t("mobileAppTitle")}
              </h3>
              <p className="text-lg">
                <span>{t("mobileAppText")}</span>
                <span className="">{t("mobileAppText2")}</span>
                <span className="text-red-500">{t("mobileAppTextfree")}</span>
                <span className="">{t("mobileAppText3")}</span>
                <span>{t("mobileAppText4")}</span>


              </p>
              <ul className="mt-3 list-none w-full flex flex-col text-lg gap-2 text-neutral-800">
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("scanTicketQRCodes")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("realTimeAttendeeMonitoring")}
                </li>
                <li className="inline-flex items-center gap-3">
                  <FaCircleArrowRight className="text-tg-orange2" />{" "}
                  {t("liveArrivalProgressTracking")}
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full pr-10">
              <img
                src="/images/appov.jpg"
                alt="Mobile App Scanner"
                width={1920}
                height={1080}
                className="w-full mt-5 rounded-xl"
              />
            </div>
          </div>
          {/* difference table */}
          <div className="hidden flex-col lg:flex-row gap-10 items-center my-10">
            <div className="flex flex-col gap-8 w-full lg:w-2/5">
              <h3 className="font-bebas text-5xl text-tg-orange2">
                {t("superiorTitle")}
              </h3>
              <p className="text-lg">
                {t("superiorText")}
                <span className="text-tg-orange2"> eventix.io</span> and
                <span className="text-tg-orange2"> your-tickets.be</span>.{" "}
                {t("commitmentStatement")}
              </p>
            </div>
            <div className="w-full lg:w-3/5 pl-10">
              <table className="min-w-full bg-white text-sm text-center">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="py-3 px-4 border-b font-oswald text-2xl font-medium">
                      Tickgetr
                    </th>
                    <th className="py-3 px-4 border-b font-oswald text-2xl font-medium border-x">
                      Your-tickets
                    </th>
                    <th className="py-3 px-4 border-b font-oswald text-2xl font-medium">
                      Eventix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b text-center">
                      0.30 per ticket fixed
                    </td>
                    <td className="py-2 px-4 border-b border-x">
                      0.55 per ticket + 1%
                    </td>
                    <td className="py-2 px-4 border-b">0.65 per ticket + 1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Free Refunds</td>
                    <td className="py-2 px-4 border-b border-x">
                      Fee for Refunds
                    </td>
                    <td className="py-2 px-4 border-b">Fee for Refunds</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Advanced Insights</td>
                    <td className="py-2 px-4 border-b border-x">
                      Basic Analytics
                    </td>
                    <td className="py-2 px-4 border-b">Basic Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">
                      Online & Offline Scanning
                    </td>
                    <td className="py-2 px-4 border-b border-x">
                      Online Scanning Only
                    </td>
                    <td className="py-2 px-4 border-b">Online Scanning Only</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Highly Customizable</td>
                    <td className="py-2 px-4 border-b border-x">
                      Limited Customization
                    </td>
                    <td className="py-2 px-4 border-b">
                      Limited Customization
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className=" relative flex flex-col gap-2 md:gap-4 items-center py-16 md:py-24 w-full bg-[url('/images/footer.jpg')] bg-no-repeat bg-center bg-cover text-white">
        <h3 className="text-lg md:text-xl font-medium">{t("readyToRide")}</h3>
        <Link
          href="/login"
          className="text-3xl md:text-6xl lg:text-7xl font-bebas hover:tracking-wider transition-all"
        >
          {t("surgeAhead")}
        </Link>
      </div>
    </div>
  );
};

export default Home;

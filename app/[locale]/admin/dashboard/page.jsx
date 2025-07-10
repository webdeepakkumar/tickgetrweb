"use client";
import React, { useState, useEffect } from "react";
import DailyRevenue from "@/app/[locale]/components/dashboard/dailyRevenue";
import MonthlyRevenue from "@/app/[locale]/components/dashboard/monthlyRevenue";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import OverallRevenue from "@/app/[locale]/components/dashboard/overallRevenue";
import Counter from "@/app/[locale]/components/counter";
import PaymentMethods from "@/app/[locale]/components/dashboard/paymentMethods";
import Transition4 from "@/app/[locale]/animations/transition3";
import { LuCalendarClock } from "react-icons/lu";
import ProgressBar from "@/app/[locale]/components/dashboard/progressBar";
import { BsCalendar2Check } from "react-icons/bs";
import { FaTicketSimple } from "react-icons/fa6";
import { HiOutlineUsers } from "react-icons/hi2";
import YearlyRevenue from "../../components/dashboard/yearlyRevenue";
import CounterFormat from "@/app/[locale]/components/counterFormat";

import {
  fetchTotalRev,
  fetchDailyRev,
  fetchOverallRev,
  fetchPaymentMethodAdmin,
  fetchReferralsDataAdmin,
  fetchTotalEvents,
  fetchTotalOrganizers,
  fetchWeeklyRev,
  fetchMonthlyRev,
  fetchTotalTickgetrRev,
  fetchWeeklyTickgetrRev,
  fetchDailyTickgetrRev,
  fetchOverallTickgetrRev,
  fetchMonthlyTickgetrRev,
} from "@/app/(Api)/firebase/firebase_firestore";
import { useTranslations } from "next-intl";

const Overview = () => {
  const t = useTranslations("admin");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickgetrRevenue, setTotalTickgetrRevenue] = useState(0);
  const [totalWRevenue, setTotalWRevenue] = useState(0);
  const [totalMRevenue, setTotalMRevenue] = useState(0);
  const [totalTickgetrWRevenue, setTotalTickgetrWRevenue] = useState(0);
  const [totalTickgetrMRevenue, setTotalTickgetrMRevenue] = useState(0);
  const [ticketsPerOrder, setTicketsPerOrder] = useState(0);
  const [totaltickets, setTotaltickets] = useState(0);
  const [amountPerOrder, setAmountPerOrder] = useState(0);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [dailyTickgetrRevenueData, setDailyTickgetrRevenueData] = useState([]);
  const [overallRevenueData, setOverallRevenueData] = useState([]);
  const [overallTickgetrRevenueData, setOverallTickgetrRevenueData] = useState(
    []
  );
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [monthlyTickgetrReveueData, setMonthlyTickgetrRevenueData] = useState(
    []
  );
  const [yearlyTRevenueData, setYearlyTRevenueData] = useState([]);
  const [refData, setReferrals] = useState([]);
  const [totalEvents, setTotalEvents] = useState();
  const [loading, setLoading] = useState(true);
  const [totalOrgs, setTotalOrgs] = useState();
  const [period, setPeriod] = useState(t("adminDashboard.overview.allTime"));
  const [tperiod, setTperiod] = useState(t("adminDashboard.overview.allTime"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { totalRevenue, ticketsPerOrder, amountPerOrder, totalTickets } =
          await fetchTotalRev();
        setTotaltickets(totalTickets);
        setTotalRevenue(totalRevenue || 0.0);
        setTicketsPerOrder(ticketsPerOrder || 0.0);
        setAmountPerOrder(amountPerOrder || 0.0);
        const { totaltRevenue } = await fetchTotalTickgetrRev();
        setTotalTickgetrRevenue(totaltRevenue);

        const totalWRevenue = await fetchWeeklyRev();
        setTotalWRevenue(totalWRevenue);
        const totalTickgetrWRevenue = await fetchWeeklyTickgetrRev();
        setTotalTickgetrWRevenue(totalTickgetrWRevenue);

        const paymentMethods = await fetchPaymentMethodAdmin();
        setPaymentMethodsData(paymentMethods);

        const dailyRevenue = await fetchDailyRev();
        setDailyRevenueData(dailyRevenue);
        const dailyTickgetrRevenue = await fetchDailyTickgetrRev();
        setDailyTickgetrRevenueData(dailyTickgetrRevenue);

        const overallRevenue = await fetchOverallRev();
        setOverallRevenueData(overallRevenue);
        const overallTickgetrRevenue = await fetchOverallTickgetrRev();
        setOverallTickgetrRevenueData(overallTickgetrRevenue);

        const { formattedData, totalMonthlyRevenue } = await fetchMonthlyRev();
        setMonthlyRevenueData(formattedData);
        setYearlyRevenueData(formattedData);
        setTotalMRevenue(totalMonthlyRevenue);

        const { formattedTData, totalTMonthlyRevenue } =
          await fetchMonthlyTickgetrRev();
        setMonthlyTickgetrRevenueData(formattedTData);
        setYearlyTRevenueData(formattedTData);
        setTotalTickgetrMRevenue(totalTMonthlyRevenue);

        const refData = await fetchReferralsDataAdmin();
        setReferrals(refData);

        const totalEvents = await fetchTotalEvents();
        setTotalEvents(totalEvents);

        const totalOrgs = await fetchTotalOrganizers();
        setTotalOrgs(totalOrgs);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const total = refData.reduce((sum, item) => sum + item.value, 0);
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  const togglePeriod = () => {
    setPeriod((prevPeriod) => {
      if (prevPeriod === t("adminDashboard.overview.daily")) {
        return t("adminDashboard.overview.monthly");
      } else if (prevPeriod === t("adminDashboard.overview.monthly")) {
        return "overall";
      } else {
        return t("adminDashboard.overview.daily");
      }
    });
  };
  const toggletwoPeriod = () => {
    setTperiod((prevPeriodd) => {
      if (prevPeriodd === t("adminDashboard.overview.daily")) {
        return t("adminDashboard.overview.monthly");
      } else if (prevPeriodd === t("adminDashboard.overview.monthly")) {
        return "overall";
      } else {
        return t("adminDashboard.overview.daily");
      }
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col w-full md:h-full h-[1400px] gap-5">
        <div className="flex flex-col lg:flex-row w-full lg:h-3/5 md:h-3/4 h-[640px] gap-5">
          <Transition4
            delay={0.3}
            className="bg-zinc-900 lg:w-3/5 lg:h-full h-1/2 flex flex-col justify-between rounded-xl md:py-5 md:px-7"
          >
            <div className="flex justify-between items-center md:px-0 px-4">
              <div>
                <div className="text-sm text-zinc-300 mb-1 md:pt-0 pt-3">
                  {t("adminDashboard.overview.totalBusiness")}
                </div>
                <div className="text-2xl font-medium text-orange-300">
                  €
                  <CounterFormat
                    value={
                      period === t("adminDashboard.overview.daily")
                        ? totalWRevenue.toFixed(2)
                        : period === t("adminDashboard.overview.monthly")
                        ? totalMRevenue.toFixed(2)
                        : totalRevenue.toFixed(2)
                    }
                  />
                </div>
              </div>
              <button
                className="bg-zinc-500 min-w-28 bg-opacity-60 rounded-lg px-3 py-2 font-medium inline-flex items-center text-white text-sm gap-2 hover:bg-zinc-100 hover:text-zinc-700 transition"
                onClick={togglePeriod}
              >
                <LuCalendarClock className="text-lg mt-[-1px] " />
                {period === t("adminDashboard.overview.daily")
                  ? t("adminDashboard.overview.weekly")
                  : period === t("adminDashboard.overview.weekly")
                  ? t("adminDashboard.overview.monthly")
                  : period === t("adminDashboard.overview.monthly")
                  ? t("adminDashboard.overview.monthly")
                  : t("adminDashboard.overview.allTime")}
              </button>
            </div>
            <div className="h-full w-full flex items-end flex-grow">
              {period === t("adminDashboard.overview.daily") ? (
                <DailyRevenue
                  revenueData={dailyRevenueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              ) : period === t("adminDashboard.overview.monthly") ? (
                <MonthlyRevenue
                  revenueData={monthlyRevenueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              ) : (
                <YearlyRevenue
                  revenueData={yearlyRevenueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              )}
            </div>
          </Transition4>
          <Transition4
            delay={0.2}
            className="bg-zinc-900 lg:w-2/5 lg:h-full h-1/2 flex flex-col rounded-xl py-5 px-7"
          >
            <div className="text-lg text-zinc-300 font-medium">
              {t("adminDashboard.overview.paymentMethods")}
            </div>
            <div className="h-full w-full flex justify-center items-center">
              <PaymentMethods
                paymentMethodsData={paymentMethodsData}
                className="text-zinc-400"
              />
            </div>
          </Transition4>
        </div>
        <div className="flex flex-col md:flex-row w-full lg:h-2/4 md:min-h-[200px] min-h-[500px] sm:min-h-[500px] gap-5 ">
          {/* Conversions Section */}
          <Transition4
            delay={0.3}
            className="bg-zinc-900 md:w-3/5 w-full h-auto md:h-full flex flex-col rounded-xl py-5 px-7 lg:gap-5 md:gap-2 gap-6 sm:py-2 jus"
          >
            <div className="text-lg text-zinc-300 font-medium">
              {t("adminDashboard.overview.conversions")}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 pb-2 ">
              <div className="relative w-full bg-white bg-opacity-10 rounded-lg overflow-hidden p-3 sm:p-2 md:p-4 flex flex-col items-center min-h-[80px] sm:min-h-[100px]">
                <div className="text-sm sm:text-xs text-orange-300 font-medium mb-1 text-center">
                  {t("adminDashboard.overview.totalEvents")}
                </div>
                <div className="text-lg sm:text-base text-white font-medium">
                  <Counter value={totalEvents} />
                </div>
                <BsCalendar2Check className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 lg:text-9xl md:text-7xl text-5xl sm:text-6xl opacity-10 text-orange-300" />
              </div>
              {/* Number of Organizers */}
              <div className="relative w-full bg-white bg-opacity-10 rounded-lg overflow-hidden p-3 sm:p-2 md:p-4 flex flex-col items-center min-h-[80px] sm:min-h-[100px]">
                <div className="text-sm sm:text-xs text-orange-300 font-medium mb-1 text-center">
                  {t("adminDashboard.overview.numberOfOrganizers")}
                </div>
                <div className="text-lg sm:text-base text-white font-medium">
                  <Counter value={totalOrgs} />
                </div>
                <HiOutlineUsers className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 lg:text-9xl md:text-7xl text-5xl sm:text-6xl opacity-10 text-orange-300" />
              </div>
              <div className="relative w-full bg-white bg-opacity-10 rounded-lg overflow-hidden p-3 sm:p-2 md:p-4 flex flex-col items-center min-h-[80px] sm:min-h-[100px]">
                <div className="text-sm sm:text-xs text-orange-300 font-medium mb-1 text-center">
                  {t("adminDashboard.overview.totaltickets")}
                </div>
                <div className="text-lg sm:text-base text-white font-medium">
                  <Counter value={totaltickets} />
                </div>
                <HiOutlineUsers className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 lg:text-9xl md:text-7xl text-5xl sm:text-6xl opacity-10 text-orange-300" />
              </div>
            </div>
          </Transition4>
          {/* Referrals Section */}
          <Transition4
            delay={0.4}
            className="bg-zinc-900 overflow-auto md:w-3/5 w-full h-auto md:h-full flex flex-col rounded-xl py-3 px-7 lg:gap-5 md:gap-2 gap-6 sm:py- sm:mb-24"
          >
            <div className=" text-lg text-zinc-300 font-medium">
              {t("adminDashboard.overview.referrals")}
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-2 gap-4 ">
              {refData.map((referrals, index) => (
                <ProgressBar
                  key={index}
                  name={referrals.name}
                  percent={Math.round((referrals.value / total) * 100)}
                  barColor="bg-orange-300"
                  barBgColor="bg-zinc-500"
                />
              ))}
            </div>
          </Transition4>
        </div>
        <div className="flex flex-col lg:flex-row w-full lg:h-[480px] md:h-[400px] h-[350px] gap-5 ">
          <Transition4
            delay={0.3}
            className="bg-zinc-900 w-full lg:w-3/2 lg:h-full min-h-[300px] flex flex-col justify-between rounded-xl md:py-5 md:px-7"
          >
            <div className="flex justify-between items-center md:px-0 px-4 m-4">
              <div>
                <div className="text-sm text-zinc-300 mb-1 md:pt-0 pt-3">
                  {t("adminDashboard.overview.tickgetrRevenue")}
                </div>
                <div className="text-2xl font-medium text-orange-300">
                  €
                  <CounterFormat
                    value={
                      tperiod === t("adminDashboard.overview.daily")
                        ? totalTickgetrWRevenue.toFixed(2)
                        : tperiod === t("adminDashboard.overview.monthly")
                        ? totalTickgetrMRevenue.toFixed(2)
                        : totalTickgetrRevenue.toFixed(2)
                    }
                  />
                </div>
              </div>
              <button
                className="bg-zinc-500 min-w-28 bg-opacity-60 rounded-lg px-3 py-2 font-medium inline-flex items-center text-white text-sm gap-2 hover:bg-zinc-100 hover:text-zinc-700 transition"
                onClick={toggletwoPeriod}
              >
                <LuCalendarClock className="text-lg mt-[-1px] " />
                {tperiod === t("adminDashboard.overview.daily")
                  ? t("adminDashboard.overview.weekly")
                  : tperiod === t("adminDashboard.overview.weekly")
                  ? t("adminDashboard.overview.monthly")
                  : tperiod === t("adminDashboard.overview.monthly")
                  ? t("adminDashboard.overview.monthly")
                  : t("adminDashboard.overview.allTime")}
              </button>
            </div>
            <div className="h-full w-full flex items-end flex-grow">
              {tperiod === t("adminDashboard.overview.daily") ? (
                <DailyRevenue
                  revenueData={dailyTickgetrRevenueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              ) : tperiod === t("adminDashboard.overview.monthly") ? (
                <MonthlyRevenue
                  revenueData={monthlyTickgetrReveueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              ) : (
                <YearlyRevenue
                  revenueData={yearlyTRevenueData}
                  strokeColor="#f7a559"
                  fillColorStart="#f7a559"
                  fillColorEnd="#262626"
                  gridColor="#4d4d4d"
                  cursorColor="#d9bca3"
                  fill="#ffffff"
                />
              )}
            </div>
          </Transition4>
        </div>
      </div>
    </div>
  );
};

export default Overview;

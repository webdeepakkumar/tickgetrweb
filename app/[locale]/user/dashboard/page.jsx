"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
//Components
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import Counter from "@/app/[locale]/components/counter";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import ProgressBar from "@/app/[locale]/components/dashboard/progressBar";
import DailyRevenue from "@/app/[locale]/components/dashboard/dailyRevenue";
import MonthlyRevenue from "@/app/[locale]/components/dashboard/monthlyRevenue";
import YearlyRevenue from "../../components/dashboard/yearlyRevenue";
import PaymentMethods from "@/app/[locale]/components/dashboard/paymentMethods";
import CounterFormat from "@/app/[locale]/components/counterFormat";
//Animation
import Transition4 from "@/app/[locale]/animations/transition3";
//Icons
import { LuCalendarClock } from "react-icons/lu";
import { BsCalendar2Check } from "react-icons/bs";
import { HiOutlineCurrencyEuro } from "react-icons/hi2";
//Firebase
import {
  fetchTotalRevenueAndOrders,
  fetchDailyRevenue,
  fetchPaymentMethodsData,
  fetchReferralsData,
  fetchWeeklyRevenue,
  fetchOverallRevenue,
  fetchMonthlyRevenue,
  fetchAuthorizedEvents,
} from "@/app/(Api)/firebase/firebase_firestore";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const Overview = () => {
  const t = useTranslations("eventsDashboard");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();
  const [eventData, setEventData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalMRevenue, setTotalMRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [ticketsPerOrder, setTicketsPerOrder] = useState(0);
  const [amountPerOrder, setAmountPerOrder] = useState(0);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [overallRevenueData, setOverallRevenueData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refData, setReferrals] = useState([]);
  const [period, setPeriod] = useState(t("overview.allTime"));
  const [userId, setUserId] = useState();
  const [authorzed, setAuthorized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (eventId) {
      setEId(eventId);
    } else {
      setEId(null);
    }
  }, [eventId]);

  useEffect(() => {
    const checkAndFetchEvents = async () => {
      if (userId && eventId) {
        const isAuthorized = await fetchAuthorizedEvents(
          userId,
          eventId,
          setEventData
        );
        if (!isAuthorized) {
          router.replace("/user/my-events");
        } else {
          setAuthorized(true);
        }
      }
    };

    checkAndFetchEvents();
  }, [userId, eventId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { totalRevenue, ticketsPerOrder, amountPerOrder } =
          await fetchTotalRevenueAndOrders(eventId);
        setTotalRevenue(totalRevenue || 0.0);
        setTicketsPerOrder(ticketsPerOrder || 0.0);
        setAmountPerOrder(amountPerOrder || 0.0);

        const overallRevenue = await fetchOverallRevenue(eventId);
        setOverallRevenueData(overallRevenue);

        const paymentMethods = await fetchPaymentMethodsData(eventId);
        setPaymentMethodsData(paymentMethods);

        const dailyRevenue = await fetchDailyRevenue(eventId);
        setDailyRevenueData(dailyRevenue);

        const { formattedData, totalMonthlyRevenue } =
          await fetchMonthlyRevenue(eventId);
        setMonthlyRevenueData(formattedData);
        setYearlyRevenueData(formattedData)
        setTotalMRevenue(totalMonthlyRevenue);

        const weeklyRevenue = await fetchWeeklyRevenue(eventId);
        setWeeklyRevenue(weeklyRevenue || 0.0);

        const refData = await fetchReferralsData(eventId);
        setReferrals(refData);

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data ");
        setLoading(false);
      }
    };

    if (authorzed && userId && eventId) {
      fetchData();
    }
  }, [eventId, userId, authorzed]);

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
      if (prevPeriod === t("overview.daily")) {
        return t("overview.monthly");
      } else if (prevPeriod === t("overview.monthly")) {
        return "overview.allTime";
      } else {
        return t("overview.daily");
      }
    });
  };
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col w-full md:h-full h-[1400px] gap-5">
        <div className="flex flex-col lg:flex-row w-full lg:h-3/5 md:h-3/4 h-[640px] gap-5">
          <Transition4 className="bg-white lg:w-3/5 lg:h-full h-1/2 flex flex-col justify-between rounded-xl md:py-5 md:px-7">
            <div className="flex justify-between items-center md:px-0 px-4">
              <div>
                <div className="text-sm text-zinc-500 mb-1 md:pt-0 pt-3">
                  {t("overview.totalRevenue")}
                </div>
                <div className="text-2xl font-medium text-tg-orange">
                  €
                  <CounterFormat
                    value={
                      period === t("overview.daily")
                        ? weeklyRevenue.toFixed(2)
                        : period === t("overview.monthly")
                        ? totalMRevenue.toFixed(2)
                        : totalRevenue
                    }
                  />
                </div>
              </div>
              <button
                className="bg-zinc-200 min-w-28 bg-opacity-60 rounded-lg px-3 py-2 font-medium inline-flex items-center text-zinc-500 text-sm gap-2 hover:bg-opacity-100 hover:text-zinc-700 transition"
                onClick={togglePeriod}
              >
                <LuCalendarClock className="text-lg mt-[-1px] " />
                {period === t("overview.daily")
                  ? t("overview.weekly")
                  : period === t("overview.weekly")
                  ? t("overview.monthly")
                  : period === t("overview.monthly")
                  ? t("overview.monthly")
                  : t("overview.allTime")}
              </button>
            </div>
            <div className="h-full w-full flex items-end flex-grow">
            {period === t("overview.daily") ? (
                    <DailyRevenue
                    revenueData={dailyRevenueData}
                    strokeColor="#FF7A00"
                    fillColorStart="#FF7A00"
                    fillColorEnd="#ffffff"
                    gridColor="#eeeeee"
                    cursorColor="#ffd5b0"
                  />
              ) : period === t("overview.monthly") ? (
                <MonthlyRevenue
                  revenueData={monthlyRevenueData}
                  strokeColor="#FF7A00"
                  fillColorStart="#FF7A00"
                  fillColorEnd="#ffffff"
                  gridColor="#eeeeee"
                  cursorColor="#ffd5b0"
                />
              ) : (
                <YearlyRevenue
                  revenueData={yearlyRevenueData}
                  strokeColor="#FF7A00"
                    fillColorStart="#FF7A00"
                    fillColorEnd="#ffffff"
                    gridColor="#eeeeee"
                    cursorColor="#ffd5b0"
                />
              )}
            </div>
          </Transition4>
          <Transition4
            delay={0.2}
            className="bg-white lg:w-2/5 lg:h-full h-1/2 flex flex-col rounded-xl py-5 px-7"
          >
            <div className="text-lg font-medium">
              {t("overview.paymentMethods")}
            </div>
            <div className="h-full w-full flex justify-center items-center">
              <PaymentMethods
                paymentMethodsData={paymentMethodsData}
                className="text-zinc-400"
              />
            </div>
          </Transition4>
        </div>
        <div className="flex flex-col md:flex-row w-full lg:h-2/5 md:h-1/4 h-[840px] gap-5">
          <Transition4
            delay={0.3}
            className="bg-white md:w-2/5 w-full h-2/5 md:h-full flex flex-col rounded-xl py-5 px-7 lg:gap-5 md:gap-2 gap-8"
          >
            <div className="text-lg font-medium">
              {t("overview.conversions")}
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-5 md:gap-3 gap-5 h-full pb-2">
              <div className="relative lg:w-1/2 lg:h-full md:h-3/4 h-2/5 bg-tg-orange bg-opacity-10 rounded-lg overflow-hidden p-4">
                <div className="text-xs text-tg-orange font-medium mb-1">
                  {t("overview.ticketsPerOrder")}
                </div>
                <div className="text-3xl font-medium">
                  <Counter value={ticketsPerOrder.toFixed(2)} />
                </div>
                <BsCalendar2Check className="absolute -right-6 -bottom-8 lg:text-9xl md:text-8xl text-9xl opacity-10 text-tg-orange" />
              </div>
              <div className="relative lg:w-1/2 lg:h-full md:h-3/4 h-2/5 bg-tg-orange bg-opacity-10 rounded-lg overflow-hidden p-4">
                <div className="text-xs text-tg-orange font-medium mb-1">
                  {t("overview.amountPerOrder")}
                </div>
                <div className="text-3xl font-medium">
                  €
                  <CounterFormat value={amountPerOrder} />
                </div>
                <HiOutlineCurrencyEuro className="absolute -right-6 -bottom-6 lg:text-9xl md:text-8xl text-9xl opacity-10 text-tg-orange" />
              </div>
            </div>
          </Transition4>
          <Transition4
            delay={0.4}
            className="bg-white md:w-3/5 w-full h-3/5 md:h-full flex flex-col rounded-xl py-5 px-7 md:gap-5 gap-10"
          >
            <div className="text-lg font-medium">{t("overview.referrals")}</div>
            <div className=" h-full w-full grid md:grid-cols-2 grid-cols-1 gap-x-10">
              {refData.map((referrals, index) => (
                <ProgressBar
                  key={index}
                  name={referrals.name}
                  percent={Math.round((referrals.value / total) * 100)}
                />
              ))}
            </div>
          </Transition4>
        </div>
      </div>
    </div>
  );
};

export default Overview;

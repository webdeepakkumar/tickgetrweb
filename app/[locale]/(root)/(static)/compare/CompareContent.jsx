"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/app/[locale]/components/Modal";
import { useTranslations } from "next-intl";
import { MdEuroSymbol } from "react-icons/md";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { eventBriteCal, eventgooseCal, eventixCal, weeztixCal, flexticketsCal, goTicketsCal, lastUpdatedAtDate, platformsPriceList, ticketApplyCal, ticketKantoorCal, tickgetrCal, tickowebCal, weezEventCal, weTicketCal, yourTicketsCal } from "@/app/[locale]/lib/platformCalculator";
import { addCompareCalculatorUse, fetchCompareCalculatorUse } from "@/app/(Api)/firebase/firebase_firestore";
import { format } from "date-fns";
import Link from "next/link";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import toast from "react-hot-toast";

const CompareContent = () => {
  const t = useTranslations("compare");

  const [formData, setFormData] = useState({
    ticket_price: null,
    estimated_amount: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [lastUsed, setLastUsed] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const dataM = [
    { label: "Bancontact", value: "Bancontact" },
    { label: "Creditcard", value: "Creditcard" },
    { label: "Pay By Bank", value: "Pay By Bank" }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [itemPick, setItemPick] = useState({});
  const [tlgShow, setTlgshow] = useState(false);
  const lastUpdatedDate = lastUpdatedAtDate();

  const handleModalClose = () => setIsModalOpen(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleShow = () => setTlgshow(!tlgShow);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchCalculatorData();
    getPlatformData();
  }, [currentCount, lastUsed]);

  const fetchCalculatorData = async () => {
    const counter = await fetchCompareCalculatorUse();
    setCurrentCount(counter.count);
    const timestamp = counter.updatedAt;
    const readableDateTime = format(timestamp.toDate(), "MMMM dd, yyyy h:mm:ss a");
    setLastUsed(readableDateTime);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addCompareCalculatorUse();
      await fetchCalculatorData();
      getPlatformData("Bancontact");
      setShowGraph(true);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setIsLoading(false);
  };

  const sortPlatformFee = (type) => getPlatformData(type);

  const getPlatformData = (type) => {
    let ticketPrice = formData.ticket_price || 10;
    let estimatedAmount = formData.estimated_amount || 50;

    const allPlatforms = [
      tickgetrCal,
      eventBriteCal,
      eventixCal,
      weeztixCal,
      yourTicketsCal,
      eventgooseCal,
      weTicketCal,
      goTicketsCal,
      ticketApplyCal,
      ticketKantoorCal,
      tickowebCal,
      flexticketsCal,
      weezEventCal,
    ].map(fn => fn(ticketPrice, estimatedAmount));

    let sorted;
    if (type === "Creditcard") {
      sorted = allPlatforms.sort((a, b) => (a.Creditcard ?? Infinity) - (b.Creditcard ?? Infinity));
    } else if (type === "Pay By Bank") {
      sorted = allPlatforms.sort((a, b) => (a.Paybybank ?? Infinity) - (b.Paybybank ?? Infinity));
    } else {
      sorted = allPlatforms.sort((a, b) => a.Bancontact - b.Bancontact);
    }

    setData(sorted);
  };

  const formatToFourDigits = (num) => num.toString().padStart(4, "0");

  return (
    <div className="w-full flex flex-col items-center pt-[120px] px-5 md:px-12 lg:px-20 pb-28 md:gap-8 gap-5 bg-zinc-100">
      <div className="flex flex-col text-center items-center gap-5 mt-4">
        <h1 className="text-4xl md:text-7xl font-oswald">
          {t("calculate_costs")}
        </h1>
        <h2 className="md:text-lg flex items-center mt-2">
          <BsClock className="mr-2" /> {t("last_update")}: &nbsp;<b>{lastUpdatedDate}</b>
        </h2>
      </div>

      <div className="flex flex-col-reverse justify-center mb-10 md:flex-row gap-7 md:gap-5 w-full">
        <div className="w-full lg:w-3/5 p-8 lg:p-10 bg-white shadow-lg rounded-2xl">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="text-3xl md:text-4xl font-bebas mb-3">{t("calculate")}</h2>
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 relative px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  {t("ticket_price")}
                  <span className="absolute text-base left-5 top-11"><MdEuroSymbol /></span>
                </label>
                <input
                  className="w-full p-4 ps-7 focus:outline-none rounded-md bg-zinc-100"
                  type="number"
                  name="ticket_price"
                  placeholder={t("ticket_price")}
                  value={formData.ticket_price ?? ""}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  min="1"
                />
              </div>
              <div className="w-full relative md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  {t("estimated_amount")}
                </label>
                <input
                  className="w-full p-4 ps-7 focus:outline-none rounded-md bg-zinc-100"
                  type="number"
                  name="estimated_amount"
                  placeholder={t("estimated_amount")}
                  value={formData.estimated_amount ?? ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  min="1"
                />
              </div>
            </div>

            <ButtonWithLoading
              isLoading={isLoading}
              isLoadingText={t("calculating")}
              isDisabled={isLoading}
              buttonText={t("calculate")}
              className={`${
                isLoading ? "py-4 px-6" : "py-4 px-10"
              } w-max focus:outline-none rounded-md text-white font-medium bg-orange-600 hover:bg-orange-700 transition`}
            />
          </form>
        </div>
      </div>

      {data.length > 0 && (
        <>
          <div style={{ width: '100%' }}>
            <div className="relative w-full">
              {!showGraph && (
                <Link href="compare" className="text-black px-5 py-3 bg-white hover:bg-black hover:text-white transition-all ease-linear rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30">{t("calculate_now")}</Link>
              )}
              <div style={{ width: '100%', height: 500 }} className={!showGraph ? "blur" : ""}>
                <ResponsiveContainer>
                  <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 65 }} barCategoryGap="18%" barGap="0">
                    <CartesianGrid strokeDasharray="4" horizontal={true} vertical={false} />
                    <XAxis dataKey="name" angle="-50" textAnchor="end" fill="#666" />
                    <YAxis tickFormatter={(v) => `€ ${v}`} domain={[0, Math.max(...data.map(p => p.Creditcard ?? 0)) + 5]} />
                    <Tooltip formatter={(value) => `€ ${value}`} />
                    <Legend layout="horizontal" verticalAlign="top" align="right" />
                    <Bar dataKey="Bancontact" fill="#ff4620" />
                    <Bar dataKey="Creditcard" fill="#ffb104" />
                    <Bar dataKey="Paybybank" fill="#007BFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareContent;
   
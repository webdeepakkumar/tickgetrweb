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
      <h1 className="text-3xl font-bold">{t("compare_heading")}</h1>
      {/* Rest of your JSX */}
    </div>
  );
};

export default CompareContent;

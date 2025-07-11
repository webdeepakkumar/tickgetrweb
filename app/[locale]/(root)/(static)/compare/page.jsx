"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/app/[locale]/components/Modal";
import { useTranslations } from "next-intl";
import { MdEuroSymbol } from "react-icons/md";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { eventBriteCal, eventgooseCal, eventixCal,weeztixCal, flexticketsCal, goTicketsCal, lastUpdatedAtDate, platformsPriceList, ticketApplyCal, ticketKantoorCal, tickgetrCal, tickowebCal, weezEventCal, weTicketCal, yourTicketsCal } from "@/app/[locale]/lib/platformCalculator";
import { addCompareCalculatorUse, fetchCompareCalculatorUse } from "@/app/(Api)/firebase/firebase_firestore";
import { format } from "date-fns";
import Link from "next/link";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import toast from "react-hot-toast";
 
export async function generateMetadata({ params }) {
  const { locale } = params;

  return {
    title: locale === "nl"
      ? "Vergelijk Ticket Platforms - Tickgetr"
      : "Compare Ticket Platforms - Tickgetr",
    description: locale === "nl"
      ? "Vergelijk tarieven van verschillende ticketingplatforms in België."
      : "Compare pricing of various ticket platforms in Belgium with ease.",
  };
}
 
const Compare = () => {
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
    // for dropdown
  const dataM =[
      {
        label: "Bancontact",
        value: "Bancontact"
      },
      {
        label: "Creditcard",
        value: "Creditcard"
      },
      {
        label:"Pay By Bank",
        value:"Pay By Bank"
      }
    ];
  const [isOpen, setIsOpen] = useState(false);
  const [itemPick, setItemPick] = useState({});
  // platform price toggle 
  const [tlgShow,setTlgshow]=useState(false);

  const lastUpdatedDate = lastUpdatedAtDate();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
  },[currentCount, lastUsed]);

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

  const sortPlatformFee = (type) => {
    getPlatformData(type);
  }

  const getPlatformData = (type) => {
    let ticketPrice = formData.ticket_price ? formData.ticket_price : 10;
    let estimatedAmount = formData.estimated_amount ? formData.estimated_amount : 50;

    const tickgetr = tickgetrCal(ticketPrice, estimatedAmount);
    const eventBrite = eventBriteCal(ticketPrice, estimatedAmount);
    const eventix = eventixCal(ticketPrice, estimatedAmount);
    const wicket = weeztixCal(ticketPrice, estimatedAmount);
    const yourTickets = yourTicketsCal(ticketPrice, estimatedAmount);
    const eventgoose = eventgooseCal(ticketPrice, estimatedAmount);
    const weTicket = weTicketCal(ticketPrice, estimatedAmount);
    const goTickets = goTicketsCal(ticketPrice, estimatedAmount);
    const ticketApply = ticketApplyCal(ticketPrice, estimatedAmount);
    const ticketKantoor = ticketKantoorCal(ticketPrice, estimatedAmount);
    const tickoweb = tickowebCal(ticketPrice, estimatedAmount);
    const flextickets = flexticketsCal(ticketPrice, estimatedAmount);
    const weezEvent = weezEventCal(ticketPrice, estimatedAmount);
    
    let platformData = [tickgetr, eventBrite, eventix, wicket, yourTickets, eventgoose, weTicket, goTickets, ticketApply, ticketKantoor, tickoweb, flextickets, weezEvent];

    if(type == 'Creditcard') {
      const sortedByAmount = platformData.sort((a, b) => {
        if (a.Creditcard === null) return 1; 
        if (b.Creditcard === null) return -1; 
        return a.Creditcard - b.Creditcard; 
      });
      setData(sortedByAmount);
    }else if(type == 'Paybybank'){
      const sortedByAmount = platformData.sort((a,b)=>{
        if(a.Paybybank === null) return 1;
        if(b.Paybybank === null) return -1;
        return a.Paybybank - b.Paybybank;
      });
      setData(sortedByAmount)
    }
     else {
      const sortedByAmount = platformData.sort((a, b) => a.Bancontact - b.Bancontact);
      setData(sortedByAmount);
    }
  }

  const formatToFourDigits = (num) => {
    return num.toString().padStart(4, "0");
  };
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  const toggleShow=()=>{
    setTlgshow(!tlgShow);
  }

  return (
    <div className="w-full flex flex-col items-center pt-[120px] md:pt-[120px] px-5 md:px-12 lg:px-20 pb-28 md:gap-8 gap-5 bg-zinc-100">
      <div className="flex flex-col text-center items-center gap-5 mt-4">
        <h1 className="text-4xl md:text-7xl font-oswald">
          {t("calculate_costs")}
        </h1>
        <h2 
          className="md:text-lg flex items-center mt-2"
        >
         <BsClock className="mr-2"/> {t("last_update")}: &nbsp;<b>{lastUpdatedDate}</b>
        </h2>
      </div>
      <div className="flex flex-col-reverse justify-center mb-10 md:flex-row gap-7 md:gap-5 w-full">
        <div className="w-full lg:w-3/5 p-8 lg:p-10 bg-white shadow-lg rounded-2xl">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="text-3xl md:text-4xl font-bebas mb-3">
              {t("calculate")}
            </h2>
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 relative px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                {t("ticket_price")}
                <span className="absolute text-base left-5 top-11"><MdEuroSymbol /></span>
                </label>
                <input
                  id="grid-first-name"
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
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                {t("estimated_amount")}
                </label>
                <input
                  id="grid-last-name"
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
        <div style={{ width: '100%'}}>
          <div className="relative w-full">
            {!showGraph && (
              <Link href="compare" className="text-black px-5 py-3 bg-white hover:bg-black hover:text-white transition-all ease-linear rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30">{t("calculate_now")}</Link>
            )}
            <div style={{ width: '100%', height: 500 }} className={!showGraph ? "blur" : ""}>
              <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 65,
                    }}
                    barCategoryGap="18%"
                    barGap="0"
                >
                  <CartesianGrid strokeDasharray="4" horizontal={true} vertical={false}/>
                  <XAxis 
                    dataKey="name" 
                    angle="-50" 
                    textAnchor="end" 
                    fill="#666"
                  />
                  <YAxis 
                    tickFormatter={v => `€ ${v}`} 
                    domain={[0, parseInt(data[data.findIndex(item => item.name === 'Flextickets')].Creditcard) + 5 ]} 
                  />
                  <Tooltip formatter={(value) => `€ ${value}`}/>
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="top" 
                    align="right" 
                  />
                  <Bar 
                    dataKey="Bancontact" 
                    fill="#ff4620" 
                  />
                  <Bar 
                    dataKey="Creditcard" 
                    fill="#ffb104" 
                  />
                    <Bar 
                    dataKey="Paybybank" 
                    fill="#007BFF" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="main-table mb-8 relative mt-16 text-white overflow-x-scroll mx-auto max-w-5xl min-w-64 w-full">
            {!showGraph && (
              <Link href='compare' className="text-black px-5 py-3 bg-white hover:bg-black hover:text-white transition-all ease-linear rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30">{t("calculate_now")}</Link>
            )}
            <div className={!showGraph ? "blur" : ""}>
              {/* dropdown start */}
              <div className="flex flex-col justify-center items-end mb-2">
                <span className="text-black">{t("filter_by")}:</span>
                <div className="relative">
                  <div className="w-60 p-2 pr-6 rounded bg-white text-black cursor-pointer" onClick={toggleOpen}>
                    {itemPick.label || 'Bancontact'}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer text-black" onClick={toggleOpen}>
                    {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                  <div className={`absolute top-[105%] w-60
                    ${isOpen ? "max-h-60" : "max-h-0"} overflow-hidden duration-150 ease-linear`}>
                    <div className="flex flex-col">
                      {
                        dataM && dataM.map((item, index) => (
                          <div key={index}>
                            <div className={`border p-2 text-black hover:bg-orange-200 cursor-pointer
                              ${index % 2 ? "bg-white" : "bg-white"}
                              ${index === 0 ? "rounded-t" : index === dataM.length - 1 ? "rounded-b" : "rounded-none"}`}
                              onClick={() => {
                                setItemPick(item);
                                sortPlatformFee(item.value);
                                toggleOpen();
                              }}>
                                {item.label}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
              {/* dropdown end */}
              <table className="table-auto rounded-xl whitespace-nowrap w-full">
                <thead className="rounded-xl">
                  <tr className="text-left">
                    <th className="px-4 py-4 rounded-xl border border-slate-50 border-r-4 border-spacing-2 bg-grey-900"></th>
                    <th className="px-4 py-4 rounded-l-xl bg-orange-600 "></th>
                    <th className="px-4 py-4 bg-orange-600 "></th>
                    <th className="px-4 py-4 bg-orange-600 ">
                      <div className="cursor-pointer inline-flex items-center">
                        <img className="p-1 w-12 rounded-lg h-10" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpgwr8Ls7fWZhubSlFX5Yz19yFdAMb6nzS3g&s'/>
                        <div className="hover:text-slate-300 text-white transition-all ease-in-out duration-200">
                          Pay by bank
                        </div>
                      </div>
                    </th>

                    <th className="px-4 py-4 bg-orange-600">
                      <div className="cursor-pointer inline-flex items-center">
                        <img className="p-1 w-12" src='/icons/cards/bancontact.png'/>
                        <div className="hover:text-slate-300 text-white transition-all ease-in-out duration-200">
                          Bancontact
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-4 bg-orange-600 ">
                      <div className="cursor-pointer inline-flex items-center">
                        <img className="p-1 w-12" src='/icons/cards/visa.png'/>
                        <img className="p-1 w-12" src='/icons/cards/mastercard.png'/>
                        <div className="hover:text-slate-300 text-white transition-all ease-in-out duration-200">
                          Creditcard
                        </div>
                      </div>
                    </th>
                   
                    <th className="px-4 py-4 rounded-r-xl bg-orange-600 "></th>
                  </tr>
                </thead>
                <tbody >
                  {data.map((platform, index) => (
                    <tr key={platform.name} className="border-t-4 border-white ease-in-out duration-300 bg-gradient-to-r from-orange-600 to-orange-400 hover:bg-gradient-to-l">
                      <td className="px-4 py-2 border border-e-4 border-slate-50 rounded-xl">{index+1}</td>
                      <td className="px-4 py-2 rounded-l-xl">
                        <div className="bg-white rounded-3xl w-8 h-8">
                          <img className="p-1 rounded-xl" src={platform.icon}/>
                        </div>
                      </td>
                      <td className="px-4 py-2">{platform.name}</td>
                      <td className="px-4 py-2">{platform.Paybybank > 0 ? `€ ${platform.Paybybank}` : 'NOT AVAILABLE'}</td>
                      <td className="px-4 py-2"> {platform.Bancontact > 0 ? `€${platform.Bancontact}` : "NOT AVALABLE"}</td>
                      <td className="px-4 py-2">{platform.Creditcard > 0 ? `€ ${platform.Creditcard}` : 'NOT AVAILABLE'}</td>
                      <td className="px-4 py-2 min-w-16 rounded-r-xl">
                        <img className="p-1 w-11" src={platform.flag}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Start Platform price */}
      <div className="text-center mb-8">
        <button onClick={toggleShow} className="flex items-center px-10 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white ease-in-out duration-300">
        {t("platform_pricing")} &nbsp; {tlgShow ? <IoChevronUp/> : <IoChevronDown/>} 
        </button>
      </div>
      {tlgShow ?
        <div className="ticket-box">
          <div className="px-6 py-10 bg-white max-w-5xl w-full mx-auto shadow-2xl rounded-3xl">
            
            <div className="flex flex-wrap">
              { platformsPriceList.map((platform) => (
                <div className="p-2 flex-[0 0 auto] w-full sm:w-1/2 lg:w-2/6">
                  <div className="border-4 border-orange-500 rounded-lg p-3 h-44">
                    <div className="flex gap-1 items-center mb-4">
                        {/* <IoTicketOutline /> */}
                        <div className="bg-white rounded-3xl w-9 h-9 border-3 border-orange-500">
                          <img className="p-1 rounded-xl" src={platform.icon}/>
                        </div>
                      <h4 className="text-2xl font-medium">{platform.name}</h4>
                    </div>
                    <div className="text-sm text-black">
                      <p className="mb-2">{platform.pricing_of_platform} {platform.vat} BTW</p>
                      <p className="mb-2">Bancontact -&#x3e; {platform.payment_methods.Bancontact}</p>
                      <p>Creditcard -&#x3e; {platform.payment_methods.Creditcard}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      : null}
      {/* End Platform price */}
      
      <div className="con-card mb-0 px-6 py-10 bg-white max-w-5xl w-full shadow-2xl rounded-3xl">
          <div className="con-content max-w-xl mx-auto">
            <h3 className="text-2xl font-semibold  mb-6">{t("how_are_prices_calculated")}</h3>
            <p className="text-lg mb-4 font-medium text-slate-600">{t("calculator_based_on")}</p>
            <ul className="mb-6">
                <li>&#8226; {t("official_price_lists")}</li>
                <li>&#8226; {t("costs_from_payment_providers")}</li>
                <li>&#8226; {t("vat_tarifs")}</li>
                <li>&#8226; {t("service_fees")}</li>
              </ul>
              <div>
                <Modal isModalOpen={isModalOpen} handleModalClose={handleModalClose}/>
                <div className="flex justify-center">
                  <button onClick={() => setIsModalOpen(true)} className="inline-block px-10 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white ease-in-out duration-300">{t("view_examples")}</button>
                </div>
              </div>
          </div>
      </div>

      <div className="con-card mb-0 px-6 py-10 bg-white text-center max-w-5xl w-full shadow-2xl rounded-3xl">
          <div className="con-content">
            <h3 className="text-2xl font-semibold mb-8">{t("about_calculations")}</h3>
            <Link className="inline-block px-10 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white ease-in-out duration-300" href="contact">{t("contact_us")}</Link>
          </div>
      </div>

      <div className="con-card mb-0 px-6 py-10 bg-white max-w-5xl w-full shadow-2xl rounded-3xl">
          <div className="con-content text-center mb-5">
            <h3 className="text-2xl font-semibold mb-10">{t("why_to_choose")}</h3>
            </div>
            <div className="mb-4 text-center border-4 border-orange-500 rounded-lg p-4 w-full">
            <h3 className="text-xl mb-4 font-semibold ">{t("compare_intro")}</h3>
            <h4 className="text-base font-medium">{t("compare_text")}</h4>
            </div>
          <div className="box-hdd bg-orange-100 mb-4 rounded-xl p-5 mt-2">
            <h4 className="text-xl font-medium mb-4">{t("cheapest_solution")}</h4>
            <p className="text-base text-slate-600">{t("pay_more")}</p>
          </div>
          <div className="box-hdd bg-orange-100 mb-4 rounded-xl p-5">
            <h4 className="text-xl font-medium mb-4">{t("user_friendly")}</h4>
            <p className="text-base text-slate-600">{t("quickly_and_easily")}</p>
          </div>
          <div className="box-hdd bg-orange-100 mb-4 rounded-xl p-5">
            <h4 className="text-xl font-medium mb-4">{t("payment_methods")}</h4>
            <p className="text-base text-slate-600">{t("support_for")}</p>
          </div>
          <div className="box-hdd bg-orange-100 mb-4 rounded-xl p-5">
            <h4 className="text-xl font-medium mb-4">{t("transparency")}</h4>
            <p className="text-base text-slate-600">{t("clear_insight")}</p>
          </div>
      </div>

      <div className="flex flex-col mt-4 justify-center items-center h-40 w-full max-w-5xl mx-auto shadow-2xl bg-orange-50 rounded-3xl">
        <p className="text-base mt-2 mb-2 text-slate-600">
          {t("use_calculator")}
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold text-orange-600">
          {formatToFourDigits(currentCount)}
        </h1>
        <p className="text-base mt-3 text-slate-600">
        {t("last_used")}  {lastUsed}
        </p>
      </div>
    </div>
  );
};

export default Compare;

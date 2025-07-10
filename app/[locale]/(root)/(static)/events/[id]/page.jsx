"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EventExpired from "@/app/[locale]/components/exipredEvent";
import DisableEvent from "@/app/[locale]/components/disableEvent";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import {
  fetchOneEventViaName,
  fetchDiscountCode,
  fetchOneUser,
  updateDiscounFields,
  addTransaction,
} from "@/app/(Api)/firebase/firebase_firestore";
import { addBuyers } from "@/app/(Api)/firebase/firebase_firestore";

import { getLatLongFromAddress } from "@/app/(Api)/maps/geocode";
import PopupForm from "@/app/[locale]/components/PopupForm";
import GoogleMapComponent from "@/app/[locale]/context/GoogleMapComponent";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import TgLogo from "@/app/[locale]/components/logo";
import Transition from "@/app/[locale]/animations/transition4";

import { LuCalendarClock } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { FaMapMarkedAlt, FaCheck } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const referralOptions = [
  { name: "Facebook" },
  { name: "Instagram" },
  { name: "Twitter" },
  { name: "Snapchat" },
  { name: "Linkedin" },
  { name: "Others" },
];

const EventTicket = ({ params: { locale } }) => {
  const t = useTranslations("eventDisplay");
  const router = useRouter();

  const { id } = useParams();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("id");
  const status = searchParams.get("result");
  // const cancel_payment = searchParams.get("cancel_payment");
  const isOrganizer = searchParams.get("organizer");
  const [discountCode, setDiscountCode] = useState("");
  const [discountDetails, setDiscountDetails] = useState([0, 0, 0]);
  const [ticketIncrementPrice, setTicketIncrementPrice] = useState(0);
  const [showReferralsPopup, setShowReferralsPopup] = useState(false);
  const [noOfTickets, setNoOfTickets] = useState(0);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);
  const [eventData, setEventData] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [fetchUsers, setFetchUsers] = useState([]);
  const [referrals, setReferrals] = useState("Others");
  const [sessionData, setSessionData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [eventName, setEventName] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [eventvisible, setEventvisible] = useState(false);
  const [eventstatus, setEventstatus] = useState(null);
  const [buyersdata, setBuyersdata] = useState({
    name: "",
    email: "",
    number: "",
  });

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (id) {
      const eventName = decodeURIComponent(id)
        .replace(/([A-Z])/g, "$1")
        .trim();
      setEventName(eventName);
    }
  }, [id]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventName) {
        setIsLoadingData(true);
        await fetchOneEventViaName(eventName, setEventData);
        setIsLoadingData(false);
      }
    };

    fetchEvent();
  }, [eventName]);

  useEffect(() => {
    if (!isLoadingData && eventData && eventData.adminAuth !== undefined) {
      const eventEnabled = eventData.adminAuth;
      const endDate = eventData.eEnd.toDate();
      const isVisible = eventData.isVisible;
      const today = new Date();
      setEventstatus(eventEnabled);
      if (!isOrganizer) {
        if (eventEnabled === true) {
          if (isVisible === true && endDate > today) {
            setIsLoadingData(false);
          } else {
            router.push("/events");
          }
        } else {
          router.push("/events");
        }
      }
      if (endDate < new Date()) {
        setEventvisible(true);
        setIsLoading(false);
      }
    }
  }, [eventData, isLoadingData]);

  const userId = eventData.userId;
  const eventId = eventData.eId;
  const pOnCharges = eventData.pOnCharges;

  useEffect(() => {
    if (userId) {
      fetchOneUser(userId, setFetchUsers);
    }
  }, [userId]);

  const userData = fetchUsers.length > 0 ? fetchUsers[0] : null;

  const stripeId = userData?.stripeAccountId;
  const uEmail = userData?.uEmail;

  useEffect(() => {
    if (eventData.eAddress) {
      getLatLongFromAddress(eventData.eAddress).then((coords) => {
        if (coords) {
          setMapCenter(coords);
        }
      });
    }
  }, [eventData.eAddress]);

  useEffect(() => {
    const dCodeUsed = discountDetails[2];

    if (dCodeUsed > 0) {
      const discountData = {
        dCodeUsed: dCodeUsed - 1,
      };
      (async () => {
        await updateDiscounFields(
          eventId,
          discountDetails[0],
          discountData,
          "dCodeUsed"
        );
      })();
    }
  }, [discountDetails, eventId]);

  const handleSubmitCode = async (e) => {
    setIsLoadingDiscount(true);
    e.preventDefault();
    const ticketType = eventData.ticketInfo[selectedTicketIndex].tType;
    if (eventId && discountCode) {
      await fetchDiscountCode(
        eventId,
        discountCode,
        (details) => {
          setDiscountDetails(details);
        },
        ticketType
      );
      setDiscountCode("");
      setIsLoadingDiscount(false);
    }
  };

  const tPrice = eventData?.ticketInfo?.[0]?.tPrice;
  const eName = eventData?.eName;

  const handleOrder = async () => {
    if (!buyersdata.name || !buyersdata.email || !buyersdata.number) {
      toast.error("Please fill the details before proceeding.");
      return;
    }
    setIsLoading(true);
    let discountPrice = eventData.ticketInfo[selectedTicketIndex].tPrice;
    if (discountDetails[1] != 0) {
      discountPrice =
        eventData.ticketInfo[selectedTicketIndex].tPrice -
        (eventData.ticketInfo[selectedTicketIndex].tPrice *
          discountDetails[1]) /
          100;
    }
    let amount = eventData.ticketInfo[selectedTicketIndex].tPrice;
    setBuyersdata(buyersdata);

    try {
      const response = await axios.post("/api/create-checkout-session", {
        accountId: stripeId,
        description: eventData.eDescription,
        amount: amount,
        ticketType: eventData.ticketInfo[selectedTicketIndex].tType,
        quantity: noOfTickets,
        pOnCharges: pOnCharges,
        referralSource: referrals,
        eventId: eventId,
        ticketIndex: selectedTicketIndex,
        eventName: eventData.eName,
        discountPercent: discountDetails[1],
        uEmail: buyersdata.email,
        userId: userId,
        eStart: format(
          eventData.eStart.toDate(),
          "dd/MM/yyyy HH:mm:ss 'UTC'XXX"
        ),
        locale,
      });

      const url = response.data.url;
      const transaction_id = response.data.transcation_id;
      const ticketType = response.data.ticketType;
      const eStart = response.data.eStart;
      const paymentId = response.data.paymentId;
      const discount = response.data.discount;

      //add in databse

      await addTransaction(
        transaction_id,
        eventId,
        buyersdata,
        noOfTickets,
        ticketType,
        uEmail,
        eName,
        eStart,
        referrals,
        discount
      );
      if (url) {
        window.location.href = url;
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleIncrement = () => {
    if (
      noOfTickets <= eventData.ticketsPerOrder - 1 &&
      noOfTickets <= eventData.ticketInfo[selectedTicketIndex].tQuantity - 1
    ) {
      setTicketIncrementPrice(
        ticketIncrementPrice + eventData.ticketInfo[selectedTicketIndex].tPrice
      );
      setNoOfTickets((prevNoOfTickets) => prevNoOfTickets + 1);
    }
  };

  const handleDecrement = () => {
    if (
      ticketIncrementPrice >= eventData.ticketInfo[selectedTicketIndex].tPrice
    ) {
      setTicketIncrementPrice(
        ticketIncrementPrice - eventData.ticketInfo[selectedTicketIndex].tPrice
      );
      setNoOfTickets((prevNoOfTickets) => prevNoOfTickets - 1);
    }
  };

  const handleDiscountCodeChange = (event) => {
    setDiscountCode(event.target.value);
  };

  const handleTicketTypeChange = (ticketType) => {
    const index = eventData.ticketInfo.findIndex(
      (ticket) => ticket.tType === ticketType
    );
    setDiscountDetails([0, 0, 0]);
    setSelectedTicketIndex(index);
    setTicketIncrementPrice(0);
    setNoOfTickets(0);
  };

  const center = mapCenter;
  const markerPosition = center;

  const currentDate = new Date();

  const availableTickets =
    eventData?.ticketInfo
      ?.map((ticket) => {
        if (ticket.tStatus == true && ticket.tEnd.toDate() > currentDate) {
          return ticket;
        }

        return null;
      })
      .filter((ticket) => ticket !== null) || [];

  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`;
    window.open(directionsUrl, "_blank");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadPdf = async () => {
    const pdfUrl = eventData.eventPDF;
    console.log(eventData.eventPDF);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = "Terms_and_Conditions.pdf";
    link.click();
  };

  if (session_id) {
    return (
      <Transition
        y={100}
        className="flex flex-col justify-center items-center py-10 md:py-20 px-5 gap-8 bg-zinc-100 w-full"
      >
        {status === "done" ? (
          <div className="rounded-full p-7 bg-green-400 bg-opacity-20">
            <div className="rounded-full p-7 bg-green-400 bg-opacity-50">
              <div className="p-4 text-3xl rounded-full bg-green-500 text-white">
                <FaCheck />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-full p-7 bg-red-400 bg-opacity-20">
            <div className="rounded-full p-7 bg-red-400 bg-opacity-50">
              <div className="p-4 text-3xl rounded-full bg-red-500 text-white">
                <IoMdCloseCircleOutline />
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="font-oswald text-3xl">
            {status === "done" ? t("payment_successful") : t("payment_failed")}
          </h1>
          <p className="text-zinc-600 text-sm md:text-base">
            {status === "done" ? t("e_ticket_email") : ""}
          </p>
        </div>
        {sessionData ? (
          <div className="flex flex-col bg-white shadow-lg w-full md:w-[450px] p-4 md:p-5 rounded-xl">
            <div className="font-oswald text-2xl text-center border-b pb-4 text-tg-orange2">
              {sessionData.eventName}
            </div>
            <table className="text-sm md:text-base my-5">
              <tr>
                <th className="text-left font-medium pt-2">
                  {t("customer_name")}
                </th>
                <td className="text-right pt-2">{sessionData.customerName}</td>
              </tr>
              <tr>
                <th className="text-left font-medium pt-2">
                  {t("customer_email")}
                </th>
                <td className="text-right pt-2">{sessionData.customerEmail}</td>
              </tr>
              <tr>
                <th className="text-left font-medium pt-2">
                  {t("transaction_date")}
                </th>
                <td className="text-right pt-2">
                  {new Date(sessionData.created * 1000).toLocaleString()}
                </td>
              </tr>
              <tr>
                <th className="text-left font-medium pt-2">
                  {t("ticket_type")}
                </th>
                <td className="text-right pt-2">{sessionData.ticketType}</td>
              </tr>
              <tr>
                <th className="text-left font-medium pb-3 pt-2">
                  {t("number_of_tickets")}
                </th>
                <td className="text-right pb-3 pt-2">
                  {sessionData.tQuantity}
                </td>
              </tr>
              <tr className="border-t">
                <th className="text-left font-medium text-base md:text-lg pt-3">
                  {t("total_amount")}
                </th>
                <td className="text-right text-base md:text-lg font-medium pt-3">
                  € {sessionData.amountTotal / 100}
                </td>
              </tr>
            </table>

            <Link
              href="/events"
              className="w-full p-3 border-2 border-transparent hover:border-black hover:bg-transparent hover:text-black font-medium transition bg-black text-white text-center rounded-lg"
            >
              {t("go_back_to_events")}
            </Link>
          </div>
        ) : (
          <p></p>
        )}
      </Transition>
    );
  }

  return eventstatus === null ? (
    <LoadingSpinner />
  ) : eventstatus ? (
    eventvisible ? (
      <EventExpired />
    ) : (
      <div className="bg-zinc-100 w-full pb-20">
        <div
          className="relative h-[350px] md:h-[550px] w-full"
          style={{
            backgroundImage: `url(${
              isLoadingData ? "" : `${eventData.eBanner}`
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000F2] to-[#000000BF] flex flex-col justify-center items-center pt-8 md:pt-16 text-white">
            <Link
              href="/"
              className="absolute left-0 top-0 m-3 md:m-6 bg-black p-1 text-white rounded-full hover:bg-tg-orange transition-all"
            >
              <MdKeyboardArrowLeft className="text-3xl" />
            </Link>
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
            {isLoadingData ? (
              <div className="animate-pulse bg-white/10 rounded-lg mb-2 md:mb-3 h-6 w-20"></div>
            ) : (
              <div className="text-sm md:text-md uppercase text-opacity-90 mb-2 md:mb-3">
                {eventData.eCategory}
              </div>
            )}
            {isLoadingData ? (
              <div className="animate-pulse bg-white/10 rounded-lg mb-2 md:mb-4 h-14 md:w-96 w-56"></div>
            ) : (
              <div className="text-3xl md:text-5xl font-oswald mb-2 md:mb-4 text-center px-4">
                {eventData.eName}
              </div>
            )}
            <div className="w-10 md:w-16 border-b-2 border-orange-200 my-3 md:my-5"></div>
            {isLoadingData ? (
              <div className="animate-pulse bg-white/10 rounded-lg  mb-3 h-8 w-32"></div>
            ) : (
              <div className="text-md md:text-lg uppercase font-medium text-opacity-90 mb-3">
                {eventData.eCity}
              </div>
            )}
            {isLoadingData ? (
              <div className="px-4 py-3 animate-pulse bg-white/10 rounded-lg h-10 w-56"></div>
            ) : (
              <div className="bg-black bg-opacity-60 px-4 py-3 rounded-md font-light inline-flex gap-2.5 items-center text-sm md:text-md">
                <LuCalendarClock className="mt-[-2px] md:text-lg font-bebas" />
                {eventData.eStart &&
                  format(eventData.eStart.toDate(), "HH:mm 'on' do MMMM yyyy")}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col px-5 xl:px-0 xl:container mx-auto py-8 gap-5 relative">
          <div className="h-4 absolute left-0 -top-3 w-full rounded-t-xl bg-zinc-100 flex justify-center items-end lg:hidden">
            <div className="w-12 h-1 bg-zinc-500 rounded-full"></div>
          </div>
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-8">
            {/* Left */}
            <div className="w-full lg:w-2/3 flex flex-col gap-5">
              {/* time */}
              <div className="flex flex-col lg:flex-row gap-5 w-full">
                {isLoadingData ? (
                  <>
                    <div className="animate-pulse bg-black/10 rounded-lg w-full lg:w-1/2 h-24"></div>
                    <div className="animate-pulse bg-black/10 rounded-lg w-full lg:w-1/2 h-24"></div>
                  </>
                ) : (
                  <>
                    <div className="bg-zinc-950 text-white p-4 rounded-lg inline-flex items-center gap-5 w-full lg:w-1/2 shadow-md shadow-zinc-200">
                      <div className="text-3xl bg-zinc-700 text-white w-max p-5 rounded-md">
                        <IoCalendar />
                      </div>
                      <div>
                        <div className="font-oswald text-2xl mb-1">
                          {t("event_start")}
                        </div>
                        <p className="text-zinc-400">
                          {eventData.eStart &&
                            format(
                              eventData.eStart.toDate(),
                              "HH:mm, do MMMM yyyy"
                            )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg inline-flex items-center gap-5 w-full lg:w-1/2 shadow-md shadow-zinc-200">
                      <div className="text-3xl bg-orange-100 text-tg-orange2 w-max p-5 rounded-md">
                        <IoCalendar />
                      </div>
                      <div>
                        <div className="font-oswald text-2xl mb-1">
                          {t("event_end")}
                        </div>
                        <p className="text-zinc-500">
                          {eventData.eEnd &&
                            format(
                              eventData.eEnd.toDate(),
                              "HH:mm, do MMMM yyyy"
                            )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isLoadingData ? (
                <>
                  {/* desc */}
                  <div className="bg-black/10 animate-pulse rounded-lg h-48 lg:h-32 w-full"></div>
                  {/* address */}
                  <div className="bg-black/10 animate-pulse rounded-lg w-full h-28 lg:h-32"></div>
                  {/* maps */}
                  <div className="relative w-full h-96 bg-black/10 animate-pulse rounded-lg"></div>
                </>
              ) : (
                <>
                  {/* desc */}
                  <div className="bg-white rounded-lg p-6 shadow-md shadow-zinc-200">
                    <h3 className="font-oswald text-3xl mb-6">
                      {t("description")}
                    </h3>
                    <p>{eventData.eDescription}</p>
                  </div>
                  {/* address */}
                  <div className="bg-white p-4 rounded-lg inline-flex items-center gap-5 shadow-md shadow-zinc-200">
                    <div className="text-3xl bg-orange-100 text-tg-orange2 w-max p-5 rounded-md">
                      <FaMapMarkedAlt />
                    </div>
                    <div>
                      <div className="font-oswald text-2xl mb-1">
                        {t("venue")}
                      </div>
                      <p className="text-zinc-500">{eventData.eAddress}</p>
                    </div>
                  </div>
                  {/* maps */}
                  <div className="relative w-full h-96 flex justify-center items-center text-white text-2xl bg-zinc-500 rounded-lg overflow-hidden shadow-md shadow-zinc-200">
                    <GoogleMapComponent
                      center={center}
                      markerPosition={markerPosition}
                    />
                    <button
                      className="absolute z-10 left-4 bottom-4 bg-white text-sm text-orange-700 hover:bg-black hover:text-orange-300 transition font-medium shadow-md px-4 py-2.5 rounded-md"
                      onClick={handleGetDirections}
                    >
                      {t("get_directions")}
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* divider */}
            <div className="lg:hidden inline-flex justify-center gap-2">
              <div className="w-4 h-4 bg-tg-orange2 rounded-full"></div>
              <div className="w-4 h-4 bg-tg-orange2 rounded-full"></div>
              <div className="w-4 h-4 bg-tg-orange2 rounded-full"></div>
            </div>
            {/* Right */}
            <div className="w-full lg:w-1/3 h-max flex flex-col gap-5">
              {/* Buy ticket */}
              {isLoadingData ? (
                <div className="w-full lg:h-80 md:h-52 h-48 bg-black/10 animate-pulse rounded-lg flex flex-col "></div>
              ) : (
                <>
                <div className="w-full h-max inline-flex justify-center items-center bg-white text-red-400 rounded-lg shadow-md shadow-zinc-200 p-5 font-oswald text-xl">
                      {t("beware_of_blocker")}
                    </div>
                <div className="w-full h-max flex flex-col gap-4 bg-zinc-900 rounded-lg shadow-md shadow-zinc-200 p-5 text-white">
                  {/* select ticket type */}
                  <div className="font-oswald text-2xl py-2 mb-2">
                    {t("buy_your_tickets")}
                  </div>
                  {/* {availableTickets.length > 0 && onBoardingComplete === true ? ( */}
                  {availableTickets.length > 0 ? (
                    <>
                      <div className="flex flex-col items-end md:flex-row md:items-center gap-3 mb-3 md:mb-0">
                        <div className="inline-flex gap-2 w-full">
                          <Dropdown>
                            <DropdownTrigger className="px-5 h-12 flex items-center text-left rounded-md bg-zinc-700 w-full text-zinc-200 transition-all outline-none cursor-pointer">
                              {selectedTicketIndex !== null ? (
                                <div className="inline-flex justify-between w-full">
                                  <div>
                                    {
                                      eventData?.ticketInfo?.[
                                        selectedTicketIndex
                                      ]?.tType
                                    }
                                  </div>
                                  <div>
                                    €{" "}
                                    {
                                      eventData?.ticketInfo?.[
                                        selectedTicketIndex
                                      ]?.tPrice
                                    }
                                  </div>
                                </div>
                              ) : (
                                t("select_ticket_type")
                              )}
                            </DropdownTrigger>
                            <DropdownMenu
                              className="w-full"
                              aria-label="Single selection actions"
                              disallowEmptySelection
                              selectionMode="single"
                              selectedKeys={[String(selectedTicketIndex)]}
                              onSelectionChange={(keys) => {
                                const selectedIndex = parseInt(
                                  Array.from(keys)
                                );
                                const selectedTicketType =
                                  availableTickets[selectedIndex].tType;
                                handleTicketTypeChange(selectedTicketType);
                              }}
                            >
                              {availableTickets.map((ticket, index) => (
                                <DropdownItem className="w-full" key={index}>
                                  <div className="w-full inline-flex justify-between">
                                    <div>{ticket.tType}</div>
                                    <div className="text-tg-orange2 ml-5">
                                      (€{ticket.tPrice})
                                    </div>
                                  </div>
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                        {selectedTicketIndex !== null &&
                          (eventData?.ticketInfo[selectedTicketIndex]
                            .tQuantity === 0 ? (
                            <div className="bg-red-500 bg-opacity-40 h-12 rounded-lg min-w-full md:min-w-max inline-flex justify-center items-center px-5">
                              {t("sold_out")}
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-3 md:gap-0 w-full md:w-max">
                              <div className="bg-emerald-500 bg-opacity-40 h-12 rounded-lg w-full inline-flex justify-center items-center px-5 md:hidden">
                                {t("available")}
                              </div>
                              <div className="inline-flex bg-zinc-500 bg-opacity-30 h-12 rounded-lg">
                                <div className="p-1.5 w-12 h-full">
                                  <button
                                    className="w-full h-full text-center text-xl bg-zinc-900 rounded-md hover:text-red-400 transition"
                                    onClick={handleDecrement}
                                  >
                                    -
                                  </button>
                                </div>
                                <div className="min-w-8 flex justify-center items-center">
                                  {noOfTickets}
                                </div>
                                <div className="p-1.5 w-12 h-full">
                                  <button
                                    className="w-full h-full text-center text-xl bg-zinc-900 rounded-md hover:text-emerald-400 transition"
                                    onClick={handleIncrement}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {/* ticket buyer data */}
                      <div className="flex flex-col gap-2  text-black  ">
                        <input
                          type="text"
                          value={buyersdata.name}
                          onChange={(e) =>
                            setBuyersdata({
                              ...buyersdata,
                              name: e.target.value,
                            })
                          }
                          className="w-full bg-white p-2 rounded-md outline-none px-3 font-medium block mb-2"
                          placeholder={t("enter_your_name")}
                          required
                        />
                        <input
                          type="email"
                          value={buyersdata.email}
                          onChange={(e) =>
                            setBuyersdata({
                              ...buyersdata,
                              email: e.target.value,
                            })
                          }
                          className=" bg-white p-2 rounded-md outline-none px-3 font-medium block mb-2"
                          placeholder={t("enter_your_email")}
                          required
                        />
                        <input
                          type="number"
                          value={buyersdata.number}
                          onChange={(e) =>
                            setBuyersdata({
                              ...buyersdata,
                              number: e.target.value,
                            })
                          }
                          className="w-full bg-white p-2 rounded-md  outline-none px-3 font-medium mb-2"
                          placeholder={t("enter_contact_number")}
                          required
                        />
                      </div>
                      {/* discount code */}
                      <div className="inline-flex gap-2 h-12 bg-white p-1 rounded-md items-center text-black">
                        {discountDetails[1] === 0 ? (
                          <>
                            <input
                              type="text"
                              value={discountCode}
                              onChange={handleDiscountCodeChange}
                              className="w-full bg-transparent outline-none px-3 font-medium"
                              placeholder={t("enter_discount_code")}
                              required={true}
                            />
                            <button
                              onClick={handleSubmitCode}
                              type="button"
                              disabled={
                                isLoadingDiscount ||
                                selectedTicketIndex === null ||
                                eventData?.ticketInfo[selectedTicketIndex]
                                  .tQuantity === 0 ||
                                discountCode === ""
                              }
                              className={`px-5 h-full transition rounded-md font-medium ${
                                isLoadingDiscount ||
                                selectedTicketIndex === null ||
                                eventData?.ticketInfo[selectedTicketIndex]
                                  .tQuantity === 0 ||
                                discountCode === ""
                                  ? "bg-zinc-400 text-white cursor-not-allowed"
                                  : "bg-black text-white hover:bg-red-400"
                              }`}
                            >
                              {t("apply")}
                            </button>
                          </>
                        ) : (
                          <div className="flex text-emerald-500 rounded-md font-medium items-center gap-2 w-full h-full justify-center">
                            <FaCircleCheck /> {t("discount_code_verified")}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-red-400 bg-red-400 bg-opacity-10 text-center p-4 rounded-lg">
                      {t("tickets_unavailable")}
                    </div>
                  )}
                  {/* total price */}
                  {noOfTickets > 0 && (
                    <div className="w-full p-4">
                      <table className="w-full text-sm my-3">
                        <tr>
                          <th className="text-left font-normal py-1">
                            {t("cart_total")}
                          </th>
                          <td className="text-right py-1">
                            € {ticketIncrementPrice.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-left font-normal py-1">
                            {t("discount")}
                            (%{discountDetails[1]})
                          </th>

                          <td className="text-right py-1 ">
                            €{" "}
                            {(
                              ((ticketIncrementPrice + 0.35 * noOfTickets) *
                                discountDetails[1]) /
                              100
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-left font-normal py-1 pb-4">
                            {t("platformfee")}
                            {/* € {ticketIncrementPrice.toFixed(2)} */}
                          </th>
                          <td className="text-right py-1 pb-4">
                            {pOnCharges
                              ? `€ ${(0.35 * noOfTickets).toFixed(2)}`
                              : t("organizerpay")}
                          </td>
                        </tr>
                        <tr className="border-t border-zinc-600">
                          <th className="text-left font-normal pt-3 text-xl">
                            {t("subtotal")}
                          </th>
                          <td className="text-right pt-3 text-xl">
                            €
                            {selectedTicketIndex !== null &&
                            !isNaN(ticketIncrementPrice) &&
                            !isNaN(discountDetails[1])
                              ? discountDetails[1] === 0
                                ? (pOnCharges
                                    ? ticketIncrementPrice + 0.35 * noOfTickets
                                    : ticketIncrementPrice
                                  ).toFixed(2)
                                : pOnCharges
                                ? (
                                    ticketIncrementPrice +
                                    0.35 * noOfTickets -
                                    ((ticketIncrementPrice +
                                      0.35 * noOfTickets) *
                                      discountDetails[1]) /
                                      100
                                  ).toFixed(2)
                                : (
                                    ticketIncrementPrice -
                                    (ticketIncrementPrice *
                                      discountDetails[1]) /
                                      100
                                  ).toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                      </table>
                    </div>
                  )}
                  {/* checkout button */}

                  {selectedTicketIndex !== null && noOfTickets !== 0 && (
                    <div className="inline-flex justify-center items-center px-4 font-normal text-xs -mb-4 mt-3 gap-2 text-zinc-300">
                      <div className="w-max flex justify-center items-center">
                        <input
                          id="terms"
                          type="checkbox"
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className="checkbox"
                        />
                      </div>
                      {eventData.eventPDF !== "" ? (
                        <label htmlFor="terms" className="cursor-pointer">
                          {t("terms_agreement")}
                        </label>
                      ) : (
                        <label htmlFor="terms" className="cursor-pointer">
                          {t("terms_acknowledgement")}
                        </label>
                      )}
                    </div>
                  )}
                  {availableTickets.length > 0 && (
                    <ButtonWithLoading
                      isLoading={isLoading}
                      isLoadingText={t("processing")}
                      onClick={(e) => setShowReferralsPopup(true)}
                      isDisabled={noOfTickets === 0 || !termsAgreed}
                      buttonText={t("proceed_to_checkout")}
                      className={`w-full p-3 mt-5 flex justify-center items-center focus:outline-none rounded-md border-2 border-transparent font-medium transition-all text-center ${
                        noOfTickets > 0 && termsAgreed
                          ? "bg-white text-black hover:bg-transparent hover:text-white hover:border-white"
                          : " bg-white text-black opacity-20 cursor-not-allowed"
                      }`}
                    />
                  )}
                </div>
                </>
              )}
              {/* terms and conditions */}
              {isLoadingData ? (
                <div className="bg-black/10 animate-pulse rounded-lg w-full md:h-16 h-14"></div>
              ) : (
                <>
                  {eventData.eventPDF !== "" ? (
                    <button
                      className="w-full h-max inline-flex justify-between items-center hover:text-tg-orange2 transition bg-white rounded-lg shadow-md shadow-zinc-200 p-5"
                      onClick={handleDownloadPdf}
                    >
                      <div className="font-oswald text-xl">
                        {t("terms_conditions")}
                      </div>
                      <div className="text-xl opacity-60">
                        <FiDownload />
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-max inline-flex justify-center items-center bg-white text-red-400 rounded-lg shadow-md shadow-zinc-200 p-5 font-oswald text-xl">
                      {t("beware_no_terms")}
                    </div>
                  )}
                </>
              )}

              {/* organizer info */}
              {isLoadingData ? (
                <div className="w-full mx-auto bg-black/5 p-10 rounded-lg ">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-black/10 h-12 w-12"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-black/10 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-black/10 rounded col-span-2"></div>
                          <div className="h-2 bg-black/10 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-black/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-max flex flex-col gap-4 bg-white rounded-lg shadow-md shadow-zinc-200 p-5">
                  <div className="flex justify-between items-center">
                    <div className="font-oswald text-2xl mb-2">
                      {t("organizer_info")}
                    </div>
                    <button
                      onClick={toggleExpand}
                      className="inline-flex items-center font-medium text-sm text-tg-orange2 gap-2"
                    >
                      {isExpanded ? t("hide_info") : t("view_all")}
                      <IoIosArrowDown
                        className={`transform transition-transform ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        } text-md`}
                      />
                    </button>
                  </div>
                  {userData && (
                    <div className="flex flex-col p-2">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-zinc-300 border-2 border-zinc-200 rounded-full overflow-hidden">
                          {userData.organizationLogo && (
                            <img
                              src={userData.organizationLogo}
                              alt="Organization Logo"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          {userData.organizationName ? (
                            <div className="font-medium text-lg">
                              {userData.organizationName}
                            </div>
                          ) : (
                            <div className="font-medium text-lg">
                              {userData.uName}
                            </div>
                          )}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="space-y-4 mt-5">
                          {userData.organizationWebsite ? (
                            <>
                              <div className="w-full border-b border-zinc-200"></div>
                              <div className="font-medium">
                                <div className="text-sm text-zinc-400 mb-1">
                                  {t("website")}
                                </div>
                                <div>
                                  <a href={userData.organizationWebsite}>
                                    {userData.organizationWebsite}
                                  </a>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-full border-b border-zinc-200"></div>
                              <div className="font-medium">
                                <div className="text-sm text-zinc-400 mb-1">
                                  {t("email")}
                                </div>
                                <div>{userData.uEmail}</div>
                              </div>
                            </>
                          )}
                          <div className="w-full border-b border-zinc-200"></div>
                          {userData.organizerPhoneNumber && (
                            <div className="font-medium">
                              <div className="text-sm text-zinc-400 mb-1">
                                {t("phone")}
                              </div>
                              <div>{userData.organizerPhoneNumber}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {showReferralsPopup && (
          <PopupForm
            onClose={() => {
              setReferrals("Others");
              setShowReferralsPopup(false);
              handleOrder();
            }}
            title={t("referralsPopup.title")}
            description={t("referralsPopup.description")}
            onSubmit={() => {
              setShowReferralsPopup(false);
              handleOrder();
            }}
            buttonText={t("referralsPopup.buttonText")}
            disabled={referrals === ""}
          >
            <div className="w-full h-full py-2 flex flex-col gap-3 rounded ">
              {referralOptions.map((option, index) => (
                <div
                  key={index}
                  className={`rounded-lg flex items-center justify-center transition gap-1 p-2 cursor-pointer ${
                    referrals === option.name
                      ? "bg-orange-200 text-orange-600"
                      : "hover:bg-zinc-200 bg-zinc-100 text-zinc-600 hover:text-zinc-700"
                  }`}
                  onClick={() => {
                    setReferrals(option.name);
                  }}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </PopupForm>
        )}
      </div>
    )
  ) : (
    <DisableEvent />
  );
};

export default EventTicket;

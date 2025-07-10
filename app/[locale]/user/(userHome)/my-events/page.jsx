"use client";

import React, { useState, useEffect } from "react";
import Tooltip from "@/app/[locale]/components/tooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import {
  fetchUserEvents,
  addEventToFirestore,
  updateEventVisibility,
  checkDuplicateEvent,
  deleteEvent,
} from "@/app/(Api)/firebase/firebase_firestore";

import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { HiOutlineDuplicate } from "react-icons/hi";
import { FaRegEye, FaRegEyeSlash, FaLocationDot } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import Transition4 from "@/app/[locale]/animations/transition4";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import { useAuth } from "@/app/[locale]/context/authContext";
import Image from "next/image";
import PopupForm from "@/app/[locale]/components/PopupForm";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import TwoBtnPopup from "@/app/[locale]/components/TwoBtnPopup";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const MyEvents = () => {
  const t = useTranslations("myEvents");

  const router = useRouter();

  const { setEId } = useEId();
  const [eventsArray, setEventsArray] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [copyEvent, setCopyEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [oneEvent, setOneEvent] = useState(null);

  const [formData, setFormData] = useState({
    eName: "",
    eStart: "",
    eEnd: "",
    eDescription: false,
    eAddress: false,
    eBanner: false,
    ticketInfo: false,
  });

  const checkboxes = [
    { name: "eDescription", label: t("description") },
    { name: "ticketInfo", label: t("tickets") },
    { name: "eAddress", label: t("address") },
    { name: "eBanner", label: t("banner") },
  ];

  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchUserEvents(userId, (events) => {
        setEventsArray(events);
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleCopyEvent = (index, filteredEvents) => {
    const filteredIndex = eventsArray.findIndex(
      (event) => event === filteredEvents[index]
    );
    setCopyEvent(filteredIndex);
  };

  const toggleEventVisibility = async (index, filteredEvents) => {
    const originalIndex = eventsArray.findIndex(
      (event) => event.eId === filteredEvents[index].eId
    );
    const event = eventsArray[originalIndex];
    const updatedVisibility = !event.isVisible;
    await updateEventVisibility(userId, event.eId, updatedVisibility);
    setEventsArray((prevEvents) =>
      prevEvents.map((ev, idx) =>
        idx === originalIndex ? { ...ev, isVisible: updatedVisibility } : ev
      )
    );
  };

  const filterEvents = (status) => {
    setFilter(status);
  };
  const convertToDate = (timestamp) => {
    return timestamp instanceof Date
      ? timestamp
      : new Date(timestamp.seconds * 1000);
  };
  const filteredEvents = eventsArray.filter((event) => {
    const eventEndDate = convertToDate(event.eEnd);
    if (filter === "upcoming") {
      return eventEndDate >= new Date();
    } else {
      return eventEndDate < new Date();
    }
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const originalEvent = eventsArray[copyEvent];
    const startDate = new Date(formData.eStart);
    const endDate = new Date(formData.eEnd);

    const isNameUnique = !eventsArray.some(
      (event) => event.eName.toLowerCase() === formData.eName.toLowerCase()
    );
    if (!isNameUnique) {
      alert("The event name must be unique. Please choose a different name.");
      setIsLoading(false);
      return;
    }

    const isDuplicate = await checkDuplicateEvent(formData.eName);
    if (isDuplicate) {
      alert(
        "An event with this name already exists. Please choose a different name."
      );
      setIsLoading(false);
      return;
    }

    if (startDate < new Date()) {
      alert("The start date must be today or later.");
      setIsLoading(false);
      return;
    }
    if (endDate < startDate) {
      alert("The end date must be on or after the start date.");
      setIsLoading(false);
      return;
    }

    const newEvent = {
      ...originalEvent,
      eName: formData.eName,
      eStart: new Date(formData.eStart),
      eEnd: new Date(formData.eEnd),
      isVisible: true,
    };

    const { eDescription, ticketInfo, eAddress, eBanner } = formData;

    if (ticketInfo) {
      newEvent.ticketInfo = originalEvent.ticketInfo.map((ticket) => ({
        ...ticket,
        tQuantity: ticket.total_tickets,
        dCodes: [],
      }));
    } else {
      newEvent.ticketInfo = [];
    }

    newEvent.eDescription = eDescription ? originalEvent.eDescription : "";
    newEvent.eBanner = eBanner ? originalEvent.eBanner : "";
    newEvent.eAddress = eAddress ? originalEvent.eAddress : "";
    newEvent.eCity = eAddress ? originalEvent.eCity : "";

    try {
      await addEventToFirestore(newEvent);
      setEventsArray((prevEvents) => [...prevEvents, newEvent]);
      setFormData({
        eName: "",
        eStart: "",
        eEnd: "",
        eDescription: false,
        eAddress: false,
        ticketInfo: false,
        eBanner: false,
      });
      setCopyEvent(null);
    } catch (error) {
      console.error("Error duplicating event:", error);
    }
    setIsLoading(false);
  };

  const upcomingEventsCount = eventsArray.filter(
    (event) => convertToDate(event.eEnd) >= new Date()
  ).length;
  const expiredEventsCount = eventsArray.filter(
    (event) => convertToDate(event.eEnd) < new Date()
  ).length;

  const handleDeleteEvent = async (e) => {
    e.preventDefault();

    const ticketsSold = oneEvent?.ticketInfo?.some(
      (ticket) => ticket.tQuantity < ticket.total_tickets
    );

    if (ticketsSold) {
      alert(
        "As tickets for the event have been sold, the event cannot be deleted!"
      );
      return;
    }

    try {
      await deleteEvent(oneEvent?.eId, oneEvent?.eBanner, oneEvent?.eventPDF);
    } catch (e) {
      toast.error("Error deleting event: ", e);
    }

    setShowDeletePopup(false);
    setOneEvent(null);
    fetchUserEvents(userId, setEventsArray);
  };

  const handleEventClick = (id) => {
    setEId(id);
  };

  return (
    <Transition4 className="w-full h-full flex flex-col">
      <div className="inline-flex gap-1 text-neutral-500">
        <button
          className={`py-3 px-5 w-36 md:w-56 rounded-t-lg flex flex-col justify-start gap-3 md:gap-2 border-b-2 ${
            filter === "upcoming"
              ? "bg-white text-black border-tg-orange border-opacity-50"
              : "bg-zinc-300 text-zinc-500 border-transparent"
          }`}
          onClick={() => filterEvents("upcoming")}
        >
          <div className="font-medium text-md text-left">
            {t("upcoming_events")}
          </div>
          <div
            className={`inline-flex w-full font-medium justify-between text-xs uppercase ${
              filter == "upcoming" ? "text-tg-orange" : "text-zinc-400"
            }`}
          >
            <div>{t("total")}</div>
            <div>{upcomingEventsCount}</div>
          </div>
        </button>
        <button
          className={`py-3 px-5 w-36 md:w-56 rounded-t-lg flex flex-col justify-start gap-3 md:gap-2 border-b-2 ${
            filter === "expired"
              ? "bg-white text-black border-tg-orange border-opacity-50"
              : "bg-zinc-300 text-zinc-500 border-transparent"
          }`}
          onClick={() => filterEvents("expired")}
        >
          <div className="font-medium text-md text-left">
            {t("expired_events")}
          </div>
          <div
            className={`inline-flex w-full font-medium justify-between text-xs uppercase ${
              filter == "expired" ? "text-tg-orange" : "text-zinc-400"
            }`}
          >
            <div>{t("total")}</div>
            <div>{expiredEventsCount}</div>
          </div>
        </button>
      </div>
      <div className="bg-white w-full h-full rounded-xl rounded-tl-none py-3 overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-5 px-5">
            {upcomingEventsCount <= 0 && expiredEventsCount <= 0 ? (
              <>
                <Image
                  src="/images/empty-box.png"
                  alt="Empty Box"
                  width={150}
                  height={150}
                  className="opacity-20 md:mb-3"
                />
                <div className="text-xl md:text-2xl font-oswald text-center">
                  {t("noEvents")}
                </div>
                <Link
                  href="/user/create-event"
                  className="px-4 py-3 bg-zinc-100 rounded-lg text-zinc-400 font-medium hover:bg-orange-100 hover:text-tg-orange2 transition"
                >
                  {t("startCreating")}
                </Link>
              </>
            ) : upcomingEventsCount > 0 && expiredEventsCount <= 0 ? (
              <>
                <Image
                  src="/images/expired1.png"
                  alt="Expired Image"
                  width={100}
                  height={100}
                  className="w-auto opacity-20 md:mb-3"
                />
                <div className="text-xl md:text-2xl font-oswald text-center">
                  {t("notExpired")}
                </div>
              </>
            ) : (
              <>
                <Image
                  src="/images/empty-box.png"
                  alt="Empty Box"
                  width={150}
                  height={150}
                  className="opacity-20 md:mb-3"
                />
                <div className="text-xl md:text-2xl font-oswald text-center">
                  {t("noEvents")}
                </div>
                <Link
                  href="/user/create-event"
                  className="px-4 py-3 bg-zinc-100 rounded-lg text-zinc-400 font-medium hover:bg-orange-100 hover:text-tg-orange2 transition"
                >
                  {t("startCreating")}
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar">
            <div className="divide-y divide-neutral-200">
              {filteredEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center px-6 py-5 relative"
                >
                  <div className="inline-flex items-center gap-5">
                    <div className="hidden w-11 h-11 bg-tg-orange bg-opacity-20 rounded-lg md:flex justify-center items-center text-tg-orange2 font-medium">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="md:text-lg font-medium" key={index}>
                        {event.eName}
                      </div>
                      <div>
                        {event.eStart ? (
                          <>
                            <div className="text-xs inline-flex gap-2 items-center text-zinc-600">
                              {event.eStart instanceof Date
                                ? new Date(event.eStart).toLocaleDateString()
                                : new Date(
                                    event.eStart.toDate()
                                  ).toLocaleDateString()}
                              {"  "}
                              {event.eStart instanceof Date
                                ? new Date(event.eStart).toLocaleTimeString()
                                : new Date(
                                    event.eStart.toDate()
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              <FaArrowRightLong />
                              {event.eEnd instanceof Date
                                ? new Date(event.eEnd).toLocaleDateString()
                                : new Date(
                                    event.eEnd.toDate()
                                  ).toLocaleDateString()}{" "}
                              {"  "}{" "}
                              {event.eEnd instanceof Date
                                ? new Date(event.eEnd).toLocaleTimeString()
                                : new Date(
                                    event.eEnd.toDate()
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                            </div>
                          </>
                        ) : (
                          <p>{t("dates_not_available")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex gap-3 text-sm">
                    <div className="inline-flex gap-2 items-center text-orange-400 border-2 border-orange-400 border-opacity-20 h-10 px-2 rounded-lg transition text-left text-xs">
                      <FaLocationDot />
                      {event.eCity ? event.eCity : t("unavailable")}
                    </div>
                    {convertToDate(event.eEnd) >= new Date() && (
                      <div
                        className={`inline-flex gap-2 justify-center items-center mr-3 lg:mr-0 border-2 border-opacity-20 h-10 w-16 px-2 rounded-lg transition text-xs ${
                          event.adminAuth
                            ? event.isVisible
                              ? "text-emerald-500 border-emerald-500 bg-emerald-100"
                              : "text-slate-400 border-slate-400 bg-slate-200"
                            : "text-red-400 border-red-800 bg-red-100"
                        } `}
                      >
                        {event.adminAuth ? (
                          event.isVisible ? (
                            t("active")
                          ) : (
                            t("hidden")
                          )
                        ) : (
                          <Tooltip position="top" content={t("tooltipDisable")}>
                            {t("disabled")}
                          </Tooltip>
                        )}
                      </div>
                    )}
                    {/* options */}
                    <Link
                      onClick={() => handleEventClick(event.eId)}
                      className="hidden lg:inline-flex gap-2 items-center md:bg-zinc-600 hover:bg-zinc-900 md:text-white md:h-10 px-3 rounded-lg transition"
                      href={{
                        pathname: "/user/dashboard",
                        query: {
                          id: event.eId,
                        },
                      }}
                    >
                      <LuSettings2 /> {t("manage")}
                    </Link>
                    {/* dropdown button */}
                    <Dropdown className="min-w-max">
                      <DropdownTrigger>
                        <button className="lg:relative lg:top-0 lg:right-0 absolute top-5 right-3 outline-none text-zinc-400">
                          <BsThreeDotsVertical />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Manage Events"
                        variant="flat"
                        color="default"
                        disallowEmptySelection
                        selectionMode="single"
                      >
                        <DropdownItem
                          key="Manage"
                          textValue="Manage"
                          startContent={
                            <LuSettings2 className="text-blue-700 hover:!text-blue-500" />
                          }
                          as={Link}
                          href={{
                            pathname: "/user/dashboard",
                            query: {
                              id: event.eId,
                            },
                          }}
                          className="hover:!bg-blue-100 hover:!text-blue-500 text-blue-700 !bg-white lg:hidden"
                        >
                          {t("manage")}
                        </DropdownItem>
                        <DropdownItem
                          key="Duplicate"
                          startContent={<HiOutlineDuplicate />}
                          textValue="Duplicate"
                          onPress={() => handleCopyEvent(index, filteredEvents)}
                          className="hover:!bg-zinc-100 transition !bg-white"
                        >
                          {t("duplicate")}
                        </DropdownItem>
                        {convertToDate(event.eEnd) >= new Date() && (
                          <DropdownItem
                            key="Visibility"
                            textValue="Visibility"
                            startContent={
                              event.isVisible ? <FaRegEyeSlash/> : <FaRegEye /> 
                            }
                            onPress={() =>
                              toggleEventVisibility(index, filteredEvents)
                            }
                            className="hover:!bg-zinc-100 transition !bg-white"
                          >
                            {event.isVisible ? t("invisible") : t("visible")}
                          </DropdownItem>
                        )}
                        <DropdownItem
                          key="Delete"
                          textValue="Delete"
                          startContent={
                            <MdDelete className="text-red-600 hover:!text-red-400" />
                          }
                          className="hover:!bg-red-100 hover:!text-red-400 transition !bg-white text-red-600"
                          onPress={() => {
                            setOneEvent(event);
                            setShowDeletePopup(true);
                          }}
                        >
                          {t("delete")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {copyEvent !== null && (
        <PopupForm
          title={t("duplicate_event")}
          description={t("duplicate_description")}
          onClose={() => setCopyEvent(null)}
          buttonText={t("duplicate_event")}
          onSubmit={handleSubmit}
          disabled={isLoading}
        >
          <div className="text-lg font-oswald pb-4 border-b border-zinc-200 -mt-2 text-tg-orange">
            {t("duplicating")}: {eventsArray[copyEvent].eName}
          </div>
          <div>
            <label className="form-label-popup">{t("eventName")}</label>
            <input
              type="text"
              name="eName"
              value={formData.eName}
              onChange={handleInputChange}
              className="form-control-popup"
            />
          </div>
          <div>
            <label className="form-label-popup">{t("startDate")}</label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="eStart"
              value={formData.eStart}
              onChange={handleInputChange}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">{t("endDate")}</label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="eEnd"
              value={formData.eEnd}
              onChange={handleInputChange}
              className="form-control-popup"
              required
            />
          </div>
          <div className="pb-4 flex flex-col gap-1 px-1">
            <p className="pb-2 mb-2 text-tg-orange2 text-sm border-b">
              {t("selectContent")}
            </p>
            {checkboxes.map((checkbox) => (
              <div key={checkbox.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={checkbox.name}
                  id={checkbox.name}
                  checked={formData[checkbox.name]}
                  onChange={handleInputChange}
                  className="checkbox2"
                />
                <label className="cursor-pointer" htmlFor={checkbox.name}>
                  {checkbox.label}
                </label>
              </div>
            ))}
          </div>
        </PopupForm>
      )}
      {showDeletePopup && (
        <TwoBtnPopup
          iconType="delete"
          title={t("delete")}
          description={t("deleteConfirmation")}
          onClose={() => setShowDeletePopup(false)}
          onConfrim={handleDeleteEvent}
          onConfrimText={t("confirm")}
          onCloseText={t("cancel")}
        />
      )}
    </Transition4>
  );
};
export default MyEvents;

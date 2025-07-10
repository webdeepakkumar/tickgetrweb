"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineDesktopAccessDisabled, MdOutlineDesktopWindows, MdDelete } from "react-icons/md";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import star from "@/public/images/star.ico";
import Image from "next/image";

import dynamic from "next/dynamic";

// ✅ Dynamic imports to fix SSR issues
const Tooltip = dynamic(() => import("@/app/[locale]/components/tooltip"), { ssr: false });
const DetailsPopup = dynamic(() => import("@/app/[locale]/components/detailsPopup"), { ssr: false });

import TwoBtnPopup from "@/app/[locale]/components/TwoBtnPopup";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { getTotalRev } from "@/app/(Api)/firebase/firebase_firestore";


import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import {
  updateEventVisibility,
  updateEventStatus,
  deleteEvent,
  fetchEvents,
} from "@/app/(Api)/firebase/firebase_firestore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import UserDetails from "@/app/[locale]/components/userDetailsPopup";
const LottieAnimation = dynamic(() => import("@/app/[locale]/animations/loadingarforocuments"), { ssr: false });


const formatDate = (date) => {
  if (!date) return "";
  let formattedDate;

  if (date && typeof date.toDate === "function") {
    formattedDate = date.toDate();
  } else if (date instanceof Date) {
    formattedDate = date;
  } else {
    formattedDate = new Date(date);
  }

  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = formattedDate.toLocaleString("default", { month: "short" });
  const year = formattedDate.getFullYear();
  let hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day} ${month}, ${year} ${hours}:${minutes}:${ampm}`;
};

const AdminEvents = () => {
  const t = useTranslations("admin");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEventDetailsPopup, setShowEventDetailsPopup] = useState(false);
  const [showuserDetailsPopup, setUserDetailsPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [EventInfosArray, setEventInfosArray] = useState([]);
  const [dataIndex, setDataIndex] = useState();
  const [eventId, setEventId] = useState();
  const [userId, setUserId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const [filteredEvents, setFilteredEvents] = useState(EventInfosArray);
  const [expiredloading, setExpiredloading] = useState(true);

  useEffect(() => {
    fetchEvents((events) => {
      setEventInfosArray(events);
      setLoading(false);
    });
  }, []);
  const convertToDate = (timestamp) => {
    return timestamp instanceof Date
      ? timestamp
      : new Date(timestamp.seconds * 1000);
  };

  useEffect(() => {
    const now = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(now.getDate() - 5);
    const fiveDaysLater = new Date(now);
    fiveDaysLater.setDate(now.getDate() + 5);

    let filteredByStatus = EventInfosArray.filter((event) => {
      const eventEndDate = convertToDate(event.eEnd);
      return filter === "upcoming" ? eventEndDate >= now : eventEndDate < now;
    });

    filteredByStatus = filteredByStatus
      .map((event) => {
        const eventCreatedAt = event.createdAt?.seconds
          ? new Date(event.createdAt.seconds * 1000)
          : null;
        const eventStartDate = event.eStart?.seconds
          ? new Date(event.eStart.seconds * 1000)
          : null;
        return {
          ...event,
          isNew:
            eventCreatedAt &&
            eventCreatedAt >= fiveDaysAgo &&
            eventCreatedAt <= fiveDaysLater,
          isStartingSoon:
            eventStartDate &&
            eventStartDate >= now &&
            eventStartDate <= fiveDaysLater,
          totalRevenue: event.totalRevenue || 0,
        };
      })
      .sort((a, b) => {
        const dateA = a.eStart?.seconds
          ? new Date(a.eStart.seconds * 1000)
          : new Date(0);
        const dateB = b.eStart?.seconds
          ? new Date(b.eStart.seconds * 1000)
          : new Date(0);
        return filter === "upcoming" ? dateA - dateB : dateB - dateA;
      });
    if (searchQuery) {
      filteredByStatus = filteredByStatus.filter((event) =>
        event.eName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const fetchRevenues = async () => {
      setExpiredloading(true);
      if (filter !== "upcoming") {
        const updatedEvents = await Promise.all(
          filteredByStatus.map(async (event) => {
            const totalRev = await getTotalRev(event.eId);
            console.log(
              `Fetched total revenue for event ${event.eId}:`,
              totalRev
            );
            return { ...event, totalRevenue: parseFloat(totalRev).toFixed(2) };
          })
        );
        setFilteredEvents(updatedEvents);
      } else {
        setFilteredEvents(filteredByStatus);
      }
      setExpiredloading(false);
    };

    fetchRevenues();
  }, [searchQuery, filter, EventInfosArray]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterEvents = (status) => {
    setFilter(status);
  };
  const resetFilters = () => {
    setSearchQuery("");
    setFilter("upcoming");
  };

  const toggleEventVisibility = async (index) => {
    const eventToUpdate = filteredEvents[index];
    if (!eventToUpdate) return;

    const updatedVisibility = !eventToUpdate.isVisible;
    const updatedEvents = EventInfosArray.map((event) =>
      event.eId === eventToUpdate.eId
        ? { ...event, isVisible: updatedVisibility }
        : event
    );

    setEventInfosArray(updatedEvents);
    setFilteredEvents(
      updatedEvents.filter((event) =>
        event.eName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    await updateEventVisibility(
      eventToUpdate.userId,
      eventToUpdate.eId,
      updatedVisibility
    );
  };

  // Toggle Event Status
  const toggleEventStatus = async (index) => {
    const eventToUpdate = filteredEvents[index];
    if (!eventToUpdate) return;

    const updatedStatus = !eventToUpdate.adminAuth;
    const updatedEvents = EventInfosArray.map((event) =>
      event.eId === eventToUpdate.eId
        ? { ...event, adminAuth: updatedStatus }
        : event
    );
    setEventInfosArray(updatedEvents);
    setFilteredEvents(
      updatedEvents.filter((event) =>
        event.eName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    await updateEventStatus(
      eventToUpdate.userId,
      eventToUpdate.eId,
      updatedStatus
    );
  };

  // Delete Event
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    await deleteEvent(eventId);
    fetchEvents(setEventInfosArray);
    setShowDeletePopup(false);
  };

  // User Details
  const userdetails = (index) => {
    const userevent = filteredEvents[index];
    setUserId(userevent.userId);
  };

  const upcomingEventsCount = EventInfosArray.filter(
    (event) => convertToDate(event.eEnd) >= new Date()
  ).length;

  const expiredEventsCount = EventInfosArray.filter(
    (event) => convertToDate(event.eEnd) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const event = filteredEvents[dataIndex];
  console.log("dat of event",event)
  const eventEndDate = event?.eEnd ? convertToDate(event.eEnd) : null;
  const isEventExpired = eventEndDate < new Date();
  const Eventid = event?.eId;
  const eventDetails = event
    ? [
        {
          label: t("adminDashboard.events.eventId"),
          value: event?.eId,
        },
        {
          label: t("adminDashboard.events.eventName"),
          value:
            event?.eName.length > 16 ? (
              <Tooltip position="bottom" content={event?.eName}>
                {event?.eName.substring(0, 16) + "..."}
              </Tooltip>
            ) : (
              event?.eName
            ),
        },
        {
          label: t("adminDashboard.events.creatorEmail"),
          value:
            event?.uEmail.length > 20 ? (
              <Tooltip position="bottom" content={event?.uEmail}>
                {event?.uEmail.substring(0, 20) + "..."}
              </Tooltip>
            ) : (
              event?.uEmail
            ),
        },
        {
          label: t("adminDashboard.events.city"),
          value: event?.eCity,
        },
        {
          label: t("adminDashboard.events.startDate"),
          value: event ? formatDate(event?.eStart) : "",
        },
        {
          label: t("adminDashboard.events.endDate"),
          value: event ? formatDate(event?.eEnd) : "",
        },
        {
          label: t("adminDashboard.events.pOnCharges"),
          value : event.pOnCharges ? t("adminDashboard.events.applied") : t("adminDashboard.events.notApplied"),
        }
      ]
    : [];

  return (
    <>
      <div className="flex flex-col w-full h-full gap-4">
        <div className="py-3 md:w-72 w-full pl-10 pr-4 bg-zinc-700 text-zinc-300 rounded-xl relative">
          <IoSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
          <input
            className="outline-none bg-transparent w-full placeholder:text-zinc-400"
            type="text"
            placeholder={t("adminDashboard.events.searchPlaceholder")}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="inline-flex gap-1 text-neutral-500">
          <button
            className={`py-3 px-5 w-36 md:w-56 rounded-t-xl flex flex-col justify-start gap-3 md:gap-2 border-b-2 ${
              filter === "upcoming"
                ? "bg-zinc-900 text-orange-500 border-tg-white border-opacity-50"
                : "bg-zinc-900 text-zinc-400 border-transparent"
            }`}
            onClick={() => filterEvents("upcoming")}
          >
            <div className="font-medium text-md text-left">
              {t("adminDashboard.events.upcoming_events")}
            </div>
            <div
              className={`inline-flex w-full font-medium justify-between text-xs uppercase ${
                filter == "upcoming" ? "text-white" : "text-zinc-400"
              }`}
            >
              <div>{t("adminDashboard.events.total")}</div>
              <div>{upcomingEventsCount}</div>
            </div>
          </button>
          <button
            className={`py-3 px-5 w-36 md:w-56 rounded-t-lg flex flex-col justify-start gap-3 md:gap-2 border-b-2 ${
              filter === "expired"
                ? "bg-zinc-900 text-orange-500 border-tg-white border-opacity-50"
                : "bg-zinc-900 text-zinc-400 border-transparent"
            }`}
            onClick={() => filterEvents("expired")}
          >
            <div className="font-medium text-md text-left">
              {t("adminDashboard.events.expired_events")}
            </div>
            <div
              className={`inline-flex w-full font-medium justify-between text-xs uppercase ${
                filter == "expired" ? "text-white" : "text-zinc-400"
              }`}
            >
              <div>{t("adminDashboard.events.total")}</div>
              <div>{expiredEventsCount}</div>
            </div>
          </button>
        </div>
        <div className="flex justify-center items-center w-full h-full bg-zinc-900 rounded-sm text-white mt-[-16px]">
          <div className="bg-zinc-900 w-full h-full flex justify-center rounded-xl md:p-6 p-4 overflow-y-auto overflow-x-hidden no-scrollbar">
            <table className="border-collapse w-full h-max text-left text-xs">
              <thead>
                <tr className="text-zinc-300 border-b  border-zinc-700 uppercase">
                  <th className=" pb-4 font-medium md:table-cell">

                  </th>
                  <th className="md:table-cell lg:table-cell hidden pb-4 font-medium">
                    {t("adminDashboard.events.eventId")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("adminDashboard.events.eventName")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("adminDashboard.events.creatorEmail")}
                  </th>
                  <th className="lg:table-cell hidden pb-4 font-medium">
                    {t("adminDashboard.events.city")}
                  </th>
                  {filter !== "upcoming" ? (
                    <th className="pb-4 font-medium md:table-cell hidden">
                      {t("adminDashboard.events.total_amount")}
                    </th>
                  ) : (
                    ""
                  )}
                  <th className="lg:table-cell hidden">
                    {t("adminDashboard.events.startDate")}
                  </th>
                  <th className="lg:table-cell hidden pb-4 font-medium">
                    {t("adminDashboard.events.endDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {expiredloading ? (
                  <tr>
                    <td colSpan="8"></td>
                  </tr>
                ) : (
                  filteredEvents.map((event, index) => (
                    <tr key={index}>
                      <td className="pt-5 font-medium md:table-cell">
                        {event.isNew && (
                          <Image src={star} alt="Star" width={18} height={18} />
                        )}
                      </td>
                      <td
                        className={`pt-5 md:table-cell hidden font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560" ,borderRadius: "15px 0px 0px 15px"   }
                            : {}
                        }
                      >
                        {event.eId}
                      </td>
                      <td
                        className={`pt-5  font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560",  }
                            : {}
                        }
                      >
                        {event.eName.length > 16 ? (
                          <Tooltip position="top" content={event.eName}>
                            <span>{event.eName.substring(0, 16) + "..."}</span>
                          </Tooltip>
                        ) : (
                          <span>{event.eName}</span>
                        )}
                      </td>
                      <td
                        className={`pt-5  font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560"}
                            : {}
                        }
                      >
                        {event.uEmail.length > 20 ? (
                          <Tooltip position="top" content={event.uEmail}>
                            {event.uEmail.substring(0, 20) + "..."}
                          </Tooltip>
                        ) : (
                          event.uEmail
                        )}
                      </td>
                      <td
                        className={`pt-5 lg:table-cell hidden font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560"  }
                            : {}
                        }
                      >
                        {event.eCity}
                      </td>
                      {filter !== "upcoming" && (
                        <td className=" pt-5 font-medium hidden md:table-cell">
                          {event.totalRevenue}
                        </td>
                      )}
                         <td
                        className={`pt-5 lg:table-cell hidden font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560"  }
                            : {}
                        }
                      >
                        {formatDate(event.eStart)}
                      </td>

                      <td
                        className={`pt-5 lg:table-cell hidden font-medium`}
                        style={
                          event.isStartingSoon
                            ? { backgroundColor: "#5fa560", borderRadius: "0px 15px 15px 0px",  }
                            : {}
                        }
                      >
                        {formatDate(event.eEnd)}
                      </td>
                      <td className="md:table-cell hidden pt-5 font-medium">
                        <div
                          className={`inline-flex gap-2 mr-3 lg:mr-0  border-2 border-opacity-20 w-16 justify-center items-center h-8 px-2 rounded-lg transition text-xs ${
                            event.adminAuth
                              ? event.isVisible
                                ? "text-emerald-500 border-emerald-500 bg-transparent"
                                : "text-slate-400 border-slate-400 bg-transparent"
                              : "text-red-600 border-red-600 bg-transparent"
                          }`}
                        >
                          {event.adminAuth
                            ? event.isVisible
                              ? t("adminDashboard.events.active")
                              : t("adminDashboard.events.hidden")
                            : t("adminDashboard.events.disabled")}
                        </div>
                      </td>
                      {/* dropdown button */}
                      <td className="relative pt-5">
                        <Dropdown className="min-w-0">
                          <DropdownTrigger className="outline-none">
                            <button className="text-zinc-400">
                              <BsThreeDotsVertical />
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Event options"
                            disallowEmptySelection
                            selectionMode="single"
                          >
                            <DropdownItem
                              key="event-details"
                              startContent={<AiOutlineInfoCircle />}
                              onPress={() => {
                                setDataIndex(`${index}`);
                                setShowEventDetailsPopup(true);
                              }}
                              className="hover:!bg-zinc-100 !bg-white"
                            >
                              {t("adminDashboard.events.eventDetails")}
                            </DropdownItem>
                            <DropdownItem
                              key="user-details"
                              startContent={<FaRegUser />}
                              onPress={() => {
                                setUserDetailsPopup(true);
                                userdetails(index, filteredEvents);
                              }}
                              className="hover:!bg-zinc-100 !bg-white"
                            >
                              {t("adminDashboard.events.userDetails")}
                            </DropdownItem>

                            <DropdownItem
                              key="toggle-visibility"
                              startContent={
                                event.isVisible ? (
                                  <FaRegEyeSlash />
                                ) : (
                                  <FaRegEye />
                                )
                              }
                              onPress={() =>
                                toggleEventVisibility(index, filteredEvents)
                              }
                              className="hover:!bg-zinc-100 !bg-white"
                            >
                              {event.isVisible
                                ? t("adminDashboard.events.invisible")
                                : t("adminDashboard.events.visible")}
                            </DropdownItem>
                            <DropdownItem
                              key="toggle-status"
                              startContent={
                                event.adminAuth ? (
                                  <MdOutlineDesktopAccessDisabled />
                                ) : (
                                  <MdOutlineDesktopWindows />
                                )
                              }
                              onPress={() =>
                                toggleEventStatus(index, filteredEvents)
                              }
                              className="hover:!bg-zinc-100 !bg-white"
                            >
                              {event.adminAuth
                                ? t("adminDashboard.events.disabled")
                                : t("adminDashboard.events.enabled")}
                            </DropdownItem>

                            <DropdownItem
                              className="hover:!bg-zinc-100 !bg-white"
                              startContent={<FiEdit />}
                            >
                              <Link
                                href={{
                                  pathname: "/admin/dashboard/events/editEvent",
                                  query: {
                                    user: event.userId,
                                    event: event.eId,
                                    title: t("adminDashboard.events.editEvent"),
                                  },
                                }}
                              >
                                {t("adminDashboard.events.editEvent")}
                              </Link>
                            </DropdownItem>
                            <DropdownItem
                              onPress={() => {
                                setShowDeletePopup(true);
                                setDataIndex(`${index}`);
                                setEventId(event.eId);
                              }}
                              startContent={
                                <MdDelete className="text-red-600 hover:!text-red-400" />
                              }
                              className="hover:!bg-red-100 hover:!text-red-400 !bg-white text-red-600"
                            >
                              {t("adminDashboard.events.delete")}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/**/}
          {showDeletePopup && (
            <TwoBtnPopup
              iconType="delete"
              title={t("adminDashboard.events.deleteEventTitle")}
              description={t("adminDashboard.events.deleteEventDescription")}
              onClose={() => setShowDeletePopup(false)}
              onConfrim={handleDeleteSubmit}
              onConfrimText={t("adminDashboard.events.yes")}
              onCloseText={t("adminDashboard.events.no")}
            />
          )}
          {showEventDetailsPopup && (
            <DetailsPopup
              title={t("adminDashboard.events.eventDetails")}
              details={eventDetails}
              eventId={Eventid}
              eventExpiry={isEventExpired}
              className="text-tg-orange text-center mb-4"
              onClose={() => setShowEventDetailsPopup(false)}
              color="text-black"
            />
          )}
          {showuserDetailsPopup && (
            <UserDetails
              title={t("adminDashboard.events.userDetails")}
              userId={userId}
              className="text-tg-orange text-center mb-4"
              onClose={() => setUserDetailsPopup(false)}
              color="text-black"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminEvents;

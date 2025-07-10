"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MdDelete, MdError } from "react-icons/md";
import { MdEuroSymbol } from "react-icons/md";
import { AiFillEdit, AiFillInfoCircle } from "react-icons/ai";

import { Switch } from "@nextui-org/switch";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import TwoBtnPopup from "@/app/[locale]/components/TwoBtnPopup";
import DetailsPopup from "@/app/[locale]/components/detailsPopup";
import { useAuth } from "@/app/[locale]/context/authContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  fetchAuthorizedEvents,
  addNewTicket,
  updateEventTicket,
  deleteEventTicket,
  updateTicketField,
  fetchOneUser,
} from "@/app/(Api)/firebase/firebase_firestore";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import Transition4 from "@/app/[locale]/animations/transition4";
import toast from "react-hot-toast";
import PopupForm from "@/app/[locale]/components/PopupForm";
import { Timestamp } from "firebase/firestore";
import formatDate from "@/app/[locale]/components/formatDate";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const formatDateInput = (date) => {
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
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  const hours = formattedDate.getHours().toString().padStart(2, "0");
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  const seconds = formattedDate.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const Tickets = () => {
  const t = useTranslations("eventsDashboard");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();

  const [showCreatePopup, setshowCreatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showTicketDetailsPopup, setShowTicketDetailsPopup] = useState(false);
  const [showEditPopop, setShowEditPopop] = useState(false);
  const [eventsArray, setEventsArray] = useState([]);
  const [userData, setUserData] = useState([]);
  const [ticketName, setTicketName] = useState("");
  const [price, setPrice] = useState("");
  const [noOftickets, setNoOftickets] = useState("");
  const [start_datetime, setStart_datetime] = useState("");
  const [end_datetime, setEnd_datetime] = useState("");
  const [dataIndex, setDataIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authorzed, setAuthorized] = useState(false);
  const [userId, setUserId] = useState();
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
          setEventsArray
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

  const [changeTicketinfo, setChangeTicketinfo] = useState({
    tType: "",
    tPrice: "",
    tQuantity: "",
    tStart: "",
    tEnd: "",
    tStatus: isVisible,
    total_tickets: "",
    oldStart: "",
    dCodes: [],
  });

  const previoustTickets = useRef("");
  const prevtQuantity = useRef("");

  useEffect(() => {
    const fetchDataAndUpdateStatus = async () => {
      setLoading(true);
      try {
        const fetchedEvents = await new Promise((resolve, reject) => {
          fetchAuthorizedEvents(userId, eventId, (fetchedEvents) => {
            resolve(fetchedEvents);
          });
        });

        const updatedEventsArray = fetchedEvents.map((event) => ({
          ...event,
          ticketInfo: event.ticketInfo?.map((ticket) => {
            const ticketEndDate = ticket.tEnd.toDate();
            if (ticketEndDate < new Date() && ticket.tStatus) {
              return {
                ...ticket,
                tStatus: false,
              };
            }
            return ticket;
          }),
        }));

        let needsUpdate = false;
        updatedEventsArray.forEach((event) => {
          event.ticketInfo?.forEach((ticket) => {
            const originalTicket = fetchedEvents
              .find((e) => e.id === event.id)
              ?.ticketInfo?.find((t) => t.tType === ticket.tType);
            if (originalTicket && ticket.tStatus !== originalTicket.tStatus) {
              needsUpdate = true;
            }
          });
        });

        if (needsUpdate) {
          setEventsArray(updatedEventsArray);
          await Promise.all(
            updatedEventsArray.map(async (event) => {
              await Promise.all(
                event.ticketInfo.map(async (ticket, ticketIndex) => {
                  if (!ticket.tStatus) {
                    await updateTicketField(
                      eventId,
                      ticketIndex,
                      { tStatus: false },
                      "tStatus"
                    );
                  }
                })
              );
            })
          );
        } else {
          setEventsArray(fetchedEvents);
        }
        await fetchOneUser(userId, setUserData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (eventId && userId) {
      fetchDataAndUpdateStatus();
    }
  }, [userId, eventId]);
  const accountcreated = userData[0]?.accountCreated;
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const resetFields = () => {
    setTicketName("");
    setPrice("");
    setNoOftickets("");
    setStart_datetime("");
    setEnd_datetime("");
    setDataIndex(null);
  };

  const handleCreateChange = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const startDate = new Date(start_datetime);
    const endDate = new Date(end_datetime);
    const today = new Date();

    if (startDate < today) {
      alert("The start date must be today or later.");
      setIsLoading(false);

      return;
    }
    if (endDate < startDate) {
      alert("The end date must be on or after the start date.");
      setIsLoading(false);

      return;
    }
    if (endDate < today) {
      alert("The end date must be today or later.");
      setIsLoading(false);

      return;
    }
    if (parseInt(noOftickets) < 0 || parseFloat(price) < 0) {
      alert("The number of tickets and the price must be non-negative.");
      setIsLoading(false);
      return;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const ticketData = {
      tEnd: endTimestamp,
      tPrice: parseFloat((price || "0").toString().replace(",", ".")) || 0,
      tQuantity: parseInt(noOftickets),
      total_tickets: parseInt(noOftickets),
      tStart: startTimestamp,
      tType: ticketName,
      tStatus: isVisible,
      dCodes: [],
    };

    await addNewTicket(eventId, ticketData);
    fetchAuthorizedEvents(userId, eventId, setEventsArray);
    setshowCreatePopup(false);
    setIsLoading(false);
    resetFields();
  };

  const openEditOpenPopup = async (ticketIndex) => {
    const ticket = eventsArray[0]?.ticketInfo?.[ticketIndex];
    if (ticket) {
      setChangeTicketinfo({
        tType: ticket.tType || "",
        tPrice: ticket.tPrice || "",
        total_tickets: ticket.total_tickets || "",
        tQuantity: ticket.tQuantity || "",
        tStart: formatDateInput(ticket.tStart || new Date()),
        tEnd: formatDateInput(ticket.tEnd || new Date()),
        oldStart: formatDateInput(ticket.tStart || new Date()),
        dCodes: ticket.dCodes || [],
      });
      previoustTickets.current = ticket.total_tickets || "";
      prevtQuantity.current = ticket.tQuantity || "";
    }
    setShowEditPopop(true);
    setDataIndex(ticketIndex);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const startDate = new Date(changeTicketinfo.tStart);
    const endDate = new Date(changeTicketinfo.tEnd);
    const today = new Date();
    const oldStart = new Date(changeTicketinfo.oldStart);

    if (startDate.getTime() !== oldStart.getTime() && startDate < today) {
      alert("The start date must be today or later.");
      setIsLoading(false);

      return;
    }

    if (endDate < startDate) {
      alert("The end date must be on or after the start date.");
      setIsLoading(false);

      return;
    }

    if (endDate < today) {
      alert("The end date must be today or later.");
      setIsLoading(false);

      return;
    }

    if (
      parseInt(changeTicketinfo.total_tickets) < 0 ||
      parseFloat(changeTicketinfo.tPrice) < 0
    ) {
      alert("The number of tickets and the price must be non-negative.");
      setIsLoading(false);
      return;
    }

    const prevTickets = parseInt(previoustTickets.current) || 0;
    const prevQuantity = parseInt(prevtQuantity.current) || 0;
    const totalTickets = parseInt(changeTicketinfo.total_tickets) || 0;

    if (totalTickets > prevTickets) {
      changeTicketinfo.tQuantity = prevQuantity + (totalTickets - prevTickets);
    } else if (totalTickets <= prevTickets && prevTickets <= prevQuantity) {
      changeTicketinfo.tQuantity = prevQuantity - (prevTickets - totalTickets);
    } else if (prevQuantity > totalTickets && totalTickets < prevTickets) {
      alert("Total Ticket should be greater than remaining tickets");
      setIsLoading(false);
      return;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    const isFutureTicket = startDate >= today || endDate >= today;
    const updatedTicketData = {
      tType: changeTicketinfo.tType || "",
      tStart: startTimestamp,
      tEnd: endTimestamp,
      tPrice: parseFloat((changeTicketinfo.tPrice || "0").toString().replace(",", ".")) || 0,
      total_tickets: totalTickets,
      tQuantity: parseInt(changeTicketinfo.tQuantity) || 0,
      tStatus:
      isFutureTicket ? true : changeTicketinfo.tStatus,
    };

    const ticketIndex = dataIndex;
    await updateEventTicket(eventId, ticketIndex, updatedTicketData);
    fetchAuthorizedEvents(userId, eventId, setEventsArray);
    setShowEditPopop(false);
    setIsLoading(false);

    resetFields();
  };

  const handleDeleteTicket = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    await deleteEventTicket(eventId, dataIndex);

    fetchAuthorizedEvents(userId, eventId, setEventsArray);

    setShowDeletePopup(false);
    setIsLoading(false);
    resetFields();
  };

  const handleTicketStatus = async (dataIndex, value) => {
    const ticket = eventsArray[0]?.ticketInfo?.[dataIndex];

    const endDate = ticket.tEnd.toDate();
    const today = new Date();

    if (endDate < today && value) {
      alert("Please update the end date before activating the Ticket.");
      return;
    }
    const updatedTicketStatus = {
      tStatus: value,
    };

    const ticketIndex = dataIndex;
    const ticketType = ticket.tType

    const response = await updateTicketField(
      eventId,
      ticketType,
      updatedTicketStatus,
      "tStatus"
    );
    if (response) {
      if (updatedTicketStatus.tStatus == false) {
        toast.success("Ticket is now Disabled!");
      } else {
        toast.success("Ticket is now Active");
      }
    } else if (!response) {
      toast.error("Error updating Ticket Status!");
    }

    fetchAuthorizedEvents(userId, eventId, setEventsArray);
  };

  const ticket = eventsArray[0];

  const ticketDetails = ticket?.ticketInfo[dataIndex]
    ? [
        {
          label: t("tickets.type"),
          value: ticket.ticketInfo[dataIndex]?.tType,
        },
        {
          label: t("tickets.no_of_tickets"),
          value: `${ticket.ticketInfo[dataIndex]?.tQuantity} / ${ticket.ticketInfo[dataIndex]?.total_tickets}`,
        },
        {
          label: t("tickets.price"),
          value: ticket.ticketInfo[dataIndex]?.tPrice,
        },
        {
          label: t("tickets.start_sale"),
          value: formatDate(ticket.ticketInfo[dataIndex]?.tStart),
        },
        {
          label: t("tickets.stop_sale"),
          value: formatDate(ticket.ticketInfo[dataIndex]?.tEnd),
        },
      ]
    : [];

  return (
    <Transition4 className="flex flex-col w-full h-full gap-4">
      <div className="w-full inline-flex justify-between text-sm font-medium">
        <div>
          <button
            onClick={() => {
              setshowCreatePopup(true);
            }}
            className="py-3 px-5 bg-tg-orange rounded-xl text-white hover:bg-tg-orange-hover transition-all"
            disabled={authorzed == false}
          >
            {t("tickets.create_ticket_button")}
          </button>
        </div>
      </div>
      <div className="bg-white w-full h-full flex justify-center rounded-xl md:p-6 p-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        <table className="border-collapse w-full h-max text-left text-xs">
          <thead>
            <tr className="text-neutral-500 border-b uppercase">
              <th className="pb-4 font-medium">{t("tickets.status")}</th>
              <th className="pb-4 font-medium">{t("tickets.type")}</th>
              <th className="pb-4 font-medium">{t("tickets.no_of_tickets")}</th>
              <th className="pb-4 font-medium">{t("tickets.price")}</th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("tickets.start_sale")}
              </th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("tickets.stop_sale")}
              </th>
            </tr>
          </thead>
          <tbody>
            {eventsArray.map((event, index) =>
              Array.isArray(event.ticketInfo) ? (
                event.ticketInfo.map((ticket, ticketIndex) => (
                  <tr key={`${index}-${ticketIndex}`}>
                    <td className="pt-5 font-medium">
                      <Switch
                        size="sm"
                        color="warning"
                        isSelected={ticket.tStatus}
                        onValueChange={(value) =>
                          handleTicketStatus(ticketIndex, value)
                        }
                      />
                    </td>
                    <td className="pt-5 font-medium">{ticket.tType}</td>
                    <td className="pt-5 font-medium">
                      {ticket.tQuantity}/{ticket.total_tickets}
                    </td>
                    <td className="pt-5 font-medium">€ {ticket.tPrice}</td>
                    <td className="md:table-cell hidden pt-5 font-medium">
                      {formatDate(ticket.tStart)}
                    </td>
                    <td className="md:table-cell hidden pt-5 font-medium">
                      {formatDate(ticket.tEnd)}
                    </td>
                    {/* <td className="lg:table-cell hidden pt-5 font-medium w-max">
                      <button
                        onClick={() => {
                          openEditOpenPopup(`${ticketIndex}`);
                        }}
                        className="text-sm bg-zinc-200 text-neutral-600 p-1 rounded-md hover:bg-zinc-500 hover:text-white transition-all"
                      >
                        <AiFillEdit />
                      </button>
                    </td>
                    <td className="lg:table-cell hidden pt-5 font-medium w-max">
                      <button
                        onClick={() => {
                          setShowDeletePopup(true);
                          setDataIndex(`${ticketIndex}`);
                        }}
                        className="text-sm bg-zinc-200 text-neutral-600 p-1 rounded-md hover:bg-zinc-500 hover:text-white transition-all"
                      >
                        <MdDelete />
                      </button>
                    </td> */}
                    {/* dropdown button */}
                    <td className="relative pt-6">
                      <Dropdown className="min-w-0 font-medium">
                        <DropdownTrigger>
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
                            key="toggle-visibility"
                            onPress={() => {
                              setDataIndex(ticketIndex);
                              setShowTicketDetailsPopup(true);
                            }}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium"
                          >
                            {t("tickets.ticket_details_popup_title")}
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => {
                              openEditOpenPopup(`${ticketIndex}`);
                            }}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium"
                          >
                            {t("tickets.edit_ticket")}
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => {
                              setShowDeletePopup(true);
                              setDataIndex(`${ticketIndex}`);
                            }}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium !text-red-700"
                          >
                            {t("tickets.ticket_delete_button_text")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={index}>
                  <td colSpan="7"> {t("tickets.no_tickets_available")}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/**/}

      {showCreatePopup && (
        <PopupForm
          onClose={() => {
            setshowCreatePopup(false);
            resetFields();
          }}
          title={t("tickets.ticket_create_popup_title")}
          description={t("tickets.ticket_create_popup_description")}
          onSubmit={handleCreateChange}
          buttonText={t("tickets.ticket_create_button_text")}
          disabled={isLoading}
        >
          {accountcreated ? (
            <></>
          ) : (
            <div className="bg-red-100 p-3 rounded-lg text-red-900 space-y-1">
              <div className="inline-flex items-center font-medium gap-1 w-full">
                <MdError /> {t("tickets.note")}
              </div>
              <div className="text-sm">
                {t("tickets.onboarding_note_complete_onboarding")}
              </div>
            </div>
          )}
          <div>
            <label className="form-label-popup">
              {t("tickets.ticket_name")}
            </label>
            <input
              type="text"
              name="ticketName"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("tickets.ticket_number")}
            </label>
            <input
              type="number"
              name="noOfAvailableTickets"
              placeholder="0"
              value={noOftickets}
              onChange={(e) => setNoOftickets(e.target.value)}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <div className="relative mb-4">
              <label className="form-label-popup">
                {t("tickets.ticket_price")}
              </label>

              <span className="absolute text-gray-500 text-base left-3 top-1/2 transform -translate-y-1/2 mt-3 pointer-events-none">
                <MdEuroSymbol />
              </span>

              <input
                className="w-full p-3.5 ps-8 focus:outline-none rounded-lg bg-zinc-100"
                type="text"
                name="ticket_price"
                placeholder="0"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only numbers and a single comma
                  if (/^\d*(,\d{0,2})?$/.test(value)) {
                    setPrice(value);
                  }
                }}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label-popup">
              {t("tickets.start_sale")}
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={start_datetime}
              onChange={(e) => setStart_datetime(e.target.value)}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">{t("tickets.stop_sale")}</label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              value={end_datetime}
              required
              onChange={(e) => setEnd_datetime(e.target.value)}
              className="form-control-popup"
            />
          </div>
        </PopupForm>
      )}
      {showEditPopop && (
        <PopupForm
          title={t("tickets.ticket_edit_popup_title")}
          description={t("tickets.ticket_edit_popup_description")}
          onClose={() => setShowEditPopop(false)}
          onSubmit={handleEditSubmit}
          buttonText={t("tickets.ticket_edit_button_text")}
          disabled={isLoading}
        >
          <div>
            <label className="form-label-popup">
              {t("tickets.ticket_name")}
            </label>
            <input
              type="text"
              name="ticketName"
              value={changeTicketinfo.tType}
              onChange={(e) =>
                setChangeTicketinfo({
                  ...changeTicketinfo,
                  tType: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("tickets.ticket_number")}
            </label>
            <input
              type="number"
              name="noOftickets"
              placeholder="0"
              value={changeTicketinfo.total_tickets}
              onChange={(e) =>
                setChangeTicketinfo({
                  ...changeTicketinfo,
                  total_tickets: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div className="relative mb-4">
            <label className="form-label-popup">
              {t("tickets.ticket_price")}
            </label>
            <span className="absolute text-gray-500 text-base left-3 top-1/2 transform -translate-y-1/2 mt-3 pointer-events-none">
              <MdEuroSymbol />
            </span>
            <input
                type="text"
                name="price"
                placeholder="0"
                value={changeTicketinfo.tPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*([,.]?\d{0,2})?$/.test(value)) {
                    setChangeTicketinfo({
                      ...changeTicketinfo,
                      tPrice: value,
                    });
                  }
                }}
              className="w-full p-3.5 ps-8 focus:outline-none rounded-lg bg-zinc-100"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("tickets.start_sale")}
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={changeTicketinfo.tStart}
              onChange={(e) =>
                setChangeTicketinfo({
                  ...changeTicketinfo,
                  tStart: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">{t("tickets.stop_sale")}</label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              value={changeTicketinfo.tEnd}
              onChange={(e) =>
                setChangeTicketinfo({
                  ...changeTicketinfo,
                  tEnd: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
        </PopupForm>
      )}

      {showDeletePopup && (
        <TwoBtnPopup
          iconType="delete"
          title={t("tickets.ticket_delete_button_text")}
          description={t("tickets.ticket_delete_confirmation")}
          onConfrim={handleDeleteTicket}
          onClose={() => setShowDeletePopup(false)}
          onConfrimText={t("tickets.yes")}
          onCloseText={t("tickets.no")}
        />
      )}

      {showTicketDetailsPopup && (
        <DetailsPopup
          onClose={() => setShowTicketDetailsPopup(false)}
          title={t("tickets.ticket_details_popup_title")}
          className="text-tg-orange text-center mb-4"
          details={ticketDetails}
        />
      )}
    </Transition4>
  );
};

export default Tickets;

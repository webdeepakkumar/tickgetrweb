"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { AiFillEdit, AiFillCopy, AiFillInfoCircle } from "react-icons/ai";

import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import DetailsPopup from "@/app/[locale]/components/detailsPopup";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Switch } from "@nextui-org/switch";
import PopupForm from "@/app/[locale]/components/PopupForm";
import TwoBtnPopup from "@/app/[locale]/components/TwoBtnPopup";
import {
  fetchAuthorizedEvents,
  addDiscountCode,
  fetchDiscountData,
  updateDiscountCode,
  deleteDiscountCode,
  updateDiscounFields,
} from "@/app/(Api)/firebase/firebase_firestore";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
//import Transition4 from "@/app/[locale]/animations/transition4";
const Transition4 = dynamic(() => import("@/app/[locale]/animations/transition4"), {
  ssr: false,
});
import toast from "react-hot-toast";
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

const Discounts = () => {
  const t = useTranslations("eventsDashboard");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();

  const [showCreatePopup, setshowCreatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopop, setShowEditPopop] = useState(false);
  const [showDiscountDetailsPopup, setShowDiscountDetailsPopup] =
    useState(false);

  const [discountName, setDiscountName] = useState("");
  const [percent, setPercent] = useState();
  const [maxUsage, setMaxUsage] = useState();
  const [eventsArray, setEventsArray] = useState([]);
  const [discountArray, setDiscountArray] = useState([]);
  const [start_datetime, setStart_datetime] = useState("");
  const [end_datetime, setEnd_datetime] = useState("");
  const [updateDiscountIndex, setupdateDiscountIndex] = useState([]);
  const [dataIndex, setDataIndex] = useState([]);
  const [editDiscountData, setEditDiscountData] = useState({
    discountCode: "",
    percent: "",
    dUsage: "",
    dStart: "",
    dEnd: "",
    isActive: true,
    dCodeUsed: "",
    oldStart: "",
  });
  const [oldDiscountCode, setOldDiscountCode] = useState();

  const [isChecked, setIsChecked] = useState(
    Array(eventsArray.length).fill(false)
  );
  const [isChangeChecked, setIsChangeChecked] = useState([]);

  const [isActive, setisActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [authorzed, setAuthorized] = useState(false);
  const [userId, setUserId] = useState();
  const { user } = useAuth();

  const previousdUsage = useRef("");
  const previousdCodeUsed = useRef("");

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
          (event) => {
            setEventsArray(event);
          }
        );
        if (!isAuthorized) {
          router.replace("/user/my-events");
        } else {
          setAuthorized(true);
          await fetchDiscountData(eventId, setDiscountArray);
        }
      }
    };

    checkAndFetchEvents();
  }, [userId, eventId]);

  useEffect(() => {
    const checkAndUpdateDiscountStatus = async () => {
      const today = new Date();
      if (discountArray && discountArray.length) {
        discountArray.forEach((discounts) => {
          if (
            discounts &&
            discounts.discountData &&
            Array.isArray(discounts.discountData)
          ) {
            discounts.discountData.forEach((discount, discountIndex) => {
              const endDate = discount.dEnd.toDate();
              if (endDate < today && discount.dStatus) {
                discount.dStatus = false;
                updateDiscounFields(
                  eventId,
                  discountIndex,
                  { dStatus: false },
                  "dStatus"
                );
              }
            });
          }
        });
      }
      setDataLoading(false);
    };

    if (authorzed) {
      checkAndUpdateDiscountStatus();
    }
  }, [discountArray, eventId, authorzed]);

  useEffect(() => {
    setIsChecked(Array(eventsArray.length).fill(false));
  }, [eventsArray]);

  if (dataLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const resetFields = () => {
    setDiscountName("");
    setPercent(null);
    setMaxUsage(null);
    setStart_datetime("");
    setEnd_datetime("");
    setDataIndex(null);
  };

  const setMaxPercent = (e) => {
    const value = Math.min(Number(e.target.value), 99);
    return value;
  };

  const handleCopyDiscount = async (discountCode) => {
    await navigator.clipboard.writeText(discountCode);
    toast.success("Discount Code Copied!");
  };

  const handleCreateChange = async (e) => {
    e.preventDefault();
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

    if (parseInt(maxUsage) < 0 || parseFloat(percent) < 0) {
      alert("The number of discounts and the percentage must be non-negative.");
      setIsLoading(false);
      return;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const discountData = [
      {
        discountCode: discountName,
        dStart: startTimestamp,
        dEnd: endTimestamp,
        percent: parseFloat(percent),
        dUsage: parseInt(maxUsage),
        dStatus: isActive,
        dCodeUsed: parseInt(maxUsage),
      },
    ];

    const ticketIndex = dataIndex;

    await addDiscountCode(eventId, ticketIndex, discountData);

    fetchAuthorizedEvents(userId, eventId, setEventsArray);
    fetchDiscountData(eventId, setDiscountArray);

    setshowCreatePopup(false);
    setIsLoading(false);
    resetFields();
  };
  const handleCheckBoxChange = (discountIndex) => {
    setIsChecked((prevIsChecked) => {
      const newIsChecked = [...prevIsChecked];
      newIsChecked[discountIndex] = !prevIsChecked[discountIndex];
      return newIsChecked;
    });

    setDataIndex((prevDataIndex) => {
      if (!Array.isArray(prevDataIndex)) {
        return [discountIndex];
      } else {
        if (!prevDataIndex.includes(discountIndex)) {
          return [...prevDataIndex, discountIndex];
        } else {
          return prevDataIndex.filter((index) => index !== discountIndex);
        }
      }
    });
  };

  const handleEditCheckBoxChange = (ticketIndex) => {
    setIsChangeChecked((prevIsChangeChecked) => {
      const updatedIsChecked = [...prevIsChangeChecked];
      updatedIsChecked[ticketIndex] = !updatedIsChecked[ticketIndex];
      return updatedIsChecked;
    });
  };

  const handleEditPopupOpen = async (discountIndex) => {
    const discount = discountArray[0]?.discountData?.[discountIndex];
    if (discount) {
      setOldDiscountCode(discount.discountCode || "");
      setEditDiscountData({
        discountCode: discount.discountCode || "",
        percent: parseFloat(discount.percent) || "",
        dUsage: parseInt(discount.dUsage) || "",
        dStart: formatDateInput(discount.dStart) || "",
        dEnd: formatDateInput(discount.dEnd) || "",
        dCodeUsed: parseInt(discount.dCodeUsed) || "",
        oldStart: formatDateInput(discount.dStart) || "",
      });

      previousdUsage.current = parseInt(discount.dUsage) || "";
      previousdCodeUsed.current = parseInt(discount.dCodeUsed) || "";

      const newIsChecked = eventsArray.flatMap((event) =>
        Array.isArray(event.ticketInfo)
          ? event.ticketInfo.map((ticket) =>
              ticket.dCodes?.includes(discount.discountCode)
            )
          : []
      );

      setIsChangeChecked(newIsChecked);
      setupdateDiscountIndex(discountIndex);
      setShowEditPopop(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const startDate = new Date(editDiscountData.dStart);
    const endDate = new Date(editDiscountData.dEnd);
    const today = new Date();
    const oldStart = new Date(editDiscountData.oldStart);

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
      parseInt(editDiscountData.dUsage) < 0 ||
      parseFloat(editDiscountData.percent) < 0
    ) {
      alert("The number of discounts and the percentage must be non-negative.");
      setIsLoading(false);

      return;
    }

    const prevdUsage = parseInt(previousdUsage.current) || 0;
    const prevdCodeUsage = parseInt(previousdCodeUsed.current) || 0;
    const total_usage = parseInt(editDiscountData.dUsage) || 0;

    if (total_usage > prevdUsage) {
      editDiscountData.dCodeUsed = prevdCodeUsage + (total_usage - prevdUsage);
    } else if (total_usage <= prevdUsage && prevdUsage <= prevdCodeUsage) {
      editDiscountData.dCodeUsed = prevdCodeUsage - (prevdUsage - total_usage);
    } else if (prevdCodeUsage > total_usage && total_usage < prevdUsage) {
      alert(
        "Total Number of Discounts should be greater than remaining discounts"
      );
      setIsLoading(false);
      return;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const updatedDiscountData = {
      discountCode: editDiscountData.discountCode || "",
      dStart: startTimestamp || new Date().toISOString(),
      dEnd: endTimestamp || new Date().toISOString(),
      percent: parseFloat(editDiscountData.percent) || 0,
      dUsage: total_usage || 0,
      dStatus:
        editDiscountData.isActive !== undefined
          ? editDiscountData.isActive
          : true,
      dCodeUsed: parseInt(editDiscountData.dCodeUsed),
    };

    Object.keys(updatedDiscountData).forEach((key) => {
      if (updatedDiscountData[key] === undefined) {
        toast.error(`Error: ${key} is undefined in updatedDiscountData`);
      }
    });

    const discountIndex = updateDiscountIndex;
    const ticketIndex = eventsArray.flatMap((event, eventIndex) =>
      Array.isArray(event.ticketInfo)
        ? event.ticketInfo.map((ticket, ticketIndex) => ticketIndex)
        : []
    );

    const filteredTicketIndex = isChangeChecked
      ? ticketIndex.filter((_, index) => isChangeChecked[index])
      : [];

    await updateDiscountCode(
      eventId,
      discountIndex,
      ticketIndex,
      updatedDiscountData,
      isChangeChecked,
      oldDiscountCode
    );

    setShowEditPopop(false);
    fetchAuthorizedEvents(userId, eventId, setEventsArray);
    fetchDiscountData(eventId, setDiscountArray);
    setIsLoading(false);
  };

  const handleDeleteDiscountCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await deleteDiscountCode(eventId, dataIndex, oldDiscountCode);
      setShowDeletePopup(false);

      fetchAuthorizedEvents(userId, eventId, setEventsArray);
      fetchDiscountData(eventId, setDiscountArray);
    } catch (error) {
      toast.error("Error deleting discount-code ", error);
    }
    resetFields();
    setIsLoading(false);
  };

  const handleDiscountStatus = async (dataIndex, value) => {
    const discount = discountArray[0].discountData[dataIndex];
    const today = new Date();
    const endDate = discount.dEnd.toDate();

    if (endDate < today && value) {
      alert("Please update the end date before activating the discount.");
      return;
    }

    const updatedDiscountStatus = {
      dStatus: value,
    };

    const response = await updateDiscounFields(
      eventId,
      dataIndex,
      updatedDiscountStatus,
      "dStatus"
    );
    if (response) {
      if (updatedDiscountStatus.dStatus) {
        toast.success("Discount Is Now Active");
      } else {
        toast.success("Discount Is Now Disabled");
      }
    } else {
      toast.error("Error updating Discount!");
    }
    fetchAuthorizedEvents(userId, eventId, setEventsArray);
    fetchDiscountData(eventId, setDiscountArray);
  };

  const discount = discountArray[0];

  const discountDetails = discount?.discountData[dataIndex]
    ? [
        {
          label: `${t("discounts.discount")} ${t("discounts.code")}`,
          value: discount?.discountData[dataIndex]?.discountCode,
        },
        {
          label: t("discounts.discount"),
          value: `${discount?.discountData[dataIndex]?.percent}%`,
        },
        {
          label: t("discounts.usage"),
          value: `${discount?.discountData[dataIndex]?.dCodeUsed} / ${discount?.discountData[dataIndex]?.dUsage}`,
        },
        {
          label: t("discounts.valid_from"),
          value: formatDate(discount?.discountData[dataIndex]?.dStart),
        },
        {
          label: t("discounts.valid_till"),
          value: formatDate(discount?.discountData[dataIndex]?.dEnd),
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
            disabled={authorzed == false || isLoading}
          >
            {t("discounts.create_discount_button")}
          </button>
        </div>
      </div>
      <div className="bg-white w-full h-full flex justify-center rounded-xl md:p-6 p-4 gap-5 overflow-y-auto overflow-x-hidden no-scrollbar ">
        <table className="border-collapse w-full h-max text-left text-xs">
          <thead>
            <tr className="text-neutral-500 border-b uppercase">
              <th className="pb-4 font-medium"> {t("discounts.status")}</th>
              <th className="pb-4 font-medium"> {t("discounts.code")}</th>
              <th className="flex items-center pb-4 font-medium">
                {" "}
                {t("discounts.discount")}
              </th>
              <th className="pb-4 font-medium"> {t("discounts.usage")}</th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("discounts.valid_from")}
              </th>
              <th className="md:table-cell hidden  pb-4 font-medium">
                {t("discounts.valid_till")}
              </th>
            </tr>
          </thead>
          <tbody>
            {discountArray.map((discounts, index) =>
              Array.isArray(discounts.discountData) ? (
                discounts.discountData.map((discount, discountIndex) => (
                  <tr key={`${index}-${discountIndex}`}>
                    <td className="pt-5 font-medium">
                      <Switch
                        size="sm"
                        color="warning"
                        isSelected={discount.dStatus}
                        onValueChange={(value) =>
                          handleDiscountStatus(discountIndex, value)
                        }
                      />
                    </td>
                    <td className="pt-5 font-medium">
                      {discount.discountCode}
                    </td>
                    <td className="pt-5 font-medium">{discount.percent}</td>
                    <td className="pt-5 font-medium">
                      {discount.dCodeUsed}/{discount.dUsage}
                    </td>
                    <td className="md:table-cell hidden pt-5 font-medium">
                      {formatDate(discount.dStart)}
                    </td>
                    <td className="md:table-cell hidden pt-5 font-medium">
                      {formatDate(discount.dEnd)}
                    </td>
                    {/* <td className="lg:table-cell hidden pt-5 font-medium w-max">
                      <button
                        onClick={() =>
                          handleCopyDiscount(discount.discountCode)
                        }
                        className="text-sm bg-zinc-200 text-neutral-600 p-1 rounded-md hover:bg-zinc-500 hover:text-white transition-all"
                      >
                        <AiFillCopy />
                      </button>
                    </td>
                    <td className="lg:table-cell hidden pt-5 font-medium w-max">
                      <button
                        onClick={() => handleEditPopupOpen(discountIndex)}
                        className="text-sm bg-zinc-200 text-neutral-600 p-1 rounded-md hover:bg-zinc-500 hover:text-white transition-all"
                      >
                        <AiFillEdit />
                      </button>
                    </td>
                    <td className="lg:table-cell hidden pt-5 font-medium w-max">
                      <button
                        onClick={() => {
                          setShowDeletePopup(true);
                          setDataIndex(discountIndex);
                          setOldDiscountCode(discount.discountCode);
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
                              setDataIndex(discountIndex);
                              setShowDiscountDetailsPopup(true);
                            }}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium"
                          >
                            {t("discounts.discount_details")}
                          </DropdownItem>
                          <DropdownItem
                            onPressk={() =>
                              handleCopyDiscount(discount.discountCode)
                            }
                            className="hover:!bg-zinc-100 !bg-white transition font-medium"
                          >
                            <button
                              onClick={() =>
                                handleCopyDiscount(discount.discountCode)
                              }
                            >
                              {t("discounts.copy_discount")}
                            </button>
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => handleEditPopupOpen(discountIndex)}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium"
                          >
                            {t("discounts.edit_discount")}
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => {
                              setShowDeletePopup(true);
                              setDataIndex(discountIndex);
                              setOldDiscountCode(discount.discountCode);
                            }}
                            className="hover:!bg-zinc-100 !bg-white transition font-medium !text-red-700"
                          >
                            {t("discounts.delete_discount")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={index}>
                  <td colSpan="7">{t("discounts.no_tickets_available")}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/**/}

      {showCreatePopup && (
        <PopupForm
          title={t("discounts.create_discount_popup_title")}
          description={t("discounts.create_discount_popup_description")}
          onClose={() => {
            setshowCreatePopup(false);
            resetFields();
          }}
          onSubmit={handleCreateChange}
          buttonText={t("discounts.create_discount_popup_button")}
          disabled={isLoading}
        >
          <div>
            <label className="form-label-popup">
              {t("discounts.discount")} {t("discounts.code")}
            </label>
            <input
              type="text"
              name="discountName"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.discount")} (%)
            </label>
            <input
              type="number"
              name="percent"
              placeholder="0"
              value={percent}
              onChange={(e) => setPercent(setMaxPercent(e))}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.max_usage")}
            </label>
            <input
              type="number"
              name="percentUsage"
              placeholder="0"
              value={maxUsage}
              onChange={(e) => setMaxUsage(e.target.value)}
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.valid_from")}*
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
            <label className="form-label-popup">
              {t("discounts.valid_till")}*
            </label>
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
          <div className="flex flex-col pb-4 gap-1 px-1">
            <p className="pb-2 mb-2 text-tg-orange2 text-sm border-b">
              {t("discounts.select_ticket_type")}
            </p>
            {eventsArray.map((event, index) =>
              Array.isArray(event.ticketInfo) ? (
                event.ticketInfo.map((ticket, ticketIndex) => {
                  const uniqueId = `type-${index}-${ticketIndex}`;
                  return (
                    <div
                      key={`${index}-${ticketIndex}`}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        id={uniqueId}
                        type="checkbox"
                        checked={isChecked[ticketIndex]}
                        onChange={() => handleCheckBoxChange(ticketIndex)}
                        className="checkbox2"
                      />
                      <label className="cursor-pointer" htmlFor={uniqueId}>
                        {ticket.tType}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p key={index}>{t("discounts.no_tickets_available")}</p>
              )
            )}
          </div>
        </PopupForm>
      )}

      {showEditPopop && (
        <PopupForm
          title={t("discounts.edit_discount_popup_title")}
          description={t("discounts.edit_discount_popup_description")}
          onClose={() => setShowEditPopop(false)}
          buttonText={t("discounts.edit_discount_popup_button")}
          onSubmit={handleEditSubmit}
          disabled={isLoading}
        >
          <div>
            <label className="form-label-popup">
              {t("discounts.discount")} {t("discounts.code")}
            </label>
            <input
              type="text"
              name="discountName"
              value={editDiscountData.discountCode}
              onChange={(e) =>
                setEditDiscountData({
                  ...editDiscountData,
                  discountCode: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.discount")} (%)
            </label>
            <input
              type="number"
              name="percent"
              placeholder="0"
              value={editDiscountData.percent}
              onChange={(e) =>
                setEditDiscountData({
                  ...editDiscountData,
                  percent: setMaxPercent(e),
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.max_usage")}
            </label>
            <input
              type="number"
              name="percentUsage"
              placeholder="0"
              value={editDiscountData.dUsage}
              onChange={(e) =>
                setEditDiscountData({
                  ...editDiscountData,
                  dUsage: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.valid_from")}*
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={editDiscountData.dStart}
              onChange={(e) =>
                setEditDiscountData({
                  ...editDiscountData,
                  dStart: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div>
            <label className="form-label-popup">
              {t("discounts.valid_till")}*
            </label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              value={editDiscountData.dEnd}
              onChange={(e) =>
                setEditDiscountData({
                  ...editDiscountData,
                  dEnd: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <div className="pb-4 flex flex-col gap-1 px-1">
            <p className="pb-2 mb-2 text-tg-orange2 text-sm border-b">
              {t("discounts.select_ticket_type")}
            </p>
            {eventsArray.map((event, index) =>
              Array.isArray(event.ticketInfo) ? (
                event.ticketInfo.map((ticket, ticketIndex) => {
                  const uniqueId = `type-${index}-${ticketIndex}`;
                  return (
                    <div
                      key={`${index}-${ticketIndex}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={isChangeChecked[ticketIndex]}
                        onChange={() => handleEditCheckBoxChange(ticketIndex)}
                        className="checkbox2"
                      />
                      <label className="cursor-pointer" htmlFor={uniqueId}>
                        {ticket.tType}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p key={index}>{t("discounts.no_tickets_available")}</p>
              )
            )}
          </div>
        </PopupForm>
      )}

      {showDeletePopup && (
        <TwoBtnPopup
          iconType="delete"
          title={t("discounts.delete_discount")}
          description="Are you sure you want to delete this discount?"
          onConfrim={handleDeleteDiscountCode}
          onClose={() => setShowDeletePopup(false)}
          onConfrimText={t("discounts.yes")}
          onCloseText={t("discounts.no")}
        />
      )}

      {showDiscountDetailsPopup && (
        <DetailsPopup
          title={t("discounts.discount_details")}
          details={discountDetails}
          className="text-tg-orange text-center mb-4"
          onClose={() => setShowDiscountDetailsPopup(false)}
        />
      )}
    </Transition4>
  );
};

export default Discounts;

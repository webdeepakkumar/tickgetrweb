"use client";

import React from "react";
import { CSVLink } from "react-csv";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Tooltip from "@/app/[locale]/components/tooltip";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import ReportsPopup from "@/app/[locale]/components/reportsopup";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Switch } from "@nextui-org/switch";
import {
  fetchBuyers,
  updateBuyerScannedStatus,
  fetchOneUser,
  fetchAuthorizedEvents,
  updateOneCollection,
} from "@/app/(Api)/firebase/firebase_firestore";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import Transition4 from "@/app/[locale]/animations/transition4";
import PopupForm from "@/app/[locale]/components/PopupForm";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { updatebuyerstatus } from "@/app/(Api)/firebase/firebase_firestore";
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
  return `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
};

const Reports = () => {
  const t = useTranslations("eventsDashboard");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();

  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [showBuyerDetailsPopup, setShowBuyerDetailsPopup] = useState(false);
  const [buyersArray, setBuyersArray] = useState([]);
  const [fetchUser, setFetchUser] = useState([]);
  const [isNameDescending, setIsNameDescending] = useState(null);
  const [isDateDescending, setIsDateDescending] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [authorzed, setAuthorized] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [refundUser, setRefundUser] = useState({
    chargeId: "",
    refundId: "",
    amount: "",
    reason: "",
    refundAppFee: false,
    stripeAccountId: "",
    tQuantity: "",
    buyerId: "",
    isRefunded: false,
    refundAmount: "",
    rAdjustment: "",
    uEmail: "",
    cardDigits: "",
    uName: "",
    bEmail: "",
    bName: "",
    organizationName: "",
    eName: "",
    isValid: true,
  });
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
          (event) => {
            setEventData(event);
            setLoading(false);
          }
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
    const event = eventData[0];
    if (buyersArray && fetchUser) {
      setRefundUser({
        amount: selectedBuyer?.tPrice,
        tQuantity: selectedBuyer?.tQuantity,
        stripeAccountId: fetchUser[0]?.stripeAccountId,
        chargeId: selectedBuyer?.chargeId,
        buyerId: selectedBuyer?.buyerId,
        isRefunded: selectedBuyer?.isRefunded,
        refundId: selectedBuyer?.refundId,
        uEmail: fetchUser[0]?.uEmail,
        uName: fetchUser[0]?.uName,
        cardDigits: selectedBuyer?.cardDigits,
        bEmail: selectedBuyer?.bEmail,
        bName: selectedBuyer?.bName,
        organizationName: fetchUser[0]?.organizationName,
        eName: event?.eName,
        refundAmount: selectedBuyer?.tPrice - selectedBuyer?.refundAmount,
        isValid: selectedBuyer?.isValid,
      });
    }
  }, [buyersArray, selectedIndex, selectedBuyer]);

  useEffect(() => {
    if (userId) {
      fetchBuyers(userId, eventId, setBuyersArray);
      fetchOneUser(userId, setFetchUser);
    }
  }, [userId]);

  useEffect(() => {
    setFilteredBuyers(buyersArray);
  }, [buyersArray]);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      const events = await fetchAuthorizedEvents(
        userId,
        eventId,
        (fetchedEvents) => {
          const ticketTypesArray = fetchedEvents.flatMap((event) =>
            event.ticketInfo?.map((ticket) => ticket.tType)
          );
          const uniqueTicketTypes = [...new Set(ticketTypesArray)];
          setTicketTypes(uniqueTicketTypes);
        }
      );
    };
    if (userId && eventId) {
      fetchTicketTypes();
    }
  }, [userId, eventId, setTicketTypes]);

  useEffect(() => {
    if (selectedTicketType) {
      const filtered = buyersArray.filter(
        (buyer) => buyer.tType === selectedTicketType
      );
      setFilteredBuyers(filtered);
    } else {
      setFilteredBuyers(buyersArray);
    }
  }, [selectedTicketType, buyersArray]);

  useEffect(() => {
    const csvData = filteredBuyers.map((buyer) => ({
      Name: buyer.bName,
      Email: buyer.bEmail,
      Tickets: buyer.tQuantity,
      Price: `€${buyer.tPrice}`,
      Refunds: buyer.refundAmount === 0 ? "-" : `€${buyer.refundAmount}`,
      Type: buyer.tType,
      Discount: `${buyer.discountPercent}%`,
      OrderTime: formatDate(buyer.tOrderTime),
      TicketCode: buyer.tQrCode,
      ScanStatus: buyer.tIsScanned ? "Scanned" : "Not Scanned",
    }));
    setCsvData(csvData);
  }, [filteredBuyers]);

  const sortByDate = () => {
    const sortedArray = [...filteredBuyers].sort((a, b) =>
      isDateDescending
        ? new Date(b.tOrderTime.toDate()) - new Date(a.tOrderTime.toDate())
        : new Date(a.tOrderTime.toDate()) - new Date(b.tOrderTime.toDate())
    );
    setFilteredBuyers(sortedArray);
    setIsDateDescending(isDateDescending === null ? true : !isDateDescending);
    setIsNameDescending(null);
  };

  const sortByName = () => {
    const sortedArray = [...filteredBuyers].sort((a, b) =>
      isNameDescending
        ? a.bName.localeCompare(b.bName)
        : b.bName.localeCompare(a.bName)
    );
    setFilteredBuyers(sortedArray);
    setIsNameDescending(isNameDescending === null ? true : !isNameDescending);
    setIsDateDescending(null);
  };

  const filterBuyersByName = (query) => {
    const filtered = buyersArray.filter((buyer) =>
      buyer.bName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBuyers(filtered);
  };
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBuyersByName(query);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBuyer(null);
    setRefundUser("");
    setIsValid(false);
    setIsNameDescending(null);
    setIsDateDescending(null);
    setFilteredBuyers(buyersArray);
  };
  const toggleScannedStatus = async (value, buyer) => {
    if (!buyer) {
      return;
    }
    setSelectedBuyer({
      ...buyer,
      tIsScanned: value,
    });
    await updateBuyerScannedStatus(buyer);
    await fetchBuyers(userId, eventId, setBuyersArray);
    resetFilters();
  };

  //refund
  //  useEffect(()=>{
  //    const handleRefundBuyer = async (e) => {
  //     e.preventDefault();
  //     setIsLoading(true);
  //     try {
  //       if (refundUser.stripeAccountId) {
  //         const amountInCents = Math.round(refundUser.refundAmount * 100);
  //         const response = await axios.post("/api/refund-charge", {
  //           accountId: refundUser.stripeAccountId,
  //           chargeId: refundUser.chargeId,
  //           amount: amountInCents,
  //           reason: refundUser.reason,
  //           refundApplicationFee: refundUser.refundAppFee,
  //         });
  //         const { refundId, refundDate } = response.data;
  //         if (refundId) {
  //           console.log("eventname:", refundUser.eName);
  //           toast.success("Buyer refunded successfully!");
  //           const response = await fetch("/api/send-email", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               to: refundUser.bEmail,
  //               uEmail: refundUser.uEmail,
  //               rAmount: refundUser.amount,
  //               uName: refundUser.organizationName
  //                 ? refundUser.organizationName
  //                 : refundUser.uName,
  //               bName: refundUser.bName,
  //               rDate: formatDate(new Date(refundDate)),
  //               cardDigits: refundUser.cardDigits,
  //               rAdjustment: refundUser.amount - refundUser.refundAmount,
  //               refundAmount: refundUser.refundAmount,
  //               eventName: refundUser.eName,
  //               tUID: process.env.NEXT_PUBLIC_MAILTRAP_REFUND_TID,
  //             }),
  //           });

  //           const data = await response.json();
  //           if (response.ok) {
  //             toast.success("Email sent successfully!");
  //           } else {
  //             toast.error("Error sending email ", data.error);
  //           }
  //           const buyerData = {
  //             refundId: refundId,
  //             isRefunded: true,
  //             refundAmount: parseFloat(
  //               parseFloat(selectedBuyer.refundAmount) +
  //                 parseFloat(refundUser.refundAmount)
  //             ),
  //           };
  //           if (isValid) {
  //             buyerData.isValid = false;
  //           }
  //           const responseData = await updateOneCollection(
  //             refundUser.buyerId,
  //             "buyer",
  //             "buyerId",
  //             buyerData
  //           );
  //           if (responseData == true) {
  //             toast.success("Buyer updated successfully");
  //           } else if (responseData == false) {
  //             toast.error("Error updating buyer");
  //           }
  //           await fetchBuyers(userId, eventId, setBuyersArray);
  //           resetFilters();
  //         }
  //         setIsValid(false);
  //         setShowRefundPopup(false);
  //       }
  //     } catch (error) {
  //       toast.error(`Error while refunding user:, ${error}`);
  //       setShowRefundPopup(false);
  //     }
  //     setIsLoading(false);
  //   };

  //  })
  const handlebuyerStatus = async (id) => {
    try {
      await updatebuyerstatus(id);
          setFilteredBuyers((prevBuyers) =>
      prevBuyers.map((buyer) =>
        buyer.buyerId === id
          ? { ...buyer, tIsScanned: !buyer.tIsScanned } 
          : buyer
      )
    );
    } catch (error) {
      console.log(error);
    }
  };

  const buyerDetails = [
    {
      label: t("reports.name"),
      value: filteredBuyers[selectedIndex]?.bName,
    },
    {
      label: t("reports.email"),
      value: filteredBuyers[selectedIndex]?.bEmail,
    },
    {
      label: t("reports.price"),
      value: (
        <div className="md:inline-flex items-center gap-2 text-right">
          {filteredBuyers[selectedIndex]?.isRefunded && (
            <div
              className={`${
                filteredBuyers[selectedIndex]?.refundAmount ==
                filteredBuyers[selectedIndex]?.tPrice
                  ? "text-red-700"
                  : "text-yellow-500"
              } inline-flex`}
            >
              {filteredBuyers[selectedIndex]?.refundAmount ==
              filteredBuyers[selectedIndex]?.tPrice
                ? t("reports.completelyRefunded")
                : t("reports.partiallyRefunded")}
            </div>
          )}
          {filteredBuyers[selectedIndex]?.isRefunded && (
            <span className="text-zinc-500 md:block hidden">-</span>
          )}
          <div>€ {filteredBuyers[selectedIndex]?.tPrice}</div>
        </div>
      ),
    },
    {
      label: t("reports.type"),
      value: filteredBuyers[selectedIndex]?.tType,
    },
    {
      label: t("reports.discount"),
      value: `${filteredBuyers[selectedIndex]?.discountPercent}%`,
    },
    {
      label: t("reports.orderTime"),
      value: formatDate(filteredBuyers[selectedIndex]?.tOrderTime),
    },
    {
      label: t("reports.ticketCode"),
      value: filteredBuyers[selectedIndex]?.tQrCode,
    },
    {
      label: t("reports.qty"),
      value: filteredBuyers[selectedIndex]?.tQuantity,
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Transition4 className="flex flex-col w-full h-full gap-4">
      <div className="w-full flex-col inline-flex md:flex-row justify-between md:gap-0 gap-4 text-sm font-medium">
        <div className="inline-flex gap-2 justify-between text-neutral-500">
          <div className="py-3 overflow-hidden w-full lg:w-60 pl-10 pr-3 bg-white rounded-xl relative border-2 border-white">
            <IoSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
            <input
              className="outline-none"
              type="text"
              placeholder={t("reports.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button
            className={`font-medium rounded-xl py-3 md:inline-flex hidden items-center gap-1 border-2 text-lg w-max ${
              isNameDescending !== null
                ? "border-tg-orange2 text-tg-orange2 pl-4 pr-3"
                : "bg-white px-5 border-white"
            }`}
            onClick={sortByName}
          >
            <div className="text-sm">{t("reports.name")}</div>
            {isNameDescending === true ? (
              <IoMdArrowDropdown className="-mr-1" />
            ) : (
              isNameDescending === false && (
                <IoMdArrowDropup className="-mr-1" />
              )
            )}
          </button>
          <button
            className={`font-medium rounded-xl py-3 inline-flex items-center gap-1 border-2 text-lg w-max ${
              isDateDescending !== null
                ? "border-tg-orange2 text-tg-orange2 pl-4 pr-2"
                : "bg-white px-5 border-white"
            }`}
            onClick={sortByDate}
          >
            <div className="text-sm">{t("reports.date")}</div>
            {isDateDescending === true ? (
              <IoMdArrowDropdown />
            ) : (
              isDateDescending === false && <IoMdArrowDropup />
            )}
          </button>
          <Dropdown className="min-w-0 w-fit ">
            <DropdownTrigger className="py-3 px-5 rounded-xl md:inline-flex hidden items-center gap-1.5 bg-white">
              <div>
                {selectedTicketType === ""
                  ? t("reports.allTickets")
                  : selectedTicketType}
                <FaAngleDown />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Ticket Types"
              variant="faded"
              color="default"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={[String(selectedTicketType)]}
            >
              <DropdownItem key="all" onPress={() => setSelectedTicketType("")}>
                {t("reports.allTickets")}
              </DropdownItem>
              {ticketTypes.map((type) => (
                <DropdownItem
                  key={type}
                  onPress={() => setSelectedTicketType(type)}
                >
                  {type}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="md:flex justify-end">
          <CSVLink data={csvData} filename="buyers_data.csv">
            <button className="py-3 px-5 bg-tg-orange rounded-xl text-white hover:bg-tg-orange-hover transition-all">
              Download CSV
            </button>
          </CSVLink>
        </div>
      </div>
      <div className="bg-white w-full h-full flex justify-center rounded-xl md:p-6 p-4 overflow-y-auto no-scrollbar">
        <table className="border-collapse w-full h-max text-left text-xs">
          <thead>
            <tr className="text-neutral-500 border-b uppercase">
              <th className="pb-4 font-medium">{t("reports.status")}</th>
              <th className="pb-4 font-medium">{t("reports.name")}</th>
              <th className="pb-4 font-medium">{t("reports.email")}</th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("reports.qty")}
              </th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("reports.price")}
              </th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("reports.type")}
              </th>
              <th className="md:table-cell hidden pb-4 font-medium">
                {t("reports.discount")}
              </th>
              <th className="lg:table-cell hidden pb-4 font-medium">
                {t("reports.orderTime")}
              </th>
              <th className="lg:table-cell hidden pb-4 font-medium">
                {t("reports.ticketCode")}
              </th>

              <th className="lg:table-cell hidden pb-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer, index) => (
              <tr key={index}>
                <td className="pt-5">
                  <Switch
                    size="sm"
                    color="warning"
                    isSelected={buyer.tIsScanned}
                    // onValueChange={(value) => {
                    //   toggleScannedStatus(value, buyer);
                    // }}
                    onValueChange={() =>
                      handlebuyerStatus(buyer.buyerId)
                    }
                  />
                </td>
                <td className="pt-5 font-medium">
                  {buyer.bName.length > 11 ? (
                    <Tooltip position="top" content={buyer.bName}>
                      {buyer.bName.substring(0, 11) + "..."}
                    </Tooltip>
                  ) : (
                    buyer.bName
                  )}
                </td>
                <td className="pt-5 font-medium">
                  {buyer.bEmail.length > 20 ? (
                    <Tooltip position="top" content={buyer.bEmail}>
                      {buyer.bEmail.substring(0, 20) + "..."}
                    </Tooltip>
                  ) : (
                    buyer.bEmail
                  )}
                </td>
                <td className="md:table-cell hidden pt-5 font-medium">
                  {buyer.tQuantity}
                </td>
                <td className="md:table-cell hidden pt-4 font-medium">
                  {buyer.refundAmount ? (
                    <Tooltip
                      position="left"
                      content={
                        buyer.refundAmount === buyer.tPrice
                          ? t("reports.refunded")
                          : `${t("reports.partiallyRefunded")} €${
                              buyer.refundAmount
                            }`
                      }
                    >
                      <span
                        className={
                          buyer.refundAmount === buyer.tPrice
                            ? "text-red-700"
                            : "text-yellow-500"
                        }
                      >
                        € {buyer.tPrice}
                      </span>
                    </Tooltip>
                  ) : (
                    <span>€ {buyer.tPrice}</span>
                  )}
                </td>

                <td className="md:table-cell hidden pt-5 font-medium">
                  {buyer.tType.length > 13 ? (
                    <Tooltip position="top" content={buyer.tType}>
                      {buyer.tType.substring(0, 13) + "..."}
                    </Tooltip>
                  ) : (
                    buyer.tType
                  )}
                </td>
                <td className="md:table-cell hidden pt-5 font-medium">
                  {buyer.discountPercent}%
                </td>
                <td className="lg:table-cell hidden pt-5 font-medium">
                  {formatDate(buyer.tOrderTime)}
                </td>
                <td className="lg:table-cell hidden pt-5 font-medium">
                  {buyer.tQrCode}
                </td>

                {/* dropdown button */}
                <td className="relative pt-6">
                  <Dropdown className="min-w-0 font-medium">
                    <DropdownTrigger>
                      <button className="text-zinc-400 outline-none bg-red">
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
                          setShowBuyerDetailsPopup(true);
                          setSelectedIndex(index);
                        }}
                        className="hover:!bg-zinc-100 !bg-white transition font-medium"
                      >
                        {t("reports.buyerDetails")}
                      </DropdownItem>
                      {/* <DropdownItem
                        key="refund-buyer"
                        onPress={() => {
                          if (buyer.refundAmount != buyer.tPrice) {
                            setShowRefundPopup(true);
                            setSelectedBuyer(buyer);
                          }
                        }}
                        className={`hover:!bg-zinc-100 !bg-white transition font-medium ${
                          buyer.refundAmount === buyer.tPrice
                            ? "!text-red-700"
                            : buyer.refundAmount !== 0
                            ? "!text-yellow-500"
                            : ""
                        }`}
                      >
                        {t("reports.refund")}
                      </DropdownItem> */}
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showRefundPopup && (
        <PopupForm
          title={t("reports.refundPopup.title")}
          description={t("reports.refundPopup.description")}
          onClose={() => {
            setShowRefundPopup(false);
            resetFilters();
          }}
          buttonText={t("reports.refundPopup.buttonText")}
          onSubmit={handleRefundBuyer}
          disabled={isLoading}
        >
          <div className="-mb-4">
            <label className="form-label-popup">
              {t("reports.refundPopup.refundAmountLabel")}
            </label>
            <input
              type="text"
              name="refundAmount"
              value={refundUser.refundAmount}
              onChange={(e) =>
                setRefundUser({
                  ...refundUser,
                  refundAmount: e.target.value,
                })
              }
              className="form-control-popup"
              required
            />
          </div>
          <select
            id="refundType"
            value={refundUser.reason}
            aria-required={true}
            onChange={(e) =>
              setRefundUser({
                ...refundUser,
                reason: e.target.value,
              })
            }
            className="form-control-popup"
            required={true}
          >
            <option
              value=""
              disabled
              selected
              className="text-zinc-500 text-sm py-2"
            >
              {t("reports.refundPopup.selectReasonPlaceholder")}
            </option>
            <option value="duplicate" className="text-sm py-2">
              {t("reports.refundPopup.reasons.duplicate")}
            </option>
            <option value="fraudulent" className="text-sm py-2">
              {t("reports.refundPopup.reasons.fraudulent")}
            </option>
            <option value="requested_by_customer" className="text-sm py-2">
              {t("reports.refundPopup.reasons.requestedByCustomer")}
            </option>
          </select>
          {refundUser.isValid && (
            <div className="inline-flex justify-center items-center font-normal text-xs -mb-3 mt-3 gap-2 text-zinc-500">
              <div className="w-max flex justify-center items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={isValid}
                  onChange={(e) => setIsValid(e.target.checked)}
                  className="checkbox"
                />
              </div>
              <label htmlFor="terms" className="cursor-pointer">
                {t("reports.refundPopup.invalidTicket")}
              </label>
            </div>
          )}
          <div className="bg-red-100 p-3 rounded-lg text-red-900 space-y-1">
            <div className="inline-flex items-center font-medium gap-1 w-full">
              <MdError /> {t("reports.refundPopup.noteTitle")}
            </div>
            <div className="text-sm">
              {t("reports.refundPopup.noteDescription")}
            </div>
          </div>
        </PopupForm>
      )}

      {showBuyerDetailsPopup && (
        <ReportsPopup
          onClose={() => setShowBuyerDetailsPopup(false)}
          title={t("reports.buyerDetails")}
          className="text-tg-orange text-center mb-4"
          details={buyerDetails}
        />
      )}
    </Transition4>
  );
};

export default Reports;

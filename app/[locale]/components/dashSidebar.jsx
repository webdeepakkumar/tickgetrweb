"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/[locale]/context/authContext";

import TgLogo from "./logo";
import TwoBtnPopup from "./TwoBtnPopup";
import Tooltip from "./tooltip";
import { deleteEvent } from "../../(Api)/firebase/firebase_firestore";
import useEventDetails from "../../api/webhook/useEventDetails";
import formatDate from "./formatDate";
import QRCode from "qrcode";
import fileDownload from "js-file-download";
//sidebar Event Banner icons
import { IoShareSocial } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import { MdQrCode } from "react-icons/md";
import { LuCopy } from "react-icons/lu";
import { IoLink } from "react-icons/io5";
//sidebar menu icons
import { FaRegTrashAlt } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";
import { RiHome6Fill } from "react-icons/ri";
import { BiSolidChart } from "react-icons/bi";
import { HiTicket } from "react-icons/hi2";
import { RiSettings4Fill } from "react-icons/ri";
import { RiDiscountPercentFill } from "react-icons/ri";
import { PiScanFill } from "react-icons/pi";
import toast from "react-hot-toast";
import { BsPlusLg } from "react-icons/bs";
import PopupDefault from "./PopupDefault";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";

const useClickOutside = (ref, callback) => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, callback]);
};

const DashSidebar = ({ eId, isOpen, setIsOpen, params: locale }) => {
  const t = useTranslations("dashSideBar");

  const sidebarRef = React.createRef();
  useClickOutside(sidebarRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDeletePopup, setshowDeletePopup] = useState(false);
  const [userId, setUserId] = useState();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  const { eventDetails: eventData } = useEventDetails(userId, eId);

  const handleShareEvent = async (copyItem) => {
    await navigator.clipboard.writeText(copyItem);
    toast.success("Link to the event copied!");
  };

  const handleDownloadQRCode = async (link) => {
    try {
      const qrCode = await QRCode.toDataURL(link, {
        errorCorrectionLevel: "H",
        type: "image/png",
        renderer: {
          width: 200,
          height: 200,
        },
      });
      const qrCodeImage = qrCode.replace(/^data:image\/png;base64,/, "");
      const qrCodeBuffer = Buffer.from(qrCodeImage, "base64");
      fileDownload(qrCodeBuffer, `${eventData?.eName}.png`);
      toast.success("QR Code downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading QR Code");
    }
  };

  const handleDeleteEvent = async (e) => {
    setshowDeletePopup(false);

    e.preventDefault();

    const ticketsSold = eventData?.ticketInfo?.some(
      (ticket) => ticket.tQuantity < ticket.total_tickets
    );

    if (ticketsSold) {
      alert(
        "As tickets for the event have been sold, the event cannot be deleted!"
      );
      return;
    }

    try {
      await deleteEvent(eId, eventData?.eBanner, eventData?.eventPDF).then(
        () => {
          router.push("/user/my-events");
        }
      );
    } catch (error) {
      toast.error("Error deleting event ", error);
    }
    router.refresh();
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed z-40 lg:relative shadow-lg lg:shadow-none w-72 h-full bg-white flex flex-col items-center justify-between transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="w-full relative">
          <button
            className="lg:hidden absolute right-3 top-3 rotate-45 bg-black bg-opacity-10 text-lg p-1 rounded-full"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <BsPlusLg />
          </button>
          <div className="w-full flex flex-col items-center gap-8 p-5 ">
            <Link href="/">
              <TgLogo className="w-36 h-9 mt-4" />
            </Link>
            <div className="w-full relative h-max rounded-lg overflow-hidden">
              <div
                style={{
                  backgroundImage: eventData
                    ? `url(${eventData.eBanner})`
                    : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 0,
                }}
                className={`absolute top-0 left-0 w-full h-full ${
                  !eventData && "animate-pulse bg-gray-300"
                }`}
              ></div>
              <div className="relative bg-gradient-to-b z-10 from-[#FFA658E6] to-[#FF9176E6] w-full flex flex-col justify-between gap-4 p-4 text-white">
                <div>
                  <div className="font-medium mb-2">
                    {eventData ? (
                      eventData.eName
                    ) : (
                      <div className="w-44 h-8 bg-orange-200 animate-pulse rounded"></div>
                    )}
                  </div>
                  <div className="text-xs">
                    {eventData ? (
                      formatDate(eventData.eStart)
                    ) : (
                      <div className="w-20 h-4 bg-orange-200 animate-pulse rounded"></div>
                    )}
                  </div>
                </div>
                <div className="inline-flex justify-between items-end">
                  <button
                    className="text-sm inline-flex items-center gap-2"
                    onClick={() => setShowSharePopup(true)}
                  >
                    <IoShareSocial />
                    {t("share_your_event")}
                  </button>
                  <Tooltip position="left" content={t("previewEvent")}>
                    <Link
                      href={`/events/${eventData?.eName}?organizer=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 flex justify-center items-center text-md bg-white bg-opacity-80 rounded-full text-[#FF9176]"
                    >
                      <FaEye />
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-3">
            <ul className="w-full">
              {Menus.map((menu, index) => (
                <Link
                  href={{
                    pathname: menu.path,
                    query: {
                      id: eId,
                    },
                  }}
                  key={index}
                  onClick={handleLinkClick}
                  className={`w-full inline-flex items-center py-3 gap-2 pl-12 font-medium text-md ${
                    normalizedPathname == menu.path
                      ? "text-tg-orange border-r-4 border-tg-orange"
                      : "text-neutral-400 hover:text-neutral-500 hover:bg-zinc-100"
                  } transition-all`}
                >
                  <div className="text-xl">{menu.icon}</div>
                  <div className="ml-2">{t(menu.title)}</div>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full p-5">
          <button
            onClick={() => setshowDeletePopup(true)}
            className="bg-red-500 text-white rounded-lg inline-flex justify-center gap-3 items-center w-full p-3 hover:bg-red-600 focus:outline-none transition-all"
          >
            <FaRegTrashAlt /> {t("delete_event")}
          </button>
        </div>
      </div>
      {showSharePopup && (
        <PopupDefault
          title={t("share_popup_title")}
          description={t("share_popup_description")}
          onClose={() => setShowSharePopup(false)}
        >
          <div className="inline-flex gap-2 mt-2 mb-7">
            <button
              onClick={() => {
                handleDownloadQRCode(
                  `${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`
                );
              }}
              className="w-14 h-14 border-2 border-zinc-300 text-zinc-400 hover:text-tg-orange hover:border-tg-orange transition text-2xl flex justify-center items-center rounded-full"
            >
              <MdQrCode />
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 border-2 border-zinc-300 text-zinc-400 hover:text-tg-orange hover:border-tg-orange transition text-xl flex justify-center items-center rounded-full"
            >
              <FaFacebookF />
            </a>
            <a
              href={`https://www.instagram.com/share/?media=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 border-2 border-zinc-300 text-zinc-400 hover:text-tg-orange hover:border-tg-orange transition text-xl flex justify-center items-center rounded-full"
            >
              <FaInstagram />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 border-2 border-zinc-300 text-zinc-400 hover:text-tg-orange hover:border-tg-orange transition text-xl flex justify-center items-center rounded-full"
            >
              <FaXTwitter />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://www.google.com/
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 border-2 border-zinc-300 text-zinc-400 hover:text-tg-orange hover:border-tg-orange transition text-xl flex justify-center items-center rounded-full"
            >
              <FaLinkedinIn />
            </a>
          </div>

          <div className="inline-flex gap-2">
            <div className="inline-flex gap-2 w-full items-center bg-zinc-100 rounded-lg py-2 px-3">
              <IoLink className="text-2xl text-zinc-500" />
              <input
                className="whitespace-nowrap text-sm w-full bg-transparent outline-none"
                value={`${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`}
                readOnly={true}
              />
            </div>
            <button
              className="rounded-lg bg-black hover:bg-zinc-800 text-white px-3 text-sm inline-flex items-center gap-2 hover:text-white transition-all"
              onClick={() => {
                handleShareEvent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}${locale}/events/${eventData?.eName}`
                );
              }}
            >
              <LuCopy /> {t("copy_event")}
            </button>
          </div>
          {/* <button
            className="p-3 border-2 border-tg-orange rounded-xl text-4xl text-tg-orange hover:bg-tg-orange hover:text-white transition-all"
            onClick={() => {
              handleDownloadQRCode(
                `${process.env.NEXT_PUBLIC_BASE_URL}events/${eventData?.eName}`
              );
            }}
          >
            <IoQrCodeOutline />
          </button> */}
        </PopupDefault>
      )}
      {showDeletePopup && (
        <TwoBtnPopup
          iconType="delete"
          title={t("delete_event")}
          description={t("delete_event_popup_description")}
          onClose={() => setshowDeletePopup(false)}
          onConfrim={handleDeleteEvent}
          onConfrimText={t("confirm")}
          onCloseText={t("cancel")}
        />
      )}
    </>
  );
};

export default DashSidebar;

export const Menus = [
  {
    title: "overview",
    icon: <RiHome6Fill />,
    path: "/user/dashboard",
  },
  {
    title: "reports",
    icon: <BiSolidChart />,
    path: "/user/dashboard/reports",
  },
  {
    title: "editEvent",
    icon: <RiSettings4Fill />,
    path: "/user/dashboard/edit-event",
  },
  {
    title: "tickets",
    icon: <HiTicket />,
    path: "/user/dashboard/tickets",
  },
  {
    title: "discounts",
    icon: <RiDiscountPercentFill />,
    path: "/user/dashboard/discounts",
  },

  {
    title: "scanning",
    icon: <PiScanFill />,
    path: "/user/dashboard/scanning",
  },
];

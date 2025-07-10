"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaGooglePlay } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import QRCode from "qrcode.react";
import { fetchAuthorizedEvents } from "@/app/(Api)/firebase/firebase_firestore";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";

import { useAuth } from "@/app/[locale]/context/authContext";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import Transition4 from "@/app/[locale]/animations/transition4";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const Scanning = () => {
  const t = useTranslations("eventsDashboard");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const [eventsArray, setEventsArray] = useState([]);
  const [loading, setLoading] = useState(true);
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
            setEventsArray(event);
            setLoading(false);
          }
        );
        if (!isAuthorized) {
          router.replace("/user/my-events");
        }
      }
    };

    checkAndFetchEvents();
  }, [userId, eventId]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const eventData = eventsArray.length > 0 ? eventsArray[0] : null;
  const qrCode = eventData ? eventData.eQrCode : "";

  return (
    <div className="w-full md:h-full h-[800px] flex md:flex-col-reverse flex-col lg:flex-row gap-5 overflow-y-auto no-scrollbar">
      <Transition4 className="lg:w-3/5 lg:h-full md:h-2/3 h-3/4 bg-white rounded-xl p-4 flex justify-center items-center flex-col gap-2 md:gap-3 ">
        <div className="text-xl md:text2xl font-semibold">
          {t("scanning.scanQrCode")}
        </div>
        <div className="md:text-lg text-sm">{t("scanning.useCode")}</div>
        <div className="relative p-8">
          <div
            className={`absolute top-0 left-0 w-full h-full backdrop-blur-md${
              qrIsVisible ? "hidden" : ""
            }`}
          ></div>
          <QRCode value={qrCode} size={180} />
        </div>
        <div className="text-sm text-neutral-600">
          {t("scanning.enterCode")}
        </div>
        <div className="bg-zinc-200 w-40 h-12 flex justify-center items-center font-medium tracking-wide text-xl rounded-lg mt-2">
          {qrIsVisible ? qrCode : "********"}
        </div>
        <button
          className="bg-tg-orange w-40 h-12 rounded-lg font-medium uppercase text-white"
          onClick={() => setQrIsVisible(!qrIsVisible)}
        >
          {qrIsVisible ? t("scanning.hide") : t("scanning.view")}
        </button>
      </Transition4>
      <Transition4
        y={80}
        className="lg:w-2/5 lg:h-full md:h-1/3 h-1/4 text-white bg-gradient-to-b from-tg-orange to-tg-orange2 rounded-xl flex lg:flex-col md:gap-12 gap-6 md:px-10 px-5 md:pt-14 pt-9  overflow-hidden"
      >
        <div className="flex flex-col md:justify-center items-center md:w-full w-3/5 gap-6 lg:gap-14">
          <div className="md:inline-flex lg:flex-row flex flex-col gap-2">
            <a
              className="inline-flex items-center bg-black bg-opacity-60 hover:bg-opacity-100 rounded-lg p-3 pr-4 gap-2 transition-all"
              href={process.env.NEXT_PUBLIC_PLAY_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGooglePlay className="text-2xl" />
              <div>
                <div className="text-xs font-light">
                  {t("scanning.getItOn")}
                </div>
                <div className="text-lg leading-none">Google Play</div>
              </div>
            </a>
            <a
              className="inline-flex items-center bg-black bg-opacity-60 hover:bg-opacity-100 rounded-lg p-3 pr-4 gap-2 transition-all"
              href={process.env.NEXT_PUBLIC_APPLE_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaApple className="text-3xl" />
              <div>
                <div className="text-xs font-light">
                  {t("scanning.downloadOn")}
                </div>
                <div className="text-lg leading-none">App Store</div>
              </div>
            </a>
          </div>
          <div className="text-center md:block hidden">
            {t("scanning.scanTickets")}
          </div>
        </div>

        <div className="md:w-full w-2/5 h-full bg-[url('/images/appDownloadMock.png')]  bg-contain bg-center bg-no-repeat transform translate-y-4 hover:translate-y-0 transition-all"></div>
      </Transition4>
    </div>
  );
};

export default Scanning;

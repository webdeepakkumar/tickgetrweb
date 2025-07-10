"use client";

import React, { useState, useEffect } from "react";
import { fetchUserEvents } from "@/app/(Api)/firebase/firebase_firestore";
import { seeDocuments } from "@/app/(Api)/firebase/firebase_storage";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useRouter } from "@/i18n/routing";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";

const ExpiredEvents = () => {
  const t = useTranslations("evendocuments");
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;

  const [eventsArray, setEventsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState({});
  
  const convertToDate = (timestamp) => {
    return timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
  };

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    fetchUserEvents(userId, async (events) => {
      const expiredEvents = events.filter((event) => convertToDate(event.eEnd) <= new Date());
      setEventsArray(expiredEvents);

      const documentPromises = expiredEvents.map(async (event) => {
        const eventId = event.eId;
        const response = await seeDocuments(eventId);
        if (!response) return { eventId, invoice: null, sales: null };
        let invoiceURL = null;
        let salesURL = null;
        response.forEach((doc) => {
          if (doc.fileType === "Invoice") invoiceURL = doc.downloadURL;
          else if (doc.fileType === "salesbalance") salesURL = doc.downloadURL;
        });
      
        return { eventId, invoice: invoiceURL, sales: salesURL };
      });

      const docsData = await Promise.all(documentPromises);
      const docsMap = docsData.reduce((acc, doc) => {
        acc[doc.eventId] = { invoice: doc.invoice, sales: doc.sales };
        return acc;
      }, {});

      setDocumentData(docsMap);
      setLoading(false)
    });
  }, [user, router]);

  const handleDownload = (fileURL) => {
    window.open(`/api/download?url=${encodeURIComponent(fileURL)}`);
  };



return (
        <>
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {eventsArray.length > 0 && (
                <h2 className="text-3xl font-oswald mb-5">Expired Events</h2>
              )}
      
              <div className="bg-white w-full h-full rounded-xl py-3 overflow-hidden">
                {eventsArray.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-5 px-5">
                    <div className="text-xl md:text-2xl font-oswald text-center">
                      No event has expired
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar">
                    <div className="divide-y divide-neutral-200">
                      {eventsArray.map((event, index) => {
                        const eventId = event.eId;
                        const invoiceURL = documentData[eventId]?.invoice || null;
                        const salesURL = documentData[eventId]?.sales || null;
      
                        return (
                          <div
                            key={index}
                            className="flex flex-col gap-3 p-4 border-b md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
                              <div className="w-11 h-11 flex justify-center items-center bg-tg-orange bg-opacity-20 rounded-lg text-tg-orange2 font-medium">
                                {index + 1}
                              </div>
                              <div className="flex flex-col">
                                <div className="text-lg font-medium">{event.eName}</div>
                                <div className="text-sm text-zinc-600 flex items-center gap-2">
                                  {new Date(event.eStart.toDate()).toLocaleDateString()}{" "}
                                  {new Date(event.eStart.toDate()).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  <FaArrowRightLong />
                                  {new Date(event.eEnd.toDate()).toLocaleDateString()}{" "}
                                  {new Date(event.eEnd.toDate()).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
      
                            <div className="flex flex-wrap gap-2 w-full md:w-auto md:justify-end">
                              {invoiceURL ? (
                                <>
                                  <button
                                    onClick={() => window.open(invoiceURL, "_blank")}
                                   className="py-3 px-4   text-md rounded-lg text-white font-semibold transition-all bg-green-500"
                                   >
                                    {t("seeinvoice")}
                                  </button>
                                  <button onClick={() => handleDownload(invoiceURL)} className="p-2 rounded-lg">
                                    <Download size={20} />
                                  </button>
                                </>
                              ) : (
                                <p className="text-red-400 text-md font-semibold">{t("invoicenotavlable")}</p>
                              )}
      
                              {salesURL ? (
                                <>
                                  <button
                                    onClick={() => window.open(salesURL, "_blank")}
                                    className="py-3 px-4   text-md rounded-lg text-white font-semibold transition-all bg-green-500"
                                  >
                                    {t("seesalesfile")}
                                  </button>
                                  <button onClick={() => handleDownload(salesURL)} className="p-2 rounded-lg">
                                    <Download size={20} />
                                  </button>
                                </>
                              ) : (
                                <p className="text-red-400 text-md font-semibold">{t("salesfilenotfound")}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      );
      
}
  

export default ExpiredEvents;

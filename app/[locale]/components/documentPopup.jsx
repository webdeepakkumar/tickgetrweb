"use client";

import { useState, useEffect } from "react";
import { seeDocuments } from "@/app/(Api)/firebase/firebase_storage";
import { X } from "lucide-react";
import LottieAnimation from "../animations/loadingarforocuments";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";

const Documentpopup = ({ eventId, onClose }) => {
  const t = useTranslations("evendocuments");
  const [eventData, setEventData] = useState([]);
  const [salesURL, setSalesURL] = useState("");
  const [invoiceURL, setInvoiceURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      
      if (!eventId) return;

      try {
        const response = await seeDocuments(eventId);
        if (!response) {
          console.warn("No document found for this eventId.");
          return;
        }

        response.forEach((doc) => {
          if (doc.fileType === "Invoice") {
            setInvoiceURL(doc.downloadURL);
          } else if (doc.fileType === "salesbalance") {
            setSalesURL(doc.downloadURL);
          } else {
            console.log("No valid URL available for this event.");
          }
        });

        console.log("File types received:", response);
        setEventData(response.map((doc) => doc.fileType).filter(Boolean));
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [eventId]);

  // Function to handle file download
  const handleDownload = (fileURL) => {
    window.open(`/api/download?url=${encodeURIComponent(fileURL)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl w-full relative animate-fadeInUp">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
          onClick={onClose}
        >
          <X size={30} />
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6">
          {t("viewevent")}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <LottieAnimation />
          </div>
        ) : (
          <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {invoiceURL ? (
              <>
                <button
                  onClick={() => window.open(invoiceURL, "_blank")}
                  className="py-3  sm:text-center px-6 rounded-lg text-white text-md  whitespace-nowrap font-semibold w-full transition-all bg-green-500 hover:bg-green-600"
                >
                 {t('seeinvoice')}
                </button>
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={() => handleDownload(invoiceURL)}
                    className=""
                  > <Download size={30} />
                  </button>
                </div>
              </>       
            ) : (
              <p className="text-center text-red-500 text-lg font-semibold md:col-span-2">
                {t("invoicenotavlable")}
              </p>
            )}

            {salesURL ? (
              <>
                <button
                  onClick={() => window.open(salesURL, "_blank")}
                  className="py-3 px-6 rounded-lg text-center text-white font-semibold text-lg w-full transition-all bg-green-500 hover:bg-green-600"
                >
                  {t("seesalesfile")}
                </button>
                <div className="flex justify-center items-center w-full">
                  <button onClick={() => handleDownload(salesURL)} className="">
                    <Download size={30} />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-red-500 text-lg font-semibold md:col-span-2">
               {t("salesfilenotfound")}
              </p>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentpopup;

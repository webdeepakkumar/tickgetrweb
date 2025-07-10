"use client";

import { useState, useRef, useEffect } from "react";
import PopupDefault from "./PopupDefault";
import toast from "react-hot-toast";
import { adddocument, seeDocuments } from "@/app/(Api)/firebase/firebase_storage";
import LottieAnimation from "../animations/loadingarforocuments";
import { useTranslations } from "next-intl";
import { deleteDocument } from "@/app/(Api)/firebase/firebase_storage";
import Upload from "../animations/uploadfile";


const DetailsPopup = ({ onClose, title, details, description, color, eventId, eventExpiry }) => {
  const t = useTranslations("evendocuments");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [eventdata, setEventData] = useState([]);
  const eventexpiry = eventExpiry;
  const [salesURL , setSalesURL] = useState("")
  const [invoiceURL, setInvoiceURL] = useState("")
  const [loadingData, setLoadingData] = useState(true);
  const [deletingInvoice, setDeletingInvoice] = useState(false);
  const [deletingSales, setDeletingSales] = useState(false);

  useEffect(()=>{
    const fetchdoucument =  async() =>{
      if (!eventId) {
        return;
      }
      setLoadingData(true)
  
      try {
        const response = await seeDocuments(eventId)
        if (!response) {
          console.warn("No document found for this eventId.");
          return;
        }
        //setting the url
        response.forEach((doc)=>{
          if(doc.fileType === "Invoice"){
            setInvoiceURL(doc.downloadURL)
          }else if (doc.fileType === "salesbalance"){
            setSalesURL(doc.downloadURL)
          }else{
            console.log("no url is available for this event")
          }
        })
        console.log("file type in fornted ",response)
        const fileTypes = response.map(doc => doc.fileType).filter(Boolean); 
        setEventData(fileTypes)
      } catch (error) {
      console.error("with this id nothing is store in databse")

      }finally{
          setLoadingData(false); 
      }

    }
    fetchdoucument();
  },[eventId])

  const handleButtonClick = (type) => {
    setSelectedType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Selected file for ${selectedType}:`, file.name);
      setSelectedFile(file);
    }
  };

  const getflodername = () => {
    return selectedType === "Invoice" ? "Invoice" : "Sales Balance";
  };
  //delete file
  const handleDelete = async (fileType,eventId) => {
    if (!eventId) return;
    try {
      if (fileType === "Invoice") setDeletingInvoice(true);
      if (fileType === "salesbalance") setDeletingSales(true);
      await deleteDocument(eventId,fileType)
      if (fileType === "Invoice") setInvoiceURL(null);
      if (fileType === "salesbalance") setSalesURL(null);
      toast.success(`File deleted successfully!`);
      onClose();
    } catch (error) {
      console.error(`Failed to delete file`);
    } finally {
      setDeletingInvoice(false);
      setDeletingSales(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to proceed.");
      return;
    }

    setUploading(true);
    try {
      const folderName = getflodername();
      const fileType = selectedType;
      const downloadurl = await adddocument(selectedFile, folderName, eventId, fileType,onClose);
      setUrl(downloadurl);
      console.log(downloadurl);
      setUploading(false);
      setSelectedFile(null);
      setSelectedType(null);
      setShowbuttons(true)
      onClose(); 
    } catch (error) {
      console.error(error);
      setUploading(false);
      
    }
  };

  return (
    <PopupDefault onClose={onClose} title={title} description={description}>
      <table className="w-full text-sm">
        <tbody>
          {details.map(({ label, value, extra }, idx) => (
            <tr key={idx} className="flex justify-between items-center py-2 border-b">
              <th className="text-zinc-500 font-medium">{label}</th>
              <td className={color}>
                {value} {extra}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {loadingData ?  <LottieAnimation/> : (
      eventexpiry && (
   <div className="mt-4 w-full flex flex-col items-center gap-4">
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {invoiceURL ? (
        <>
        <button
        onClick={() => window.open(invoiceURL, "_blank")}
        className={`py-2.5 px-6 sm:py-1.5 whitespace-nowrap sm:px-3 text-sm sm:text-md md:text-lg md:py-2.5 rounded-lg text-red-500 font-semibold w-full transition-all bg-gray-300 `}
         >{t('seeinvoice')}</button>
          <button onClick={() => handleDelete("Invoice", eventId)}
         className={`py-2.5 px-4 text-sm rounded-lg text-white font-semibold   transition-all flex items-center justify-center
         ${deletingInvoice ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"}
        `}>
        {deletingInvoice ? t("deleting") : t("delete_invoice")}
      </button>
         </>

      ):(
        <>
    <button
      onClick={() => handleButtonClick("Invoice")}
      className={`py-2.5 px-6 sm:py-1.5 whitespace-nowrap sm:px-3 text-sm sm:text-md md:text-lg md:py-2.5 rounded-lg text-white font-semibold w-full transition-all bg-gray-300
        ${eventdata.includes("Invoice") 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-orange-400 hover:bg-orange-500"}
      `}
      disabled={ eventdata.includes("Invoice")}
    >
      {t("uploadinvoice")}
    </button>
   <div className="h-5 sm:block hidden"> 

   </div>
    </>
      )}
    {salesURL ? (
      <>
      <button
     onClick={() => window.open(salesURL, "_blank")}
     className={`py-2.5 px-6 sm:py-1.5 whitespace-nowrap sm:px-3 text-sm sm:text-md md:text-lg md:py-2.5 rounded-lg text-red-500 font-semibold w-full transition-all bg-gray-300 `}
    >{t("seesalesfile")}</button>
      <button onClick={() => handleDelete("salesbalance", eventId)}
       className={`py-2.5 px-4 text-sm rounded-lg text-white font-semibold   transition-all flex items-center justify-center
        ${deletingSales ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"}
       `}>

      {deletingSales ? t("deleting") : t("delete_sales")}
      </button>
     </>
    ): (
    <button
      onClick={() => handleButtonClick("salesbalance")}
      className={`py-2.5 px-6 sm:py-1.5 whitespace-nowrap sm:px-3 text-sm sm:text-md md:text-lg md:py-2.5 rounded-lg text-white font-semibold w-full transition-all bg-gray-300
        ${eventdata.includes("salesbalance") 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-orange-400 hover:bg-orange-500"}
      `}
      disabled={eventdata.includes("salesbalance")}
    >
   {t("uploadsales")}
    </button>
      )}
    </div>
    
 <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

 {selectedFile && (
    <button
      onClick={handleUpload}
      className={`w-full py-2.5 px-6 sm:py-1.5 whitespace-nowrap sm:px-3 text-sm sm:text-md md:text-lg md:py-2.5 rounded-lg  text-white font-semibold transition-all
        ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
      `}
      disabled={uploading}
    >
      {uploading ? t("uploading") : t("upload")}
    </button>
 )}
  </div>
))}
    </PopupDefault>
  );
};

export default DetailsPopup;

"use client";

import React, { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import ImageCropper from "./ImageCropper";
import { Autocomplete } from "@react-google-maps/api";
import { fetchBuyersTickets } from "@/app/(Api)/firebase/firebase_firestore";
import {
  checkDuplicateEvent,
  fetchAuthorizedEvents,
  updateOneEvent,
} from "@/app/(Api)/firebase/firebase_firestore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { FaAngleDown } from "react-icons/fa6";

import {
  uploadImageToStorage,
  addPDF,
} from "@/app/(Api)/firebase/firebase_storage";
import { Timestamp } from "firebase/firestore";
import ButtonWithLoading from "./button/loadingButton";
import LoadingSpinner from "./LoadingSpinner";
import { deleteObject, getStorage, ref } from "firebase/storage";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

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
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = formattedDate.getFullYear();
  const hours = formattedDate.getHours().toString().padStart(2, "0");
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  const seconds = formattedDate.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const EditEventComponent = ({
  eventId,
  userId,
  bgColor,
  btnColor,
  formLabel,
  formControl,
  formControl2,
  formTextArea,
  textColor,
  dropdownColor,
  divider,
}) => {
  const t = useTranslations("eventsDashboard");
  const category = useTranslations("createEvent");
  const [isavalabel, setIsavalabel] = useState(false)
  useEffect(()=>{
    const fetchdata = async  ()=>{
      try{
      const buyerExists = await fetchBuyersTickets(eventId)
      setIsavalabel(buyerExists)
  }catch(error){
    console.log("error",error)
  }
}
  fetchdata()
  },[eventId])

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [eventsArray, setEventsArray] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [uploadPDF, setUploadPDF] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [cropperKey, setCropperKey] = useState(Date.now());
  const [originalBanner, setOriginalBanner] = useState(null);
  const [updateEvent, setUpdateEvent] = useState({
    eName: "",
    eDescription: "",
    eCategory: "",
    eStart: "",
    eEnd: "",
    ticketInfo: [],
    eAddress: "",
    eCity: "",
    eBanner: "",
    eMap: "",
    eId: "",
    eQrCode: "",
    isExpired: false,
    isVisible: true,
    ticketsPerOrder: 20,
    pOnCharges: false,
    eventPDF: "",
    oldStart: "",
    isPurchased: false,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const options = {
    types: ["geocode", "establishment"],
  };
  const categories = [
    {
      value: category("step_one.event_categories.party"),
      label: category("step_one.event_categories.party"),
    },
    {
      value: category("step_one.event_categories.festival"),
      label: category("step_one.event_categories.festival"),
    },
    {
      value: category("step_one.event_categories.sport"),
      label: category("step_one.event_categories.sport"),
    },
    {
      value: category("step_one.event_categories.concert"),
      label: category("step_one.event_categories.concert"),
    },
    {
      value: category("step_one.event_categories.music"),
      label: category("step_one.event_categories.music"),
    },
    {
      value: category("step_one.event_categories.afterwork"),
      label: category("step_one.event_categories.afterwork"),
    },
    {
      value: category("step_one.event_categories.prom"),
      label: category("step_one.event_categories.prom"),
    },
    {
      value: category("step_one.event_categories.dinnerParty"),
      label: category("step_one.event_categories.dinnerParty"),
    },
    {
      value: category("step_one.event_categories.show"),
      label: category("step_one.event_categories.show"),
    },
    {
      value: category("step_one.event_categories.other"),
      label: category("step_one.event_categories.other"),
    },
  ];

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const placeName =
        place.name && !place.formatted_address.includes(place.name)
          ? `${place.name} ${place.formatted_address}`
          : place.formatted_address;

      setUpdateEvent({
        ...updateEvent,
        eAddress: placeName || "",
        eCity: getCityFromPlace(place) || "",
      });
    }
  };

  const getCityFromPlace = (place) => {
    const cityComponent = place.address_components.find((component) =>
      component.types.includes("locality")
    );
    return cityComponent ? cityComponent.long_name : "";
  };

  const handleCrop = (croppedImage) => {
    setImagePreview(URL.createObjectURL(croppedImage));
    setUploadImage(croppedImage);
    setCropperKey(Date.now());
  };

  const handleClosePopup = () => {
    setImage(null);
    setImagePreview(null);
    setCropperKey(Date.now());
  };

  useEffect(() => {
    if (eventId && userId) {
      fetchAuthorizedEvents(userId, eventId, (events) => {
        setEventsArray(events);
        setLoading(false);
      });
    }
  }, [userId, eventId]);

  useEffect(() => {
    const event = eventsArray[0];

    if (event) {
      setUpdateEvent({
        eName: event.eName || "",
        eDescription: event.eDescription || "",
        eBanner: event.eBanner || "",
        eStart: formatDate(event.eStart || new Date()),
        eEnd: formatDate(event.eEnd || new Date()),
        eAddress: event.eAddress || "",
        eCity: event.eCity || "",
        eMap: event.eMap || "",
        eId: event.eId || "",
        ticketInfo: event.ticketInfo || [],
        eCategory: event.eCategory || "",
        eQrCode: event.eQrCode || "",
        isExpired: event.isExpired || false,
        isVisible: event.isVisible || true,
        eventPDF: event.eventPDF || "",
        pOnCharges: event.pOnCharges || false,
        ticketsPerOrder: event.ticketsPerOrder || 20,
        oldStart: formatDate(event.eStart || new Date()),
        isPurchased: event.isPurchased || false,
      });

      setOriginalBanner(event.eBanner);
      setPdfPreview(event.eventPDF);
      setIsChecked(event.pOnCharges);

      if (
        typeof event.eBanner === "string" &&
        event.eBanner.startsWith("http")
      ) {
        setImagePreview(event.eBanner);
      } else {
        if (event.eBanner instanceof Blob || event.eBanner instanceof File) {
          setImagePreview(URL.createObjectURL(event.eBanner));
        }
      }
    }
  }, [eventsArray]);

  const handlePdfChange = (e) => {
    if (updateEvent.isPurchased && updateEvent.eventPDF !== "") {
      alert("You cannot update the PDF as the event has been purchased.");
      return;
    }

    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        const pdfName = `pdf_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.pdf`;
        const newFile = new File([file], pdfName, {
          type: "application/pdf",
        });
        setUploadPDF(newFile);
        setPdfPreview(URL.createObjectURL(newFile));
      } else {
        alert("Please select a PDF file.");
      }
    }
  };

  const handleDeleteImage = () => {
    setUploadImage(null);
    setImagePreview(null);
    setCropperKey(Date.now());
  };

  const handlePdfDelete = () => {
    if (updateEvent.isPurchased && updateEvent.eventPDF !== "") {
      alert("You cannot delete the PDF as the event has been purchased.");
      return;
    }

    setUploadPDF(null);
    setPdfPreview(null);
  };

  const handleCheckBoxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const updateEventChanges = async (e) => {
    setIsUpdateLoading(true);

    e.preventDefault();

    const isDuplicate = await checkDuplicateEvent(updateEvent.eName);
    if (isDuplicate && updateEvent.eName != eventsArray[0]?.eName) {
      alert(
        "An event with this name already exists. Please choose a different name."
      );
      setIsUpdateLoading(false);
      return;
    }

    let newImageRef = updateEvent.eBanner;
    const imageDeleteRef = originalBanner;

    let pdfRef = updateEvent.eventPDF;

    if (uploadPDF) {
      pdfRef = await addPDF(uploadPDF, updateEvent.eventPDF);
    } else if (!pdfPreview && updateEvent.eventPDF) {
      await deleteObject(ref(getStorage(), updateEvent.eventPDF));
      pdfRef = "";
    }

    if (uploadImage) {
      newImageRef = await uploadImageToStorage(
        uploadImage,
        imageDeleteRef,
        "event_images"
      );
    } else if (!imagePreview && originalBanner) {
      await deleteObject(ref(getStorage(), imageDeleteRef));
      newImageRef = "";
    }

    const startDate = new Date(updateEvent.eStart);
    const endDate = new Date(updateEvent.eEnd);
    const today = new Date();
    const oldStart = new Date(updateEvent.oldStart);

    if (startDate.getTime() !== oldStart.getTime() && startDate < today) {
      alert("The start date must be today or later.");
      return;
    }

    if (endDate < startDate) {
      alert("The end date must be on or after the start date.");
      return;
    }

    const updateEventData = {
      eName: updateEvent.eName,
      eDescription: updateEvent.eDescription,
      eBanner: newImageRef,
      eStart: Timestamp.fromDate(startDate),
      eEnd: Timestamp.fromDate(endDate),
      eCity: updateEvent.eCity,
      eAddress: updateEvent.eAddress,
      eCategory: updateEvent.eCategory,
      eventPDF: pdfRef,
      pOnCharges: isChecked,
      ticketsPerOrder: updateEvent.ticketsPerOrder,
    };

    try {
      await updateOneEvent(eventId, userId, updateEventData);
      setIsUpdateLoading(false);
      toast.success("Event updated successfully");
      fetchAuthorizedEvents(userId, eventId, setEventsArray);
    } catch (error) {
      setIsUpdateLoading(false);
      toast.error("Error updating event!");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`${
        bgColor ? bgColor : "bg-white"
      } w-full h-full flex flex-col text-lg rounded-xl lg:px-16 px-6 lg:py-8 pt-2 pb-6 overflow-y-auto no-scrollbar  ${textColor}`}
    >
      {/* Design & Edit Ticket */}

      <div className="flex flex-col justify-between lg:px-6 pt-5 gap-10">
        <div className="w-full flex flex-col">
          <label htmlFor="banner" className={`${formLabel} `}>
            {t("editEvent.banner")}
            <span className="text-xs ml-2">(1320 x 700 px)</span>
          </label>
          <div className="h-44 md:h-96 border border-gray-300 rounded-lg overflow-hidden relative group ">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Event"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex md:hidden md:group-hover:flex justify-center items-center">
                  <button
                    onClick={handleDeleteImage}
                    className="bg-zinc-800 bg-opacity-75 text-white rounded-full p-3 text-xl"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </>
            ) : (
              <ImageCropper
                key={cropperKey}
                onCrop={handleCrop}
                onClose={handleClosePopup}
                aspectRatio={16 / 9}
              />
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-5 ">
          <div className="flex flex-col md:flex-row md:gap:10 gap-5">
            <div className="md:w-3/4 w-full">
              <label className={`${formLabel}`}>
                {t("editEvent.eventName")}
              </label>
              <input
                type="text"
                id="event-name"
                name="event-name"
                value={updateEvent.eName}
                onChange={(e) =>
                  setUpdateEvent({
                    ...updateEvent,
                    eName: e.target.value,
                  })
                }
                className={`${formControl}`}
                required
              />
            </div>
            <div className="md:w-1/4 w-full">
              <label htmlFor="category" className={formLabel}>
                {category("step_one.category")}
              </label>
              <Dropdown className={`w-full ${dropdownColor}`}>
                <DropdownTrigger className={`${formControl}`}>
                  <div className="inline-flex justify-between">
                    {updateEvent.eCategory}
                    <FaAngleDown />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Event Categories"
                  variant="faded"
                  color="default"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={[String(updateEvent.eCategory)]}
                  className={`${formLabel} ${dropdownColor}`}
                >
                  {categories.map((category) => (
                    <DropdownItem
                      key={category.value}
                      onPress={() => {
                        setUpdateEvent({
                          ...updateEvent,
                          eCategory: category.value,
                        });
                      }}
                      className={`${textColor}`}
                    >
                      {category.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap:10 gap-5">
            <div className="md:w-1/2 w-full">
              <label className={`${formLabel}`}>
                {t("editEvent.startDate")}
                <br />
              </label>
              <input
                type="datetime-local"
                id="start_datetime"
                name="start_datetime"
                value={updateEvent.eStart}
                onChange={(e) =>
                  setUpdateEvent({
                    ...updateEvent,
                    eStart: e.target.value,
                  })
                }
                className={`${formControl}`}
                required
              />
            </div>
            <div className="md:w-1/2 w-full">
              <label className={`${formLabel}`}>{t("editEvent.endDate")}</label>
              <input
                type="datetime-local"
                id="end_datetime"
                name="end_datetime"
                value={updateEvent.eEnd}
                onChange={(e) =>
                  setUpdateEvent({
                    ...updateEvent,
                    eEnd: e.target.value,
                  })
                }
                className={`${formControl}`}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap:10 gap-5">
            <div className="md:w-3/4 w-full">
              <label className={`${formLabel}`}>{t("editEvent.address")}</label>
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
                options={options}
              >
                <input
                  type="text"
                  id="editLocation"
                  name="editLocation"
                  value={updateEvent.eAddress}
                  onChange={(e) =>
                    setUpdateEvent({
                      ...updateEvent,
                      eAddress: e.target.value,
                    })
                  }
                  placeholder="Enter Location"
                  className={`${formControl}`}
                  required
                />
              </Autocomplete>
            </div>
            <div className="md:w-1/4 w-full">
              <label className={`${formLabel}`}>{t("editEvent.city")}</label>
              <input
                type="text"
                id="editLocation"
                name="editLocation"
                value={updateEvent.eCity}
                onChange={(e) =>
                  setUpdateEvent({
                    ...updateEvent,
                    eCity: e.target.value,
                  })
                }
                placeholder="Enter Location"
                className={`${formControl}`}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="description" className={`${formLabel}`}>
              {t("editEvent.description")}
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={updateEvent.eDescription}
              onChange={(e) =>
                setUpdateEvent({
                  ...updateEvent,
                  eDescription: e.target.value,
                })
              }
              className={`${formTextArea}`}
              placeholder="Event Description"
              required
            />
          </div>
        </div>
        <div className={divider}></div>
      </div>

      {/* Settings */}

      <div className=" md:px-6 py-6 text-sm font-normal">
        <p className="text-lg font-medium">{t("editEvent.serviceFees")}</p>
        <div className="flex items-center mt-4 gap-1">
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isavalabel}
            onChange={handleCheckBoxChange}
            className="cursor-pointer"
          />

          <p>{t("editEvent.passOnCharges")}</p>
        </div>
        <p className="mt-2">{t("editEvent.serviceFeesDescription")}</p>
        <p className="text-red-500">{t("editEvent.notmodified")}</p>
      </div>

      <div className=" md:px-6 py-6 flex flex-col text-sm gap-2 font-normal">
        <p className="text-lg font-medium">{t("editEvent.ticketsPerOrder")}</p>
        <p className="mt-2">{t("editEvent.ticketsPerOrderDescription")}</p>
        <input
          type="text"
          value={updateEvent.ticketsPerOrder}
          onChange={(e) =>
            setUpdateEvent({
              ...updateEvent,
              ticketsPerOrder: e.target.value,
            })
          }
          className={`${formControl2} text-center`}
        />
      </div>

      <div className="md:px-6 py-6 text-sm font-normal ">
        <p className="text-lg font-medium">
          {" "}
          {t("editEvent.termsAndConditions")}
        </p>
        <p className="mt-4 mb-5">
          {t("editEvent.termsAndConditionsDescription")}
        </p>
        {pdfPreview ? (
          <>
            <div className="w-28 h-28 mt-2 border border-gray-100 rounded-md overflow-hidden relative group">
              <embed
                src={pdfPreview}
                type="application/pdf"
                width="100%"
                height="100%"
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-50 flex justify-center items-center">
                <button
                  onClick={handlePdfDelete}
                  className="bg-gray-800 bg-opacity-75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          </>
        ) : (
          <label htmlFor="pdf" className="relative cursor-pointer">
            <div className="w-28 h-28 mt-2 border border-gray-300 rounded-md flex justify-center items-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <input
              type="file"
              name="pdf"
              id="pdf"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="absolute opacity-0 w-32 h-0 cursor-pointer"
            />
          </label>
        )}
      </div>

      <div className="md:pl-6 pt-5">
        <ButtonWithLoading
          onClick={updateEventChanges}
          isLoading={isUpdateLoading}
          isLoadingText={t("editEvent.saveChangesButton")}
          isDisabled={isUpdateLoading}
          buttonText={t("editEvent.saveChangesButton")}
          className={`${btnColor ? btnColor : "bg-tg-orange"} `}
        />
      </div>
    </div>
  );
};

export default EditEventComponent;

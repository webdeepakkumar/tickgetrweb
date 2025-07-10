"use client";
import React, { useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import ButtonWithLoading from "./button/loadingButton";
import ImageCropper from "./ImageCropper";
import { MdDeleteOutline } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { checkDuplicateEvent } from "../../(Api)/firebase/firebase_firestore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";


export function StepOne({ onNext, formData }) {
  const t = useTranslations("createEvent");

  const [eName, setEventName] = useState(formData.eName || "");
  const [eStart, setStartDate] = useState(formData.eStart || "");
  const [eEnd, setEndDate] = useState(formData.eEnd || "");
  const [eAddress, setAddress] = useState(formData.eAddress || "");
  const [eCity, setCity] = useState(formData.eCity || "");
  const [eCategory, setCategory] = useState(formData.eCategory || "");
  const [selectedCategory, setSelectedCategory] = useState(eCategory);

  const options = {
    types: ["geocode", "establishment"],
  };
    const { user } = useAuth();
    const [userId, setUserId] = useState();
    const [isLoading, setIsLoading] = useState(true);


  const categories = [
    {
      value: t("step_one.event_categories.party"),
      label: t("step_one.event_categories.party"),
    },
    {
      value: t("step_one.event_categories.galabal"),
      label: t("step_one.event_categories.galabal"),
    },
    {
      value: t("step_one.event_categories.prom"),
      label: t("step_one.event_categories.prom"),
    },
    {
      value: t("step_one.event_categories.festival"),
      label: t("step_one.event_categories.festival"),
    },
    {
      value: t("step_one.event_categories.sport"),
      label: t("step_one.event_categories.sport"),
    },
    {
      value: t("step_one.event_categories.concert"),
      label: t("step_one.event_categories.concert"),
    },
    {
      value: t("step_one.event_categories.show"),
      label: t("step_one.event_categories.show"),
    },
    {
      value: t("step_one.event_categories.feest"),
      label: t("step_one.event_categories.feest"),
    },
    {
      value: t("step_one.event_categories.anders"),
      label: t("step_one.event_categories.anders"),
    }
  ];

  const handleEventNameChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 50) {
      setEventName(inputText);
    }
  };
  useEffect(() => {
    if (!user || user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    setEventName(formData.eName || "");
    setStartDate(formData.eStart || "");
    setEndDate(formData.eEnd || "");
    setAddress(formData.eAddress || "");
    setCity(formData.eCity || "");
    setCategory(formData.eCategory || "");
  }, [formData]);

  const handleNext = async (e) => {
    e.preventDefault();
    const startDate = new Date(eStart);
    const endDate = new Date(eEnd);
    const today = new Date();
    if (startDate < today) {
      alert("The start date must be today or later.");
      return;
    }
    if (endDate < startDate) {
      alert("The end date must be on or after the start date.");
      return;
    }
    const isDuplicate = await checkDuplicateEvent(eName);
    if (isDuplicate) {
      alert(
        "An event with this name already exists. Please choose a different name."
      );
      return;
    }

    onNext({ eName, eStart, eEnd, eAddress, eCity, eCategory });
  };

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace();

    // Check if place.name already exists in formatted_address
    const placeName =
      place.name && !place.formatted_address.includes(place.name)
        ? `${place.name} ${place.formatted_address}`
        : place.formatted_address;

    setAddress(placeName);

    let city = "";
    for (let component of place.address_components) {
      if (component.types.includes("locality")) {
        city = component.long_name;
        break;
      }
    }

    setCity(city);
  };

  return (
    <>
    <form onSubmit={handleNext} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="flex md:flex-row flex-col w-full gap-5">
          <div className="w-full md:w-4/6">
            <div className="inline-flex justify-between w-full items-center">
              <label htmlFor="eventName" className="form-label">
                {t("step_one.event_name")}
              </label>
              <div
                className={`text-xs font-medium mb-1 ${
                  eName.length == 50 ? "text-red-400" : "text-zinc-400"
                } pr-2`}
              >
                {eName.length}/50 {t("step_one.characters_left")}
              </div>
            </div>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={eName}
              onChange={(e) => handleEventNameChange(e)}
              className="form-control"
              placeholder={t("step_one.event_name")}
              maxLength={50}
              required
            />
          </div>

          <div className="w-full md:w-2/6">
            <label htmlFor="category" className="form-label">
              {t("step_one.category")}
            </label>
            <Dropdown className="w-full">
              <DropdownTrigger className="w-full py-3 px-5 rounded-lg md:inline-flex hidden items-center gap-1.5 bg-white">
                <div className="inline-flex justify-between">
                  {selectedCategory === ""
                    ? t("step_one.category")
                    : selectedCategory}
                  <FaAngleDown />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Event Categories"
                variant="faded"
                color="default"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[String(selectedCategory)]}
                className="w-full"
              >
                {categories.map((category) => (
                  <DropdownItem
                    key={category.value}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      setCategory(category.value);
                    }}
                    className="w-full"
                  >
                    {category.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/2">
            <label htmlFor="startDate" className="form-label">
              {t("step_one.start_date")}
            </label>
            <input
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={eStart}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="endDate" className="form-label">
              {t("step_one.end_date")}
            </label>
            <input
              type="datetime-local"
              name="endDate"
              id="endDate"
              value={eEnd}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="form-label">
            {t("step_one.address")}
          </label>
          <Autocomplete
            onLoad={(autocomplete) => {
              window.autocomplete = autocomplete;
            }}
            onPlaceChanged={handlePlaceChanged}
            options={options}
          >
            <input
              type="text"
              name="address"
              value={eAddress}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              placeholder={t("step_one.address")}
              required
            />
          </Autocomplete>
        </div>
        <div>
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={eCity}
            onChange={(e) => setCity(e.target.value)}
            className="form-control"
            placeholder={t("step_one.city")}
            required
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="form-button">
          {t("step_one.next_step")}
        </button>
        <Link href="/user/my-events" className="form-cancel">
          {t("step_one.cancel")}
        </Link>
      </div>
    </form>
    </>
  );
}

export function StepTwo({ onPrev, onNext, formData }) {
  const t = useTranslations("createEvent");

  const [eDescription, setDescription] = useState(formData.eDescription || "");
  const [eBanner, setImage] = useState(formData.eBanner || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropperKey, setCropperKey] = useState(Date.now());

  useEffect(() => {
    setDescription(formData.eDescription || "");
    setImage(formData.eBanner || null);
    if (formData.eBanner) {
      setImagePreview(URL.createObjectURL(formData.eBanner));
    }
  }, [formData]);

  const handleNext = (e) => {
    e.preventDefault();
    onNext({ eDescription, eBanner });
  };

  const handleCrop = (croppedImage) => {
    setImage(croppedImage);
    setImagePreview(URL.createObjectURL(croppedImage));
    setCropperKey(Date.now());
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
    setCropperKey(Date.now());
  };

  const handleClosePopup = () => {
    setImage(null);
    setImagePreview(null);
    setCropperKey(Date.now());
  };

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-8 w-full">
      <div className="w-full flex flex-col-reverse md:flex-row gap-6">
        <div className="w-full md:w-7/12">
          <label htmlFor="description" className="form-label">
            {t("step_two.description")}
          </label>
          <textarea
            name="description"
            id="description"
            value={eDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            placeholder={t("step_two.description_placeholder")}
            maxLength={500}
            required
          />
          <div
            className={`${
              eDescription.length == 500 ? "text-red-500" : "text-zinc-500"
            } text-sm text-right`}
          >
            {eDescription.length}/500 {t("step_two.characters_left")}
          </div>
        </div>
        <div className="relative w-full md:w-5/12">
          <label htmlFor="banner" className="form-label">
            {t("step_two.banner")}
            <span className="text-xs ml-2">(1920 x 1080 px)</span>
          </label>
          <div className="h-44 md:h-52 border border-gray-300 rounded-lg overflow-hidden relative group">
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
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onPrev} className="form-cancel">
          {t("step_two.back")}
        </button>
        <button type="submit" className="form-button">
          {t("step_two.overview")}
        </button>
      </div>
    </form>
  );
}

export function StepThree({ onPrev, formData, handleSubmit, isLoading }) {
  const t = useTranslations("createEvent");

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-10">
        <div className="flex w-full md:w-1/2 flex-col gap-5">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {t("step_three.category")}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {formData.eCategory}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {" "}
              {t("step_three.address")}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {formData.eAddress}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {" "}
              {t("step_three.city")}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {formData.eCity}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {t("step_three.start_date")}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {new Date(formData.eStart).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {" "}
              {t("step_three.end_date")}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {new Date(formData.eEnd).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full md:w-1/2">
          <div>
            {formData.eBanner ? (
              <img
                src={URL.createObjectURL(formData.eBanner)}
                alt="Event"
                className="w-full h-44 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-44 object-cover rounded-lg bg-zinc-300 flex justify-center items-center">
                {t("step_two.no_image_uploaded")}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {t("step_three.event_name")}{" "}
            </p>
            <p className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              {formData.eName}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              {t("step_three.description")}
            </p>
            <div className="text font-medium text-black border-2 border-zinc-300 p-3 rounded-lg">
              <p> {formData.eDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 md:mt-7 mt-14">
        <button type="button" onClick={onPrev} className="form-cancel">
          {t("step_three.back")}
        </button>
        <ButtonWithLoading
          isLoading={isLoading}
          isLoadingText={t("step_three.create_event")}
          isDisabled={isLoading}
          buttonText={t("step_three.create_event")}
          onClick={handleSubmit}
          className="flex items-center justify-center form-button"
        />
      </div>
    </div>
  );
}

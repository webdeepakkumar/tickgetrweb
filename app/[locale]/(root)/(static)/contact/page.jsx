"use client";
import React, { useState } from "react";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { FaAngleDown } from "react-icons/fa6";
import { useTranslations } from "next-intl";

const Contact = () => {
  const t = useTranslations("contact");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    comment: "",
    type: "",
    queryType: "",
  });
  const [selectedQueryType, setSelectedQueryType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const queryTypes = [
    {
      value: "Leaving suggestions for improvement",
      label: t("leaving_suggestions_for_improvement"),
    },
    {
      value: "Reporting a problem with the site",
      label: t("reporting_a_problem_with_the_site"),
    },
    { value: "Leaving a review", label: t("leaving_a_review") },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await axios.post("/api/send-email", {
        to: "info@tickgetr.be",
        cEmail: formData.email.toLowerCase(),
        cName: formData.name,
        cType: formData.type,
        qType: formData.queryType,
        tUID: process.env.NEXT_PUBLIC_MAILTRAP_CONTACT_FORM_TID,
        cCompany: formData.company,
        cComment: formData.comment,
        cPhone: formData.phone,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to send email. Please try again later.");
      return;
    }
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      comment: "",
      type: "",
      queryType: "",
    });
    toast.success("Email sent successfully!");

    try {
      await axios.post("/api/send-email", {
        to: formData.email.toLowerCase(),
        cName: formData.name,
        tUID: process.env.NEXT_PUBLIC_MAILTRAP_CONTACT_RESPONSE_TID,
      });
    } catch (error) {
      setIsLoading(false);
      console.log("Failed to send the second email. Please try again later.");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full bg-zinc-100">
      <div className="px-5 pt-[120px] lg:pt-[160px] pb-16 md:pb-24 xl:container mx-auto flex flex-col lg:flex-row gap-8 md:gap-14">
        <div className="w-full lg:w-2/5 flex flex-col gap-8 bg-gradient-to-br from-tg-orange to-tg-orange2 shadow-lg text-white rounded-lg p-8 lg:p-10 h-max">
          <h1 className="text-4xl md:text-5xl font-oswald">
            {t("get_in_touch")}
          </h1>
          <h3 className="">{t("get_in_touch_subtitle")}</h3>
          <div className="inline-flex items-center gap-3 md:text-lg">
            <div className="bg-white p-3 rounded-full">
              <FaEnvelope className="text-tg-orange2 md:text-xl text-lg" />
            </div>
            info@tickgetr.be
          </div>
        </div>
        <div className="w-full lg:w-3/5 p-8 lg:p-10 bg-white shadow-lg rounded-lg">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="text-3xl md:text-4xl font-bebas mb-3">
              {t("send_us_a_message")}
            </h2>

            <input
              className="w-full p-4 focus:outline-none rounded-md bg-zinc-100"
              type="text"
              name="name"
              placeholder={t("name_placeholder")}
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <input
              className="w-full p-4 focus:outline-none rounded-md bg-zinc-100"
              type="text"
              name="company"
              placeholder={t("company_placeholder")}
              value={formData.company}
              onChange={handleChange}
              disabled={isLoading}
            />
            <input
              className="w-full p-4 focus:outline-none rounded-md bg-zinc-100"
              type="email"
              name="email"
              placeholder={t("email_placeholder")}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <input
              className="w-full p-4 focus:outline-none rounded-md bg-zinc-100"
              type="tel"
              name="phone"
              placeholder={t("phone_placeholder")}
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <textarea
              className="w-full p-4 focus:outline-none rounded-md bg-zinc-100 max-h-36"
              rows="4"
              name="comment"
              placeholder={t("comment_placeholder")}
              value={formData.comment}
              onChange={handleChange}
              required
              disabled={isLoading}
            ></textarea>
            <div className="mt-4">
              <p className="font-bebas text-2xl mb-3">{t("query_type")}:</p>
              <Dropdown className="w-full">
                <DropdownTrigger className="lg:w-1/3 md:w-1/2 w-full py-3 px-5 rounded-md border border-zinc-300 md:inline-flex hidden items-center gap-1.5 bg-white">
                  <div className="inline-flex justify-between gap-3">
                    {selectedQueryType === ""
                      ? t("query_type")
                      : queryTypes.find(
                          (type) => type.value === selectedQueryType
                        ).label}
                    <FaAngleDown />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Query Type"
                  variant="faded"
                  color="default"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKey={selectedQueryType}
                >
                  {queryTypes.map((type) => (
                    <DropdownItem
                      key={type.label}
                      onPress={() => {
                        setSelectedQueryType(type.value);
                        setFormData({ ...formData, queryType: type.value });
                      }}
                    >
                      {type.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="py-4">
              <p className="font-bebas text-2xl mb-3">{t("type_label")}</p>
              <div className="inline-flex items-center gap-3">
                <label
                  className={`radio-button p-4 rounded-md cursor-pointer transition-all ${
                    formData.type === "Visitor"
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Visitor"
                    checked={formData.type === "Visitor"}
                    onChange={handleChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  {t("visitor")}
                </label>
                <label
                  className={`radio-button p-4 rounded-md cursor-pointer transition-all ${
                    formData.type === "Organiser"
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Organiser"
                    checked={formData.type === "Organiser"}
                    onChange={handleChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  {t("organiser")}
                </label>
              </div>
            </div>

            <ButtonWithLoading
              isLoading={isLoading}
              isLoadingText={t("sending_message")}
              isDisabled={isLoading}
              buttonText={t("send_message_button")}
              className={`${
                isLoading ? "py-4 px-6" : "py-4 px-10"
              } mt-3 w-max focus:outline-none rounded-md bg-tg-orange2 text-white font-medium hover:bg-tg-orange2-hover transition`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

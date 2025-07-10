"use client";
import { useState } from "react";
import { checkLostTicket } from "@/app/(Api)/firebase/firebase_firestore";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const LostTicket = () => {
  const t = useTranslations("lostTicket");

  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const selectedDate = new Date(date);
    try {
      await checkLostTicket(email.toLowerCase(), selectedDate);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error.message;
    }

    setDate("");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center pt-[120px] lg:pt-[150px] pb-32 gap-16 px-6 md:px-12">
      <div className="text-4xl lg:text-5xl font-oswald md:w-3/4 w-full">
        {t("locate_your_tickets")}
      </div>
      <div className="w-full xl:w-3/4 flex flex-col-reverse lg:flex-row gap-12 lg:gap-20">
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-2/5 border-2 rounded-xl p-8 flex flex-col gap-4 h-max"
        >
          <div>
            <label htmlFor="email" className="form-label">
              {t("email_label")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("email_placeholder")}
              className="form-control bg-zinc-100 border-none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date" className="form-label">
              {t("date_label")}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control bg-zinc-100 border-none"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <ButtonWithLoading
            isLoading={isLoading}
            isLoadingText={t("resend_loading")}
            isDisabled={isLoading}
            buttonText={t("resend_button")}
            className="inline-flex justify-center items-center bg-black text-white rounded-md py-3 px-4 mt-5 hover:bg-tg-orange2 transition"
          />
        </form>
        <div className="flex flex-col w-full lg:w-3/5 gap-5">
          <div className="space-y-3">
            <h3 className="text-2xl text-tg-orange2 font-oswald">
              {t("lost_ticket_heading")}
            </h3>
            <p>{t("lost_ticket_message")}</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl text-tg-orange2 font-oswald">
              {t("not_received_heading")}
            </h3>
            <p>{t("not_received_message")}</p>
            <p>
              {t("typo_message")}{" "}
              <Link
                href="/contact"
                className="text-tg-orange2 hover:text-tg-orange2-hover  cursor-pointer"
              >
                {t("contact_us")}
              </Link>
              .
            </p>
            <p>
              {t("further_assistance")}{" "}
              <a
                href="mailto:info@tickgetr.be"
                className="text-tg-orange2 hover:text-tg-orange2-hover  cursor-pointer"
              >
                info@tickgetr.be
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostTicket;

import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

// Dynamically import your actual LostTicket page component
const LostTicketPage = dynamic(() => import("./LostTicketPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Lost Ticket? Resend Ticket | Tickgetr",
    nl: "Ticket Kwijt? Ticket Opnieuw Versturen | Tickgetr",
  };

  const descriptions = {
    en: "Lost your ticket? Use your email and event date to resend your ticket instantly via TickGetr.",
    nl: "Ticket kwijt? Gebruik je e-mail en datum om je ticket direct opnieuw te versturen via TickGetr.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return <LostTicketPage />;
}
  
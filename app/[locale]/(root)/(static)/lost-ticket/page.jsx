import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

// Dynamically import your actual LostTicket page component
const LostTicketPage = dynamic(() => import("./LostTicketPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Lost Tickets | Tickgetr",
    nl: "Verloren tickets | Tickgetr",
  };

  const descriptions = {
    en: "Lost your event ticket? TickGetr helps you recover it quickly and securely. Contact support for fast assistance and hassle‑free ticket retrieval.",
    nl: "Ben je je evenementticket kwijt? TickGetr helpt je om het snel en veilig terug te vinden. Neem contact op met de support voor snelle hulp en probleemloos tickets ophalen.",
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
  
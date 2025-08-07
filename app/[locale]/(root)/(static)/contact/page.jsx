import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

// Load your client component
const contact = dynamic(() => import("./contact"), { ssr: false });
 
export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Contact Us | Tickgetr",
    nl: "Neem Contact Op | Tickgetr",
  };

  const descriptions = {
    en: "Get in touch with TickGetr support or sales team. Have questions about event ticketing? Contact us for fast, friendly help and support.",
    nl: "Neem contact op met het TickGetr-team voor ondersteuning of verkoop. Vragen over online ticketverkoop? Wij helpen je graag verder.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return <contact />;
}
 
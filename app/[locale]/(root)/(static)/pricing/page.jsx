import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";
const PricingPage = dynamic(() => import("./PricingPage"), { ssr: false });

export const generateMetadata = async ({ params }) => {
  const locale = params?.locale || "en";

  const titles = {
    en: "Simplified Pricing | Tickgetr",
    nl: "Eenvoudige Prijzen | Tickgetr",
  };

  const descriptions = {
    en: "Explore TickGetr pricing for event organizers and ticket buyers. Simple and transparent plans to help you manage and sell tickets with ease.",
    nl: "Ontdek TickGetr-prijzen voor organisatoren en ticketkopers. Eenvoudige en transparante plannen om je tickets moeiteloos te beheren en te verkopen.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params }) {
  const locale = params?.locale || "en";
  unstable_setRequestLocale(locale);
  return <PricingPage />;
}

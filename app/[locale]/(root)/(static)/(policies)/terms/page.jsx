import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

const TermsPage = dynamic(() => import("./TermsPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Terms and Conditions | Tickgetr",
    nl: "Algemene voorwaarden | Ticketgetr",
  };

  const descriptions = {
    en: "Review TickGetr’s Terms of Service for rules, responsibilities, and policies governing event ticketing. Clear, transparent guidelines for users and organizers.",
    nl: "Bekijk de servicevoorwaarden van TickGetr voor de regels, verantwoordelijkheden en beleidsregels met betrekking tot ticketverkoop voor evenementen. Duidelijke, transparante richtlijnen voor gebruikers en organisatoren.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params }) {
  unstable_setRequestLocale(params.locale);
  return <TermsPage params={params} />;
}

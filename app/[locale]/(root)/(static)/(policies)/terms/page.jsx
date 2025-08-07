import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

const TermsPage = dynamic(() => import("./TermsPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Terms and Conditions | Tickgetr",
    nl: "Algemene Voorwaarden | Tickgetr",
  };

  const descriptions = {
    en: "Read the terms and conditions for using TickGetr as an event organizer or visitor. Stay informed about your rights and responsibilities.",
    nl: "Lees de algemene voorwaarden voor het gebruik van TickGetr als organisator of bezoeker. Blijf op de hoogte van je rechten en plichten.",
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

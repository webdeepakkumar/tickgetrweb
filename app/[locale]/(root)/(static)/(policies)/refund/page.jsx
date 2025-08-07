import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

const RefundPage = dynamic(() => import("./RefundPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Refund Policy | Tickgetr",
    nl: "Retourbeleid | Tickgetr",
  };

  const descriptions = {
    en: "Understand TickGetr’s refund policy for ticket buyers and organizers. Learn how refunds are processed and eligibility criteria.",
    nl: "Lees het retourbeleid van TickGetr voor ticketkopers en organisatoren. Ontdek hoe terugbetalingen worden verwerkt en wat de voorwaarden zijn.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params }) {
  unstable_setRequestLocale(params.locale);
  return <RefundPage params={params} />;
}

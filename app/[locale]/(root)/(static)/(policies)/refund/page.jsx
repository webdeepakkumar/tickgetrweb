import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

const RefundPage = dynamic(() => import("./RefundPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Refund Policy | Tickgetr",
    nl: "Restitutiebeleid | Ticketr",
  };
 
  const descriptions = {
    en: "Discover TickGetr’s refund policy for tickets. Understand eligibility, timeframes, and procedures so you can request refunds with ease and clarity.",
    nl: "Ontdek het restitutiebeleid van TickGetr voor tickets. Begrijp de voorwaarden, tijdschema's en procedures, zodat u eenvoudig en duidelijk restitutie kunt aanvragen.",
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

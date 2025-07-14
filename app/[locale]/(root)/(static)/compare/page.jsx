import { useTranslations } from "next-intl";
import dynamic from "next/dynamic"; 
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = params;

  if (locale === "nl") {
    return {
      title: "Vergelijk Ticketplatformen - Tickgetr",
      description:
        "Gebruik de calculator om eenvoudig tarieven van verschillende ticketplatforms te vergelijken op basis van betaalmethoden.",
    };
  }

  return {
    title: "Compare Ticket Platforms - Tickgetr",
    description:
      "Use the calculator to easily compare pricing across various ticketing platforms based on payment methods.",
  };
}

const CompareContent = dynamic(() => import("./CompareContent"), {
  ssr: false,
});

export default function ComparePage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("compare");
  return <CompareContent />;
}

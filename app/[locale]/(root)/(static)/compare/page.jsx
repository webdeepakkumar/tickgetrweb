import { useTranslations } from "next-intl";
import dynamicImport from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic"; 
export async function generateMetadata({ params }) {
  const { locale } = params;

  if (locale === "nl") {
    return {
      title: "Vergelijk Prijzen voor Evenemententickets | Tickgetr",      
      description:
        "Vergelijk eenvoudig ticketplatforms met Tickgetr. Vind de beste prijs-kwaliteitoplossing door de prijzen van verschillende platforms naast elkaar te zetten.",
    };
  }

  return {
    title: "Compare Event Ticket Prices | Tickgetr",
    description:
      "Easily compare ticket platforms with Tickgetr. Find the best price-quality solution by comparing prices from different platforms.",
  };
}

const CompareContent = dynamicImport(() => import("./CompareContent"), {
  ssr: false,
});

export default function ComparePage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("compare");
  return <CompareContent />;
}

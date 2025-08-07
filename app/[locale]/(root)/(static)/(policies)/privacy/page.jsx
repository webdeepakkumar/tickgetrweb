import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

// Dynamically import the actual page component
const PrivacyPage = dynamic(() => import("./PrivacyPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Privacy Policy | Tickgetr",
    nl: "Privacybeleid | Tickgetr",
  };

  const descriptions = {
    en: "Learn how TickGetr protects your data with our Privacy Policy. Clear details on information collection, usage, and security measures for users and organizers.",
    nl: "Ontdek hoe TiGer uw gegevens beschermt met ons privacybeleid. Duidelijke informatie over het verzamelen, gebruiken en de beveiligingsmaatregelen voor gebruikers en organisatoren.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}; 

export default function Page({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  return <PrivacyPage />;
}

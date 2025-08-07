import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

const PrivacyPage = dynamic(() => import("./PrivacyPage"), { ssr: false });

export const generateMetadata = ({ params }) => {
  const locale = params.locale;

  const titles = {
    en: "Privacy Policy | Tickgetr",
    nl: "Privacybeleid | Tickgetr", 
  };

  const descriptions = {
    en: "Read our privacy policy to understand how TickGetr protects your personal data and ensures transparency.",
    nl: "Lees ons privacybeleid om te begrijpen hoe TickGetr je persoonlijke gegevens beschermt en transparantie garandeert.",
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

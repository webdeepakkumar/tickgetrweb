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
    en: "Review TickGetr’s privacy policy to understand how your personal data is collected, stored, and protected.",
    nl: "Lees het privacybeleid van TickGetr en ontdek hoe je persoonlijke gegevens worden verzameld, opgeslagen en beschermd.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
};

export default function Page({ params }) {
  unstable_setRequestLocale(params.locale);
  return <PrivacyPage params={params} />;
}

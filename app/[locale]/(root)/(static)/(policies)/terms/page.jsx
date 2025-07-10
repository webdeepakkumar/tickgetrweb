import React from "react";
import Terms from "@/app/[locale]/components/terms";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const TermsPage = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("termsAndConditions");

  const organiserTC = t.raw("organiser_TC", {
    returnObjects: true,
  });
  const visitorTC = t.raw("visitor_TC", {
    returnObjects: true,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-6 md:px-10 lg:w-4/5 pt-[120px] md:pt-[160px] pb-20 flex flex-col gap-14 md:gap-20">
        <div className="text-4xl md:text-5xl font-oswald">
          <div className="hidden lg:block">{t("title_full")}</div>
          <div className="block lg:hidden">{t("title_short")}</div>
        </div>
        <Terms title={t("TC_organizers")} faqs={organiserTC} />
        <Terms title={t("TC_visitors")} faqs={visitorTC} />
      </div>
    </div>
  );
};

export default TermsPage;

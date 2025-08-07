import React from "react";
import Policy from "@/app/[locale]/components/Policy";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const PrivacyPage = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("privacyData");

  const title = t.raw("title");
  const policies = t.raw("policies");

  return (
    <div>
      <Policy title={title} policies={policies} />
    </div>
  );
};
 
export default PrivacyPage;

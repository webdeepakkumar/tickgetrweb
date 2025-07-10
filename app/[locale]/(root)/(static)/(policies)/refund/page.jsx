import React from "react";
import Policy from "@/app/[locale]/components/Policy";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const RefundPage = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("refundPolicy");

  const title = t.raw("title");
  const policies = t.raw("policies", { returnObjects: true });

  return (
    <div>
      <Policy title={title} policies={policies} />
    </div>
  );
};

export default RefundPage;

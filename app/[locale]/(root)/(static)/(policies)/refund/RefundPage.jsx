"use client";

import React from "react";
import Policy from "@/app/[locale]/components/Policy";
import { useTranslations } from "next-intl";

const RefundPage = ({ params }) => {
  const t = useTranslations("refundPolicy");
  const locale = params?.locale || "en"; // fallback

  const title = t.raw("title");
  const policies = t.raw("policies", { returnObjects: true });

  return (
    <div>
      <Policy title={title} policies={policies} />
    </div>
  );
};

export default RefundPage;

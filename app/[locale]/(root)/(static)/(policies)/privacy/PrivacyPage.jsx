"use client";

import React from "react";
import Policy from "@/app/[locale]/components/Policy";
import { useTranslations } from "next-intl";

const PrivacyPage = ({ params }) => {
  const locale = params?.locale || "en"; // fallback to 'en' to avoid crash

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

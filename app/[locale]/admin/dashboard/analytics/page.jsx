import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { FaRegHandPointer } from "react-icons/fa";

const Analytics = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  const t = useTranslations("admin");

  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-zinc-900 rounded-xl text-white gap-5">
      <h2>{t("adminDashboard.analytics.move_text")}</h2>
      <FaRegHandPointer style={{ transform: "rotate(180deg)" }} size={30} />
      <a
        href={"https://analytics.google.com/analytics"}
        target="_blank"
        rel="noopener noreferrer"
        className="
          bg-tg-orange py-3 w-max px-5 rounded-xl text-white hover:bg-tg-orange-hover transition-all"
      >
        {t("adminDashboard.analytics.move_button")}
      </a>
    </div>
  );
};

export default Analytics;

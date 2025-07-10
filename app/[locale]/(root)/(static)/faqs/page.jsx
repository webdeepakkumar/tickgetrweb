import Faqs from "@/app/[locale]/components/faq";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";

const FaqsPage = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("faqs");

  const visitorFaqs = t.raw("visitor_faqs", { returnObjects: true });
  const organizerFaqs = t.raw("organizer_faqs", { returnObjects: true });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-5 md:px-10 lg:w-3/5 pt-[120px] md:pt-[160px] pb-20 flex flex-col gap-14 md:gap-20">
        <div className="text-4xl md:text-5xl font-oswald">
          <div className="hidden lg:block">{t("title_full")}</div>
          <div className="block lg:hidden">{t("title_short")}</div>
        </div>
        <Faqs title={t("faqs_visitors")} faqs={visitorFaqs} />
        <Faqs title={t("faqs_organizers")} faqs={organizerFaqs} />
      </div>
      <div className="w-full px-5 py-16 md:py-20 flex flex-col justify-center items-center gap-6 bg-orange-100">
        <p className="font-medium font-oswald text-2xl text-center">
          {t("couldnt_find_question")}
        </p>
        <div className="text-center md:text-lg md:w-3/4">
          {t("explore_solutions")}{" "}
          <Link
            href="/solutions"
            className="text-orange-500 hover:text-orange-600 transition-all duration-500"
          >
            {t("solutions_page")}
          </Link>{" "}
          {t("more_information")}{" "}
          <a
            href="mailto:info@tickgetr.be"
            className="text-orange-500 hover:text-orange-600 transition-all duration-500"
          >
            info@tickgetr.be
          </a>
          . {t("response_time")}
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;

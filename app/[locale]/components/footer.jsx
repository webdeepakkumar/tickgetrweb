import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import LanguageDropDown from "./languageDropDown";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import TgLogo from "./logo";
import { unstable_setRequestLocale } from "next-intl/server";

const Footer = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  const currentyear = new Date().getFullYear()

  const t = useTranslations("footer");

  return (
    <footer className="bg-zinc-950 text-white w-full px-8 md:px-16">
      <div className="flex gap-20 flex-wrap justify-between py-16 md:py-20">
        <div className="flex flex-col gap-6 md:justify-between">
          <TgLogo
            className="w-36 md:w-40 h-max"
            logoText="white"
            logoEmblem="white"
          />
          <div className="justify-center w-full gap-3 hidden">
            <a
              href="https://google.com"
              className="h-12 w-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              aria-label={t("facebook")}
            >
              <FaFacebookF className="text-lg" />
            </a>
            <a
              href="https://google.com"
              className="h-12 w-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              aria-label={t("instagram")}
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://google.com"
              className="h-12 w-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              aria-label={t("linkedin")}
            >
              <FaLinkedinIn className="text-lg" />
            </a>
            <a
              href="https://google.com"
              className="h-12 w-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              aria-label={t("twitter")}
            >
              <FaXTwitter className="text-lg" />
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-14 md:gap-28">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-oswald mb-6">{t("quickLinks")}</h3>
            <Link className="footer-links" href="/">
              {t("home")}
            </Link>
            {/* <Link className="footer-links" href="/events">
              {t("events")}
            </Link> */}
            <Link className="footer-links" href="/solutions">
              {t("solutions")}
            </Link>
            <Link className="footer-links" href="/pricing">
              {t("pricing")}
            </Link>
            <Link className="footer-links" href="/contact">
              {t("contact")}
            </Link>
            <Link className="footer-links" href="/compare">
              {t("compare")}
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-oswald mb-6">{t("needHelp")}</h3>
            <a className="footer-links" href="mailto:info@tickgetr.be">
              info@tickgetr.be
            </a>
            <Link className="footer-links" href="/lost-ticket">
              {t("lostTickets")}
            </Link>
            <Link className="footer-links" href="/faqs">
              {t("faqs")}
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-oswald mb-6">{t("moreInfo")}</h3>
            <Link className="footer-links" href="/terms">
              {t("terms")}
            </Link>
            <Link className="footer-links" href="/privacy">
              {t("privacy")}
            </Link>
            <Link className="footer-links" href="/refund">
              {t("refund")}
            </Link>
          </div>
        </div>
      </div>
      <div className="relative w-full flex flex-col items-start md:flex-row md:justify-center gap-1 md:gap-3 border-t border-neutral-400 py-12 text-xs md:text-sm font-light text-neutral-300">
        <div className=" absolute right-0 top-1/2 transform -translate-y-1/2">
          <LanguageDropDown className="bg-zinc-900 rounded-lg inline-flex justify-center gap-1 items-center h-10 pl-3 pr-4 focus:outline-none hover:bg-zinc-800 transition-all" />
        </div>
        <div>© {currentyear} {t("allRightsReserved")}</div>
      </div>
    </footer>
  );
};

export default Footer;

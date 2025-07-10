import { Poppins } from "next/font/google";
import Footer from "@/app/[locale]/components/footer.jsx";
import Navbar from "@/app/[locale]/components/navbar.jsx";
import { Splash } from "../components/splash";
import { unstable_setRequestLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function generateStaticParams() {
  return ["en", "nl"].map((locale) => ({ locale }));
}

export default function LandingLayout({ children, params: locale }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <div className={poppins.className}>
        <Splash />
        <Navbar />
        {children}
        <Footer params={locale} />
        <Toaster/>
      </div>
    </>
  );
}

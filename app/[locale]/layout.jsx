import { Poppins } from "next/font/google";
import "../../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { EIdProvider } from "./context/eventContextProvider";
import {
  LoadScriptProvider,
  LoadScriptWrapper,
} from "./context/LoadScriptContext";
import { AuthProvider } from "./context/authContext";
import { AdminAuthProvider } from "./context/adminAuthContext";
import CookieConsentProvider from "./components/CookieConsentProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const locales = ["en", "nl"];

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    icons: { icon: "/icons/favicon.ico" },
    description: "Online Ticketing Platform",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }) {
  unstable_setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R74FZE3GKN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R74FZE3GKN');
            `,
          }}
        />
      </head>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster position="top-center" />
          <AdminAuthProvider>
            <EIdProvider>
              <AuthProvider>
                <LoadScriptProvider>
                  <LoadScriptWrapper>
                    <CookieConsentProvider>{children}</CookieConsentProvider>
                  </LoadScriptWrapper>
                </LoadScriptProvider>
              </AuthProvider>
            </EIdProvider>
          </AdminAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

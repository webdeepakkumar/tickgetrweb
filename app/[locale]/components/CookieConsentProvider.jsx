"use client";

import { useState, useEffect } from "react";
import GoogleAnalytics from "./googleAnalytics";
import CookieBanner from "./cookieBanner";
import { getLocalStorage, setLocalStorage } from "../lib/storageHelper";

export default function CookieConsentProvider({ children }) {
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage("cookie_consent", null);
    setCookieConsent(storedCookieConsent);
  }, []);

  useEffect(() => {
    if (cookieConsent !== null) {
      const consentValue = cookieConsent ? "granted" : "denied";
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: consentValue,
        });
      }
      setLocalStorage("cookie_consent", cookieConsent);
    }
  }, [cookieConsent]);

  return (
    <>
      {cookieConsent === true && (
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      )}
      {children}
      <CookieBanner
        setCookieConsent={setCookieConsent}
        cookieConsent={cookieConsent}
      />
    </>
  );
}

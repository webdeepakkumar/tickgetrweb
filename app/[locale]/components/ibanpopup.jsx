"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
const IbanPopup = () => {
    const router = useRouter()
    const t = useTranslations("accountrequired");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
    <div className="bg-white p-6 md:p-12 rounded-2xl shadow-2xl max-w-3xl text-center">
      <h2 className="text-2xl md:text-4xl font-oswald mb-4 md:mb-6 text-orange-500">
        {t("account_required")}
      </h2>
      <p className="text-xl font-md font-oswald md:text-2xl text-gray-700 mb-6 md:mb-10">
       {t("account_required_msg")}
      </p>
      <Link
        href="/user/profile"
        className="bg-orange-400 text-white  px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-semibold hover:bg-orange-600 transition"
      >
       {t("account_required_button")}
      </Link>
    </div>
  </div>
  
  );
};

export default IbanPopup;

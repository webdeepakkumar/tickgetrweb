"use client";

import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import PopupDefault from "./PopupDefault";
import LottieAnimation from "../animations/loadingarforocuments";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { fetchUserById } from "@/app/(Api)/firebase/firebase_firestore";

const DetailsPopup = ({ onClose, title, userId }) => {
  const t = useTranslations("evendocuments");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!userId) return;
        const data = await fetchUserById(userId);
        if (data) {
          setUserData(data);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white font-normal p-5 md:p-6 rounded-2xl shadow-lg relative flex flex-col w-[300px] md:w-[400px] max-h-[600px]">
        <div className="space-y-2  border-zinc-200 pb-3 mb-4">
          <h2 className="text-3xl font-oswald text-tg-orange2">{title}</h2>
        </div>
        <div className="overflow-y-auto flex flex-1 flex-col w-full no-scrollbar">
          {loading ? (
            <p className="text-center text-gray-500">
              <LottieAnimation />
            </p>
          ) : userData ? (
            
            <table className="w-full text-sm border-y">
              <tbody>
                <tr>
                  <td className="font-semibold p-2  border-b text-gray-700">
                    {t("user_ID")}
                  </td>
                  <td className="p-2 border-b text-black">{userData.userId}</td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("uName")}
                  </td>
                  <td className="p-2 border-b text-black">{userData.uName}</td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("user_email")}
                  </td>
                  <td className="p-2 border-b text-black ">
                    {userData.uEmail}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("user_country")}
                  </td>
                  <td className="p-2 border-b text-black ">
                    {userData.invoiceCountry}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("IBAN_Number")}
                  </td>
                  <td className="p-2 border-b text-black">
                    {userData.ibannumber || t("not_available")}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("organizer_number")}
                  </td>
                  <td className="p-2 border-b text-black">
                    {userData.organizerPhoneNumber || t("not_available")}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("organization_name")}
                  </td>
                  <td className="p-2 border-b text-black">
                    {userData.organizationName || t("not_available")}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("Organization_website")}
                  </td>
                  <td className="p-2 border-b text-black">
                    {userData.organizationWebsite || t("not_available")}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 border-b text-gray-700">
                    {t("organization_logo")}
                  </td>
                  <td className="p-2 border-b text-black text-center">
                    {userData.organizationLogo ? (
                      <img
                        src={userData.organizationLogo}
                        alt="Organization Logo"
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    ) : (
                      t("not_available")
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center text-red-500">
              User details not available.
            </p>
          )}
        </div>

        <button
          className="text-3xl mt-3 mr-2 rotate-45 absolute top-0 right-0 text-zinc-400"
          onClick={onClose}
        >
          <GoPlus />
        </button>
      </div>
    </div>
  );
};

export default DetailsPopup;

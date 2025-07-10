"use client";
import React, { useState, useEffect } from "react";
import {
  StepOne,
  StepTwo,
  StepThree,
} from "@/app/[locale]/components/multiStepForm";
import { useAuth } from "@/app/[locale]/context/authContext";
import { GeoPoint, Timestamp } from "firebase/firestore";
import { addEventToFirestore } from "@/app/(Api)/firebase/firebase_firestore";
import { uploadImageToStorage } from "@/app/(Api)/firebase/firebase_storage";
import { FaCheck } from "react-icons/fa";
import Transition4 from "@/app/[locale]/animations/transition4";
import { fetchOneUser } from "@/app/(Api)/firebase/firebase_firestore";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import IbanPopup from "@/app/[locale]/components/ibanpopup";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";

const CreateEvent = () => {
  const t = useTranslations("createEvent");

  const [userId, setUserId] = useState();
      const [fetchUser, setFetchUser] = useState([]);
     const [Visible , setVisible] = useState(null)

  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else if (user) {
      setUserId(user.uid);
    }
  }, [user]);

    useEffect(() => {
      const fetchUser = async () => {
        if (userId) {
          await fetchOneUser(userId, setFetchUser);
      
  
        }
      };
      fetchUser();
    }, [userId]);

    useEffect(() => {
      
      if (fetchUser && fetchUser.length > 0) {
          const userData = fetchUser[0]; 
          const accountcreate =  userData?.accountCreated;
           console.log("Account Created Status form the event page:", accountcreate);
          setVisible(accountcreate)          
      }
         // Converts truthy/falsy values to boolean
      
  }, [fetchUser])

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    eName: "",
    eStart: "",
    eEnd: "",
    eAddress: "",
    eCity: "",
    eCategory: "",
    eDescription: "",
    eBanner: null,
    ticketInfo: [],
    eId: "",
    eQrCode: "",
    ticketsPerOrder: parseInt(20),
    eventPDF: "",
    pOnCharges: false,
    isExpired: false,
    isVisible: true,
    isPurchased: false,
    adminAuth: true,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const formSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const imageUrl = await uploadImageToStorage(
        formData.eBanner,
        "",
        "event_images"
      );
      const startDate = new Date(formData.eStart);
      const endDate = new Date(formData.eEnd);
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      await addEventToFirestore({
        ...formData,
        eStart: startTimestamp,
        eEnd: endTimestamp,
        eBanner: imageUrl,
        userId,
      }).then(() => {
        setIsLoading(false);
        router.push("/user/my-events");
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to add event to Firestore:", error);
    }
  };

  return (
    <>
    {Visible === null ? <><LoadingSpinner/></> : Visible ? (
    <Transition4 className="w-full h-full flex flex-col items-center">
      <div className="w-full inline-flex justify-center pb-8 border-b border-zinc-400">
        <div className="w-full px-10 pt-10 md:pt-0 md:px-0 md:w-3/5 inline-flex justify-between items-end">
          {/* step1 */}
          <div
            className={`flex flex-col gap-2 justify-center items-center relative ${
              currentStep >= 1 ? "text-black" : "text-zinc-400"
            }`}
          >
            <div className="font-oswald font-medium text-2xl hidden md:block">
              01
            </div>
            <div
              className={`absolute md:top-0 md:left-10 bottom-full pb-2 md:pb-0 ${
                currentStep >= 1 ? "text-zinc-700" : "text-zinc-400"
              } text-lg w-max font-oswald`}
            >
              {t("step1_title")}
            </div>
            <div
              className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded-full flex justify-center items-center text-white ${
                currentStep === 1
                  ? "border-tg-orange"
                  : currentStep > 1
                  ? "bg-tg-orange border-tg-orange"
                  : "border-zinc-400"
              }`}
            >
              {currentStep > 1 ? (
                <FaCheck className="text-sm md:text-md" />
              ) : (
                ""
              )}
            </div>
          </div>
          {/* divider */}
          <div
            className={`w-full mx-2 mb-3 md:mb-4 h-[2px] rounded-full ${
              currentStep >= 2 ? "bg-tg-orange" : "bg-zinc-400"
            }`}
          ></div>
          {/* step2 */}
          <div
            className={`flex flex-col gap-2 justify-center items-center relative ${
              currentStep >= 2 ? "text-black" : "text-zinc-400"
            }`}
          >
            <div className="font-oswald font-medium text-2xl hidden md:block">
              02
            </div>
            <div
              className={`absolute md:top-0 md:left-10 bottom-full pb-2 md:pb-0 ${
                currentStep >= 2 ? "text-zinc-700" : "text-zinc-400"
              } text-lg w-max font-oswald`}
            >
              {t("step2_title")}
            </div>
            <div
              className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded-full flex justify-center items-center text-white ${
                currentStep === 2
                  ? "border-tg-orange"
                  : currentStep > 2
                  ? "bg-tg-orange border-tg-orange"
                  : "border-zinc-400"
              }`}
            >
              {currentStep > 2 ? (
                <FaCheck className="text-sm md:text-md" />
              ) : (
                ""
              )}
            </div>
          </div>
          {/* divider */}
          <div
            className={`w-full mx-2 mb-3 md:mb-4 h-[2px] rounded-full ${
              currentStep >= 3 ? "bg-tg-orange" : "bg-zinc-400"
            }`}
          ></div>
          {/* step3 */}
          <div
            className={`flex flex-col gap-2 justify-center items-center relative ${
              currentStep >= 3 ? " text-black" : "text-zinc-400"
            }`}
          >
            <div className="font-oswald font-medium text-2xl hidden md:block">
              03
            </div>
            <div
              className={`absolute md:top-0 md:left-10 bottom-full pb-2 md:pb-0 ${
                currentStep >= 3 ? "text-zinc-700" : "text-zinc-400"
              } text-lg w-max font-oswald`}
            >
              {t("step3_title")}
            </div>
            <div
              className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded-full flex justify-center items-center text-white ${
                currentStep === 3
                  ? "border-tg-orange"
                  : currentStep > 3
                  ? "bg-tg-orange border-tg-orange"
                  : "border-zinc-400"
              }`}
            >
              {currentStep > 3 ? (
                <FaCheck className="text-sm md:text-md" />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-1 overflow-hidden justify-center pt-6">
        <div className="w-full md:w-3/4 p-4 overflow-y-auto no-scrollbar pb-20">
          {typeof window !== "undefined" &&
          window.google &&
          window.google.maps ? (
            <div>
              {currentStep === 1 && (
                <StepOne onNext={handleNext} formData={formData} />
              )}
              {currentStep === 2 && (
                <StepTwo
                  onPrev={handlePrev}
                  onNext={handleNext}
                  formData={formData}
                />
              )}
              {currentStep === 3 && (
                <StepThree
                  onPrev={handlePrev}
                  formData={formData}
                  handleSubmit={formSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          ) : (
            <div>
              {currentStep === 1 && (
                <StepOne onNext={handleNext} formData={formData} />
              )}
              {currentStep === 2 && (
                <StepTwo
                  onPrev={handlePrev}
                  onNext={handleNext}
                  formData={formData}
                />
              )}
              {currentStep === 3 && (
                <StepThree
                  onPrev={handlePrev}
                  formData={formData}
                  handleSubmit={formSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Transition4>
    ):(
      <IbanPopup/>
    )}
    
    </>
  );
};
export default CreateEvent;

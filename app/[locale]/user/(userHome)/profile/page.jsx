"use client";

import { useState, useEffect, useId } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/[locale]/context/authContext";

import {
  fetchOneUser,
  updateOneCollection,
  updateOneUserField,
} from "@/app/(Api)/firebase/firebase_firestore";
import { uploadImageToStorage } from "@/app/(Api)/firebase/firebase_storage";

import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import ButtonWithLoading from "@/app/[locale]/components/button/loadingButton";
import Transition4 from "@/app/[locale]/animations/transition4";
import axios from "axios";
import ImageCropper from "@/app/[locale]/components/ImageCropper";
import { MdDeleteOutline } from "react-icons/md";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { FaStripeS } from "react-icons/fa";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

// let OnboardingUrl = "";
// let stripeProfileUrl = "";
// let stripeAccountId = "";

const Profile = ({ params: { locale } }) => {
  const t = useTranslations("profile");

  const searchParams = useSearchParams();
  const router = useRouter();
  const profileComplete = searchParams.get("account_complete");

  const [organizationName, setOrganizationName] = useState("");
  const [organizationWebsite, setOrganizationWebsite] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizationType, setOrganizerType] = useState("");
  const [ibannumber , setIbannumber] = useState("");
  const [organizerPhoneNumber, setOrganizerPhoneNumber] = useState("");
  const [accountId, setAccountId] = useState("");
  const [invoiceCountry, setInvoiceCountry] = useState("");
  const [invoicePostalCode, setInvoicePostalCode] = useState("");
  const [invoiceStreet, setInvoiceStreet] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState("");
  // const [stripeProfile, setStripeProfile] = useState("");
  // const [onBoardingComplete, setOnBoardingComplete] = useState(false);
  const [cropperKey, setCropperKey] = useState(Date.now());
  const [uploadLogo, setUploadLogo] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  const [triggerLinkGeneration, setTriggerLinkGeneration] = useState(false);
  // const [stripeAccountComplete, setStripeAccountComplete] = useState(false);
  // const [capabilitiesCheck, setCapabilitiesCheck] = useState(false);

  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState();

  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchOneUser(userId, (user) => {
        setUserData(user);
        setLoading(false);
      });
    }
  }, [userId]);

  useEffect(() => {
    async function updateUserData() {
      try {
        await updateOneUserField(useId,"ibannumber",ibannumber),
        toast.success("iban number added ")
        fetchOneUser(userId,setUserData)
        
        await updateOneUserField(userId, "onBoardingComplete", true);
        toast.success("Onboarding successful. Thank you.");
        fetchOneUser(userId, setUserData);
       
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }

    if (profileComplete === "true" && userId) {
      updateUserData();
    }
  }, [profileComplete, userId]);

  // useEffect(() => {
  //   async function checkCapabilities() {
  //     const dashboardLinkRes = await axios.post("/api/create-login-link", {
  //       accountId,
  //     });

  //     const { dashboardUrl, accountComplete } = dashboardLinkRes.data;
  //     setCapabilitiesCheck(accountComplete);
  //     // console.log("Account Complete: ", accountComplete);
  //     if (accountComplete) {
  //       await updateOneUserField(userId, "onBoardingComplete", true);
  //       // console.log("Account Complete!");
  //     } else {
  //       // console.log("Account Not Complete!");
  //     }
  //   }
  //   if (accountId !== "") {
  //     checkCapabilities();
  //   }
  // }, [capabilitiesCheck, accountId]);

  useEffect(() => {
    const user = userData[0];
    console.log("user details",userData)

    if (user) {
      // setAccountId(user.stripeAccountId || "");
      setOrganizationName(user.organizationName || "");
      setOrganizationWebsite(user.organizationWebsite || "");
      setOrganizationLogo(user.organizationLogo || "");
      setOrganizerType(user.organizationType || "");
      setOrganizerPhoneNumber(user.organizerPhoneNumber || "");
      setInvoiceCountry(user.invoiceCountry || "");
      setOrganizerName(user.uName || "");
      //ibannumber
      setIbannumber(user.ibannumber || "");
      setInvoicePostalCode(user.invoicePostalCode || "");
      setInvoiceStreet(user.invoiceStreet || "");
      setInvoiceNumber(user.invoiceNumber || "");
      setAccountCreated(user.accountCreated || false);
      // setOnboardingUrl(user.onboardingUrl || "");
      // setStripeProfile(user.stripeProfile || "");
      // setOnBoardingComplete(user.onBoardingComplete || false);

      setEmail(user.uEmail);

      if (
        typeof user.organizationLogo === "string" &&
        user.organizationLogo.startsWith("http")
      ) {
        setLogoPreview(user.organizationLogo);
      } else {
        if (
          user.organizationLogo instanceof Blob ||
          user.organizationLogo instanceof File
        ) {
          setLogoPreview(URL.createObjectURL(user.organizationLogo));
        }
      }
    }
  }, [userData]);

  // useEffect(() => {
  //   setIsLoading(true);

  //   // async function dashboardLink() {
  //   //   if (accountId && accountId !== "" && onBoardingComplete) {
  //   //     try {
  //   //       const dashboardLinkRes = await axios.post("/api/create-login-link", {
  //   //         accountId,
  //   //       });

  //   //       const { dashboardUrl, accountComplete } = dashboardLinkRes.data;

  //   //       if (accountComplete) {
  //   //         setStripeAccountComplete(true);

  //   //         stripeProfileUrl = dashboardUrl;
  //   //         setStripeProfile(stripeProfileUrl);
  //   //         setIsLoading(false);
  //   //         await updateOneUserField(userId, "onBoardingComplete", true);

  //   //         fetchOneUser(userId, setUserData);
  //   //       } else {
  //   //         setStripeAccountComplete(false);

  //   //         await updateOneUserField(userId, "onBoardingComplete", false);
  //   //         fetchOneUser(userId, setUserData);
  //   //         setTriggerLinkGeneration(!triggerLinkGeneration);
  //   //       }
  //   //     } catch (error) {
  //   //       console.error(
  //   //         "Error creating dashboard link:",
  //   //         error.response ? error.response.data : error.message
  //   //       );
  //   //     }
  //   //   } else if (accountId && accountId !== "" && !onBoardingComplete) {
  //   //     try {
  //   //       const accountLinkRes = await axios.post("/api/create-account-link", {
  //   //         accountId,
  //   //         locale,
  //   //       });
  //   //       OnboardingUrl = accountLinkRes.data.url;
  //   //       setOnboardingUrl(OnboardingUrl);
  //   //       setIsLoading(false);

  //   //       try {
  //   //         if (profileComplete === "false") {
  //   //           await updateOneUserField(userId, "onBoardingComplete", false);
  //   //         }
  //   //         fetchOneUser(userId, setUserData);
  //   //       } catch (error) {}
  //   //     } catch (error) {
  //   //       console.error(
  //   //         "Error creating onboarding URL:",
  //   //         error.response ? error.response.data : error.message
  //   //       );
  //   //     }
  //   //   } else {
  //   //   }
  //   // }

  //   // if (accountId && accountId !== "") {
  //   //   dashboardLink();
  //   // }
  // }, [
  //   onBoardingComplete,
  //   accountId,
  //   userId,
  //   triggerLinkGeneration,
  //   // stripeAccountComplete,
  // ]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleCreateAccount = async (e) => {
    setIsLoadingAccount(true);

    e.preventDefault();
    let imageRefToDelete = organizationLogo;
    let newOrganizationLogo = organizationLogo;

    if (uploadLogo) {
      try {
        newOrganizationLogo = await uploadImageToStorage(
          uploadLogo,
          imageRefToDelete,
          "organization_images"
        );
      } catch (error) {
        toast.error("Error uploading image to storage ", error);
        return;
      }
    } else if (!logoPreview && organizationLogo) {
      try {
        await deleteObject(ref(getStorage(), organizationLogo));
        newOrganizationLogo = "";
      } catch (error) {
        if (error.code !== "storage/object-not-found") {
          toast.error("Error deleting existing image ", error);
          return;
        }
      }
    }

    try {
      const updatedUserData = {
        uEmail: email,
        uName: organizerName,
        organizationWebsite: organizationWebsite,
        organizationName: organizationName,
        organizationLogo: newOrganizationLogo,
        organizationType: organizationType,
        organizerPhoneNumber: organizerPhoneNumber,
        invoiceCountry: invoiceCountry,
        invoicePostalCode: invoicePostalCode,
        ibannumber:ibannumber,
        invoiceStreet: invoiceStreet,
        invoiceNumber: invoiceNumber,
        accountCreated: true,
      };

      const response = await updateOneCollection(
        userId,
        "user",
        "userId",
        updatedUserData
      );
      if (response == true) {
        toast.success("User Profile Updated!");
      } else if (response == false) {
        toast.error("Error updating user");
      }
      fetchOneUser(userId, setUserData);
      // setIsLoadingAccount(false);
      setTriggerLinkGeneration(!triggerLinkGeneration);
    } catch (error) {
      toast.error("Error updating User Data!");
    }

    setIsLoadingAccount(false);
  };

  const handleSubmit = async (e) => {
    setIsLoadingAccount(true);

    e.preventDefault();

    let imageRefToDelete = organizationLogo;
    let newOrganizationLogo = organizationLogo;

    if (uploadLogo) {
      try {
        newOrganizationLogo = await uploadImageToStorage(
          uploadLogo,
          imageRefToDelete
        );
      } catch (error) {
        toast.error("Error uploading image to storage ", error);
        return;
      }
    } else if (!logoPreview && organizationLogo) {
      try {
        await deleteObject(ref(getStorage(), organizationLogo));
        newOrganizationLogo = "";
      } catch (error) {
        if (error.code !== "storage/object-not-found") {
          toast.error("Error deleting existing image ", error);
          return;
        }
      }
    }

    try {
      const updatedUserData = {
        uEmail: email,
        uName: organizerName,
        organizationWebsite: organizationWebsite,
        organizationName: organizationName,
        organizationLogo: newOrganizationLogo,
        organizationType: organizationType,
        organizerPhoneNumber: organizerPhoneNumber,
        invoiceCountry: invoiceCountry,
        invoicePostalCode: invoicePostalCode,
        invoiceStreet: invoiceStreet,
        invoiceNumber: invoiceNumber,
        accountCreated: accountCreated,
        ibannumber:ibannumber,
      };

      const response = await updateOneCollection(
        userId,
        "user",
        "userId",
        updatedUserData
      );
      if (response == true) {
        toast.success("User Profile Updated!");
      } else if (response == false) {
        toast.error("Error updating user");
      }
      fetchOneUser(userId, setUserData);
      setTriggerLinkGeneration(!triggerLinkGeneration);
    } catch (error) {
      toast.error("Error updating User Data!");
    }
    setIsLoadingAccount(false);
  };

  const handleCrop = (croppedImage) => {
    setUploadLogo(croppedImage);
    setLogoPreview(URL.createObjectURL(croppedImage));
    setCropperKey(Date.now());
    setImageRef(`profile_images/${croppedImage.name}`);
  };

  const handleDeleteImage = () => {
    setLogoPreview("");
    setCropperKey(Date.now());
  };

  const handleClosePopup = () => {
    setLogoPreview("");
    setCropperKey(Date.now());
  };

  return (
    <Transition4 className="w-full h-full flex flex-col gap-7 p-3 md:p-0">
      <h2 className="text-3xl font-oswald mb-5">{t("organization")}</h2>
      <form
        onSubmit={(e) => {
          accountCreated ? handleSubmit(e) : handleCreateAccount(e);
        }}
        className="w-full flex flex-col md:flex-row md:gap-8 pb-10"
      >
        {/* organization */}
        <div className="md:w-2/5 flex flex-col md:gap-8">
          <div className="md:border-2 border-zinc-300 md:rounded-lg md:p-6 w-full gap-10 pb-10 space-y-4">
            <h2 className="text-2xl font-oswald text-tg-orange2 mb-8">
              {t("organization_details")}
            </h2>
            <div>
              <label htmlFor="organizationName" className="form-label">
                {t("organization_name")}
                <br />
              </label>
              <input
                type="text"
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="form-control"
              />
            </div>
            <div>
              <label htmlFor="organizationWebsite" className="form-label">
                {t("organization_website")}
              </label>
              <input
                type="text"
                id="organizationWebsite"
                value={organizationWebsite}
                onChange={(e) => setOrganizationWebsite(e.target.value)}
                className="form-control"
              />
            </div>
            <div>
              <label htmlFor="organizationLogo" className="form-label">
                {t("organization_logo")}
              </label>
              <div className="h-44 w-44 md:w-52 md:h-52 border border-gray-300 rounded-lg overflow-hidden relative group">
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="Event"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex md:hidden md:group-hover:flex justify-center items-center">
                      <button
                        onClick={handleDeleteImage}
                        className="bg-zinc-800 bg-opacity-75 text-white rounded-full p-3 text-xl"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </>
                ) : (
                  <ImageCropper
                    key={cropperKey}
                    onCrop={handleCrop}
                    onClose={handleClosePopup}
                    aspectRatio={1 / 1}
                  />
                )}
              </div>
            </div>
          </div>
          {/* organizer */}
          <div className="md:border-2 border-zinc-300 md:rounded-lg md:p-6 w-full gap-10 pb-10 space-y-4">
            <h2 className="text-2xl font-oswald text-tg-orange2 mb-8">
              {t("organizer_details")}
            </h2>
            <div>
              <label htmlFor="organizerName" className="form-label">
                {t("organizer_name")}
              </label>
              <input
                type="text"
                id="organizerName"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="organizerPhoneNumber" className="form-label">
                {t("organizer_phone_number")}
              </label>
              <input
                type="tel"
                id="organizerPhoneNumber"
                value={organizerPhoneNumber}
                onChange={(e) => setOrganizerPhoneNumber(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* billing details */}
        <div className="md:w-3/5 w-full flex flex-col md:gap-8">
          <div>
            <div className="md:border-2 border-zinc-300 md:rounded-lg md:p-6 w-full gap-10 pb-10 space-y-4">
              <h2 className="text-2xl font-oswald text-tg-orange2 mb-8">
                {t("billing_details")}
              </h2>
              
              {/* <div>
                <label htmlFor="accountId" className="form-label">
                  Stripe - Connect Account ID:
                </label>
                <div className="mb-2 py-3 px-4 border-2 border-black border-opacity-20 w-full rounded-lg outline-none">
                  {accountId !== "" ? accountId : "No Stripe Account Yet"}
                </div>
              </div> */}
               <div>
                <label htmlFor="orgnizeribanaccount" className="form-label">
                  {t("orgnizerIbnaccount")}
                </label>
                <input
                  type="text"
                  id="orgnizeribanaccount"
                  placeholder={t("ibannumber")}
                  value={ibannumber}
                  onChange={(e) => setIbannumber(e.target.value)}
                  className="form-control"
                  required={true}
                  // disabled={accountCreated}
                />
              </div>
              <div>
              </div>
           
              <div>
                <label htmlFor="organizerType" className="form-label">
                  {t("organization_type")}
                </label>
                <select
                  id="organizerType"
                  value={organizationType}
                  onChange={(e) => setOrganizerType(e.target.value)}
                  className="form-control"
                  required={true}
                 // disabled={accountCreated}
                >
                  <option value="" disabled>
                    {t("select_type")}
                  </option>
                  <option value="individual">{t("individual")}</option>
                  <option value="company">{t("company")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="invoiceCity" className="form-label">
                  {t("country")}
                </label>
                <p className="text-xs text-orange-800 mb-2">
                  {t("iso_country_code_info")}
                </p>
                <input
                  type="text"
                  id="invoiceCountry"
                  placeholder={t("country_code")}
                  value={invoiceCountry}
                  onChange={(e) => setInvoiceCountry(e.target.value)}
                  className="form-control"
                  required={true}
                 // disabled={accountCreated}
                />
              </div>
              <div>
                
                <label htmlFor="invoicePostalCode" className="form-label">
                  {t("postal_code")}
                </label>
                <input
                  type="text"
                  id="invoicePostalCode"
                  value={invoicePostalCode}
                  onChange={(e) => setInvoicePostalCode(e.target.value)}
                  className="form-control"
                 // disabled={accountCreated}
                />
              </div>
              <div>
                <label htmlFor="invoiceStreet" className="form-label">
                  {t("address")}
                </label>
                <input
                  type="text"
                  id="invoiceAddress"
                  value={invoiceStreet}
                  onChange={(e) => setInvoiceStreet(e.target.value)}
                  className="form-control"
                  required={true}
                 // disabled={accountCreated}
                />
              </div>
              <div>
                <label htmlFor="invoiceNumber" className="form-label">
                  {t("number")}
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="form-control"
                  required={true}
                 // disabled={accountCreated}
                />
              </div>
            </div>
          </div>
          <ButtonWithLoading
              isLoading={isLoadingAccount}
              isLoadingText={
                accountCreated
                  ? `${t("save_changes")}...`
                  : `${t("submit")}...`
              }
              isDisabled={isLoadingAccount}
              buttonText={
                accountCreated
                  ? t("save_changes")
                  : t("submit")
              }
              className="form-button h-max w-max mb-2"
            />
          {/* <div className="flex flex-col ">
            <div className="hidden md:block">
              {accountCreated ? (
                <div className=" flex flex-col gap-5 mb-7">
                  {onBoardingComplete ? (
                    <Link
                      href={stripeProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-5 w-max bg-purple-400 rounded-lg text-white text-md hover:bg-purple-500 transition-all inline-flex items-center gap-2"
                      aria-disabled={isLoading}
                    >
                      {isLoading ? (
                        t("loading")
                      ) : (
                        <>
                          <FaStripeS /> {t("manage_on_stripe")}
                        </>
                      )}
                    </Link>
                  ) : (
                    <div>
                      <Link
                        href={OnboardingUrl}
                        className="py-3 px-5 w-max bg-purple-400 rounded-lg text-white text-md hover:bg-purple-500 transition-all inline-flex items-center gap-2"
                        aria-disabled={isLoading}
                      >
                        {isLoading ? (
                          t("loading")
                        ) : (
                          <>
                            <FaStripeS /> {t("setup_stripe_connected_account")}
                          </>
                        )}
                      </Link>
                      <p className="text-xs text-orange-800 mb-2 mt-2">
                        {t("complete_onboarding_info")}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
            <ButtonWithLoading
              isLoading={isLoadingAccount}
              isLoadingText={
                accountCreated
                  ? `${t("save_changes")}...`
                  : `${t("create_connected_stripe_account")}...`
              }
              isDisabled={isLoadingAccount}
              buttonText={
                accountCreated
                  ? t("save_changes")
                  : t("create_connected_stripe_account")
              }
              className="form-button h-max w-max mb-2"
            />
          </div> */}
        </div>
      </form>
    </Transition4>
  );
};

export default Profile;

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import Loading from "../loading";
import LoadingSpinner from "../components/LoadingSpinner";

const LoadScriptContext = createContext();

export const LoadScriptProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const value = {
    isLoaded,
    setIsLoaded,
  };

  return (
    <LoadScriptContext.Provider value={value}>
      {children}
    </LoadScriptContext.Provider>
  );
};

export const useLoadScript = () => useContext(LoadScriptContext);

export const libraries = ["places"];

export const LoadScriptWrapper = ({ children }) => {
  const { isLoaded, setIsLoaded } = useLoadScript();

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(false);
    }
  }, [isLoaded, setIsLoaded]);

  if (isLoaded) {
    return children;
  }
  const Loading = (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={Loading}
    >
      {children}
    </LoadScript>
  );
};

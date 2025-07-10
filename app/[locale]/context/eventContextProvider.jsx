"use client";
import { createContext, useContext, useState } from "react";

const EIdContext = createContext();

export const EIdProvider = ({ children }) => {
  const [eId, setEId] = useState(null);

  return (
    <EIdContext.Provider value={{ eId, setEId }}>
      {children}
    </EIdContext.Provider>
  );
};

export const useEId = () => {
  const context = useContext(EIdContext);
  if (!context) {
    throw new Error("useEId must be used within an EIdProvider");
  }
  return context;
};

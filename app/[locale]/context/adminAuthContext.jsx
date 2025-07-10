"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (
      storedAdmin &&
      storedAdmin.email === adminEmail &&
      storedAdmin.password === adminPassword
    ) {
      setAdmin(storedAdmin);
    }
    setLoading(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

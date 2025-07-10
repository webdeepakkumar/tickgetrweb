"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useAdminAuth } from "@/app/[locale]/context/adminAuthContext";
import LoadingSpinner from "./LoadingSpinner";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, loading, router]);

  if (loading || !admin) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-zinc-800">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;

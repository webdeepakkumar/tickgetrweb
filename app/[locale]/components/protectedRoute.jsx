"use client";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      router.refresh();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

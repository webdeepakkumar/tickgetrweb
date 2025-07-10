"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import Header from "@/app/[locale]/components/adminHeader";
import Sidebar from "@/app/[locale]/components/adminSidebar";
import AdminProtectedRoute from "@/app/[locale]/components/AdminProtectedRoute";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function AdminDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminProtectedRoute>
      <div className={poppins.className}>
        <div className="h-screen w-full flex flex-1 overflow-hidden">
          <div>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
          <div className="w-full h-full bg-zinc-800 md:px-8 pt-8 md:pb-8 pb-4 px-4 flex flex-col gap-7">
            <Header />
            <div className="h-full w-full overflow-y-auto no-scrollbar">
              <button
                className="z-10 absolute flex flex-col gap-1 top-[48px] text-3xl left-1 lg:hidden mb-4 py-1 md:pl-8 pl-4"
                onClick={() => {
                  setIsSidebarOpen(true);
                }}
              >
                <div className="h-[2px] w-[25px] bg-white rounded-full"></div>
                <div className="h-[2px] w-[20px] bg-white rounded-full"></div>
                <div className="h-[2px] w-[25px] bg-white rounded-full"></div>
              </button>
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

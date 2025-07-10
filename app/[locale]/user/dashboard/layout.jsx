"use client";
import { Poppins } from "next/font/google";
import { useState } from "react";
import Header from "@/app/[locale]/components/dashHeader";
import Sidebar from "@/app/[locale]/components/dashSidebar";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function EventDashboardLayout({ children, params: { locale } }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { eId } = useEId();

  return (
    <div className={poppins.className}>
      <div className="h-screen w-full flex flex-1 overflow-hidden">
        <div>
          <Sidebar
            eId={eId}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            params={locale}
          />
        </div>
        <div className="w-full h-full bg-zinc-100 md:px-8 lg:pt-8 md:pt-5 pt-3 md:pb-8 pb-4 px-4 flex flex-col md:gap-5 gap-3">
          <Header title="Overview" />
          <div className="h-full w-full overflow-y-auto no-scrollbar">
            <button
              className="z-10 absolute flex flex-col gap-1 md:top-[35px] top-[30px] text-3xl left-1 lg:hidden mb-4 py-1 md:pl-8 pl-4"
              onClick={() => {
                setIsSidebarOpen(true);
              }}
            >
              <div className="h-[2px] w-[25px] bg-zinc-800 rounded-full"></div>
              <div className="h-[2px] w-[20px] bg-zinc-800 rounded-full"></div>
              <div className="h-[2px] w-[25px] bg-zinc-800 rounded-full"></div>
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Poppins } from "next/font/google";
import UserHeader from "@/app/[locale]/components/userHeader";
import UserSidebar from "@/app/[locale]/components/userSidebar";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../../context/authContext";
import { fetchOneUser } from "@/app/(Api)/firebase/firebase_firestore";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function UserDashbaordLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState([]);
  const { user } = useAuth();
  console.log('user--',user.uid);
  useEffect(() => {
    if (user.uid) {
      fetchOneUser(user.uid, (response) => {
        setUserData(response);
      });
    }
  }, [userId]);

  if (userData && userData[0]?.isBlocked) {
    return (
      <div className={poppins.className}>
        <div className="relative w-full">
          <button 
            className="text-white px-5 py-3 bg-black hover:bg-black hover:text-white transition-all ease-linear rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30"
          >
            Sorry, You don't have any access. Please contact with admin.
          </button>
          <div className="h-screen lg:w-full flex flex-col">
            <UserHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={`w-full flex flex-1 overflow-hidden blur-sm pointer-events-none` }>
              <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex-1 bg-zinc-100 md:p-10 p-4 overflow-y-auto">
                No Access
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={poppins.className}>
      <div className="h-screen lg:w-full flex flex-col">
        <UserHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="w-full flex flex-1 overflow-hidden">
          <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1 bg-zinc-100 md:p-10 p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

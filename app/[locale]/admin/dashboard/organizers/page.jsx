"use client";

import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import dynamic from "next/dynamic";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { MdOutlineDesktopAccessDisabled, MdOutlineDesktopWindows } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import star from "@/public/images/star.ico";
import { getAuth } from "firebase/auth";
import { useTranslations } from "next-intl";

// ✅ Dynamically imported components (to avoid SSR issues)
const Tooltip = dynamic(() => import("@/app/[locale]/components/tooltip"), { ssr: false });
const UserDetails = dynamic(() => import("@/app/[locale]/components/userDetailsPopup"), { ssr: false });
const DetailsPopup = dynamic(() => import("@/app/[locale]/components/detailsPopup"), { ssr: false });

// Normal imports
import { getTotalOrgRev } from "@/app/(Api)/firebase/firebase_firestore";
import {
  fetchEvents,
  fetchUsers,
  fetchBuyersForEvent,
  blockOrganization,
} from "@/app/(Api)/firebase/firebase_firestore";
import CounterFormat from "@/app/[locale]/components/counterFormat";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";


const AdminOrganizers = () => {
  const t = useTranslations("admin");
  const th = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);
  const [usersArray, setUsersArray] = useState([]);
  const [eventsArray, setEventsArray] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(usersArray);
  const [userEventCounts, setUserEventCounts] = useState({});
  const [userRevenues, setUserRevenues] = useState({});
  const [calculatingRevenues, setCalculatingRevenues] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataIndex, setDataIndex] = useState();
  const [userId, setUserId] = useState();
  const [userDetailsPopup, setUserDetailsPopup] = useState(false);

  const user = getAuth();
  const userid = user.userId;

  useEffect(() => {
    fetchUsers(setUsersArray);
    fetchEvents(setEventsArray);
  }, []);

  useEffect(() => {
    // Initialize calculatingRevenues state for all users to true
    const initialCalculatingRevenues = usersArray.reduce((acc, user) => {
      acc[user.userId] = true;
      return acc;
    }, {});
    setCalculatingRevenues(initialCalculatingRevenues);

    // Fetch users and events
    setLoading(true);
    setError(null);
    fetchUsers(setUsersArray)
      .then(() => fetchEvents(setEventsArray))
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false);
        setDataLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredUsers(usersArray);
    countEventsForUsers(usersArray, eventsArray);
    calculateRevenuesForUsers(usersArray, eventsArray);
  }, [usersArray, eventsArray]);

  const countEventsForUsers = (users, events) => {
    const counts = users.reduce((acc, user) => {
      acc[user.userId] = events.filter(
        (event) => event.userId === user.userId
      ).length;
      return acc;
    }, {});
    setUserEventCounts(counts);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    // Check if the query is a number or text
    if (!isNaN(query) && query.trim() !== "") {
      filterUsersByAmount(query);
    } else {
      filterUsersByName(query);
    }
  };
  const filterUsersByName = (query) => {
    const filtered = usersArray.filter(
      (user) =>
        user.uName && user.uName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  
  const filterUsersByAmount = (query) => {
    const filtered = usersArray.filter((user) => {
      const revenue = userRevenues[user.userId]; 
      return revenue && revenue.toString().includes(query);
    });
    setFilteredUsers(filtered);
  };
  const resetFilters = () => {
    setSearchQuery("");
    setFilteredUsers(usersArray);
  };

  const calculateRevenuesForUsers = async (users) => {
    setCalculatingRevenues(
      users.reduce((acc, user) => ({ ...acc, [user.userId]: true }), {})
    );

    const revenues = await Promise.all(
      users.map(async (user) => {
        try {
          const totalRev = await getTotalOrgRev(user.userId);
          console.log(`Fetched revenue for user ${user.userId}:`, totalRev);
          return {
            userId: user.userId,
            totalRevenue: parseFloat(totalRev).toFixed(2),
          };
        } catch (error) {
          console.error(
            `Error fetching revenue for user ${user.userId}:`,
            error
          );
          return { userId: user.userId, totalRevenue: "0.00" };
        }
      })
    );

    // Convert array to object for easy access
    const revenuesObject = revenues.reduce((acc, user) => {
      acc[user.userId] = user.totalRevenue;
      return acc;
    }, {});

    setUserRevenues(revenuesObject);
    setCalculatingRevenues(
      users.reduce((acc, user) => ({ ...acc, [user.userId]: false }), {})
    );
  };

  const users = filteredUsers[dataIndex];
  const Recent_FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
  const currentDate = new Date();

  const userDetails = users
    ? [
        {
          label: t("adminDashboard.organizers.userId"),
          value:
            users?.userId.length > 16 ? (
              <Tooltip position="bottom" content={users?.userId}>
                {users?.userId.substring(0, 16) + "..."}
              </Tooltip>
            ) : (
              users?.userId
            ),
        },
        {
          label: t("adminDashboard.organizers.userName"),
          value: (
            <>
              {users?.uName.length > 12 ? (
                <Tooltip position="top" content={users?.uName}>
                  {users?.uName.substring(0, 12) + "..."}
                </Tooltip>
              ) : (
                users?.uName
              )}
            </>
          ),
        },
        {
          label: t("adminDashboard.organizers.userEmail"),
          value:
            users?.uEmail.length > 20 ? (
              <Tooltip position="top" content={users?.uEmail}>
                {users?.uEmail.substring(0, 12) + "..."}
              </Tooltip>
            ) : (
              users?.uEmail
            ),
        },
        {
          label: t("adminDashboard.organizers.noOfEvents"),
          value: userEventCounts[users.userId] || 0,
        },
        {
          label: t("adminDashboard.organizers.totalRevenue"),
          value: calculatingRevenues[users?.userId] ? (
            "Calculating..."
          ) : userRevenues?.[users?.userId] !== undefined ? (
            <span>
              € <CounterFormat value={userRevenues[users?.userId].toFixed(2)} />
            </span>
          ) : (
            0
          ),
        },
      ]
    : [];

  if (dataLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const blockUser = async (index) => {
    const event = filteredUsers[index];
    const blockedStatus = !event.isBlocked;
    await blockOrganization(event.userId, blockedStatus);
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user, idx) =>
        idx === index ? { ...user, isBlocked: blockedStatus } : user
      )
    );
  };
  const userdetails = async (index) => {
    const userevent = filteredUsers[index];
    setUserId(userevent.userId);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="py-3 w-72 pl-10 pr-4 bg-zinc-700 text-zinc-300 rounded-xl relative">
        <IoSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
        <input
          className="outline-none bg-transparent w-full placeholder:text-zinc-400"
          type="text"
          placeholder={t("adminDashboard.organizers.searchPlaceholderText")}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="flex justify-center items-center w-full h-full bg-zinc-900 rounded-xl text-white">
        <div className="bg-zinc-900 w-full h-full flex justify-center rounded-xl md:p-6 p-4 overflow-y-auto overflow-x-hidden no-scrollbar">
          <table className="border-collapse w-full h-max text-left text-xs">
            <thead>
              <tr className="text-zinc-300 border-b  border-zinc-700 uppercase">
              <th className=" font-medium">
      
                </th>
                <th className="lg:table-cell hidden pb-4 font-medium">
                  {t("adminDashboard.organizers.userId")}
                </th>
                <th className=" pb-4 font-medium">
                  {t("adminDashboard.organizers.name")}
                </th>
                <th className="md:table-cell hidden pb-4 font-medium">
                  {t("adminDashboard.organizers.email")}
                </th>
                <th className="lg:table-cell hidden pb-4 font-medium">
                  {t("adminDashboard.organizers.noOfEvents")}
                </th>
                <th className="pb-4 font-medium">
                  {t("adminDashboard.organizers.totalRevenue")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                    <td className=" pt-5 font-medium">
                    {user?.createdAt &&
                    (user.createdAt.toDate
                      ? user.createdAt.toDate()
                      : new Date(user.createdAt)) >=
                      new Date(currentDate - Recent_FIVE_DAYS) ? (
                      <Image
                        src={star}
                        alt="New User"
                        width={18}
                        height={18}
                      />
                    ) : null}
                  </td>
                  <td className="lg:table-cell hidden pt-5 font-medium">
                    {user.userId}
                  </td>
                  <td className="pt-5 font-medium">
                    {user.uName.length > 12 ? (
                      <Tooltip position="top" content={user.uName}>
                        {user.uName.substring(0, 12) + "..."}
                      </Tooltip>
                    ) : (
                      user.uName
                    )}
                   
                  </td>
                  <td className="md:table-cell hidden pt-5 font-medium">
                    {user.uEmail.length > 18 ? (
                      <Tooltip position="top" content={user.uEmail}>
                        {user.uEmail.substring(0, 18) + "..."}
                      </Tooltip>
                    ) : (
                      user.uEmail
                    )}
                  </td>
                  <td className=" hidden pt-5 font-medium lg:table-cell">
                    {userEventCounts[user.userId] || 0}
                  </td>
                  <td className="pt-5 font-medium">
                    {calculatingRevenues[user?.userId] ? (
                      t("adminDashboard.organizers.calculating")
                    ) : userRevenues?.[user?.userId] !== undefined ? (
                      <span>
                        €{" "}
                        <CounterFormat
                          value={Number(userRevenues[user?.userId]).toFixed(2)}
                        />
                      </span>
                    ) : (
                      "€ 0.00"
                    )}
                  </td>
                  <td className="md:table-cell hidden relative pt-5">
                    <Dropdown>
                      <DropdownTrigger className="outline-none md:hidden">
                        <button className="text-zinc-400">
                          <BsThreeDotsVertical />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Event options"
                        disallowEmptySelection
                        selectionMode="single"
                      >
                        <DropdownItem
                          key="toggle-visibility"
                          onClick={() => {
                            setDataIndex(`${index}`);
                            setShowUserDetailsPopup(true);
                          }}
                          className="lg:hidden"
                        >
                          <div className="inline-flex w-full items-center gap-2">
                            <AiFillInfoCircle />
                            {t("adminDashboard.organizers.userDetails")}
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                  <td className="md:table-cell hidden pt-5 font-medium">
                    <div
                      className={`inline-flex gap-2 mr-3 lg:mr-0  border-2 border-opacity-20 w-16 justify-center items-center h-8 px-2 rounded-lg transition text-xs ${
                        !user.isBlocked
                          ? "text-emerald-500 border-emerald-500 bg-transparent"
                          : "text-red-600 border-red-600 bg-transparent"
                      }`}
                    >
                      {!user.isBlocked ? "Active" : "Blocked"}
                    </div>
                  </td>
                  <td>
                    <Dropdown className="min-w-0">
                      <DropdownTrigger className="outline-none">
                        <button className="text-zinc-400">
                          <BsThreeDotsVertical />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Event options"
                        disallowEmptySelection
                        selectionMode="single"
                      >
                        <DropdownItem
                          key="toggle-status"
                          startContent={
                            user.isBlocked ? (
                              <MdOutlineDesktopWindows />
                            ) : (
                              <MdOutlineDesktopAccessDisabled />
                            )
                          }
                          onPress={() => blockUser(index, filteredUsers)}
                          className="hover:!bg-zinc-100 !bg-white"
                        >
                          {user.isBlocked
                            ? t("adminDashboard.events.enabled")
                            : t("adminDashboard.events.disabled")}
                        </DropdownItem>
                        <DropdownItem
                          key="user-details"
                          startContent={<FaRegUser />}
                          onPress={() => {
                            setUserDetailsPopup(true);
                            userdetails(index, filteredUsers);
                          }}
                          className="hover:!bg-zinc-100 !bg-white"
                        >
                          {th("adminDashboard.events.userDetails")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/**/}
        {showUserDetailsPopup && (
          <DetailsPopup
            title={t("adminDashboard.organizers.userDetails")}
            details={userDetails}
            className="text-tg-orange text-center mb-4"
            onClose={() => setShowUserDetailsPopup(false)}
            color="text-black"
          />
        )}
        {userDetailsPopup && (
          <UserDetails
            title={th("adminDashboard.events.userDetails")}
            userId={userId}
            className="text-tg-orange text-center mb-4"
            onClose={() => setUserDetailsPopup(false)}
            color="text-black"
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrganizers;

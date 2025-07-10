"use client";
import { useEffect, useState } from "react";
import { fetchEvents } from "@/app/(Api)/firebase/firebase_firestore";
import { format } from "date-fns";
import { IoSearch } from "react-icons/io5";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Events = () => {
  const t = useTranslations("events");

  const [loading, setLoading] = useState(true);
  const [sortByDate, setSortByDate] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventInfo, setEventInfosArray] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents((events) => {
      const currentDate = new Date();
      const activeEvents = events.filter(
        (event) =>
          event.eEnd.toDate() > currentDate &&
          event.adminAuth &&
          event.isVisible
      );
      const sortedEvents = activeEvents.sort((a, b) => b.eStart - a.eStart);
      setEventInfosArray(sortedEvents);
      setFilteredEvents(sortedEvents);
      setLoading(false);
    });
  }, []);

  const sortEventsByDate = () => {
    const newSortOrder = sortByDate === "asc" ? "desc" : "asc";
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const timestampA = a.eStart;
      const timestampB = b.eStart;
      return newSortOrder === "asc"
        ? timestampA - timestampB
        : timestampB - timestampA;
    });
    setSortByDate(newSortOrder);
    setFilteredEvents(sortedEvents);
  };

  const filterEventsByName = (query) => {
    const filtered = eventInfo.filter((event) =>
      event.eName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterEventsByName(query);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[120px] md:pt-[140px] px-5 xl:container mx-auto pb-40">
      <div className="w-full flex flex-col gap-5 md:flex-row md:justify-between md:items-end md:mb-14 mb-10">
        <h2 className="text-3xl lg:text-4xl font-oswald">{t("allEvents")}</h2>
        <div className="flex flex-col-reverse md:flex-row gap-5">
          <button
            className="border-tg-orange2 border-2 text-tg-orange2 font-medium rounded-xl py-3 pl-4 pr-3 inline-flex items-center gap-1 w-max text-sm self-end"
            onClick={sortEventsByDate}
          >
            {t("sortByDate")}
            <div className="text-xl">
              {sortByDate === "asc" ? (
                <IoMdArrowDropup />
              ) : (
                <IoMdArrowDropdown />
              )}
            </div>
          </button>
          <div className="py-3 md:w-72 pl-10 pr-4 bg-zinc-200 rounded-xl relative w-full inline-flex items-center">
            <IoSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
            <input
              className="outline-none bg-transparent w-full placeholder:text-zinc-500"
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex-1 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className="w-full grid gap-10 md:gap-6 2xl:grid-col-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
          style={{ gridAutoRows: "minmax(300px, auto)" }}
        >
          {filteredEvents.map((event, index) => (
            <Link key={index} href={`/events/${event.eName}`}>
              <div className="h-full rounded-lg bg-white shadow-md overflow-hidden hover:scale-[1.05] transition-all group">
                <div
                  className="h-[170px] md:h-[180px] overflow-hidden bg-black"
                  style={{
                    backgroundImage: `url('${event.eBanner}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="p-4 pt-7 h-full flex flex-col gap-2 relative">
                  <div className="absolute -top-10 left-6 bg-white shadow-md text-orange-600 flex flex-col items-center justify-center w-14 h-14 rounded-lg overflow-hidden">
                    <div className="text-2xl font-semibold leading-none w-max">
                      {event.eStart != null
                        ? format(event.eStart.toDate(), t("date.day"))
                        : t("null")}
                    </div>
                    <div className="font-medium uppercase text-xs leading-none">
                      {event.eStart != null
                        ? format(event.eStart.toDate(), t("date.month"))
                        : t("null")}
                    </div>
                  </div>
                  <p className="font-semibold text-neutral-800">
                    {event.eName}
                  </p>
                  <div className="flex flex-col text-zinc-400 text-xs gap-1 font-medium">
                    <div>
                      {event.eStart != null
                        ? format(event.eStart.toDate(), t("date.time"))
                        : t("null")}
                      <span className="mx-1">{t("to")}</span>
                      {event.eEnd != null
                        ? format(event.eEnd.toDate(), t("date.time"))
                        : t("null")}
                    </div>
                    <div>{event.eCity}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;

"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { format, isAfter } from "date-fns";
import { FaFileDownload } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/app/(Api)/firebase/firebase_firestore";
import toast from "react-hot-toast";
import { useEventsData } from "@/app/[locale]/hooks/useEventData";

const Tooltip = dynamic(() => import("@/app/[locale]/components/tooltip"), { ssr: false });
const DetailsPopup = dynamic(() => import("@/app/[locale]/components/detailsPopup"), { ssr: false });
const LottieAnimation = dynamic(() => import("@/app/[locale]/animations/loadingarforocuments"), { ssr: false });

export const dynamic = "force-dynamic";

const EventsPage = () => {
  const t = useTranslations("adminEvents");
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { events, loading } = useEventsData();

  const handleDetails = (event) => {
    setSelectedEvent(event);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedEvent(null);
  };

  const handleEdit = (event) => {
    const searchParams = new URLSearchParams({
      event: event.id,
      user: event.userId,
    });
    router.push(`/admin/dashboard/events/editEvent?${searchParams}`);
  };

  const handleDelete = async (eventId) => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };

  return (
    <div className="w-full min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {loading ? (
        <LottieAnimation />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-zinc-800 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>{t("date")}: {format(event.date.toDate(), "dd MMM yyyy")}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => handleDetails(event)} title="Details">
                  <MdOutlineRemoveRedEye size={20} />
                </button>
                <button onClick={() => handleEdit(event)} title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(event.id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {popupOpen && selectedEvent && (
        <DetailsPopup
          title={selectedEvent.name}
          details={[
            { label: t("location"), value: selectedEvent.location },
            { label: t("organizer"), value: selectedEvent.organizer },
          ]}
          onClose={handleClosePopup}
          eventId={selectedEvent.id}
          eventExpiry={isAfter(new Date(), selectedEvent.date.toDate())}
        />
      )}
    </div>
  );
};

export default EventsPage; 

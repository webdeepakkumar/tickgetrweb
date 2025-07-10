"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAuthorizedEvents } from "@/app/(Api)/firebase/firebase_firestore";
import EditEventComponent from "@/app/[locale]/components/editEventComponent";
import { useEId } from "@/app/[locale]/context/eventContextProvider";
import { useAuth } from "@/app/[locale]/context/authContext";
import { useRouter } from "@/i18n/routing";

const EditEvent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const { setEId } = useEId();
  const [userId, setUserId] = useState();
  const [eventData, setEventData] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user && user == null) {
      router.replace("/");
    } else {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const checkAndFetchEvents = async () => {
      if (userId && eventId) {
        const isAuthorized = await fetchAuthorizedEvents(
          userId,
          eventId,
          setEventData
        );
        if (!isAuthorized) {
          router.replace("/user/my-events");
        }
      }
    };

    checkAndFetchEvents();
  }, [userId, eventId]);

  useEffect(() => {
    if (eventId) {
      setEId(eventId);
    } else {
      setEId(null);
    }
  }, [eventId]);

  return (
    <EditEventComponent
      eventId={eventId}
      userId={userId}
      bgColor=""
      btnColor="form-button"
      formLabel="form-label"
      formControl="form-control"
      formControl2="form-control-2"
      formTextArea="form-textarea"
      textColor="text-zinc-600"
      divider="w-full my-10 border border-zinc-200"
    />
  );
};

export default EditEvent;

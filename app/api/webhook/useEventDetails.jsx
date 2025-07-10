import { useState, useEffect } from "react";
import { fetchAuthorizedEvents } from "@/app/(Api)/firebase/firebase_firestore";

const useEventDetails = (userId, eventId) => {
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    if (eventId && userId) {
      fetchAuthorizedEvents(userId, eventId, (data) => {
        if (data && data.length > 0) {
          setEventDetails(data[0]);
        }
      });
    }
  }, [userId, eventId]);

  return { eventDetails };
};

export default useEventDetails;

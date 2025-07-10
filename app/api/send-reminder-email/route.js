import { app } from "@/app/(Api)/firebase/firebase";
import { NextResponse } from "next/server";
import {
  fetchBuyers,
  fetchEvents,
  fetchOneUser,
} from "@/app/(Api)/firebase/firebase_firestore";

const formatDate = (date) => {
  if (!date) return "";
  let formattedDate;

  if (date && typeof date.toDate === "function") {
    formattedDate = date.toDate();
  } else if (date instanceof Date) {
    formattedDate = date;
  } else { 
    formattedDate = new Date(date);
  }
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = formattedDate.toLocaleString("default", { month: "long" });
  const year = formattedDate.getFullYear();
  let hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
};

const isTomorrow = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

let setEventData = [];
let setFetchUsers = [];
let setBuyersArray = [];

await fetchEvents((events) => {
  setEventData = events;
});

let eventsTomorrow = setEventData.filter((event) => {
  const eventDate = event.eStart.toDate
    ? event.eStart.toDate()
    : new Date(event.eStart);
  return isTomorrow(eventDate);
});

export async function POST() {
  try {
    for (const event of eventsTomorrow) {
      await fetchOneUser(event.userId, (user) => {
        setFetchUsers = user;
      });
      await fetchBuyers(event.userId, event.eId, (buyers) => {
        setBuyersArray = buyers;
      });

      for (const buyer of setBuyersArray) {
        if (!buyer.isRefunded) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/send-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: buyer.bEmail,
                bName: buyer.bName,
                eventName: event.eName,
                eStart: formatDate(event.eStart),
                location: event.eAddress,
                eDescription: event.eDescription,
                uEmail: setFetchUsers[0]?.uEmail,

                tUID: process.env.NEXT_PUBLIC_MAILTRAP_REMINDER_TID,
              }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(`Email sent successfully to ${buyer.bEmail}`);
          } else {
            console.error("Error sending email:", data.error);
          }
        }
      }
    }
    return NextResponse.json(
      { message: "Emails processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Error sending emails", details: error.message },
      { status: 500 }
    );
  }
}

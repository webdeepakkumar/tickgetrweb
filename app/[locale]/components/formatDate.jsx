import React from "react";

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

export default formatDate;

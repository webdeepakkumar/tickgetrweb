"use client";
import { useState, useRef, useEffect } from "react";
import PopupDefault from "./PopupDefault";
import { useTranslations } from "next-intl";


const ReportsPopup = ({ onClose, title, details, description, color, eventId, eventExpiry }) => {
  const t = useTranslations("evendocuments");
  return (
    <PopupDefault onClose={onClose} title={title} description={description}>
      <table className="w-full text-sm">
        <tbody>
          {details.map(({ label, value, extra }, idx) => (
            <tr key={idx} className="flex justify-between items-center py-2 border-b">
              <th className="text-zinc-500 font-medium">{label}</th>
              <td className={color}>
                {value} {extra}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </PopupDefault>
  );
};

export default ReportsPopup;

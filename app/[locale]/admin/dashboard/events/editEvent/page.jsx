"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// ✅ dynamic import to prevent SSR
const EditEventComponent = dynamic(() => import('@/app/[locale]/components/editEventComponent'), { ssr: false });

const EditEventAdmin = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");
  const userId = searchParams.get("user");

  return (
    <EditEventComponent
      eventId={eventId}
      userId={userId}
      bgColor="bg-zinc-900 text-black"
      btnColor="admin-form-button"
      formLabel="admin-form-label"
      formControl="admin-form-control"
      formControl2="admin-form-control-2"
      formTextArea="admin-form-textarea"
      textColor="text-zinc-300"
      divider="w-full my-10 border border-zinc-600"
      dropdownColor="bg-zinc-800 hover:!bg-zinc-800 !text-white hover:!text-white transition"
    />
  );
};

export default EditEventAdmin;

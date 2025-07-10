"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { TiArrowSortedDown } from "react-icons/ti";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useTransition } from "react";

const LanguageDropDown = ({ className }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localeActive = useLocale();

  const [selectedLanguage, setSelectedLanguage] = useState(localeActive);
  const availableLanguages = ["en", "nl"];

  const handleLanguageChange = (selectedKey) => {
    setSelectedLanguage(selectedKey);

    const nextLocale = selectedKey.toString();
    const url = new URL(window.location.href);
    const pathname = url.pathname.replace(`/${localeActive}`, `/${nextLocale}`);
    const searchParams = url.search;

    startTransition(() => {
      router.replace(`${pathname}${searchParams}`);
    });
  };

  return (
    <Dropdown className="min-w-0 w-fit">
      <DropdownTrigger>
        <button className={className} disabled={isPending}>
          <TiArrowSortedDown /> {selectedLanguage.toUpperCase()}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedLanguage]}
        onSelectionChange={(keys) => handleLanguageChange(Array.from(keys)[0])}
        className="w-max absolute mt-14 bg-white text-black rounded-md shadow-lg text-center overflow-hidden"
      >
        {availableLanguages.map((language) => (
          <DropdownItem
            key={language}
            textValue={language}
            className={`w-full p-2 hover:!bg-zinc-200 !bg-white transition font-medium`}
          >
            {language.toUpperCase()}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropDown;

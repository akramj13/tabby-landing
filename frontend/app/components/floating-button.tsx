"use client";

import { useEffect, useState } from "react";
import { AppleIcon } from "./icons";
import { DownloadButton } from "./download-button";

const floatingActionClass =
  "tabby-button tabby-button-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-base font-semibold tracking-tight sm:h-14 sm:px-7";

const bmcClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-line bg-[#FFDD00] px-4 text-sm font-semibold tracking-tight text-[#000000] shadow-[0_3px_0_var(--line)] transition-colors hover:bg-[#FFDD00]/85 sm:h-11 sm:px-5 sm:text-base";

export const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="tabby-float-cta-enter fixed bottom-4 right-3 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <DownloadButton className={floatingActionClass}>
        <AppleIcon className="h-5 w-5" />
        Download for Mac
      </DownloadButton>
      <a
        href="https://buymeacoffee.com/tabbyapp"
        target="_blank"
        rel="noopener noreferrer"
        className={bmcClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 884 1279"
          fill="none"
          className="h-4 w-4 sm:h-4.5 sm:w-4.5"
        >
          <path
            d="m791 298-1-1c-7-12-17-22-28-29-12-7-25-11-39-11H160c-14 0-27 4-39 11-11 7-21 17-28 29l-1 1-1 2c-7 13-10 27-10 42v3c3 113 28 223 72 325 37 85 90 163 157 229 25 25 52 48 82 67v131H196c-27 0-48 22-48 48 0 27 22 48 48 48h491c27 0 48-22 48-48 0-27-22-48-48-48H491v-131c29-19 57-42 82-67 67-67 120-144 157-229 44-102 69-212 72-325v-3c0-15-4-29-11-42z"
            fill="#000"
          />
          <path
            d="M791 298-1 2c-7 13-10 27-10 42v3c3 113 28 223 72 325 37 85 90 163 157 229 25 25 52 48 82 67v131H196c-27 0-48 22-48 48 0 27 22 48 48 48h491c27 0 48-22 48-48 0-27-22-48-48-48H491v-131c29-19 57-42 82-67 67-67 120-144 157-229 44-102 69-212 72-325v-3c0-15-4-29-11-42"
            fill="#000"
          />
        </svg>
        Buy us a coffee
      </a>
    </div>
  );
};

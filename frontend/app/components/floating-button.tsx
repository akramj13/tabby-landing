"use client";

import { useEffect, useState } from "react";
import { AppleIcon } from "./icons";
import { DownloadButton } from "./download-button";

const floatingActionClass =
  "tabby-button tabby-button-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold tracking-tight sm:h-14 sm:px-7";

const bmcClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-line bg-[#FFDD00] px-4 text-sm font-bold tracking-tight text-[#000000] shadow-[0_5px_0_var(--line)] transition-colors hover:bg-[#FFDD00]/85 sm:h-11 sm:px-5 sm:text-base";

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
      <a
        href="https://buymeacoffee.com/tabbyapp"
        target="_blank"
        rel="noopener noreferrer"
        className={bmcClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000"
          className="h-4 w-4 sm:h-4.5 sm:w-4.5"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        Buy us a coffee
      </a>
      <DownloadButton className={floatingActionClass}>
        <AppleIcon className="h-5 w-5" />
        Download for Mac
      </DownloadButton>
    </div>
  );
};

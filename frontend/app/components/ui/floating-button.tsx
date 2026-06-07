"use client";

import { useEffect, useState } from "react";
import { DownloadButton } from "@/app/components/ui/download-button";
import { AppleIcon } from "@/app/components/ui/icons";
import { SupportButton } from "@/app/components/ui/support-button";

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
      <SupportButton size="xs" />
      <DownloadButton size="sm" icon={<AppleIcon className="h-5 w-5" />}>
        Download for Mac
      </DownloadButton>
    </div>
  );
};

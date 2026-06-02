import Link from "next/link";

export function AnnouncementBanner() {
  return (
    <div
      style={{ color: "#ffffff" }}
      className="fixed inset-x-0 top-0 z-[60] flex h-12 items-center justify-center bg-[var(--button-blue)] px-4 text-sm font-medium tracking-tight sm:text-base"
    >
      <span className="truncate">
        v0.4.2-beta released on June 2, 2026. Send feedback at{" "}
        <Link
          href="/feedback"
          style={{
            color: "#ffffff",
            textDecorationLine: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          cotabby.app/feedback
        </Link>
      </span>
    </div>
  );
}

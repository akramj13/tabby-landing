import Image from "next/image";

const POSITION_CLASS =
  "pointer-events-none absolute left-1/2 top-0 z-0 w-24 -translate-x-1/2 -translate-y-[78%] sm:w-28 lg:w-36";

/**
 * Decorative cat ears that peek over a positioned panel.
 */
export function PeekingCatMascot({ className }: { className?: string }) {
  return (
    <div className={`${POSITION_CLASS} ${className ?? ""}`} aria-hidden="true">
      <div className="tabby-ears-peek w-full">
        <Image
          src="/app-icons/ears.webp"
          alt=""
          aria-hidden="true"
          width={637}
          height={234}
          sizes="(min-width: 1024px) 9rem, (min-width: 640px) 7rem, 6rem"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

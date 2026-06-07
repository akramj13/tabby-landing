import Image from "next/image";

// A static tabby foreleg reaching from the left edge toward a section heading.
// Its parent must be positioned and must not clip overflow.
const POSITION_CLASS =
  "pointer-events-none absolute left-0 top-[58%] z-10 hidden w-[17rem] -translate-y-1/2 sm:block md:w-[20rem] lg:w-[27rem]";

export function BattingPawMascot() {
  return (
    <div className={POSITION_CLASS} aria-hidden="true">
      <Image
        src="/app-icons/arm.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        sizes="(min-width: 1024px) 27rem, (min-width: 768px) 20rem, 17rem"
        className="h-auto w-full"
      />
    </div>
  );
}

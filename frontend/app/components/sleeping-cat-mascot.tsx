import Image from "next/image";

const POSITION_CLASS =
  "pointer-events-none absolute bottom-0 right-4 z-20 w-40 translate-y-[54%] sm:right-10 sm:w-60 sm:translate-y-[55%] lg:right-16 lg:w-[24rem] lg:translate-y-[55%]";

export function SleepingCatMascot() {
  return (
    <div className={POSITION_CLASS} aria-hidden="true">
      <div className="tabby-cat-breathe w-full">
        <Image
          src="/app-icons/cat-sleep.webp"
          alt=""
          aria-hidden="true"
          width={768}
          height={683}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 15rem, 10rem"
          className="h-auto w-full"
        />
      </div>
      <span
        aria-hidden="true"
        className="tabby-cat-z absolute right-[24%] top-[12%] select-none font-display text-sm font-bold italic text-ink/60 sm:text-lg lg:text-2xl"
      >
        z
      </span>
      <span
        aria-hidden="true"
        className="tabby-cat-z tabby-cat-z-delay absolute right-[18%] top-[14%] select-none font-display text-[0.7rem] font-bold italic text-ink/50 sm:text-base lg:text-xl"
      >
        z
      </span>
    </div>
  );
}

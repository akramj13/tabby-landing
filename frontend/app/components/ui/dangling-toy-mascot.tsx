import Image from "next/image";

// A static mouse-on-a-string toy hanging from a card's top-right edge.
// Hidden on narrow screens where it would cover the card's content.
const POSITION_CLASS =
  "pointer-events-none absolute right-4 top-0 z-20 hidden w-10 sm:block lg:right-6 lg:w-12";

export function DanglingToyMascot() {
  return (
    <div className={POSITION_CLASS} aria-hidden="true">
      <Image
        src="/app-icons/toy.webp"
        alt=""
        aria-hidden="true"
        width={198}
        height={1536}
        sizes="(min-width: 1024px) 3rem, 2.5rem"
        className="h-auto w-full"
      />
    </div>
  );
}

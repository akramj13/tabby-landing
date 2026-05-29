import Image from "next/image";

type CotabbyLogoChipProps = {
  label: string;
  iconSrc: string;
  className?: string;
};

export function CotabbyLogoChip({
  label,
  iconSrc,
  className,
}: CotabbyLogoChipProps) {
  return (
    <div
      className={`tabby-chip inline-flex h-15 min-w-45 shrink-0 items-center gap-3 rounded-2xl px-4 text-sm font-semibold tracking-tight text-ink sm:min-w-52.5 sm:text-base ${
        className ?? ""
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border-2 border-line bg-white">
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          width={48}
          height={48}
          sizes="24px"
          className="h-6 w-6 object-contain"
        />
      </div>
      <span className="text-muted">{label}</span>
    </div>
  );
}

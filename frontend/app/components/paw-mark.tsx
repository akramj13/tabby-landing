type PawMarkProps = {
  className?: string;
};

export function PawMark({ className }: PawMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="50" cy="70" rx="23" ry="18" />
      <ellipse cx="20" cy="46" rx="9.5" ry="12.5" />
      <ellipse cx="39" cy="30" rx="9.5" ry="13.5" />
      <ellipse cx="61" cy="30" rx="9.5" ry="13.5" />
      <ellipse cx="80" cy="46" rx="9.5" ry="12.5" />
    </svg>
  );
}

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "blue" | "secondary" | "primary" | "white";
type Size = "icon" | "xs" | "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  blue: "tabby-button tabby-button-blue",
  secondary: "tabby-button tabby-button-secondary",
  primary: "tabby-button tabby-button-primary",
  white: "tabby-button bg-white text-ink hover:bg-white/85",
};

const SIZE: Record<Size, string> = {
  icon: "h-12 w-12 rounded-xl text-base",
  xs: "h-10 sm:h-11 gap-1.5 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm",
  sm: "h-12 sm:h-14 gap-2 rounded-2xl px-6 sm:px-7 text-sm sm:text-base",
  md: "h-14 sm:h-16 gap-3 rounded-2xl px-7 text-[1.05rem] sm:text-[1.2rem]",
  lg: "h-14 sm:h-16 gap-3 rounded-2xl px-8 text-[1.15rem] sm:text-[1.4rem]",
};

const WIDTH_AUTO: Record<Size, string> = {
  icon: "",
  xs: "w-full sm:w-auto",
  sm: "w-full sm:w-auto sm:min-w-[200px]",
  md: "w-full sm:w-auto sm:min-w-[270px]",
  lg: "w-full sm:w-auto sm:min-w-[260px] lg:min-w-[320px]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  shimmer?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & {
  href: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

type ButtonProps = Common & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type TabbyButtonProps = LinkProps | ButtonProps;

function buildClass(
  variant: Variant,
  size: Size,
  fullWidth: boolean,
  shimmer: boolean,
  extra?: string,
) {
  return [
    "inline-flex items-center justify-center font-bold tracking-tight",
    VARIANT[variant],
    SIZE[size],
    fullWidth ? "w-full" : WIDTH_AUTO[size],
    shimmer ? "tabby-button-shimmer" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function TabbyButton(props: TabbyButtonProps) {
  const {
    variant = "blue",
    size = "md",
    icon,
    iconRight,
    fullWidth = false,
    shimmer = false,
    className,
    children,
  } = props;

  const cls = buildClass(variant, size, fullWidth, shimmer, className);
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const {
      href,
      external,
      variant: _v,
      size: _s,
      icon: _i,
      iconRight: _ir,
      fullWidth: _fw,
      shimmer: _sh,
      className: _cn,
      children: _c,
      ...rest
    } = props;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          {...rest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconRight: _ir,
    fullWidth: _fw,
    shimmer: _sh,
    className: _cn,
    children: _c,
    type = "button",
    ...rest
  } = props as ButtonProps;
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}

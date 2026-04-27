export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <circle cx="8" cy="8" r="7" fill="#1d1d1f" />
      <circle cx="8" cy="8" r="2.6" fill="#a8431d" />
    </svg>
  );
}

export function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mark = size === "lg" ? "h-3.5 w-3.5" : size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  const text =
    size === "lg" ? "text-[20px]" : size === "sm" ? "text-[12px]" : "text-[14px]";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={mark} />
      <span className={`font-semibold tracking-tight text-ink ${text}`}>BuyEOD</span>
    </span>
  );
}

import Image from "next/image";

const BADGE_SRC = "/master-badge.png";
const BADGE_W = 327;
const BADGE_H = 250;

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src={BADGE_SRC}
      alt="EOD Master Badge"
      width={BADGE_W}
      height={BADGE_H}
      priority
      className={className}
    />
  );
}

export function Logo({
  className = "",
  size = "md",
  showWordmark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}) {
  const markH =
    size === "xl"
      ? "h-20"
      : size === "lg"
        ? "h-12"
        : size === "sm"
          ? "h-6"
          : "h-8";
  const text =
    size === "xl"
      ? "text-[32px]"
      : size === "lg"
        ? "text-[20px]"
        : size === "sm"
          ? "text-[12px]"
          : "text-[15px]";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`${markH} w-auto`} />
      {showWordmark && (
        <span className={`font-semibold tracking-tight text-ink ${text}`}>
          BuyEOD
        </span>
      )}
    </span>
  );
}

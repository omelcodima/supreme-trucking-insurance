import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  return (
    <Link href={href} className="flex items-center">
      <img
        src="/logo.svg"
        alt="Supreme Trucking Insurance"
        className={compact ? "h-[96px] w-auto object-contain" : "h-[116px] w-auto object-contain"}
      />
    </Link>
  );
}

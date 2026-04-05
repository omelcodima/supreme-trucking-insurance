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
        className={compact ? "h-[82px] w-auto object-contain" : "h-[104px] w-auto object-contain"}
      />
    </Link>
  );
}

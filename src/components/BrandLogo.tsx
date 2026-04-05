import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const width = compact ? 520 : 620;
  const height = compact ? 120 : 140;

  return (
    <Link href={href} className="flex items-center">
      <Image
        src="/logo.png"
        alt="Supreme Trucking Insurance"
        width={width}
        height={height}
        priority
        className={compact ? "h-auto w-auto max-h-[96px] object-contain" : "h-auto w-auto max-h-[110px] object-contain"}
      />
    </Link>
  );
}

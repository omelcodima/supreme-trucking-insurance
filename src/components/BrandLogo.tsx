import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const width = compact ? 500 : 580;
  const height = compact ? 118 : 136;

  return (
    <Link href={href} className="flex items-center">
      <Image
        src="/logo.webp"
        alt="Supreme Trucking Insurance"
        width={width}
        height={height}
        priority
        className={compact ? "h-auto w-auto max-h-[94px] object-contain" : "h-auto w-auto max-h-[108px] object-contain"}
      />
    </Link>
  );
}

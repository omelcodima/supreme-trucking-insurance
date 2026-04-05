import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const width = compact ? 320 : 380;
  const height = compact ? 72 : 86;

  return (
    <Link href={href} className="flex items-center">
      <Image
        src="/logo.png"
        alt="Supreme Trucking Insurance"
        width={width}
        height={height}
        priority
        className={compact ? "h-auto w-auto max-h-[64px] object-contain" : "h-auto w-auto max-h-[78px] object-contain"}
      />
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const width = compact ? 320 : 360;
  const height = compact ? 72 : 82;

  return (
    <Link href={href} className="flex items-center">
      <Image
        src="/logo.jpg"
        alt="Supreme Trucking Insurance"
        width={width}
        height={height}
        priority
        className="h-auto w-auto max-h-[72px] object-contain"
      />
    </Link>
  );
}

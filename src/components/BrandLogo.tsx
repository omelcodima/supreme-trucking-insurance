import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const boxClass = compact ? "brand-mark brand-mark-compact" : "brand-mark";

  return (
    <Link href={href} className="brand-link" aria-label="Supreme Trucking Insurance home">
      <div className={boxClass}>
        <Image
          src="/logo-compact.svg"
          alt="Supreme Trucking Insurance"
          fill
          priority={compact}
          className="object-contain object-left"
          sizes="240px"
        />
      </div>
    </Link>
  );
}

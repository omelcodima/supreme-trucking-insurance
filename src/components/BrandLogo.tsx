import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const boxClass = compact
    ? "relative h-[74px] w-[220px] overflow-hidden sm:h-[86px] sm:w-[280px] lg:h-[104px] lg:w-[430px]"
    : "relative h-[90px] w-[260px] overflow-hidden sm:h-[104px] sm:w-[360px] lg:h-[118px] lg:w-[500px]";
  const imageClass = compact ? "object-contain object-left -mt-[6px] sm:-mt-[8px]" : "object-contain object-left -mt-[8px] sm:-mt-[10px]";

  return (
    <Link href={href} className="flex items-center">
      <div className={boxClass}>
        <Image
          src="/logo.svg"
          alt="Supreme Trucking Insurance"
          fill
          priority
          className={imageClass}
          sizes={compact ? "430px" : "500px"}
        />
      </div>
    </Link>
  );
}

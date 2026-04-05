import Image from "next/image";
import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const boxClass = compact ? "relative h-[104px] w-[430px] overflow-hidden" : "relative h-[118px] w-[500px] overflow-hidden";
  const imageClass = compact ? "object-contain object-left -mt-[8px]" : "object-contain object-left -mt-[10px]";

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

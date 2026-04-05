import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const boxClass = compact ? "h-[104px] w-[430px] overflow-hidden" : "h-[118px] w-[500px] overflow-hidden";
  const imgClass = compact ? "h-[150px] w-auto object-contain -mt-[8px]" : "h-[170px] w-auto object-contain -mt-[10px]";

  return (
    <Link href={href} className="flex items-center">
      <div className={boxClass}>
        <img
          src="/logo.svg"
          alt="Supreme Trucking Insurance"
          className={imgClass}
        />
      </div>
    </Link>
  );
}

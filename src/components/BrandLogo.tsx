import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const icon = (
    <svg
      width={compact ? 42 : 52}
      height={compact ? 42 : 52}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M32 3L10 11.5V28.5C10 42.2 19.3 54.2 32 58C44.7 54.2 54 42.2 54 28.5V11.5L32 3Z"
        fill="#0f2044"
      />
      <path
        d="M32 8L14.5 14.8V28C14.5 39.1 21.9 48.4 32 51.6C42.1 48.4 49.5 39.1 49.5 28V14.8L32 8Z"
        stroke="#f97316"
        strokeWidth="2.5"
      />
      <path
        d="M37.5 17C32.8 17 28.8 19.1 26.8 22.6C24.9 25.8 25.1 29 28.6 31.4L34.5 35.4C36.3 36.6 36.2 38.5 35.2 40C34.2 41.4 32.4 42.3 30.2 42.3C27.2 42.3 24.6 40.9 22.8 38.7"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 18.4C33.6 23.9 32.4 29.7 31.9 45"
        stroke="#f97316"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );

  const text = compact ? (
    <div className="flex flex-col leading-[0.95]">
      <span className="text-[#f97316] font-black text-lg tracking-[0.22em]">SUPREME</span>
      <span className="text-white text-[10px] font-semibold tracking-[0.32em]">TRUCKING INSURANCE</span>
    </div>
  ) : (
    <div className="flex flex-col leading-[0.95]">
      <span className="text-[#f97316] font-black text-xl tracking-[0.24em]">SUPREME</span>
      <span className="text-white text-[11px] font-semibold tracking-[0.34em]">TRUCKING INSURANCE</span>
    </div>
  );

  return (
    <Link href={href} className="flex items-center gap-3">
      {icon}
      {text}
    </Link>
  );
}

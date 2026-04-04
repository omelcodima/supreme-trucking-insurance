import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

function Mark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M36 4L12 13.5V31.5C12 46.6 22.2 59.5 36 63.5C49.8 59.5 60 46.6 60 31.5V13.5L36 4Z"
        fill="#0f2044"
      />
      <path
        d="M36 9L16.5 16.8V31C16.5 43.2 24.8 53.5 36 57C47.2 53.5 55.5 43.2 55.5 31V16.8L36 9Z"
        stroke="#f97316"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M44 17C36.7 17 31.1 20.3 28.1 25.2C25.6 29.3 25.9 33.2 31 36.5L38 41C40.3 42.5 40.2 44.8 38.9 46.9C37.4 49.1 34.8 50.5 31.6 50.5C27.4 50.5 23.8 48.6 21.3 45.6"
        stroke="white"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.5 18.2C38.4 25.1 36.8 32 36.1 53"
        stroke="#f97316"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Mark size={compact ? 60 : 66} />
      <div className="flex flex-col leading-[0.9]">
        <span className={`text-[#f97316] font-black ${compact ? 'text-[24px]' : 'text-[28px]'} tracking-[0.14em]`}>
          SUPREME
        </span>
        <span className={`text-white ${compact ? 'text-[11px]' : 'text-[12px]'} font-semibold tracking-[0.30em]`}>
          TRUCKING INSURANCE
        </span>
      </div>
    </Link>
  );
}

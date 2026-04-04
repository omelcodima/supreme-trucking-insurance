import Link from "next/link";

type Props = {
  compact?: boolean;
  href?: string;
};

export default function BrandLogo({ compact = false, href = "/" }: Props) {
  const iconSize = compact ? 54 : 64;
  const titleSize = compact ? "text-xl" : "text-2xl";
  const subtitleSize = compact ? "text-[10px]" : "text-xs";

  return (
    <Link href={href} className="flex items-center gap-3">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
      >
        <path
          d="M36 4L12 13.5V31.5C12 46.4 22 59.1 36 63C50 59.1 60 46.4 60 31.5V13.5L36 4Z"
          fill="#0f2044"
        />
        <path
          d="M36 9L16.8 16.7V31C16.8 43.1 24.9 53.1 36 56.6C47.1 53.1 55.2 43.1 55.2 31V16.7L36 9Z"
          stroke="#f97316"
          strokeWidth="3.6"
          strokeLinejoin="round"
        />
        <path
          d="M43.5 18C38 18 33.5 20.7 31 24.8C28.8 28.4 29.1 31.8 33.2 34.6L39.2 38.7C41.3 40.1 41.2 42.2 40 44.1C38.8 45.9 36.6 47.1 33.8 47.1C30.2 47.1 27.1 45.5 24.9 42.8"
          stroke="white"
          strokeWidth="5.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M41.5 18.7C38.8 24.8 37.4 31.1 36.8 50.4"
          stroke="#f97316"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col leading-[0.92]">
        <span className={`text-[#f97316] font-black ${titleSize} tracking-[0.18em]`}>
          SUPREME
        </span>
        <span className={`text-white ${subtitleSize} font-semibold tracking-[0.28em]`}>
          TRUCKING INSURANCE
        </span>
      </div>
    </Link>
  );
}

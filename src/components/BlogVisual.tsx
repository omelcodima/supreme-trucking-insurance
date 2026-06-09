type BlogVisualProps = {
  title: string;
  category: string;
  sourceName?: string;
  variant?: "hero" | "card";
};

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";
}

function getTheme(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("safety") || normalized.includes("fmcsa")) {
    return {
      label: "FMCSA WATCH",
      accent: "from-orange-500 via-amber-400 to-stone-200",
      plate: "bg-orange-500",
    };
  }

  if (normalized.includes("cargo")) {
    return {
      label: "CARGO NOTE",
      accent: "from-sky-500 via-orange-400 to-stone-200",
      plate: "bg-sky-700",
    };
  }

  if (normalized.includes("fleet")) {
    return {
      label: "FLEET BRIEF",
      accent: "from-stone-700 via-orange-500 to-amber-200",
      plate: "bg-stone-800",
    };
  }

  return {
    label: "TRUCKING NEWS",
    accent: "from-[#2F261C] via-[#f97316] to-[#F4D7A1]",
    plate: "bg-[#2F261C]",
  };
}

export function BlogVisual({ title, category, sourceName, variant = "card" }: BlogVisualProps) {
  const theme = getTheme(category);
  const isHero = variant === "hero";

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[1.35rem] border border-white/40 bg-[#2F261C] shadow-[0_24px_70px_rgba(47,38,28,0.22)] ${
        isHero ? "min-h-[310px] md:min-h-[390px]" : "min-h-[210px]"
      }`}
      aria-label={`Editorial visual for ${title}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} opacity-95`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.55),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(115deg,rgba(47,38,28,0.05),rgba(47,38,28,0.55))]" />
      <div className="absolute -left-12 bottom-9 h-28 w-[120%] rotate-[-6deg] rounded-full bg-[#2F261C]/80 shadow-2xl" />
      <div className="absolute -left-10 bottom-16 h-2 w-[115%] rotate-[-6deg] bg-white/25" />
      <div className="absolute -left-10 bottom-7 h-2 w-[115%] rotate-[-6deg] bg-white/15" />

      <div className="absolute bottom-20 left-[12%] h-16 w-44 rounded-xl bg-[#FFF7EA] shadow-[0_18px_35px_rgba(0,0,0,0.22)] md:h-20 md:w-56">
        <div className="absolute -left-8 bottom-0 h-12 w-16 rounded-l-full bg-[#FFF7EA]" />
        <div className="absolute right-5 top-4 h-8 w-12 rounded-md bg-sky-200/80" />
        <div className="absolute bottom-[-10px] left-8 h-8 w-8 rounded-full border-[6px] border-[#2F261C] bg-stone-500" />
        <div className="absolute bottom-[-10px] right-8 h-8 w-8 rounded-full border-[6px] border-[#2F261C] bg-stone-500" />
      </div>

      <div className="absolute right-5 top-5 grid h-20 w-20 place-items-center rounded-2xl border border-white/45 bg-white/20 text-xl font-black text-white shadow-lg backdrop-blur md:right-7 md:top-7 md:h-24 md:w-24 md:text-2xl">
        {getInitials(category)}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
        <div>
          <span className="inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
            {theme.label}
          </span>
        </div>

        <div className="max-w-[82%] pt-24 md:pt-32">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
            Supreme Trucking Insurance
          </p>
          <h3 className={`${isHero ? "mt-3 text-3xl md:text-5xl" : "mt-2 text-xl"} max-w-3xl font-black leading-tight text-white drop-shadow-sm`}>
            {title}
          </h3>
          {sourceName ? (
            <p className="mt-3 max-w-xl text-xs font-bold uppercase tracking-[0.12em] text-white/70">
              Source-informed original brief
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

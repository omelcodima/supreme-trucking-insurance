type BlogVisualProps = {
  title: string;
  category: string;
  sourceName?: string;
  imageAltText?: string;
  variant?: "hero" | "card";
};

function getVisual(category: string, title: string) {
  const normalized = category.toLowerCase();
  const normalizedTitle = title.toLowerCase();

  const isFmcsaOrCompliance =
    normalized.includes("fmcsa") ||
    normalizedTitle.includes("fmcsa") ||
    normalizedTitle.includes("dot") ||
    normalizedTitle.includes("qualification") ||
    normalizedTitle.includes("exemption") ||
    normalizedTitle.includes("safety") ||
    normalizedTitle.includes("compliance");

  if (isFmcsaOrCompliance) {
    return {
      image: "/images/hero-premium.jpg",
      label: "FMCSA / compliance",
      objectPosition: "34% center",
    };
  }

  if (normalized.includes("fleet")) {
    return {
      image: "/images/fleet-card-v2.jpg",
      label: "Fleet update",
      objectPosition: "center",
    };
  }

  if (normalized.includes("new authority") || normalized.includes("authority")) {
    return {
      image: "/images/new-authority-card-v2.jpg",
      label: "New authority",
      objectPosition: "center",
    };
  }

  const label = normalized.includes("cargo") || normalized.includes("reefer")
    ? "Cargo coverage"
    : normalized.includes("owner")
      ? "Owner-operator"
      : "Trucking news";

  return {
    image: "/images/hero-premium.jpg",
    label,
    objectPosition: "34% center",
  };
}

export function BlogVisual({
  title,
  category,
  sourceName,
  imageAltText,
  variant = "card",
}: BlogVisualProps) {
  const visual = getVisual(category, title);
  const isHero = variant === "hero";

  return (
    <div
      className={`group/visual relative isolate overflow-hidden rounded-[1.35rem] border border-white/70 bg-[#F7F3EC] shadow-[0_24px_70px_rgba(47,38,28,0.16)] ${
        isHero ? "min-h-[320px] md:min-h-[430px]" : "min-h-[230px]"
      }`}
      aria-label={imageAltText || `Editorial image for ${title}`}
    >
      <div
        className="absolute inset-0 scale-[1.01] bg-cover transition-transform duration-700 group-hover/visual:scale-[1.05]"
        style={{
          backgroundImage: `url(${visual.image})`,
          backgroundPosition: visual.objectPosition,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#1f160f]/62 via-[#1f160f]/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f160f]/42 via-transparent to-transparent" />
      <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#f97316] via-[#fbbf24] to-white/70" />
      <div
        className="absolute bottom-4 right-4 h-20 w-48 rounded-2xl bg-contain bg-center bg-no-repeat opacity-[0.22] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] md:h-24 md:w-56"
        style={{ backgroundImage: "url(/logo.svg)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full border border-white/65 bg-white/86 px-3.5 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#2F261C] shadow-lg backdrop-blur-md">
            {visual.label}
          </span>
          <span className="rounded-full bg-[#f97316] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white shadow-lg">
            Supreme
          </span>
        </div>

        <div className={`${isHero ? "max-w-3xl" : "max-w-[92%]"}`}>
          <p className="inline-flex rounded-full bg-[#f97316] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white shadow-lg">
            {sourceName ? "Original news brief" : "Insurance insight"}
          </p>
          {isHero ? (
            <h3 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] md:text-5xl">
              {title}
            </h3>
          ) : null}
        </div>
      </div>
    </div>
  );
}

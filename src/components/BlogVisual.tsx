import Image from "next/image";

type BlogVisualProps = {
  title: string;
  category: string;
  sourceName?: string;
  variant?: "hero" | "card";
};

function getVisual(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("cargo") || normalized.includes("reefer")) {
    return {
      image: "/images/cargo-card-v2.jpg",
      label: "Cargo coverage brief",
      accent: "from-sky-500 to-orange-500",
    };
  }

  if (normalized.includes("fleet")) {
    return {
      image: "/images/fleet-card-v2.jpg",
      label: "Fleet insurance update",
      accent: "from-stone-800 to-orange-500",
    };
  }

  if (normalized.includes("new authority") || normalized.includes("authority")) {
    return {
      image: "/images/new-authority-card-v2.jpg",
      label: "New authority watch",
      accent: "from-orange-600 to-amber-400",
    };
  }

  if (normalized.includes("owner")) {
    return {
      image: "/images/owner-operator-card-v2.jpg",
      label: "Owner-operator insight",
      accent: "from-orange-500 to-stone-800",
    };
  }

  return {
    image: "/images/highway-premium.jpg",
    label: "Trucking insurance news",
    accent: "from-[#f97316] to-[#2F261C]",
  };
}

export function BlogVisual({ title, category, sourceName, variant = "card" }: BlogVisualProps) {
  const visual = getVisual(category);
  const isHero = variant === "hero";

  return (
    <div
      className={`group/visual relative isolate overflow-hidden rounded-[1.35rem] border border-white/60 bg-[#2F261C] shadow-[0_24px_70px_rgba(47,38,28,0.18)] ${
        isHero ? "min-h-[320px] md:min-h-[430px]" : "min-h-[230px]"
      }`}
      aria-label={`Editorial image for ${title}`}
    >
      <Image
        src={visual.image}
        alt="Semi truck on highway for Supreme Trucking Insurance article"
        fill
        sizes={isHero ? "(min-width: 768px) 896px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        className="scale-[1.02] object-cover transition-transform duration-700 group-hover/visual:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f160f]/78 via-[#1f160f]/38 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1f160f]/72 via-transparent to-black/10" />
      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${visual.accent}`} />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full border border-white/45 bg-white/18 px-3.5 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
            {visual.label}
          </span>
          <span className="rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            Supreme
          </span>
        </div>

        <div className={`${isHero ? "max-w-3xl" : "max-w-[92%]"}`}>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">
            {sourceName ? "Source-informed original brief" : "Trucking insurance insight"}
          </p>
          <h3
            className={`mt-2 font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)] ${
              isHero ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}

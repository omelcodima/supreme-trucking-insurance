type BlogVisualProps = {
  title: string;
  category: string;
  sourceName?: string;
  imageAltText?: string;
  variant?: "hero" | "card";
};

type VisualOption = {
  image: string;
  label: string;
  objectPosition: string;
  tone: "amber" | "blue" | "copper" | "slate";
  flip?: boolean;
};

const complianceVisuals: VisualOption[] = [
  {
    image: "/images/highway-premium.jpg",
    label: "FMCSA / compliance",
    objectPosition: "center",
    tone: "blue",
  },
  {
    image: "/images/owner-operator-card-v2.jpg",
    label: "Driver qualification",
    objectPosition: "center",
    tone: "slate",
  },
  {
    image: "/images/fleet-card-v2.jpg",
    label: "Safety file review",
    objectPosition: "center",
    tone: "amber",
  },
  {
    image: "/images/owner-operator-premium.jpg",
    label: "Driver file check",
    objectPosition: "center",
    tone: "copper",
  },
];

const truckingNewsVisuals: VisualOption[] = [
  {
    image: "/images/highway-premium.jpg",
    label: "Trucking news",
    objectPosition: "center",
    tone: "blue",
  },
  {
    image: "/images/cargo-card-v2.jpg",
    label: "Freight market",
    objectPosition: "center",
    tone: "copper",
  },
  {
    image: "/images/fleet-card-v2.jpg",
    label: "Carrier update",
    objectPosition: "center",
    tone: "amber",
  },
  {
    image: "/images/hero-premium.jpg",
    label: "Road risk brief",
    objectPosition: "34% center",
    tone: "slate",
    flip: true,
  },
];

const categoryVisuals: Record<string, VisualOption[]> = {
  fleet: [
    {
      image: "/images/fleet-card-v2.jpg",
      label: "Fleet update",
      objectPosition: "center",
      tone: "amber",
    },
    {
      image: "/images/highway-premium.jpg",
      label: "Fleet operations",
      objectPosition: "center",
      tone: "blue",
    },
  ],
  cargo: [
    {
      image: "/images/cargo-card-v2.jpg",
      label: "Cargo coverage",
      objectPosition: "center",
      tone: "copper",
    },
    {
      image: "/images/hero-epic-american.png",
      label: "Load risk",
      objectPosition: "34% center",
      tone: "amber",
    },
  ],
  authority: [
    {
      image: "/images/new-authority-card-v2.jpg",
      label: "New authority",
      objectPosition: "center",
      tone: "amber",
    },
    {
      image: "/images/owner-operator-card-v2.jpg",
      label: "First truck file",
      objectPosition: "center",
      tone: "slate",
    },
  ],
  owner: [
    {
      image: "/images/owner-operator-card-v2.jpg",
      label: "Owner-operator",
      objectPosition: "center",
      tone: "slate",
    },
    {
      image: "/images/owner-operator-premium.jpg",
      label: "Solo trucker file",
      objectPosition: "center",
      tone: "blue",
    },
  ],
  pricing: [
    {
      image: "/images/owner-operator-premium.jpg",
      label: "Quote prep",
      objectPosition: "center",
      tone: "blue",
    },
    {
      image: "/images/highway-premium.jpg",
      label: "Premium drivers",
      objectPosition: "center",
      tone: "amber",
      flip: true,
    },
  ],
  requirements: [
    {
      image: "/images/highway-premium.jpg",
      label: "Coverage requirements",
      objectPosition: "center",
      tone: "blue",
    },
    {
      image: "/images/hero-epic-american.png",
      label: "Filing checklist",
      objectPosition: "34% center",
      tone: "copper",
    },
  ],
};

function titleHash(value: string) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 7);
}

function pickVisual(options: VisualOption[], title: string) {
  return options[titleHash(title) % options.length];
}

function getVisual(category: string, title: string, sourceName?: string) {
  const normalized = category.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  const combined = `${normalized} ${normalizedTitle}`;

  const isFmcsaOrCompliance =
    combined.includes("fmcsa") ||
    combined.includes("dot") ||
    combined.includes("qualification") ||
    combined.includes("exemption") ||
    combined.includes("safety") ||
    combined.includes("compliance") ||
    combined.includes("driver file") ||
    combined.includes("hearing") ||
    combined.includes("seizure");

  if (isFmcsaOrCompliance) {
    if (combined.includes("hearing") && combined.includes("renews") && combined.includes("carriers")) {
      return complianceVisuals[1];
    }

    if (combined.includes("hearing") && combined.includes("renews")) {
      return complianceVisuals[3];
    }

    if (combined.includes("hearing")) {
      return complianceVisuals[3];
    }

    if (combined.includes("seizure") && combined.includes("notice")) {
      return complianceVisuals[0];
    }

    if (combined.includes("seizure") && combined.includes("reviews")) {
      return complianceVisuals[2];
    }

    return pickVisual(complianceVisuals, title);
  }

  if (normalized.includes("fleet")) {
    return pickVisual(categoryVisuals.fleet, title);
  }

  if (normalized.includes("cargo") || normalized.includes("reefer")) {
    return pickVisual(categoryVisuals.cargo, title);
  }

  if (normalized.includes("new authority") || normalized.includes("authority")) {
    return pickVisual(categoryVisuals.authority, title);
  }

  if (normalized.includes("owner")) {
    return pickVisual(categoryVisuals.owner, title);
  }

  if (normalized.includes("pricing") || normalized.includes("cost") || normalizedTitle.includes("cost")) {
    return pickVisual(categoryVisuals.pricing, title);
  }

  if (normalized.includes("requirement") || normalizedTitle.includes("requirement")) {
    return pickVisual(categoryVisuals.requirements, title);
  }

  return pickVisual(sourceName ? truckingNewsVisuals : truckingNewsVisuals.slice(0, 3), title);
}

function getToneClasses(tone: VisualOption["tone"]) {
  switch (tone) {
    case "blue":
      return {
        overlay: "from-[#0f2633]/70 via-[#0f2633]/14 to-transparent",
        side: "from-[#102c3a]/46 via-transparent to-transparent",
        strip: "from-[#2563eb] via-[#f97316] to-white/70",
      };
    case "copper":
      return {
        overlay: "from-[#2c160d]/68 via-[#6b2c11]/14 to-transparent",
        side: "from-[#3b1d10]/46 via-transparent to-transparent",
        strip: "from-[#c2410c] via-[#f97316] to-white/70",
      };
    case "slate":
      return {
        overlay: "from-[#111827]/70 via-[#111827]/16 to-transparent",
        side: "from-[#111827]/42 via-transparent to-transparent",
        strip: "from-[#374151] via-[#f97316] to-white/70",
      };
    case "amber":
    default:
      return {
        overlay: "from-[#1f160f]/62 via-[#1f160f]/10 to-transparent",
        side: "from-[#1f160f]/42 via-transparent to-transparent",
        strip: "from-[#f97316] via-[#fbbf24] to-white/70",
      };
  }
}

export function BlogVisual({
  title,
  category,
  sourceName,
  imageAltText,
  variant = "card",
}: BlogVisualProps) {
  const visual = getVisual(category, title, sourceName);
  const toneClasses = getToneClasses(visual.tone);
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
          transform: visual.flip ? "scaleX(-1)" : undefined,
        }}
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${toneClasses.overlay}`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${toneClasses.side}`} />
      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${toneClasses.strip}`} />
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

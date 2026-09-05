type BlogVisualProps = {
  title: string;
  category: string;
  sourceName?: string;
  imageUrl?: string;
  imageAltText?: string;
  imageLabel?: string;
  imageCue?: string;
  variant?: "hero" | "card";
};

type VisualOption = {
  image: string;
  label: string;
  cue: string;
  objectPosition: string;
  tone: "amber" | "blue" | "copper" | "slate";
  flip?: boolean;
};

function visual(
  image: string,
  label: string,
  cue: string,
  tone: VisualOption["tone"],
  objectPosition = "center",
  flip = false,
): VisualOption {
  return { image, label, cue, tone, objectPosition, flip };
}

const visualLibrary = {
  fmcsaRoad: visual(
    "/images/highway-premium.jpg",
    "FMCSA / DOT notice",
    "Road safety and compliance update",
    "blue",
  ),
  driverFile: visual(
    "/images/new-authority-card-v2.jpg",
    "Driver qualification",
    "Medical, hearing, exemption paperwork",
    "slate",
  ),
  driverStanding: visual(
    "/images/owner-operator-card-v2.jpg",
    "Driver file review",
    "Owner-operator documents and eligibility",
    "slate",
  ),
  safetyFleet: visual(
    "/images/fleet-card-v2.jpg",
    "Safety review",
    "Inspections, carrier files, fleet exposure",
    "amber",
  ),
  cargoDock: visual(
    "/images/cargo-card-v2.jpg",
    "Cargo / freight",
    "Loaded trailers, warehouse risk, freight claims",
    "copper",
  ),
  fleetYard: visual(
    "/images/fleet-card-v2.jpg",
    "Fleet operations",
    "Multiple units, renewals, driver rosters",
    "amber",
  ),
  authorityPrep: visual(
    "/images/new-authority-card-v2.jpg",
    "New authority",
    "DOT setup, questions, first filings",
    "amber",
  ),
  ownerOperator: visual(
    "/images/owner-operator-card-v2.jpg",
    "Owner-operator",
    "Single-truck file and coverage checklist",
    "slate",
  ),
  quotePrep: visual(
    "/images/owner-operator-premium.jpg",
    "Quote prep",
    "Premium factors, truck value, underwriting file",
    "blue",
  ),
  roadRisk: visual(
    "/images/hero-premium.jpg",
    "Road risk brief",
    "Highway operations and insurance impact",
    "slate",
    "34% center",
    true,
  ),
  filingChecklist: visual(
    "/images/hero-epic-american.png",
    "Filing checklist",
    "DOT authority, filings, public notice context",
    "copper",
    "34% center",
  ),
};

const complianceVisuals: VisualOption[] = [
  visualLibrary.fmcsaRoad,
  visualLibrary.driverFile,
  visualLibrary.safetyFleet,
  visualLibrary.driverStanding,
  visualLibrary.filingChecklist,
];

const truckingNewsVisuals: VisualOption[] = [
  visualLibrary.roadRisk,
  visualLibrary.cargoDock,
  visualLibrary.fleetYard,
  visualLibrary.fmcsaRoad,
];

const categoryVisuals: Record<string, VisualOption[]> = {
  fleet: [visualLibrary.fleetYard, visualLibrary.safetyFleet, visualLibrary.fmcsaRoad],
  cargo: [visualLibrary.cargoDock, visualLibrary.roadRisk],
  authority: [visualLibrary.authorityPrep, visualLibrary.filingChecklist, visualLibrary.driverFile],
  owner: [visualLibrary.ownerOperator, visualLibrary.driverStanding, visualLibrary.quotePrep],
  pricing: [visualLibrary.quotePrep, visualLibrary.fmcsaRoad],
  requirements: [visualLibrary.filingChecklist, visualLibrary.fmcsaRoad],
};

const titleVisualRules: { terms: string[]; visuals: VisualOption[] }[] = [
  {
    terms: ["renews seizure-disorder driving exemptions"],
    visuals: [visualLibrary.driverFile],
  },
  {
    terms: ["grants driver exemptions for seizure disorders"],
    visuals: [visualLibrary.driverStanding],
  },
  {
    terms: ["seizure exemption notice"],
    visuals: [visualLibrary.safetyFleet],
  },
  {
    terms: ["reviews seizure exemption applications"],
    visuals: [visualLibrary.driverStanding],
  },
  {
    terms: ["renews hearing exemptions for interstate cmv drivers: what carriers"],
    visuals: [visualLibrary.driverFile],
  },
  {
    terms: ["renews hearing exemptions for interstate cmv drivers: what trucking companies"],
    visuals: [visualLibrary.driverStanding],
  },
  {
    terms: ["reviews hearing exemption applications"],
    visuals: [visualLibrary.filingChecklist],
  },
  {
    terms: ["requirements by state", "state requirement", "insurance requirement", "coverage requirement"],
    visuals: [visualLibrary.filingChecklist],
  },
  {
    terms: ["marking paperwork", "paperwork review", "omb review"],
    visuals: [visualLibrary.filingChecklist, visualLibrary.fmcsaRoad],
  },
  {
    terms: ["hearing", "deaf", "vision", "seizure", "medical", "exemption", "qualification"],
    visuals: [
      visualLibrary.driverFile,
      visualLibrary.driverStanding,
      visualLibrary.safetyFleet,
      visualLibrary.filingChecklist,
      visualLibrary.fmcsaRoad,
    ],
  },
  {
    terms: ["driver file", "driver qualification", "driver applicant", "cdl", "drug", "clearinghouse"],
    visuals: [visualLibrary.driverStanding, visualLibrary.driverFile, visualLibrary.safetyFleet],
  },
  {
    terms: ["cargo", "freight", "load", "warehouse", "reefer", "broker", "shipper", "theft"],
    visuals: [visualLibrary.cargoDock],
  },
  {
    terms: ["fleet", "multiple units", "renewal", "carrier update", "motor carrier", "unit schedule"],
    visuals: [visualLibrary.fleetYard, visualLibrary.safetyFleet],
  },
  {
    terms: ["inspection", "out of service", "safety", "crash", "violation", "audit", "safety rating"],
    visuals: [visualLibrary.safetyFleet, visualLibrary.fmcsaRoad],
  },
  {
    terms: ["new authority", "authority", "registration", "mc number", "dot number", "first truck", "startup"],
    visuals: [visualLibrary.authorityPrep, visualLibrary.filingChecklist],
  },
  {
    terms: ["filing", "bmc-91", "mcs-90", "public notice", "application", "permit"],
    visuals: [visualLibrary.filingChecklist, visualLibrary.authorityPrep],
  },
  {
    terms: ["cost", "price", "pricing", "rate", "premium", "quote", "underwriting", "loss runs"],
    visuals: [visualLibrary.quotePrep, visualLibrary.fmcsaRoad],
  },
  {
    terms: ["owner-operator", "owner operator", "leased", "bobtail", "non-trucking"],
    visuals: [visualLibrary.ownerOperator, visualLibrary.driverStanding],
  },
  {
    terms: ["fmcsa", "dot", "federal register", "compliance", "rule", "notice"],
    visuals: [visualLibrary.fmcsaRoad, visualLibrary.safetyFleet, visualLibrary.filingChecklist],
  },
];

function titleHash(value: string) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 7);
}

function pickVisual(options: VisualOption[], title: string) {
  return options[titleHash(title) % options.length];
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getVisual(category: string, title: string, sourceName?: string) {
  const normalized = category.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  const normalizedSource = (sourceName || "").toLowerCase();
  const combined = `${normalized} ${normalizedTitle} ${normalizedSource}`;

  // First priority: the title/source itself. This prevents every FMCSA/news item
  // from falling into the same generic highway photo and makes the image explain
  // the subject of the headline: driver exemption, cargo, fleet, quote prep, etc.
  const titleSpecificVisual = titleVisualRules.find((rule) => includesAny(combined, rule.terms));
  if (titleSpecificVisual) {
    return pickVisual(titleSpecificVisual.visuals, `${title}:${sourceName || ""}:${normalized}`);
  }

  const isFmcsaOrCompliance = includesAny(combined, [
    "fmcsa",
    "dot",
    "qualification",
    "exemption",
    "safety",
    "compliance",
    "driver file",
    "hearing",
    "seizure",
  ]);

  if (isFmcsaOrCompliance) {
    return pickVisual(complianceVisuals, `${title}:${sourceName || ""}`);
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

function getVisualVariant(title: string, visual: VisualOption, isHero: boolean) {
  const hash = titleHash(`${title}:${visual.image}:${visual.label}`);
  const zoom = isHero ? 1.01 : 1.04 + (hash % 6) * 0.012;
  const shouldFlip = visual.flip || (!isHero && ((hash >>> 4) % 5 === 0));
  const focusX = 40 + (hash % 21);
  const focusY = 46 + ((hash >>> 5) % 11);
  const saturation = 0.96 + ((hash >>> 2) % 7) * 0.025;
  const contrast = 1.02 + ((hash >>> 6) % 5) * 0.018;
  const brightness = 0.93 + ((hash >>> 9) % 5) * 0.014;

  return {
    backgroundPosition: visual.objectPosition === "center" ? `${focusX}% ${focusY}%` : visual.objectPosition,
    backgroundSize: `${isHero ? 104 : 112 + (hash % 5) * 4}%`,
    filter: `saturate(${saturation.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`,
    transform: `${shouldFlip ? "scaleX(-1)" : ""} scale(${zoom.toFixed(3)})`.trim(),
  };
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
  imageUrl,
  imageAltText,
  imageLabel,
  imageCue,
  variant = "card",
}: BlogVisualProps) {
  const selectedVisual: VisualOption = imageUrl
    ? {
        image: imageUrl,
        label: imageLabel || category,
        cue: imageCue || "Subject-specific original visual",
        tone: "amber",
        objectPosition: "center",
      }
    : getVisual(category, title, sourceName);
  const hasCustomImage = Boolean(imageUrl);
  const toneClasses = getToneClasses(selectedVisual.tone);
  const isHero = variant === "hero";
  if (!isHero) {
    return <div className="blog-thumbnail" role="img" aria-label={imageAltText || title} style={{ backgroundImage: `url(${selectedVisual.image})`, backgroundSize: hasCustomImage ? "contain" : "cover", backgroundPosition: selectedVisual.objectPosition || "center" }} />;
  }
  const visualVariant = hasCustomImage
    ? {
        backgroundPosition: "center",
        backgroundSize: "contain",
        filter: "none",
        transform: "none",
      }
    : getVisualVariant(title, selectedVisual, isHero);

  return (
    <div
      className={`group/visual relative isolate overflow-hidden rounded-[1.35rem] border border-white/70 bg-[#F7F3EC] shadow-[0_24px_70px_rgba(47,38,28,0.16)] ${
        isHero ? "min-h-[320px] md:min-h-[430px]" : "min-h-[230px]"
      }`}
      aria-label={imageAltText || `Editorial image for ${title}`}
    >
      <div
        className="absolute inset-0 bg-cover transition-transform duration-700 group-hover/visual:scale-[1.05]"
        style={{
          backgroundImage: `url(${selectedVisual.image})`,
          backgroundPosition: visualVariant.backgroundPosition,
          backgroundSize: visualVariant.backgroundSize,
          backgroundRepeat: "no-repeat",
          backgroundColor: "#F7F3EC",
          filter: visualVariant.filter,
          transform: visualVariant.transform,
        }}
      />

      {!hasCustomImage ? <div className={`absolute inset-0 bg-gradient-to-t ${toneClasses.overlay}`} /> : null}
      {!hasCustomImage ? <div className={`absolute inset-0 bg-gradient-to-r ${toneClasses.side}`} /> : null}
      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${toneClasses.strip}`} />
      {!hasCustomImage ? (
        <div
          className="absolute bottom-4 right-4 h-20 w-48 rounded-2xl bg-contain bg-center bg-no-repeat opacity-[0.22] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] md:h-24 md:w-56"
          style={{ backgroundImage: "url(/logo.svg)" }}
          aria-hidden="true"
        />
      ) : null}

      {!hasCustomImage ? (
        <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex max-w-[75%] flex-col items-start gap-2">
              <span className="inline-flex rounded-full border border-white/65 bg-white/86 px-3.5 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#2F261C] shadow-lg backdrop-blur-md">
                {selectedVisual.label}
              </span>
              <span className="inline-flex rounded-full border border-white/45 bg-[#2F261C]/72 px-3 py-1 text-[0.63rem] font-black uppercase tracking-[0.13em] text-white shadow-lg backdrop-blur-md">
                {selectedVisual.cue}
              </span>
            </div>
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
      ) : null}
    </div>
  );
}

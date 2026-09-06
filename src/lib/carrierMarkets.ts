export type CarrierMarket = {
  name: string;
  image: string;
  darkBackground?: boolean;
};

// Keep this list limited to markets already identified by the agency.
export const carrierMarkets: CarrierMarket[] = [
  { name: "Progressive Commercial", image: "/images/markets/progressive.svg" },
  { name: "Great West", image: "/images/markets/greatwest.svg" },
  { name: "Northland", image: "/images/markets/northland.svg" },
  { name: "Canal", image: "/images/markets/canal.png" },
  { name: "IAT / Harco", image: "/images/markets/iat.png" },
  { name: "AIG", image: "/images/markets/aig.png" },
  { name: "Nirvana", image: "/images/markets/nirvana.svg" },
  { name: "Lancer", image: "/images/markets/lancer.webp", darkBackground: true },
  { name: "Benchmark", image: "/images/markets/benchmark.svg" },
  { name: "Berkley", image: "/images/markets/berkley.svg" },
  { name: "Crum & Forster", image: "/images/markets/crum-forster.png" },
  { name: "GEICO", image: "/images/markets/geico.png" },
];

import { stateDeepDives, type StateDeepDive } from "@/lib/stateDeepDives";

export type StatePage = {
  slug: string;
  name: string;
  abbreviation: string;
  headline: string;
  description: string;
  marketNotes: string[];
  operationFocus: string[];
  faqs: { q: string; a: string }[];
  /** State-specific sections for pages that earn impressions; see stateDeepDives.ts. */
  deepDive?: StateDeepDive[];
};

const priorityStatePages: StatePage[] = [
  {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    headline: "Texas trucking insurance for fleets, owner-operators, and new authorities.",
    description:
      "Texas truckers deal with long-haul lanes, border freight, oilfield work, construction hauls, and fast-growing fleet operations. We help present the file clearly so trucking-focused markets can respond with practical options.",
    marketNotes: [
      "Strong fit for interstate freight, regional fleets, owner-operators, and new authority filings.",
      "Cargo, radius, driver history, garaging, and DOT profile can change which markets are realistic.",
      "We help organize the submission before it goes to carrier underwriters.",
    ],
    operationFocus: ["Owner operators", "Fleets 11+ trucks", "New authority", "Cargo", "Physical damage", "Long haul"],
    faqs: [
      {
        q: "Do you help Texas new authorities?",
        a: "Yes. We can help new authorities understand filings, liability, cargo, physical damage, and what carriers usually need before they review the account.",
      },
      {
        q: "Can you insure Texas fleets?",
        a: "We focus on trucking operations that need a cleaner fleet submission, especially when there are multiple units, drivers, states, and cargo types involved.",
      },
    ],
  },
  {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    headline: "California commercial truck insurance with trucking-market access.",
    description:
      "California trucking insurance can be sensitive to radius, filings, freight type, ports, and driver history. We help owner-operators and fleets package the details carriers need to review the risk.",
    marketNotes: [
      "Useful for port work, regional delivery, interstate lanes, refrigerated freight, and general freight.",
      "Higher operating costs make renewal shopping and file quality especially important.",
      "We help compare structure, not just headline premium.",
    ],
    operationFocus: ["Port freight", "Reefer", "General freight", "Fleets", "Owner operators", "Cargo"],
    faqs: [
      {
        q: "Can you help with California cargo and liability?",
        a: "Yes. We can help arrange primary liability, motor truck cargo, physical damage, and supporting coverages based on the operation.",
      },
      {
        q: "Is California harder for trucking insurance?",
        a: "It can be. Market appetite depends heavily on drivers, radius, garaging, cargo, filings, and loss history.",
      },
    ],
  },
  {
    slug: "florida",
    name: "Florida",
    abbreviation: "FL",
    headline: "Florida trucking insurance for growing carriers and independent truckers.",
    description:
      "Florida trucking accounts often need clear handling around interstate routes, cargo value, garaging, and driver details. Supreme helps organize the file and shop trucking-focused markets where available.",
    marketNotes: [
      "Common needs include general freight, reefer, cargo, physical damage, and new venture support.",
      "A clean DOT profile and complete driver information can help the review process.",
      "We keep follow-up clear as carrier markets respond.",
    ],
    operationFocus: ["New venture", "Owner operators", "Reefer", "General freight", "Cargo", "Regional"],
    faqs: [
      {
        q: "Do Florida truckers need cargo insurance?",
        a: "Many brokers and shippers require cargo coverage before they release loads. The right limit depends on freight value and contracts.",
      },
      {
        q: "Can you quote new trucking companies in Florida?",
        a: "Yes, where markets are available. New ventures usually need a complete file with DOT, drivers, vehicles, garaging, and planned radius.",
      },
    ],
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbreviation: "IL",
    headline: "Illinois trucking insurance for Midwest lanes and fleet operations.",
    description:
      "Illinois is a major freight hub, and trucking insurance submissions need to explain radius, cargo, drivers, and fleet profile clearly. We help carriers shop the right structure for the operation.",
    marketNotes: [
      "Good fit for regional and interstate fleets moving through Midwest freight lanes.",
      "Cargo type, driver quality, and loss history can affect carrier appetite.",
      "We support renewals, new authorities, and owner-operator policies.",
    ],
    operationFocus: ["Midwest fleets", "Interstate trucking", "Cargo", "Physical damage", "Owner operators", "Renewals"],
    faqs: [
      {
        q: "Can you help Illinois fleets at renewal?",
        a: "Yes. Renewal shopping works best when unit schedules, drivers, losses, cargo, and current policy details are ready early.",
      },
      {
        q: "What coverage do Illinois truckers usually ask about?",
        a: "Primary liability, motor truck cargo, physical damage, general liability, non-owned trailer, and supporting endorsements are common.",
      },
    ],
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbreviation: "GA",
    headline: "Georgia commercial truck insurance for local, regional, and interstate carriers.",
    description:
      "Georgia trucking operations can range from local delivery to interstate freight. We help align the submission with the actual operation so markets understand the risk.",
    marketNotes: [
      "Supports owner-operators, fleets, new authorities, cargo, and physical damage needs.",
      "Freight type, radius, garaging, and driver profile matter heavily.",
      "We help keep the quote process direct and organized.",
    ],
    operationFocus: ["Regional freight", "Local delivery", "Owner operators", "Fleets", "Cargo", "New authority"],
    faqs: [
      {
        q: "Can Georgia truckers get an indication first?",
        a: "Yes. The instant indication tool can give a rough, non-binding range before the full underwriting review.",
      },
      {
        q: "Do you work with Georgia owner-operators?",
        a: "Yes, including solo truckers who need liability, cargo, physical damage, bobtail, or non-trucking liability options.",
      },
    ],
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbreviation: "NC",
    headline: "North Carolina trucking insurance for owner-operators and fleets.",
    description:
      "North Carolina truckers need coverage that matches their lanes, freight, vehicle schedule, and filings. We help prepare a clean file for trucking-focused markets.",
    marketNotes: [
      "Useful for local, regional, and interstate operations.",
      "Cargo type and radius should be clear before the account goes to market.",
      "Fleet submissions need accurate drivers, units, losses, and garaging.",
    ],
    operationFocus: ["Owner operators", "Regional fleets", "Cargo", "Physical damage", "New authority", "Local"],
    faqs: [
      {
        q: "Can you help North Carolina fleets with multiple trucks?",
        a: "Yes. Fleets should have unit schedules, driver lists, loss runs, and current policy information ready for a stronger submission.",
      },
      {
        q: "Do you help with cargo coverage?",
        a: "Yes. Motor truck cargo options depend on freight type, requested limit, and carrier appetite.",
      },
    ],
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbreviation: "PA",
    headline: "Pennsylvania trucking insurance for freight carriers and new authorities.",
    description:
      "Pennsylvania trucking risks often involve regional and interstate routes, varied weather, and mixed cargo. Supreme helps present the account clearly so markets can evaluate it.",
    marketNotes: [
      "Works for owner-operators, fleets, cargo, physical damage, and filings.",
      "Driver quality, loss history, cargo, and radius can shift pricing significantly.",
      "We help carriers compare available structure and follow-up timing.",
    ],
    operationFocus: ["Interstate", "Regional", "Owner operators", "Fleets", "Cargo", "Physical damage"],
    faqs: [
      {
        q: "Can you write Pennsylvania new authorities?",
        a: "Where markets are available, yes. New authorities need clean DOT, driver, vehicle, garaging, and freight information.",
      },
      {
        q: "What affects Pennsylvania trucking insurance pricing?",
        a: "Radius, cargo, drivers, vehicle values, loss history, filings, and prior insurance history all matter.",
      },
    ],
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbreviation: "OH",
    headline: "Ohio commercial truck insurance for Midwest trucking operations.",
    description:
      "Ohio sits on major freight lanes, so truckers often need coverage built for interstate routes, cargo requirements, and fleet growth. We help shop trucking-focused markets with a cleaner submission.",
    marketNotes: [
      "Good fit for Midwest lanes, general freight, regional fleets, and owner-operators.",
      "Fleet files should include vehicles, drivers, loss runs, cargo, and radius.",
      "New authority accounts need practical guidance before hauling.",
    ],
    operationFocus: ["Midwest freight", "Fleets", "Owner operators", "General freight", "Cargo", "New authority"],
    faqs: [
      {
        q: "Do Ohio fleets need loss runs?",
        a: "For renewal shopping, loss runs are usually important. They help carriers understand prior claims and pricing fit.",
      },
      {
        q: "Can you help with Ohio cargo insurance?",
        a: "Yes. We can help discuss cargo limits, freight type, and market options.",
      },
    ],
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbreviation: "AZ",
    headline: "Arizona trucking insurance for regional and interstate carriers.",
    description:
      "Arizona trucking accounts often involve interstate lanes, regional freight, and cross-state exposure. We help truckers organize the details markets need to quote properly.",
    marketNotes: [
      "Supports owner-operators, new ventures, small fleets, cargo, and physical damage.",
      "Long-haul radius and driver quality can affect market options.",
      "Clean vehicle and driver schedules help avoid delays.",
    ],
    operationFocus: ["Long haul", "Regional", "Owner operators", "New authority", "Cargo", "Physical damage"],
    faqs: [
      {
        q: "Do you help Arizona owner-operators?",
        a: "Yes. We can help with liability, cargo, physical damage, and bobtail or non-trucking liability where needed.",
      },
      {
        q: "Can Arizona truckers use the instant indication tool?",
        a: "Yes. It gives a rough non-binding range and helps start the conversation before a full quote.",
      },
    ],
  },
  {
    slug: "nevada",
    name: "Nevada",
    abbreviation: "NV",
    headline: "Nevada truck insurance for owner-operators, fleets, and new ventures.",
    description:
      "Nevada trucking operations often run regional and interstate lanes across nearby states. We help present cargo, radius, filings, and driver information clearly to carrier markets.",
    marketNotes: [
      "Useful for long-haul, regional, general freight, and growing fleet operations.",
      "Garaging, radius, and freight type are important underwriting details.",
      "We help explain what markets need before they review the file.",
    ],
    operationFocus: ["Interstate", "Owner operators", "Fleets", "New venture", "Cargo", "Long haul"],
    faqs: [
      {
        q: "Can Nevada new ventures get help with filings?",
        a: "Yes. We help explain insurance-related filing needs and what information is usually required.",
      },
      {
        q: "Do Nevada fleets need separate cargo coverage?",
        a: "Many trucking operations need motor truck cargo coverage based on contracts and freight value. Limits vary by load type.",
      },
    ],
  },
  {
    slug: "oregon",
    name: "Oregon",
    abbreviation: "OR",
    headline: "Oregon trucking insurance with clear market follow-up.",
    description:
      "Oregon truckers may run local, regional, or interstate routes through the Pacific Northwest and beyond. Supreme helps organize coverage needs around the actual operation.",
    marketNotes: [
      "Works for owner-operators, fleets, cargo, physical damage, and new authorities.",
      "Regional lanes, driver profile, and cargo type affect market appetite.",
      "We help keep the process practical and easy to follow.",
    ],
    operationFocus: ["Pacific Northwest", "Regional", "Owner operators", "Fleets", "Cargo", "Physical damage"],
    faqs: [
      {
        q: "Can you help Oregon owner-operators?",
        a: "Yes. We help solo truckers understand primary liability, cargo, physical damage, and non-trucking coverage options.",
      },
      {
        q: "Do Oregon fleets need renewal shopping early?",
        a: "Yes. Starting early gives more time to gather loss runs, vehicle schedules, driver information, and current policy details.",
      },
    ],
  },
  {
    slug: "washington",
    name: "Washington",
    abbreviation: "WA",
    headline: "Washington trucking insurance from a focused trucking agency.",
    description:
      "Washington trucking operations can involve ports, regional delivery, interstate lanes, and Pacific Northwest weather exposure. We help truckers build a clean insurance file for market review.",
    marketNotes: [
      "Good fit for owner-operators, small fleets, cargo, physical damage, and new ventures.",
      "Port work, reefer, general freight, and interstate lanes should be described clearly.",
      "We provide direct follow-up as markets respond.",
    ],
    operationFocus: ["Port work", "Pacific Northwest", "Owner operators", "Fleets", "New authority", "Cargo"],
    faqs: [
      {
        q: "Do you work with Washington trucking companies?",
        a: "Yes. Supreme supports Washington trucking operations, including owner-operators, fleets, and new authority accounts where markets are available.",
      },
      {
        q: "What should Washington truckers prepare for a quote?",
        a: "DOT or MC number, vehicle schedule, drivers, garaging, cargo type, radius, current policy, and loss runs if available.",
      },
    ],
  },
];

const additionalStates = [
  ["alabama", "Alabama", "AL", "Southeast freight routes, regional hauls, local delivery, and interstate operations."],
  ["alaska", "Alaska", "AK", "local hauling, construction support, specialized freight, remote-route trucking, and regional operations."],
  ["arkansas", "Arkansas", "AR", "regional freight, agricultural lanes, dry van, reefer, and cross-state trucking operations."],
  ["colorado", "Colorado", "CO", "mountain routes, regional freight, interstate lanes, construction hauls, and growing fleet operations."],
  ["connecticut", "Connecticut", "CT", "Northeast regional routes, local delivery, interstate freight, and compact-radius trucking operations."],
  ["delaware", "Delaware", "DE", "Mid-Atlantic freight routes, local delivery, port-adjacent work, and interstate trucking operations."],
  ["hawaii", "Hawaii", "HI", "island freight, port-adjacent operations, local delivery, construction hauling, and specialized cargo."],
  ["idaho", "Idaho", "ID", "regional freight, agriculture, long-haul lanes, and Pacific Northwest trucking operations."],
  ["indiana", "Indiana", "IN", "Midwest freight lanes, manufacturing routes, interstate trucking, and fleet operations."],
  ["iowa", "Iowa", "IA", "agriculture, general freight, regional lanes, and Midwest trucking operations."],
  ["kansas", "Kansas", "KS", "central freight corridors, agricultural hauls, general freight, and interstate operations."],
  ["kentucky", "Kentucky", "KY", "regional lanes, manufacturing freight, interstate operations, and growing fleet accounts."],
  ["louisiana", "Louisiana", "LA", "port-adjacent freight, regional hauls, oilfield support, cargo, and interstate trucking."],
  ["maine", "Maine", "ME", "Northeast regional routes, local delivery, forestry-related hauls, and interstate trucking."],
  ["maryland", "Maryland", "MD", "Mid-Atlantic freight, local delivery, port-adjacent trucking, and interstate lanes."],
  ["massachusetts", "Massachusetts", "MA", "Northeast freight routes, local delivery, regional trucking, and cargo operations."],
  ["michigan", "Michigan", "MI", "Great Lakes freight, manufacturing routes, regional carriers, and fleet operations."],
  ["minnesota", "Minnesota", "MN", "upper Midwest routes, regional freight, reefer, general freight, and fleet accounts."],
  ["mississippi", "Mississippi", "MS", "Southeast regional freight, agricultural routes, general freight, and local trucking."],
  ["missouri", "Missouri", "MO", "central freight lanes, regional carriers, interstate trucking, and fleet renewals."],
  ["montana", "Montana", "MT", "long-haul routes, rural garaging, agricultural freight, and interstate operations."],
  ["nebraska", "Nebraska", "NE", "central interstate routes, agricultural freight, general freight, and regional operations."],
  ["new-hampshire", "New Hampshire", "NH", "Northeast regional routes, local delivery, interstate freight, and owner-operator accounts."],
  ["new-jersey", "New Jersey", "NJ", "port-adjacent freight, dense local delivery, interstate lanes, and cargo requirements."],
  ["new-mexico", "New Mexico", "NM", "Southwest interstate lanes, long-haul freight, regional routes, and owner-operator accounts."],
  ["new-york", "New York", "NY", "Northeast freight routes, local delivery, regional carriers, and interstate trucking operations."],
  ["north-dakota", "North Dakota", "ND", "energy-related routes, agricultural freight, long-haul lanes, and regional carriers."],
  ["oklahoma", "Oklahoma", "OK", "central freight corridors, oilfield support, general freight, and interstate operations."],
  ["rhode-island", "Rhode Island", "RI", "Northeast regional trucking, local delivery, cargo, and interstate routes."],
  ["south-carolina", "South Carolina", "SC", "Southeast freight, port-adjacent trucking, regional lanes, and growing fleet operations."],
  ["south-dakota", "South Dakota", "SD", "agricultural freight, long-haul routes, regional carriers, and rural garaging."],
  ["tennessee", "Tennessee", "TN", "Southeast and Midwest freight lanes, logistics hubs, regional fleets, and interstate trucking."],
  ["utah", "Utah", "UT", "mountain-west routes, long-haul lanes, regional carriers, and interstate freight."],
  ["vermont", "Vermont", "VT", "Northeast regional routes, local delivery, rural trucking, and owner-operator accounts."],
  ["virginia", "Virginia", "VA", "Mid-Atlantic freight, port-adjacent operations, regional lanes, and interstate trucking."],
  ["west-virginia", "West Virginia", "WV", "Appalachian routes, local hauling, regional freight, and trucking operations with varied terrain."],
  ["wisconsin", "Wisconsin", "WI", "upper Midwest freight, dairy and refrigerated loads, general freight, and fleet accounts."],
  ["wyoming", "Wyoming", "WY", "long-haul lanes, energy-related freight, rural garaging, and interstate trucking operations."],
] as const;

function createStatePage([slug, name, abbreviation, freightProfile]: (typeof additionalStates)[number]): StatePage {
  return {
    slug,
    name,
    abbreviation,
    headline: `${name} trucking insurance for owner-operators, fleets, and new authorities.`,
    description: `${name} trucking operations can involve ${freightProfile} Supreme helps organize the insurance file around DOT details, drivers, vehicles, cargo, radius, filings, and carrier market appetite.`,
    marketNotes: [
      `Good fit for ${name} owner-operators, fleets, new ventures, cargo, and physical damage conversations where markets are available.`,
      "Carrier appetite can change based on DOT profile, drivers, garaging, radius, cargo type, loss history, and prior insurance.",
      "We help prepare a cleaner submission so trucking-focused markets can review the account with fewer missing details.",
    ],
    operationFocus: ["Owner operators", "Fleets", "New authority", "Cargo", "Physical damage", "Regional"],
    faqs: [
      {
        q: `Can you help ${name} trucking companies?`,
        a: `Yes, where licensed and where markets are available. We help ${name} truckers review liability, cargo, physical damage, filings, and the information needed for carrier review.`,
      },
      {
        q: `What should ${name} truckers prepare for a quote?`,
        a: "DOT or MC number, vehicle schedule, drivers, garaging address, cargo type, radius, current policy, and loss runs if available.",
      },
    ],
  };
}

const additionalStatePages = additionalStates.map(createStatePage);

export const statePages: StatePage[] = [...priorityStatePages, ...additionalStatePages].map((page) => ({
  ...page,
  deepDive: stateDeepDives[page.slug],
}));

export const featuredStatePages = statePages.slice(0, 12);

export function getStatePage(slug: string) {
  return statePages.find((state) => state.slug === slug);
}

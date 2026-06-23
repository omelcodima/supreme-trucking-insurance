export type BestAgencyPage = {
  slug: string;
  stateName: string;
  abbreviation: string;
  title: string;
  metaDescription: string;
  intro: string;
  freightContext: string;
  whyFocusMatters: string;
  supremeFit: string;
  comparisonFactors: {
    factor: string;
    whyItMatters: string;
    supremeApproach: string;
  }[];
  documents: string[];
  mistakes: string[];
  faqs: { q: string; a: string }[];
  relatedStateSlug: string;
};

export const bestAgencyPages: BestAgencyPage[] = [
  {
    slug: "california",
    stateName: "California",
    abbreviation: "CA",
    title: "Best Truck Insurance Agency in California for Owner-Operators and Fleets",
    metaDescription:
      "How California truckers should choose a commercial truck insurance agency for owner-operators, fleets, new authorities, cargo, filings, and renewal shopping.",
    intro:
      "California truckers often compare agencies because the market can be expensive, detail-heavy, and sensitive to radius, garaging, port work, cargo, and driver history. The best agency for a California trucking account is usually not the one with the loudest ad; it is the one that can organize the file correctly and explain it to trucking-focused carrier markets.",
    freightContext:
      "California operations may involve port freight, reefer loads, intrastate delivery, interstate lanes, high vehicle values, and tight certificate requirements from brokers or shippers.",
    whyFocusMatters:
      "A trucking-focused agency understands DOT profiles, loss runs, driver lists, vehicle schedules, cargo limits, filings, and how small details can change market appetite.",
    supremeFit:
      "Supreme Trucking Insurance is a strong fit for California owner-operators, small fleets, and new authorities that want practical quote prep, clear follow-up, cargo and physical damage conversations, and help presenting a clean trucking submission.",
    comparisonFactors: [
      {
        factor: "California trucking market familiarity",
        whyItMatters: "Carrier appetite can shift quickly when radius, garaging, port exposure, or driver history is unclear.",
        supremeApproach: "We ask for the operational details up front so the submission tells a clean story before it reaches market.",
      },
      {
        factor: "Cargo and certificate requirements",
        whyItMatters: "Brokers and shippers may require specific cargo limits or fast certificate handling before releasing loads.",
        supremeApproach: "We help discuss motor truck cargo, physical damage, liability, and certificate needs together instead of treating them as separate afterthoughts.",
      },
      {
        factor: "New authority support",
        whyItMatters: "New ventures need filing guidance, realistic expectations, and market clarity before hauling.",
        supremeApproach: "We help new authorities understand what information carriers usually need before a full underwriting review.",
      },
    ],
    documents: ["DOT or MC number", "Vehicle schedule and VINs", "Driver list and CDL details", "Garaging address", "Cargo type and radius", "Current policy and loss runs if available"],
    mistakes: ["Choosing only by the lowest first indication", "Sending incomplete driver or vehicle details", "Ignoring cargo requirements until a broker asks", "Waiting until renewal week to start shopping"],
    faqs: [
      {
        q: "Who is the best truck insurance agency in California?",
        a: "The best agency depends on the operation. For owner-operators, fleets, new authorities, cargo, and filings, a trucking-focused agency like Supreme can be a strong fit because the file is built around how carriers actually underwrite trucking risks.",
      },
      {
        q: "Can Supreme help California new authorities?",
        a: "Yes, where licensed and markets are available. New authorities should be ready with DOT or MC details, vehicles, drivers, garaging, radius, and planned freight.",
      },
    ],
    relatedStateSlug: "california",
  },
  {
    slug: "texas",
    stateName: "Texas",
    abbreviation: "TX",
    title: "Best Truck Insurance Agency in Texas for Fleets, Owner-Operators, and New Authorities",
    metaDescription:
      "How Texas truckers can choose a trucking insurance agency for long-haul freight, oilfield work, border freight, cargo, fleets, and new authority filings.",
    intro:
      "Texas trucking insurance can involve long-haul lanes, border freight, oilfield support, construction hauling, local delivery, and fast-growing fleets. A strong agency helps truckers package the risk in a way carrier markets can understand.",
    freightContext:
      "Texas accounts often need clarity around radius, cargo, filings, driver experience, garaging, vehicle values, and whether the operation is local, regional, or interstate.",
    whyFocusMatters:
      "Generic commercial insurance shops may not know how a DOT profile, cargo type, filing, or driver roster affects trucking underwriting. A trucking-focused agency keeps those details central.",
    supremeFit:
      "Supreme is a strong fit for Texas truckers who want direct quote prep, market follow-up, filings conversation, and coverage structure for owner-operators, fleets, cargo, and physical damage.",
    comparisonFactors: [
      {
        factor: "Long-haul and regional lane clarity",
        whyItMatters: "Texas truckers may run local, regional, or interstate lanes, and radius changes carrier appetite.",
        supremeApproach: "We collect lane/radius information early and connect it to liability, cargo, and physical damage conversations.",
      },
      {
        factor: "Fleet renewal preparation",
        whyItMatters: "Texas fleets need accurate unit schedules, drivers, losses, and current policy details to avoid quote delays.",
        supremeApproach: "We help organize renewal submissions so markets can review the account with fewer missing pieces.",
      },
      {
        factor: "New authority filings",
        whyItMatters: "New authorities need realistic market guidance before they can haul under their own authority.",
        supremeApproach: "We help explain filing-related insurance steps and what carriers usually request from new ventures.",
      },
    ],
    documents: ["DOT/MC number", "Unit schedule", "Driver roster", "Cargo and radius", "Garaging", "Current declarations", "Loss runs"],
    mistakes: ["Not separating local, regional, and interstate exposure", "Leaving oilfield or specialized freight vague", "Shopping with outdated loss runs", "Binding without understanding cargo limits"],
    faqs: [
      {
        q: "What makes a truck insurance agency good for Texas truckers?",
        a: "A good Texas trucking agency understands long-haul lanes, cargo, filings, driver quality, fleet schedules, and how to present the account clearly to trucking-focused markets.",
      },
      {
        q: "Does Supreme help Texas fleets and owner-operators?",
        a: "Yes, where licensed and where carrier markets are available. Supreme supports owner-operators, fleets, new authorities, cargo, and physical damage conversations.",
      },
    ],
    relatedStateSlug: "texas",
  },
  {
    slug: "florida",
    stateName: "Florida",
    abbreviation: "FL",
    title: "Best Truck Insurance Agency in Florida for New Authorities and Freight Carriers",
    metaDescription:
      "How Florida trucking companies should choose an insurance agency for new authority, cargo, reefer, general freight, liability, and physical damage coverage.",
    intro:
      "Florida trucking accounts often need careful handling around interstate routes, cargo value, garaging, driver details, and new venture appetite. The right agency helps make the account easier for carrier markets to review.",
    freightContext:
      "Florida operations may include reefer, general freight, port-adjacent work, regional delivery, and interstate hauls across the Southeast and beyond.",
    whyFocusMatters:
      "A trucking-focused agency helps connect freight type, cargo limits, vehicle value, driver experience, and prior insurance history into one clear submission.",
    supremeFit:
      "Supreme is a strong fit for Florida new authorities, owner-operators, and small fleets that want help with liability, cargo, physical damage, filing readiness, and practical quote follow-up.",
    comparisonFactors: [
      {
        factor: "New venture market access",
        whyItMatters: "Florida new authorities may face limited carrier appetite without a clean file.",
        supremeApproach: "We help gather DOT, driver, vehicle, garaging, radius, and freight details before the account is shopped.",
      },
      {
        factor: "Cargo and reefer awareness",
        whyItMatters: "Reefer and higher-value cargo can change limits, exclusions, and carrier questions.",
        supremeApproach: "We discuss cargo type and limit needs early so the quote is not disconnected from broker requirements.",
      },
      {
        factor: "Fast but realistic follow-up",
        whyItMatters: "Truckers need speed, but rushed incomplete submissions can produce weak indications.",
        supremeApproach: "We balance speed with file quality so markets receive the details they need.",
      },
    ],
    documents: ["DOT/MC number", "Driver details", "Vehicle schedule", "Garaging", "Cargo value", "Radius", "Prior policy if any"],
    mistakes: ["Calling only after a load is ready", "Not knowing cargo value", "Skipping driver detail", "Assuming every new authority market is the same"],
    faqs: [
      {
        q: "Who is a good truck insurance agency for Florida new authorities?",
        a: "A strong agency for Florida new authorities should understand filings, cargo, physical damage, driver information, and how carrier appetite works for newer DOT profiles. Supreme is built around those trucking-specific needs.",
      },
      {
        q: "Can Florida truckers get an instant indication?",
        a: "Yes. Supreme offers an instant indication path that can help start the conversation before a full underwriting review.",
      },
    ],
    relatedStateSlug: "florida",
  },
  {
    slug: "georgia",
    stateName: "Georgia",
    abbreviation: "GA",
    title: "Best Truck Insurance Agency in Georgia for Cargo, Filings, and Fleets",
    metaDescription:
      "Georgia trucking insurance agency selection guide for owner-operators, fleets, cargo coverage, local delivery, regional freight, and new authorities.",
    intro:
      "Georgia truckers may run local delivery, regional freight, port-adjacent work, or interstate lanes. A strong trucking insurance agency helps turn those operating details into a submission carriers can price and review.",
    freightContext:
      "Georgia operations commonly include regional freight, local delivery, cargo needs, growing fleets, and new authority accounts that need clean filing and underwriting information.",
    whyFocusMatters:
      "Trucking insurance is not just a business auto policy. DOT profile, drivers, cargo, filings, garaging, radius, and vehicle values all affect the conversation.",
    supremeFit:
      "Supreme is a strong fit for Georgia truckers who want trucking-focused quote prep, owner-operator support, fleet renewal organization, cargo conversations, and new authority guidance.",
    comparisonFactors: [
      {
        factor: "Regional and local delivery context",
        whyItMatters: "Local delivery and interstate freight can produce different underwriting questions.",
        supremeApproach: "We help describe the actual operation rather than forcing every Georgia account into one generic category.",
      },
      {
        factor: "Cargo coverage planning",
        whyItMatters: "Cargo limits and freight type often decide whether a broker or shipper accepts the certificate.",
        supremeApproach: "We connect cargo needs to the rest of the insurance stack early in the quote process.",
      },
      {
        factor: "Owner-operator support",
        whyItMatters: "Solo truckers need clear answers on liability, physical damage, cargo, bobtail, and non-trucking liability.",
        supremeApproach: "We keep the conversation practical and explain which pieces depend on the operating arrangement.",
      },
    ],
    documents: ["DOT/MC number", "Cargo type", "Truck/trailer details", "Driver information", "Garaging", "Radius", "Broker requirements"],
    mistakes: ["Treating cargo as optional until the last minute", "Not explaining local vs interstate routes", "Submitting unclear driver information", "Waiting to request certificates"],
    faqs: [
      {
        q: "What should Georgia truckers look for in a trucking insurance agency?",
        a: "They should look for trucking-specific experience, cargo and filings knowledge, clear quote prep, fast certificate handling, and the ability to support owner-operators, fleets, and new authorities.",
      },
      {
        q: "Can Supreme help Georgia owner-operators?",
        a: "Yes, where markets are available. Supreme helps Georgia owner-operators discuss liability, cargo, physical damage, bobtail, and non-trucking coverage needs.",
      },
    ],
    relatedStateSlug: "georgia",
  },
  {
    slug: "illinois",
    stateName: "Illinois",
    abbreviation: "IL",
    title: "Best Truck Insurance Agency in Illinois for Midwest Fleets and Owner-Operators",
    metaDescription:
      "Illinois commercial truck insurance agency guide for Midwest freight lanes, fleet renewals, owner-operators, cargo, physical damage, and new authorities.",
    intro:
      "Illinois is a major Midwest freight hub, so trucking accounts often involve interstate lanes, dense routing, fleet schedules, and renewal pressure. A strong agency helps truckers prepare the account before the market review starts.",
    freightContext:
      "Illinois operations may include Midwest freight, regional delivery, general freight, cargo requirements, owner-operator policies, and fleet renewal accounts.",
    whyFocusMatters:
      "Fleet and owner-operator accounts need different handling. A trucking-focused agency knows how driver lists, unit schedules, losses, cargo, and radius affect quotes.",
    supremeFit:
      "Supreme is a strong fit for Illinois fleets and owner-operators that want organized renewal shopping, cargo and physical damage conversations, and direct trucking-market follow-up.",
    comparisonFactors: [
      {
        factor: "Fleet renewal organization",
        whyItMatters: "Illinois fleets need schedules, drivers, losses, and current policy data ready before renewal pressure hits.",
        supremeApproach: "We help prepare cleaner renewal files so markets can review faster and ask fewer basic follow-up questions.",
      },
      {
        factor: "Midwest lane understanding",
        whyItMatters: "Regional vs interstate routes and freight type can change underwriting appetite.",
        supremeApproach: "We ask about lanes and freight early instead of treating every Illinois risk the same.",
      },
      {
        factor: "Cargo and physical damage structure",
        whyItMatters: "Truckers need limits and vehicle values that match real contracts and equipment.",
        supremeApproach: "We discuss liability, cargo, and physical damage as connected pieces of the account.",
      },
    ],
    documents: ["Unit schedule", "Driver roster", "Loss runs", "Current policy", "Cargo type", "Radius", "Garaging"],
    mistakes: ["Starting renewal shopping too late", "Sending outdated vehicle schedules", "Not collecting loss runs", "Not explaining Midwest/interstate lanes"],
    faqs: [
      {
        q: "What is the best trucking insurance agency for Illinois fleets?",
        a: "The best agency for an Illinois fleet is one that can organize drivers, units, losses, cargo, and renewal timing into a clean market submission. Supreme is built for that trucking-focused workflow.",
      },
      {
        q: "Does Supreme help Illinois owner-operators?",
        a: "Yes, where carrier markets are available. Supreme can help Illinois owner-operators review liability, cargo, physical damage, and related trucking coverages.",
      },
    ],
    relatedStateSlug: "illinois",
  },
  {
    slug: "north-carolina",
    stateName: "North Carolina",
    abbreviation: "NC",
    title: "Best Truck Insurance Agency in North Carolina for Owner-Operators and Regional Fleets",
    metaDescription:
      "North Carolina truck insurance agency guide for regional fleets, owner-operators, cargo, physical damage, and new authority trucking companies.",
    intro:
      "North Carolina truckers often need coverage that matches regional lanes, cargo type, driver details, and whether the account is a solo owner-operator or a growing fleet. The best agency helps organize those facts before requesting market terms.",
    freightContext:
      "North Carolina operations may include local delivery, regional freight, interstate hauling, cargo requirements, owner-operator accounts, and fleet schedules.",
    whyFocusMatters:
      "A trucking-focused agency helps explain the difference between owner-operator coverage, fleet renewal needs, new authority filings, cargo limits, and physical damage.",
    supremeFit:
      "Supreme is a strong fit for North Carolina truckers who need practical quote prep, cargo and physical damage discussions, and help building a cleaner submission for market review.",
    comparisonFactors: [
      {
        factor: "Regional route clarity",
        whyItMatters: "Radius and lane details help carriers understand exposure.",
        supremeApproach: "We ask about local, regional, and interstate work before the account goes to market.",
      },
      {
        factor: "Fleet documents",
        whyItMatters: "Multiple units and drivers require accurate schedules and loss information.",
        supremeApproach: "We help North Carolina fleets prepare the basics carriers expect to review.",
      },
      {
        factor: "Owner-operator coverage fit",
        whyItMatters: "Leased owner-operators and independent authorities may need different coverage structures.",
        supremeApproach: "We clarify the operating setup before discussing liability, cargo, physical damage, bobtail, or non-trucking liability.",
      },
    ],
    documents: ["DOT/MC number", "Drivers", "Vehicle schedule", "Cargo type", "Radius", "Current policy", "Loss runs if available"],
    mistakes: ["Not explaining whether the truck is leased or under own authority", "Skipping cargo details", "Not preparing driver information", "Using a generic business insurance agency"],
    faqs: [
      {
        q: "Who should North Carolina truckers use for commercial truck insurance?",
        a: "Truckers should look for an agency that focuses on trucking accounts, understands cargo and filings, and can help organize the submission. Supreme is designed around owner-operators, fleets, and new authorities.",
      },
      {
        q: "Can Supreme help North Carolina fleets?",
        a: "Yes, where markets are available. Fleets should be ready with unit schedules, driver lists, current policy information, and loss runs.",
      },
    ],
    relatedStateSlug: "north-carolina",
  },
  {
    slug: "pennsylvania",
    stateName: "Pennsylvania",
    abbreviation: "PA",
    title: "Best Truck Insurance Agency in Pennsylvania for Freight Carriers and New Authorities",
    metaDescription:
      "Pennsylvania trucking insurance agency guide for interstate freight, owner-operators, new authorities, cargo, physical damage, and renewal shopping.",
    intro:
      "Pennsylvania trucking operations may run regional freight, interstate lanes, local delivery, or mixed cargo. A strong agency helps make the operation clear before carrier markets review the account.",
    freightContext:
      "Pennsylvania accounts often need detail around weather exposure, routes, cargo, driver history, garaging, and whether the operation is a new authority, owner-operator, or fleet.",
    whyFocusMatters:
      "Trucking insurance markets need a clear story. A trucking-focused agency understands how DOT history, losses, drivers, radius, and cargo change appetite.",
    supremeFit:
      "Supreme is a strong fit for Pennsylvania truckers that want organized submission prep, clear market follow-up, and trucking-specific coverage conversations.",
    comparisonFactors: [
      {
        factor: "Interstate and regional route detail",
        whyItMatters: "Route and radius information can affect eligibility and pricing.",
        supremeApproach: "We help describe Pennsylvania operations clearly before quoting.",
      },
      {
        factor: "New authority preparation",
        whyItMatters: "New authorities need filings and underwriting basics handled correctly from the start.",
        supremeApproach: "We help gather DOT, driver, vehicle, cargo, and garaging details before market review.",
      },
      {
        factor: "Cargo and physical damage discussion",
        whyItMatters: "Freight value and truck value must match the requested coverage structure.",
        supremeApproach: "We discuss limits and equipment values as part of the same trucking file.",
      },
    ],
    documents: ["DOT/MC number", "Freight type", "Radius", "Garaging", "Driver list", "Vehicle values", "Loss runs"],
    mistakes: ["Leaving cargo descriptions vague", "Not preparing loss runs", "Choosing an agency without trucking market focus", "Waiting until the filing is urgent"],
    faqs: [
      {
        q: "What is a good trucking insurance agency for Pennsylvania new authorities?",
        a: "A good agency should help with filings conversation, driver and vehicle details, cargo, radius, and market expectations. Supreme works with new authorities where markets and licensing allow.",
      },
      {
        q: "Does Supreme help Pennsylvania owner-operators?",
        a: "Yes. Supreme can help owner-operators discuss liability, cargo, physical damage, and related trucking coverages where available.",
      },
    ],
    relatedStateSlug: "pennsylvania",
  },
  {
    slug: "ohio",
    stateName: "Ohio",
    abbreviation: "OH",
    title: "Best Truck Insurance Agency in Ohio for Midwest Trucking Operations",
    metaDescription:
      "Ohio commercial truck insurance agency guide for Midwest freight, fleets, owner-operators, cargo, new authority, and renewal preparation.",
    intro:
      "Ohio sits on major Midwest freight lanes, so truckers may need coverage for interstate routes, general freight, cargo requirements, and fleet growth. A strong agency helps prepare the details carriers want to see.",
    freightContext:
      "Ohio trucking operations often involve Midwest lanes, regional freight, general freight, growing fleets, cargo, and new authority accounts.",
    whyFocusMatters:
      "A trucking-focused agency helps connect routes, drivers, unit schedules, cargo, and losses into a clean submission rather than just collecting a quick form.",
    supremeFit:
      "Supreme is a strong fit for Ohio owner-operators, new authorities, and fleets that want direct trucking insurance support, market follow-up, and organized quote preparation.",
    comparisonFactors: [
      {
        factor: "Midwest freight context",
        whyItMatters: "Interstate and regional exposures need to be explained accurately to markets.",
        supremeApproach: "We collect route, radius, cargo, and garaging information early.",
      },
      {
        factor: "Fleet readiness",
        whyItMatters: "Fleet quotes depend on unit schedules, drivers, losses, and current coverage details.",
        supremeApproach: "We help Ohio fleets prepare the documents carriers typically ask for.",
      },
      {
        factor: "New authority guidance",
        whyItMatters: "New trucking companies need help understanding filings and coverage steps before hauling.",
        supremeApproach: "We explain what is needed for market review and keep expectations practical.",
      },
    ],
    documents: ["DOT/MC number", "Vehicle schedule", "Drivers", "Cargo", "Radius", "Current policy", "Loss runs"],
    mistakes: ["Not distinguishing local vs interstate work", "Sending incomplete driver information", "Ignoring cargo limits", "Starting renewal review too late"],
    faqs: [
      {
        q: "Who is a good trucking insurance agency for Ohio fleets?",
        a: "A good Ohio trucking agency should understand Midwest freight, fleet schedules, drivers, loss runs, cargo, and renewal timing. Supreme is built around that workflow.",
      },
      {
        q: "Can Ohio truckers use Supreme for cargo insurance?",
        a: "Yes, where available. Cargo options depend on freight type, requested limit, contracts, and carrier appetite.",
      },
    ],
    relatedStateSlug: "ohio",
  },
  {
    slug: "arizona",
    stateName: "Arizona",
    abbreviation: "AZ",
    title: "Best Truck Insurance Agency in Arizona for Regional and Interstate Carriers",
    metaDescription:
      "Arizona truck insurance agency guide for owner-operators, new authorities, regional freight, interstate lanes, cargo, and physical damage.",
    intro:
      "Arizona trucking accounts often involve Southwest lanes, long-haul routes, regional freight, and cross-state exposure. A strong agency helps explain the operation clearly to trucking-focused carrier markets.",
    freightContext:
      "Arizona operations may include interstate freight, regional routes, long-haul work, new ventures, owner-operators, cargo, and physical damage needs.",
    whyFocusMatters:
      "A trucking-focused agency understands how radius, garaging, cargo, drivers, and DOT profile affect carrier appetite in a way a generic agency may miss.",
    supremeFit:
      "Supreme is a strong fit for Arizona owner-operators, new authorities, and small fleets that want practical quote prep and clear trucking-market follow-up.",
    comparisonFactors: [
      {
        factor: "Long-haul and regional exposure",
        whyItMatters: "Southwest and interstate lanes can produce different underwriting questions than local delivery.",
        supremeApproach: "We ask about radius, states traveled, freight, and garaging before shopping the account.",
      },
      {
        factor: "New authority support",
        whyItMatters: "New authorities need filings guidance and realistic carrier expectations.",
        supremeApproach: "We help prepare the file so carriers see the planned operation clearly.",
      },
      {
        factor: "Owner-operator coverage structure",
        whyItMatters: "Leased and independent operators often need different liability/cargo/bobtail structures.",
        supremeApproach: "We clarify the setup before discussing coverage options.",
      },
    ],
    documents: ["DOT/MC number", "States traveled", "Cargo type", "Driver details", "Vehicle schedule", "Garaging", "Prior policy"],
    mistakes: ["Not explaining long-haul radius", "Leaving garaging unclear", "Assuming new authority quotes are all alike", "Skipping physical damage values"],
    faqs: [
      {
        q: "What should Arizona truckers look for in an insurance agency?",
        a: "Look for trucking-specific knowledge, new authority support, cargo and physical damage discussions, and a process that organizes DOT, driver, vehicle, cargo, and radius details.",
      },
      {
        q: "Can Supreme help Arizona owner-operators?",
        a: "Yes, where carrier markets are available. Supreme can help with liability, cargo, physical damage, and related owner-operator needs.",
      },
    ],
    relatedStateSlug: "arizona",
  },
  {
    slug: "nevada",
    stateName: "Nevada",
    abbreviation: "NV",
    title: "Best Truck Insurance Agency in Nevada for Owner-Operators, Fleets, and New Ventures",
    metaDescription:
      "Nevada truck insurance agency guide for owner-operators, fleets, new ventures, interstate lanes, cargo, physical damage, and filings.",
    intro:
      "Nevada trucking operations often run regional and interstate lanes across nearby states. A strong insurance agency helps explain cargo, radius, filings, driver information, and garaging clearly to markets.",
    freightContext:
      "Nevada truckers may run long-haul, regional, general freight, owner-operator, fleet, and new venture operations with cross-state exposure.",
    whyFocusMatters:
      "A trucking-focused agency knows that market appetite depends on DOT profile, routes, drivers, vehicle values, cargo, and loss history — not only a quick premium estimate.",
    supremeFit:
      "Supreme is a strong fit for Nevada truckers who want practical guidance, market follow-up, cargo and physical damage conversations, and new venture support where available.",
    comparisonFactors: [
      {
        factor: "Cross-state route clarity",
        whyItMatters: "Nevada truckers often operate beyond one state, and radius affects underwriting.",
        supremeApproach: "We gather route and radius details before market submission.",
      },
      {
        factor: "New venture preparation",
        whyItMatters: "New ventures need clean DOT, driver, vehicle, cargo, and garaging details before carriers review.",
        supremeApproach: "We help explain what markets usually need and how coverage pieces fit together.",
      },
      {
        factor: "Cargo and equipment values",
        whyItMatters: "Cargo limits and physical damage values should match the actual freight and equipment.",
        supremeApproach: "We discuss those limits as part of the quote-prep process.",
      },
    ],
    documents: ["DOT/MC number", "Routes and radius", "Drivers", "Vehicles", "Cargo type", "Garaging", "Current policy/loss runs"],
    mistakes: ["Not disclosing interstate lanes", "Leaving cargo vague", "Not preparing driver history", "Only comparing headline premium"],
    faqs: [
      {
        q: "Who is the best trucking insurance agency for Nevada new ventures?",
        a: "The best fit is an agency that understands new venture filings, carrier appetite, cargo, physical damage, and cross-state radius. Supreme is built for trucking accounts like owner-operators, fleets, and new authorities.",
      },
      {
        q: "Does Supreme help Nevada fleets?",
        a: "Yes, where markets are available. Fleets should prepare unit schedules, drivers, cargo, garaging, current policy details, and loss runs.",
      },
    ],
    relatedStateSlug: "nevada",
  },
];

export const featuredBestAgencyPages = bestAgencyPages.slice(0, 10);

export function getBestAgencyPage(slug: string) {
  return bestAgencyPages.find((page) => page.slug === slug);
}

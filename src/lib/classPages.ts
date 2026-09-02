/**
 * Coverage-by-operation pages: one per vehicle class or line of work that
 * truckers search for by name (dump truck, hotshot, box truck, reefer,
 * hazmat, tow, NEMT). Each lives at /<slug>. The state pages answer
 * "trucking insurance in Texas"; these answer "insurance for my kind of truck".
 */
export type ClassPage = {
  /** URL: /<slug> */
  slug: string;
  /** Short name used in links and breadcrumbs, e.g. "Dump truck insurance". */
  name: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  sectionTitle: string;
  intro: string[];
  listTitle: string;
  listItems: string[];
  quickFacts: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDescription: string;
  /** Search term for the Carrierlens market directory link. */
  carrierlensQuery: string;
};

export const classPages: ClassPage[] = [
  {
    slug: "dump-truck-insurance",
    name: "Dump truck insurance",
    metaTitle: "Dump Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Dump truck insurance for owner-operators and aggregate fleets: liability, physical damage, and the site and radius details carriers ask about. Multiple markets, fast quotes.",
    eyebrow: "Dump trucks",
    title: "Dump truck insurance for haulers who work the site, not the interstate.",
    description:
      "Aggregate, asphalt, demolition, and construction hauling carry different risks than freight — and different markets. We place dump trucks with carriers that write local and intrastate work.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Built for site work",
    intro: [
      "Dump trucks spend their day backing, tipping, and loading in places a freight truck never sees: quarries, job sites, plants, and residential streets. Underwriters price that exposure — rollover on uneven ground, overloads, backing incidents, and the wear on brakes and tires — and the markets that understand it are a shorter list.",
      "We help you present the operation clearly: radius, what you haul, whether you work for a contractor or on your own authority, and the sites you serve. That is what turns a dump truck submission into real quotes.",
    ],
    listTitle: "Coverage we arrange for dump trucks",
    listItems: [
      "Auto liability at the limits your contracts and filings require",
      "Physical damage — collision and comprehensive on the truck and dump body",
      "Motor truck cargo, where a contractor or broker requires it",
      "General liability for site work and contractor agreements",
      "Hired and non-owned auto for a fleet that also uses employee vehicles",
      "Workers compensation and occupational accident, where available",
    ],
    quickFacts: [
      { label: "Designed for", value: "Owner-operators, aggregate haulers, and construction fleets" },
      { label: "Typical work", value: "Sand, gravel, asphalt, dirt, demolition, and site hauling" },
      { label: "What carriers ask", value: "Radius, sites served, driver MVRs, and loss history" },
    ],
    faqs: [
      {
        q: "Do I need cargo insurance on a dump truck?",
        a: "Often not for your own aggregate loads, but many contractors and brokers require a cargo limit before they will dispatch you. We check the contract and quote it only if it is needed.",
      },
      {
        q: "Why is dump truck insurance priced differently than freight?",
        a: "The losses are different: tipping on uneven ground, backing at sites, overloads, and short heavy trips. Carriers that write dump work price those exposures and want to see your radius, the sites you serve, and the driver's experience with the equipment.",
      },
      {
        q: "I am new to dump truck hauling. Can I get covered?",
        a: "Usually yes. New ventures have fewer markets and higher rates in the first year. Clean MVRs, a realistic radius, and a described customer base help a new dump truck operation get quoted.",
      },
      {
        q: "Does intrastate vs. interstate matter?",
        a: "Yes. Most dump work is intrastate and local, which changes the filings, the minimum limits, and the carriers that will quote. We confirm which filings your state and your contracts require.",
      },
    ],
    ctaTitle: "Get a dump truck quote",
    ctaDescription: "Tell us the truck, the radius, and what you haul. We will tell you which markets fit and what they need.",
    carrierlensQuery: "dump truck",
  },
  {
    slug: "hotshot-insurance",
    name: "Hotshot insurance",
    metaTitle: "Hotshot Trucking Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Hotshot insurance for pickup-and-gooseneck operators: primary liability, cargo, and physical damage for the truck and trailer. Non-CDL and CDL hotshots, new authority welcome.",
    eyebrow: "Hotshot",
    title: "Hotshot insurance for the pickup and the trailer behind it.",
    description:
      "Hotshot operators run a heavy-duty pickup with a gooseneck or flatbed trailer — often under CDL weight, often on their own authority. We quote the whole rig, not just the truck.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Commercial coverage for a pickup that hauls for hire",
    intro: [
      "Hotshot trucking looks like a pickup to a personal-lines company and like a freight truck to the FMCSA. Once you haul for hire across state lines you need operating authority, primary liability at commercial limits, and usually the cargo limit your brokers ask for — and a personal auto policy will not respond.",
      "We work with markets that write hotshot: Class 3 to 5 pickups, gooseneck and flatbed trailers, expedited and LTL freight, oilfield and equipment moves. The submission covers the truck, the trailer, the freight, and where you run.",
    ],
    listTitle: "Coverage we arrange for hotshot operators",
    listItems: [
      "Primary auto liability — most brokers ask for $1,000,000 even when the federal minimum is lower",
      "Motor truck cargo, typically $100,000 for broker load boards",
      "Physical damage on the pickup and the trailer",
      "Trailer interchange, if you pull trailers you do not own",
      "Non-trucking liability / bobtail, if you lease on to a carrier",
      "General liability, where a shipper or yard requires it",
    ],
    quickFacts: [
      { label: "Designed for", value: "Non-CDL and CDL hotshot operators on their own authority or leased on" },
      { label: "Typical rig", value: "3/4-ton to 1.5-ton pickup with gooseneck, flatbed, or step-deck trailer" },
      { label: "What carriers ask", value: "Gross combination weight, freight, radius, and driving history" },
    ],
    faqs: [
      {
        q: "Do I need a CDL to run hotshot?",
        a: "Not if your truck and trailer stay under 26,001 pounds gross combination weight rating. Above that, a CDL applies. Either way, for-hire interstate work needs operating authority and commercial insurance.",
      },
      {
        q: "How much liability do brokers require for hotshot?",
        a: "Most brokers and load boards ask for $1,000,000 in auto liability and $100,000 in cargo, even though the federal minimum for general freight is lower. We quote to what your brokers actually require.",
      },
      {
        q: "Will my personal auto policy cover the pickup?",
        a: "Not for for-hire hauling. Personal policies exclude commercial use, and a claim while loaded can be denied. A commercial auto policy written for hotshot covers the truck, the trailer, and the freight.",
      },
      {
        q: "Can a brand-new hotshot authority get insurance?",
        a: "Yes. New ventures have fewer markets and pay more in the first year; a clean MVR and a realistic plan for freight and radius make the difference. Rates usually improve at the first renewal.",
      },
    ],
    ctaTitle: "Get a hotshot quote",
    ctaDescription: "Send us the truck, the trailer, and the freight you plan to haul. We will quote the rig to what your brokers require.",
    carrierlensQuery: "hotshot",
  },
  {
    slug: "box-truck-insurance",
    name: "Box truck insurance",
    metaTitle: "Box Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Box truck insurance for local delivery, moving, expediting, and final-mile operators: liability, cargo, physical damage, and the coverages contracts require. Fast quotes from multiple markets.",
    eyebrow: "Box trucks",
    title: "Box truck insurance for delivery, moving, and final-mile work.",
    description:
      "Straight trucks do local, repetitive work — many stops, tight streets, loading docks, and contracts with their own insurance requirements. We match the policy to the work and the contract.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Coverage shaped by the route, not the mileage",
    intro: [
      "A box truck's risk is the day: dozens of stops, backing into docks, residential streets, and drivers who are in and out of the cab. Underwriters look at the radius, the number of stops, the freight, and whether you run under contract for a retailer, a carrier, or a moving company.",
      "We quote box trucks from 16 to 26 feet — non-CDL straight trucks and CDL units — for owner-operators and small fleets, and we read the contract first so the certificate matches what the customer requires.",
    ],
    listTitle: "Coverage we arrange for box trucks",
    listItems: [
      "Auto liability at the limit your contracts require",
      "Motor truck cargo, including household goods where you move residential customers",
      "Physical damage — collision and comprehensive, including the box and liftgate",
      "General liability for deliveries onto customer premises",
      "Hired and non-owned auto for fleets whose staff also drive personal vehicles",
      "Non-trucking liability, if you lease on to a carrier",
    ],
    quickFacts: [
      { label: "Designed for", value: "Owner-operators and small fleets running local and regional straight trucks" },
      { label: "Typical work", value: "Final-mile delivery, expediting, moving, furniture and appliance, dedicated routes" },
      { label: "What carriers ask", value: "Radius, stops per day, contracts, driver MVRs, and loss history" },
    ],
    faqs: [
      {
        q: "Do I need a CDL for a box truck?",
        a: "Not under 26,001 pounds GVWR. Most 16- to 26-foot box trucks are non-CDL. Insurance is still commercial: personal auto policies exclude business use.",
      },
      {
        q: "What does a delivery contract usually require?",
        a: "Commonly $1,000,000 auto liability, cargo, and general liability, with the customer named as additional insured or certificate holder. Send us the contract and we will quote to it.",
      },
      {
        q: "Does moving household goods need different coverage?",
        a: "Yes. Household goods cargo has its own valuation rules and exclusions, and interstate movers need specific authority. We arrange cargo that matches how you move and what you are liable for.",
      },
      {
        q: "Can I insure one box truck without a fleet?",
        a: "Yes. Single-unit box trucks are one of the most common policies we write, for new ventures and established operators alike.",
      },
    ],
    ctaTitle: "Get a box truck quote",
    ctaDescription: "Tell us the truck, the route, and the contract you are working under. We quote to the certificate the customer wants.",
    carrierlensQuery: "box truck",
  },
  {
    slug: "reefer-truck-insurance",
    name: "Reefer truck insurance",
    metaTitle: "Reefer Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Refrigerated trucking insurance: motor truck cargo with reefer breakdown coverage, spoilage, liability, and physical damage for reefer units. Markets that write temperature-controlled freight.",
    eyebrow: "Refrigerated freight",
    title: "Reefer truck insurance that covers the load when the unit fails.",
    description:
      "Refrigerated freight is the cargo that can spoil in your trailer while nothing else goes wrong. The right cargo policy pays for that — the wrong one excludes it.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Cargo coverage written for temperature-controlled loads",
    intro: [
      "Produce, meat, dairy, frozen goods, and pharmaceuticals all ride on a refrigeration unit that can fail, run out of fuel, or be set to the wrong temperature. Standard motor truck cargo often excludes spoilage unless reefer breakdown coverage is added, and shippers will ask for it by name.",
      "We place reefer operations with carriers that write temperature-controlled freight, and we check the cargo form for what is actually covered: mechanical breakdown, driver error on temperature, contamination, and the high-value theft exposure of a loaded reefer.",
    ],
    listTitle: "Coverage we arrange for reefer operations",
    listItems: [
      "Motor truck cargo with reefer breakdown / spoilage coverage",
      "Cargo limits sized to your loads — often $100,000 to $250,000 for refrigerated freight",
      "Auto liability at contract limits",
      "Physical damage on the tractor and the reefer trailer, including the unit",
      "Trailer interchange for pulled trailers",
      "General liability where shippers and cold-storage facilities require it",
    ],
    quickFacts: [
      { label: "Designed for", value: "Owner-operators and fleets hauling temperature-controlled freight" },
      { label: "Typical loads", value: "Produce, meat and poultry, dairy, frozen goods, pharmaceuticals" },
      { label: "What carriers ask", value: "Cargo type, load values, trailer and unit age, and reefer maintenance" },
    ],
    faqs: [
      {
        q: "Is spoilage covered by regular cargo insurance?",
        a: "Frequently not. Many cargo forms exclude temperature-related loss unless reefer breakdown coverage is endorsed. We confirm it is on the policy before you haul refrigerated loads.",
      },
      {
        q: "Does reefer breakdown cover driver error?",
        a: "It depends on the form. Some cover a unit that fails mechanically but exclude a unit set to the wrong temperature or never turned on. We read the wording and tell you what you have.",
      },
      {
        q: "Why do carriers ask about the age of the reefer trailer?",
        a: "Older units fail more often, and some markets limit reefer breakdown to trailers under a certain age. Maintenance records and a newer unit widen your options.",
      },
      {
        q: "What cargo limit do I need for reefer freight?",
        a: "Most brokers require at least $100,000; high-value loads such as meat or pharmaceuticals often need $250,000 or more. We size the limit to the loads you actually haul.",
      },
    ],
    ctaTitle: "Get a reefer quote",
    ctaDescription: "Tell us what you haul, the trailer and unit, and your typical load value. We quote cargo that actually covers spoilage.",
    carrierlensQuery: "reefer",
  },
  {
    slug: "hazmat-trucking-insurance",
    name: "Hazmat trucking insurance",
    metaTitle: "Hazmat Trucking Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Hazmat trucking insurance: $1M and $5M liability limits under federal rules, pollution liability, cargo, and the MCS-90. Markets that write hazardous materials and hazardous waste haulers.",
    eyebrow: "Hazardous materials",
    title: "Hazmat trucking insurance at the limits the federal rules require.",
    description:
      "Hazardous materials haulers carry higher federal minimums, pollution exposure, and a short list of willing carriers. We know which markets write hazmat and what they need to see.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Higher limits, fewer markets, more documentation",
    intro: [
      "Federal financial responsibility rules set higher minimum liability for hazardous materials — $1,000,000 for many hazmat and hazardous-waste loads and $5,000,000 for the most dangerous materials in bulk — and the MCS-90 endorsement puts the insurer on the hook for the public. Most trucking markets simply do not write it.",
      "We work with carriers that do: fuel and petroleum, chemicals, gases, hazardous waste, and other regulated classes. The submission includes your hazmat classes, safety permit, driver endorsements, and loss history, because that is what the underwriter decides on.",
    ],
    listTitle: "Coverage we arrange for hazmat carriers",
    listItems: [
      "Auto liability at $1,000,000 or $5,000,000 to match your hazmat classes and filings",
      "MCS-90 endorsement and federal filings",
      "Pollution liability for spills and cleanup — usually beyond what the MCS-90 alone provides",
      "Motor truck cargo for the product hauled",
      "Physical damage on tractors, tankers, and trailers",
      "General liability and workers compensation where required",
    ],
    quickFacts: [
      { label: "Designed for", value: "Tank, chemical, gas, and hazardous-waste carriers, from single units to fleets" },
      { label: "Federal minimums", value: "$1,000,000 for many hazmat loads; $5,000,000 for the highest-hazard bulk classes" },
      { label: "What carriers ask", value: "Hazmat classes, safety permit, driver H endorsements, and loss history" },
    ],
    faqs: [
      {
        q: "What liability limit does hazmat require?",
        a: "Federal rules set $1,000,000 for oil and many hazardous materials and $5,000,000 for the highest-hazard materials in bulk, such as certain explosives, poison gas, and radioactive materials. Your exact minimum depends on what you haul and how; we confirm it against your hazmat classes.",
      },
      {
        q: "Does the MCS-90 cover a spill cleanup?",
        a: "The MCS-90 makes the insurer pay the public for certain losses, including environmental restoration, but it is not the same as pollution liability coverage for your own defense and cleanup costs. Most hazmat operations need a pollution liability policy or endorsement in addition.",
      },
      {
        q: "Why is hazmat insurance hard to get?",
        a: "Fewer carriers write it, the limits are high, and a single loss can be severe. A clean safety record, current permits, endorsed drivers, and good documentation are what get a hazmat account quoted.",
      },
      {
        q: "Do you insure hazardous waste haulers?",
        a: "Yes, with markets that write hazardous and industrial waste. Waste haulers also need to show their EPA and state registrations and the facilities they serve.",
      },
    ],
    ctaTitle: "Get a hazmat quote",
    ctaDescription: "Send us your hazmat classes, permits, and equipment list. We will tell you which markets will look at the account and at what limits.",
    carrierlensQuery: "hazmat",
  },
  {
    slug: "tow-truck-insurance",
    name: "Tow truck insurance",
    metaTitle: "Tow Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Tow truck insurance for wreckers, rollbacks, and roadside operators: on-hook towing, garagekeepers, liability, and physical damage. Motor club and rotation contract requirements handled.",
    eyebrow: "Towing & recovery",
    title: "Tow truck insurance for the vehicle on the hook and the one in your yard.",
    description:
      "Towing has two exposures a freight policy never sees — the customer's vehicle while you tow it, and the customer's vehicle while you store it. We write both, plus the truck.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Coverage for other people's vehicles",
    intro: [
      "A tow operator is liable for other people's vehicles: on the hook, on the bed, and on the lot. On-hook towing coverage pays for the vehicle in tow; garagekeepers pays for vehicles stored at your yard. Neither is part of ordinary trucking insurance, and motor clubs, police rotation lists, and repo clients each have their own certificate requirements.",
      "We work with markets that write towing and recovery — light-duty rollbacks, heavy wreckers, roadside assistance, and repossession — and we build the policy around the contracts you hold.",
    ],
    listTitle: "Coverage we arrange for tow operators",
    listItems: [
      "Auto liability for the tow trucks",
      "On-hook towing coverage for customer vehicles in tow",
      "Garagekeepers coverage for vehicles stored on your lot",
      "Physical damage on wreckers and rollbacks, including the boom and bed equipment",
      "General liability for roadside work and customer premises",
      "Repossession and motor-club contract requirements, where you hold them",
    ],
    quickFacts: [
      { label: "Designed for", value: "Light-duty, heavy-duty, roadside, rotation, and repo tow operators" },
      { label: "Typical fleet", value: "Rollbacks, wreckers, flatbeds, and service trucks" },
      { label: "What carriers ask", value: "Types of towing, rotation and motor club contracts, storage yard, and driver MVRs" },
    ],
    faqs: [
      {
        q: "What is on-hook coverage?",
        a: "Coverage for damage to a customer's vehicle while you are towing or carrying it. It is separate from physical damage on your own truck and from liability, and most tow contracts require a specific on-hook limit.",
      },
      {
        q: "Do I need garagekeepers if I store vehicles overnight?",
        a: "Yes, if you want the vehicles in your yard covered for fire, theft, vandalism, or collision while stored. Garagekeepers is the coverage for that, and rotation and repo contracts usually require it.",
      },
      {
        q: "Can you insure a new towing business?",
        a: "Yes. New tow operations have fewer markets, and the contracts you plan to hold, your yard, and your driving record decide the options. Rates usually improve after the first clean year.",
      },
      {
        q: "Does repo work change the policy?",
        a: "It does. Repossession carries its own liability exposures and some carriers exclude it. Tell us before you take repo assignments so the policy is written to include it.",
      },
    ],
    ctaTitle: "Get a tow truck quote",
    ctaDescription: "Tell us the trucks, the kinds of towing you do, and the contracts you hold. We quote on-hook and garagekeepers alongside the truck.",
    carrierlensQuery: "towing",
  },
  {
    slug: "nemt-insurance",
    name: "NEMT insurance",
    metaTitle: "NEMT Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Non-emergency medical transportation insurance: commercial auto liability at broker-required limits, general liability, and coverage for wheelchair vans and ambulettes. Markets that write NEMT.",
    eyebrow: "Non-emergency medical transportation",
    title: "NEMT insurance for wheelchair vans, ambulettes, and medical transport fleets.",
    description:
      "Non-emergency medical transportation is passenger work with contracts that dictate the limits. We place NEMT operators with the carriers that write it and match the certificate to the broker.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Passenger coverage written to the contract",
    intro: [
      "NEMT operators carry patients — wheelchair, stretcher, and ambulatory — under contracts with transportation brokers, Medicaid programs, hospitals, and dialysis centers. Those contracts set the insurance: commonly $1,000,000 to $1,500,000 in auto liability, general liability, and specific endorsements, before you can accept a single trip.",
      "Few auto markets write passenger transportation, and fewer write medical transport. We know which do, what they charge, and what they need to see: vehicles and lifts, driver screening, trip volume, and the contracts you hold.",
    ],
    listTitle: "Coverage we arrange for NEMT operators",
    listItems: [
      "Commercial auto liability at the limit your broker or state program requires",
      "General liability, including patient loading and unloading",
      "Hired and non-owned auto for staff vehicles",
      "Physical damage on vans, ambulettes, and lift equipment",
      "Abuse and molestation coverage where contracts require it",
      "Workers compensation where required for drivers and attendants",
    ],
    quickFacts: [
      { label: "Designed for", value: "Wheelchair van, ambulette, and stretcher transport operators, one van to a fleet" },
      { label: "Typical contracts", value: "Transportation brokers, Medicaid programs, hospitals, dialysis and adult day centers" },
      { label: "What carriers ask", value: "Vehicle list, lifts and securement, driver screening, trip volume, and contracts" },
    ],
    faqs: [
      {
        q: "How much liability does NEMT need?",
        a: "Most brokers and state Medicaid programs require $1,000,000 in auto liability, and some require $1,500,000 or more. General liability is usually required as well. We quote to the contract you are trying to sign.",
      },
      {
        q: "Is NEMT the same as ambulance insurance?",
        a: "No. NEMT is non-emergency transport without medical treatment en route. Ambulance operations carry medical professional exposure and a different set of markets. If you do both, the policy must be written for both.",
      },
      {
        q: "Can a new NEMT company get insured?",
        a: "Yes. New NEMT operations are placed regularly, with fewer markets and higher first-year rates. Clean driver records, a lift-equipped vehicle in good condition, and a signed or pending broker contract help.",
      },
      {
        q: "What does the broker want on the certificate?",
        a: "Usually the broker named as additional insured and certificate holder, the required limits, and sometimes endorsements such as waiver of subrogation. Send us the requirements and we handle the certificate.",
      },
    ],
    ctaTitle: "Get an NEMT quote",
    ctaDescription: "Send us the vehicles and the broker's insurance requirements. We quote to the certificate they need to see.",
    carrierlensQuery: "NEMT",
  },
];

export function getClassPage(slug: string) {
  return classPages.find((page) => page.slug === slug);
}

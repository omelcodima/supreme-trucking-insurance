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
      "Hotshot (hot shot) operators run a heavy-duty pickup with a gooseneck or flatbed trailer — often under CDL weight, often on their own authority. We quote the whole rig, not just the truck.",
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
  {
    slug: "semi-truck-insurance",
    name: "Semi truck insurance",
    metaTitle: "Semi Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Semi truck insurance for owner-operators and fleets: liability, physical damage, cargo, and bobtail for 18-wheelers. Multiple trucking markets, fast quotes.",
    eyebrow: "Semi trucks & 18-wheelers",
    title: "Semi truck insurance for the tractor, the trailer, and the freight.",
    description:
      "Whether you run one 18-wheeler on your own authority or a fleet of tractors, the policy has to match the freight, the lanes, and the filings. We shop trucking markets that write semis.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "The four policies every semi runs on",
    intro: [
      "A semi truck policy is a stack: primary auto liability at the limit the FMCSA and your shippers require, physical damage on a tractor that may be worth more than the house, motor truck cargo for what is on the trailer, and bobtail or non-trucking liability for the miles you run without a load. Underwriters price the stack on the driver's record, the radius, the freight, and the loss history.",
      "We place semi trucks for owner-operators, leased-on drivers, and fleets — new authorities included — with carriers that write over-the-road and regional tractor-trailer operations, and we build the submission so the underwriter sees a clean file.",
    ],
    listTitle: "Coverage we arrange for semi trucks",
    listItems: [
      "Primary auto liability — $750,000 is the federal minimum for general freight; most brokers and shippers require $1,000,000",
      "Physical damage — collision and comprehensive on the tractor and trailer, at actual cash value or a stated amount",
      "Motor truck cargo for the freight you haul, at the limit your brokers require",
      "Bobtail / non-trucking liability for owner-operators leased to a carrier",
      "Trailer interchange when you pull trailers you do not own",
      "General liability, occupational accident, and workers compensation where required",
    ],
    quickFacts: [
      { label: "Designed for", value: "Owner-operators, leased-on drivers, and fleets running tractor-trailers" },
      { label: "Typical freight", value: "Dry van, reefer, flatbed, and specialized over-the-road freight" },
      { label: "What carriers ask", value: "Driver MVRs and CDL years, radius, freight, equipment values, and loss runs" },
    ],
    faqs: [
      {
        q: "How much is semi truck insurance?",
        a: "It depends on the driver's record, years of authority, radius, freight, equipment values, and loss history more than on the truck itself. New authorities and drivers with violations pay the most; leased-on operators who only need bobtail and physical damage pay far less. We quote from multiple markets so you can compare real numbers for your operation.",
      },
      {
        q: "What is the minimum insurance for a semi truck?",
        a: "For-hire interstate carriers hauling general freight must carry $750,000 in liability under FMCSA rules; hazardous materials require $1,000,000 or $5,000,000 depending on the material. Most brokers and shippers require $1,000,000 regardless. Cargo is not a federal requirement, but nearly every broker requires it.",
      },
      {
        q: "Does a leased-on owner-operator need their own policy?",
        a: "Usually the motor carrier covers liability while you are under dispatch. You still need bobtail or non-trucking liability for the rest of the time and physical damage on your own tractor — the carrier's policy does not pay for your truck.",
      },
      {
        q: "Can a new authority get semi truck insurance?",
        a: "Yes. New authorities have fewer markets and higher first-year premiums. A clean MVR, at least two years of CDL experience, a newer tractor, and a clear description of the freight and lanes get a new authority quoted.",
      },
    ],
    ctaTitle: "Get a semi truck quote",
    ctaDescription: "Send us the tractor, the trailer, the freight, and the driver's record. We quote the whole stack from trucking markets.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "bobtail-insurance",
    name: "Bobtail & non-trucking liability",
    metaTitle: "Bobtail Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Bobtail and non-trucking liability insurance for owner-operators leased to a carrier: what each covers, what your lease requires, and how to get it quoted fast.",
    eyebrow: "Bobtail & non-trucking liability",
    title: "Bobtail insurance for the miles you drive without a load.",
    description:
      "Leased to a carrier? Their policy covers you under dispatch. Bobtail and non-trucking liability cover the rest — deadheading home, running to the shop, the weekend.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Two coverages, one gap",
    intro: [
      "Bobtail liability covers the tractor when you are driving without a trailer, whether or not you are under dispatch — typically the trip back after dropping a load. Non-trucking liability covers you when you are not working for the motor carrier at all: personal use, the drive to the mechanic, the weekend. Most leases require one or both, and most owner-operators need both, because the carrier's policy stops the moment you are off dispatch.",
      "We write bobtail and non-trucking liability alongside physical damage for owner-operators leased to carriers of every size, and we read the lease so the certificate matches what your carrier requires.",
    ],
    listTitle: "Coverage we arrange for leased-on owner-operators",
    listItems: [
      "Bobtail liability — driving the tractor without a trailer",
      "Non-trucking liability — using the truck outside the carrier's dispatch",
      "Physical damage on the tractor you own, which the carrier's policy does not cover",
      "Occupational accident coverage, which many leases require in place of workers compensation",
      "Trailer interchange, if you pull the carrier's trailers",
      "Certificates that name the motor carrier as the lease requires",
    ],
    quickFacts: [
      { label: "Designed for", value: "Owner-operators leased to a motor carrier" },
      { label: "Typical requirement", value: "Most leases require bobtail or non-trucking liability plus physical damage" },
      { label: "What carriers ask", value: "The lease, the tractor, the driver's MVR, and the motor carrier you are leased to" },
    ],
    faqs: [
      {
        q: "What is the difference between bobtail and non-trucking liability?",
        a: "Bobtail liability applies when the tractor is driven without a trailer, even if you are under dispatch. Non-trucking liability applies when you are not under dispatch at all — personal use or errands — trailer or not. They overlap but neither replaces the other, which is why many leases ask for both.",
      },
      {
        q: "Does my motor carrier's insurance cover me?",
        a: "Only while you are under dispatch for that carrier, and only for liability. It does not cover your tractor for physical damage and it does not cover you between loads. Bobtail, non-trucking liability, and physical damage fill those gaps.",
      },
      {
        q: "How much does bobtail insurance cost?",
        a: "Bobtail and non-trucking liability are among the least expensive trucking coverages because the exposure is limited. The tractor's value, the driver's record, and the limits the lease requires set the premium; we quote it together with the physical damage so you see the whole cost.",
      },
      {
        q: "I run under my own authority — do I need bobtail?",
        a: "No. Under your own authority your primary liability policy covers the tractor with or without a trailer, on and off dispatch. Bobtail and non-trucking liability are for owner-operators leased to another carrier.",
      },
    ],
    ctaTitle: "Get a bobtail quote",
    ctaDescription: "Send us the lease and the tractor. We quote bobtail, non-trucking liability, and physical damage together.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "car-hauler-insurance",
    name: "Car hauler insurance",
    metaTitle: "Car Hauler Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Car hauler insurance for auto transporters: liability, cargo for vehicles in transit, physical damage, and the loading claims that make this class its own market.",
    eyebrow: "Auto haulers",
    title: "Car hauler insurance for the vehicles on your trailer.",
    description:
      "Auto transport is cargo that drives on and off the trailer, gets scratched at a dealer lot, and is often worth more than the truck. The markets that write it are few and specific.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Why car haulers are a class of their own",
    intro: [
      "The cargo on a car hauler is high-value, exposed, and handled at every stop: loading damage, chipped windshields, hail on an open trailer, and the occasional total loss of a vehicle that came off a ramp. Standard motor truck cargo forms often limit or exclude vehicles in transit, and dealers, auctions, and brokers require a specific per-vehicle and per-load limit before they hand over the keys.",
      "We work with the markets that write auto haulers — single-car hotshot rigs, wedge trailers, and multi-car stingers — and build the submission around the equipment, the lanes, and the contracts you haul under.",
    ],
    listTitle: "Coverage we arrange for car haulers",
    listItems: [
      "Motor truck cargo written for vehicles in transit, with per-vehicle and per-load limits",
      "Auto liability at the limits your brokers and auction contracts require",
      "Physical damage on the truck and the car-hauler trailer",
      "Loading and unloading coverage where the cargo form treats it separately",
      "General liability for dealer lots and customer premises",
      "Trailer interchange and hired / non-owned auto where needed",
    ],
    quickFacts: [
      { label: "Designed for", value: "Hotshot auto haulers, wedge and stinger operators, dealer and auction transporters" },
      { label: "Typical loads", value: "Dealer trades, auction vehicles, fleet moves, private transport" },
      { label: "What carriers ask", value: "Trailer type and capacity, vehicle values per load, lanes, and experience with the equipment" },
    ],
    faqs: [
      {
        q: "What cargo limit does a car hauler need?",
        a: "It depends on what you carry: a single luxury vehicle can exceed the limit that covers eight economy cars. Brokers and auctions commonly require $100,000 to $250,000 or more per load, and some want a per-vehicle limit. We size the limit to your typical and your highest-value loads.",
      },
      {
        q: "Does regular cargo insurance cover vehicles I haul?",
        a: "Frequently not, or only with sub-limits and exclusions for loading damage, hail, or theft. Auto hauler cargo is a specific form. We confirm the wording before you accept loads.",
      },
      {
        q: "Can I start car hauling with a pickup and a wedge trailer?",
        a: "Yes — this is the common hotshot auto-hauler setup. You still need operating authority for interstate for-hire work, liability at commercial limits, and cargo written for vehicles. Markets exist for new entrants with clean records.",
      },
      {
        q: "Why is car hauler insurance harder to place?",
        a: "The claims are frequent and expensive relative to the premium: loading and unloading damage, weather on open trailers, and total losses. Fewer carriers write the class, and they want to see experience, equipment condition, and how you secure and inspect vehicles.",
      },
    ],
    ctaTitle: "Get a car hauler quote",
    ctaDescription: "Tell us the trailer, the typical load values, and the lanes. We match you with markets that write auto transport.",
    carrierlensQuery: "auto hauler",
  },
  {
    slug: "cargo-van-insurance",
    name: "Cargo van insurance",
    metaTitle: "Cargo Van Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Commercial cargo van and Sprinter van insurance for expediters, couriers, and delivery contractors: liability, cargo, physical damage, and contract certificates.",
    eyebrow: "Cargo vans & Sprinters",
    title: "Cargo van insurance for expediting, courier, and delivery work.",
    description:
      "A Sprinter or Transit hauling for hire is a commercial truck to the FMCSA and to your customers. We write the van, the freight, and the certificate the contract asks for.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Commercial coverage for a van that works for hire",
    intro: [
      "Cargo vans and Sprinters do expedited freight, medical courier runs, final-mile delivery, and contract routes for carriers and retailers. The moment the van hauls for pay, personal auto is out, and most contracts ask for $1,000,000 in liability, a cargo limit, and sometimes general liability — before the first load.",
      "We place cargo vans for owner-operators and small fleets: expediters on load boards, couriers, delivery contractors, and leased-on van operators. The submission covers the van, the freight, the radius, and the contract.",
    ],
    listTitle: "Coverage we arrange for cargo vans",
    listItems: [
      "Commercial auto liability at contract limits",
      "Motor truck cargo for expedited freight and packages",
      "Physical damage — collision and comprehensive on the van",
      "Hired and non-owned auto for contractors who also use personal vehicles",
      "General liability where a customer or carrier requires it",
      "Non-trucking liability when leased on to an expedite carrier",
    ],
    quickFacts: [
      { label: "Designed for", value: "Expediters, couriers, medical transport, final-mile and route contractors" },
      { label: "Typical vans", value: "Sprinter, Transit, ProMaster, and cutaway cargo vans" },
      { label: "What carriers ask", value: "Radius, freight type, contracts, driver MVRs, and whether you are leased on" },
    ],
    faqs: [
      {
        q: "Do I need DOT authority for a cargo van?",
        a: "For-hire interstate hauling requires operating authority when you cross state lines for pay, regardless of vehicle size. Vans under 10,001 pounds GVWR are exempt from some federal safety rules but not from the need for commercial insurance, and a personal policy will not respond to a for-hire claim.",
      },
      {
        q: "What do expedite carriers require from a leased-on van?",
        a: "Usually physical damage on your van, non-trucking liability, and occupational accident coverage, with the carrier providing liability and cargo under dispatch. Check the lease; we quote to it.",
      },
      {
        q: "How much cargo coverage does a courier need?",
        a: "Medical and pharmaceutical couriers and expediters commonly need $100,000; some contracts ask for less and some for more. We match the limit to your contracts rather than a default.",
      },
      {
        q: "Is a cargo van cheaper to insure than a box truck?",
        a: "Usually, because the vehicle value and the loads are smaller, but the driver's record, the radius, and the contract limits matter more than the vehicle. We quote the van from markets that write light commercial vehicles for hire.",
      },
    ],
    ctaTitle: "Get a cargo van quote",
    ctaDescription: "Send us the van, the work you do, and any contract requirements. We quote the van as the commercial vehicle it is.",
    carrierlensQuery: "delivery",
  },
  {
    slug: "mcs-90",
    name: "MCS-90 endorsement",
    metaTitle: "MCS-90 Endorsement Explained | Supreme Trucking Insurance",
    metaDescription:
      "What the MCS-90 endorsement is, what it does and does not cover, the liability limits it certifies, and how it differs from the BMC-91 and BMC-91X filings.",
    eyebrow: "Guide",
    title: "The MCS-90 endorsement: what it is and what it actually covers.",
    description:
      "The MCS-90 is the federal endorsement on your liability policy that promises the public will be paid — even when your policy would not. Here is what that means for your premium and your risk.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "What the MCS-90 does",
    intro: [
      "Federal rules (49 CFR Part 387) require for-hire motor carriers to prove financial responsibility. The MCS-90 endorsement attached to your auto liability policy is how the insurer certifies it: if a member of the public is injured or their property damaged by your operation and the policy would otherwise not pay — an excluded vehicle, a driver not on the schedule, a lapsed premium — the insurer pays up to the federal minimum anyway, and then has the right to recover that money from you.",
      "It is a guarantee to the public, not extra coverage for you. The limits it certifies are $750,000 for general freight, $1,000,000 for oil and most hazardous materials, and $5,000,000 for the highest-hazard materials in bulk. Your BMC-91 or BMC-91X filing with the FMCSA tells the government the endorsement exists; the endorsement itself sits on the policy.",
    ],
    listTitle: "What the MCS-90 is — and is not",
    listItems: [
      "Required on the liability policy of every for-hire interstate carrier subject to FMCSA financial-responsibility rules",
      "Pays the public up to the certified limit even when the policy has an exclusion or lapse that would otherwise apply",
      "Gives the insurer a right of reimbursement from you for anything it paid that the policy did not cover",
      "Does not cover your own truck, your cargo, or your drivers' injuries",
      "Does not raise your policy limits — it certifies a minimum, and most brokers still require $1,000,000",
      "Is distinct from the BMC-91 / BMC-91X filing, which is the insurer's notice to the FMCSA that the endorsement is in force",
    ],
    quickFacts: [
      { label: "Applies to", value: "For-hire interstate carriers under FMCSA financial-responsibility rules" },
      { label: "Limits certified", value: "$750,000 general freight · $1,000,000 oil and most hazmat · $5,000,000 highest-hazard bulk" },
      { label: "Related filings", value: "BMC-91 (single insurer) or BMC-91X (more than one insurer)" },
    ],
    faqs: [
      {
        q: "Does the MCS-90 mean I am always covered?",
        a: "No. It means the injured public is paid. If the loss was excluded under your policy, the insurer pays the claimant and then bills you for it. Keep your drivers scheduled, your vehicles listed, and your premium current so the policy itself responds.",
      },
      {
        q: "What is the difference between MCS-90 and BMC-91?",
        a: "The MCS-90 is an endorsement on your insurance policy. The BMC-91 (or BMC-91X when more than one insurer is involved) is the filing your insurer sends to the FMCSA to prove that coverage. Your authority stays active only while a valid filing is on record.",
      },
      {
        q: "Do intrastate carriers need an MCS-90?",
        a: "The federal MCS-90 rules apply to interstate operations and to intrastate hazardous-materials carriers; many states have their own intrastate financial-responsibility forms and filings. We confirm which filings your operation actually requires.",
      },
      {
        q: "Why did my premium change when the MCS-90 was added?",
        a: "Because the insurer is taking on a guarantee beyond the policy terms. Markets price that exposure, and some will not write it at all — which is why for-hire authority narrows the list of carriers that will quote a new operation.",
      },
    ],
    ctaTitle: "Need liability with the MCS-90 and filings done right?",
    ctaDescription: "We place for-hire carriers with markets that file the BMC-91 promptly and quote at the limits your brokers require.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "amazon-relay-insurance-requirements",
    name: "Amazon Relay insurance requirements",
    metaTitle: "Amazon Relay Insurance Requirements | Supreme Trucking",
    metaDescription:
      "The insurance Amazon Relay requires from carriers — liability, cargo, general liability, and certificate details — and how to get a policy that passes the check.",
    eyebrow: "Guide",
    title: "Amazon Relay insurance requirements, and how to meet them.",
    description:
      "Amazon Relay checks your certificate before you can book loads. The limits are higher than the federal minimums, and the certificate wording has to be exact.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "What Amazon Relay checks",
    intro: [
      "Amazon Relay onboarding asks for a certificate of insurance showing commercial auto liability of at least $1,000,000 per occurrence covering owned, hired, and non-owned vehicles, commercial general liability, cargo coverage of at least $100,000, and — for carriers with employees — workers compensation as your state requires. Amazon must be listed as certificate holder and additional insured where the portal says so, and the coverage has to stay active: a lapse suspends your Relay account.",
      "Requirements change and vary by program; Amazon's carrier portal is the source of truth, and we read the current requirement with you before we quote. Then we place the policy with a market that writes Relay carriers and issue a certificate that matches what the portal asks for, wording included.",
    ],
    listTitle: "Coverage Amazon Relay typically requires",
    listItems: [
      "Commercial auto liability of $1,000,000 per occurrence, covering owned, hired, and non-owned vehicles",
      "Commercial general liability of $1,000,000 per occurrence and $2,000,000 aggregate",
      "Motor truck cargo of at least $100,000 per occurrence",
      "Workers compensation as required by your state, with employer's liability",
      "Amazon listed as certificate holder and additional insured where the portal requires it",
      "Continuous coverage — a lapse or a cancelled policy suspends the account",
    ],
    quickFacts: [
      { label: "Designed for", value: "Box truck, tractor-trailer, and cargo van carriers onboarding to Amazon Relay" },
      { label: "Common limits", value: "$1M auto liability · $1M/$2M general liability · $100K cargo" },
      { label: "What carriers ask", value: "USDOT/MC, equipment list, driver MVRs, and whether you are new to Relay or renewing" },
    ],
    faqs: [
      {
        q: "Does a new authority qualify for Amazon Relay insurance?",
        a: "Amazon sets its own eligibility rules, including how long your authority must be active; those rules are separate from insurance. On the insurance side, new authorities can be placed at Relay limits with fewer markets and higher first-year premiums.",
      },
      {
        q: "Is general liability really required for a trucking carrier?",
        a: "For Amazon Relay, yes — it is the requirement that catches carriers used to a liability-and-cargo-only policy. We add truckers general liability to the submission so the certificate passes.",
      },
      {
        q: "What if my certificate is rejected?",
        a: "Usually the limits, the additional-insured wording, or the certificate holder are wrong. Send us the rejection notice; correcting the certificate is routine when the policy itself meets the requirement.",
      },
      {
        q: "Can I use a box truck for Amazon Relay?",
        a: "Yes — box trucks, tractors, and cargo vans all run Relay loads, each with its own program requirements. The insurance requirements are similar; the equipment type changes the market and the premium.",
      },
    ],
    ctaTitle: "Get a Relay-ready quote",
    ctaDescription: "Tell us the trucks and whether you are onboarding or renewing. We quote to Amazon's limits and issue the certificate the portal wants.",
    carrierlensQuery: "delivery",
  },
];

export function getClassPage(slug: string) {
  return classPages.find((page) => page.slug === slug);
}

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
      "Compare dump truck insurance for owner-operators and aggregate fleets. Review liability, physical damage, job sites, and operating radius with Supreme.",
    eyebrow: "Dump trucks",
    title: "Dump truck insurance for haulers who work the site, not the interstate.",
    description:
      "Aggregate, asphalt, demolition, and construction hauling have distinct insurance needs. Describe your local or intrastate operation for review by a licensed insurance professional.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Built for site work",
    intro: [
      "Dump trucks spend their day backing, tipping, and loading in places a freight truck never sees: quarries, job sites, plants, and residential streets. Underwriters price that exposure — rollover on uneven ground, overloads, backing incidents, and the wear on brakes and tires — and the markets that understand it are a shorter list.",
      "We help organize your request: radius, what you haul, whether you work for a contractor or on your own authority, and the sites you serve. A complete request supports review but does not assure a quote or acceptance.",
    ],
    listTitle: "Coverage to discuss for dump trucks",
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
        a: "Cargo needs depend on ownership of the load, the operation, and your contracts. Ask the licensed professional reviewing your request about applicable requirements and any available terms; do not assume aggregate hauling is automatically covered or exempt.",
      },
      {
        q: "Why is dump truck insurance priced differently than freight?",
        a: "The losses are different: tipping on uneven ground, backing at sites, overloads, and short heavy trips. Carriers that write dump work price those exposures and want to see your radius, the sites you serve, and the driver's experience with the equipment.",
      },
      {
        q: "I am new to dump truck hauling. Can I get covered?",
        a: "You can submit a request for review. Availability and pricing depend on the operation, state, driver history, and underwriting. A new business is not assured of a quote or acceptance.",
      },
      {
        q: "Does intrastate vs. interstate matter?",
        a: "You can submit a request for local work. Describe the state, radius, loads, and contracts so a licensed professional can review requirements and possible options. A request does not assure insurer access or acceptance.",
      },
    ],
    ctaTitle: "Get a dump truck quote",
    ctaDescription: "Tell us the truck, the radius, and what you haul so a licensed professional can review your request and possible next steps.",
    carrierlensQuery: "dump truck",
  },
  {
    slug: "hotshot-insurance",
    name: "Hotshot insurance",
    metaTitle: "Hotshot Trucking Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Explore hotshot insurance for pickups and gooseneck trailers. Review liability, cargo, physical damage, and new-authority needs with Supreme.",
    eyebrow: "Hotshot",
    title: "Hotshot insurance for the pickup and the trailer behind it.",
    description:
      "Hotshot operators use pickups and trailers for a range of freight. Include both vehicles, the cargo, and your operating arrangement when requesting an insurance review.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Commercial coverage for a pickup that hauls for hire",
    intro: [
      "Hotshot trucking looks like a pickup to a personal-lines company and like a freight truck to the FMCSA. Once you haul for hire across state lines you need operating authority, primary liability at commercial limits, and usually the cargo limit your brokers ask for — and a personal auto policy will not respond.",
      "A hotshot submission should describe the pickup, gooseneck or flatbed trailer, expedited or LTL freight, equipment moves, and routes. A licensed professional can assess which options, if any, are available through their authorized channels.",
    ],
    listTitle: "Coverage to discuss for hotshot operators",
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
        a: "Brokers may request limits such as $1,000,000 in auto liability and $100,000 in cargo, but contracts and legal requirements vary. Provide the actual requirements for review; proposed limits do not assure contract acceptance or coverage for a loss.",
      },
      {
        q: "Will my personal auto policy cover the pickup?",
        a: "Personal auto policies may exclude for-hire hauling. Ask a licensed professional to review your use and policy terms. Commercial auto, physical damage, and motor truck cargo address different exposures; one policy label does not establish coverage for all three.",
      },
      {
        q: "Can a brand-new hotshot authority get insurance?",
        a: "Some insurers consider new ventures, subject to their underwriting criteria. Driver records, freight, radius, and other details affect the review. Neither acceptance nor a lower renewal premium is assured.",
      },
    ],
    ctaTitle: "Get a hotshot quote",
    ctaDescription: "Send the truck, trailer, planned freight, and broker requirements for a quote-request review. Available terms depend on underwriting.",
    carrierlensQuery: "hotshot",
  },
  {
    slug: "box-truck-insurance",
    name: "Box truck insurance",
    metaTitle: "Box Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Compare box truck insurance for delivery, moving, and final-mile work. Review liability, cargo, physical damage, and contract requirements with Supreme.",
    eyebrow: "Box trucks",
    title: "Box truck insurance for delivery, moving, and final-mile work.",
    description:
      "Straight trucks encounter frequent stops, tight streets, and loading docks. Include your contracts and delivery work in a request for review; policy terms and acceptance require insurer approval.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Coverage shaped by the route, not the mileage",
    intro: [
      "A box truck's risk is the day: dozens of stops, backing into docks, residential streets, and drivers who are in and out of the cab. Underwriters look at the radius, the number of stops, the freight, and whether you run under contract for a retailer, a carrier, or a moving company.",
      "For a box truck request, include vehicle size, driver qualifications, delivery routes, and customer contracts. Ask the servicing professional to review requested certificate wording against the actual policy; a certificate cannot add coverage.",
    ],
    listTitle: "Coverage to discuss for box trucks",
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
        a: "Contracts may specify liability, cargo, general liability, or additional-insured requirements. Send the actual contract for licensed professional review. A certificate holder is not automatically an additional insured, and a certificate cannot add coverage absent from the policy.",
      },
      {
        q: "Does moving household goods need different coverage?",
        a: "Household goods moving has distinct valuation rules, exclusions, and authority requirements. Describe the work and ask a licensed professional to review the applicable cargo forms and contracts. Availability is subject to underwriting.",
      },
      {
        q: "Can I insure one box truck without a fleet?",
        a: "You can request review for a single box truck. The business does not need to be a fleet to submit a request, but an insurer must determine eligibility and terms.",
      },
    ],
    ctaTitle: "Get a box truck quote",
    ctaDescription: "Tell us the truck, route, and contract requirements for review. Coverage and certificate wording must be confirmed by the authorized professional handling the policy.",
    carrierlensQuery: "box truck",
  },
  {
    slug: "reefer-truck-insurance",
    name: "Reefer truck insurance",
    metaTitle: "Reefer Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Explore reefer truck insurance for refrigerated freight. Discuss cargo, breakdown, spoilage, liability, and physical damage options with Supreme.",
    eyebrow: "Refrigerated freight",
    title: "Reefer truck insurance for temperature-controlled freight.",
    description:
      "Refrigerated freight can spoil after equipment failure or a temperature error. Whether a loss is covered depends on the cargo policy, endorsements, exclusions, and facts of the claim.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Cargo coverage written for temperature-controlled loads",
    intro: [
      "Produce, meat, dairy, frozen goods, and pharmaceuticals all ride on a refrigeration unit that can fail, run out of fuel, or be set to the wrong temperature. Standard motor truck cargo often excludes spoilage unless reefer breakdown coverage is added, and shippers will ask for it by name.",
      "Include temperature-controlled freight in your request and ask the licensed professional handling it about mechanical breakdown, temperature-setting errors, contamination, and theft. These exposures may have different conditions, exclusions, and limits.",
    ],
    listTitle: "Coverage to discuss for reefer operations",
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
        a: "Not necessarily. Cargo forms may exclude temperature-related loss or require a specific endorsement. Check the actual policy and ask the servicing agent or insurer to confirm the terms before relying on coverage.",
      },
      {
        q: "Does reefer breakdown cover driver error?",
        a: "It depends on the actual form, endorsements, exclusions, and facts of the loss. Mechanical failure, incorrect settings, and failure to operate the unit may be treated differently. Ask the servicing professional or insurer to explain the applicable terms.",
      },
      {
        q: "Why do carriers ask about the age of the reefer trailer?",
        a: "Insurers may consider equipment age and maintenance, and some forms restrict reefer breakdown by unit age. Maintenance records support the review but do not assure eligibility or broader coverage.",
      },
      {
        q: "What cargo limit do I need for reefer freight?",
        a: "Provide the actual contract requirements and your typical and maximum load values for review. The limit alone does not establish that a commodity or cause of loss is covered; available terms depend on underwriting and policy wording.",
      },
    ],
    ctaTitle: "Get a reefer quote",
    ctaDescription: "Include your freight, trailer, refrigeration unit, and load values. Ask for a review of spoilage conditions and exclusions; a request does not establish coverage.",
    carrierlensQuery: "reefer",
  },
  {
    slug: "hazmat-trucking-insurance",
    name: "Hazmat trucking insurance",
    metaTitle: "Hazmat Trucking Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Review hazmat trucking insurance with Supreme: liability limits, pollution liability, cargo, and MCS-90 needs for hazardous-material haulers.",
    eyebrow: "Hazardous materials",
    title: "Hazmat trucking insurance at the limits the federal rules require.",
    description:
      "Hazardous materials hauling can involve additional financial-responsibility requirements and pollution exposures. Eligibility and limits require review of the materials, operation, and applicable rules.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Higher limits, fewer markets, more documentation",
    intro: [
      "Federal financial responsibility rules set higher minimum liability for hazardous materials — $1,000,000 for many hazmat and hazardous-waste loads and $5,000,000 for the most dangerous materials in bulk — and the MCS-90 endorsement puts the insurer on the hook for the public. Most trucking markets simply do not write it.",
      "A request should identify fuel, chemicals, gases, hazardous waste, or other materials, plus permits, driver endorsements, and loss history. A licensed professional must confirm whether an authorized placement option is available.",
    ],
    listTitle: "Coverage to discuss for hazmat carriers",
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
        a: "Specialized exposures and potential loss severity can restrict insurer appetite. Safety records, permits, driver qualifications, and documentation inform underwriting; they do not assure a quote or acceptance.",
      },
      {
        q: "Can a hazardous waste hauler submit a request?",
        a: "You may submit details for review, including materials, EPA and state registrations, and facilities served. This website does not confirm insurer access, eligibility, or coverage for a hazardous waste operation.",
      },
    ],
    ctaTitle: "Get a hazmat quote",
    ctaDescription: "Send your hazmat classes, permits, and equipment list for a licensed professional to review. Available options and limits depend on underwriting and authorized access.",
    carrierlensQuery: "hazmat",
  },
  {
    slug: "tow-truck-insurance",
    name: "Tow truck insurance",
    metaTitle: "Tow Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Compare tow truck insurance for wreckers and rollbacks. Discuss on-hook towing, garagekeepers, liability, and physical damage options with Supreme.",
    eyebrow: "Towing & recovery",
    title: "Tow truck insurance for the vehicle on the hook and the one in your yard.",
    description:
      "Towing and vehicle storage create different exposures from hauling freight. Ask about on-hook towing, garagekeepers, and coverage for the tow truck itself.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Coverage for other people's vehicles",
    intro: [
      "On-hook towing and garagekeepers coverage may address different losses involving customer vehicles. Limits, exclusions, deductibles, and legal-liability or direct-coverage terms matter. Motor clubs, rotation lists, and repossession contracts may have additional requirements.",
      "Describe light-duty rollbacks, heavy wreckers, roadside assistance, storage, and repossession work in your request. The licensed professional reviewing it must confirm available terms through authorized channels.",
    ],
    listTitle: "Coverage to discuss for tow operators",
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
        a: "Garagekeepers coverage may be relevant to customer vehicles stored in your care. Review covered causes of loss, exclusions, deductibles, limits, and contract requirements with a licensed professional; storage alone does not establish coverage.",
      },
      {
        q: "Can you insure a new towing business?",
        a: "A new towing business can submit a request. Contracts, storage arrangements, driver history, state, and insurer criteria affect eligibility. Acceptance and future premium reductions are not assured.",
      },
      {
        q: "Does repo work change the policy?",
        a: "Repossession can create additional exposures and may be excluded. Disclose it before taking assignments and ask the servicing professional or insurer whether the policy covers the work; an endorsement may be required or unavailable.",
      },
    ],
    ctaTitle: "Get a tow truck quote",
    ctaDescription: "Tell us the trucks, towing work, storage arrangements, and contracts so your request can include questions about on-hook and garagekeepers coverage.",
    carrierlensQuery: "towing",
  },
  {
    slug: "nemt-insurance",
    name: "NEMT insurance",
    metaTitle: "NEMT Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Explore NEMT insurance for wheelchair vans and ambulettes. Review commercial auto, general liability, and broker-required limits with Supreme.",
    eyebrow: "Non-emergency medical transportation",
    title: "NEMT insurance for wheelchair vans, ambulettes, and medical transport fleets.",
    description:
      "Non-emergency medical transportation involves passenger exposures and contract-specific insurance requirements. A request requires review before any insurer access, terms, or certificate can be confirmed.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Passenger coverage written to the contract",
    intro: [
      "NEMT operators carry patients — wheelchair, stretcher, and ambulatory — under contracts with transportation brokers, Medicaid programs, hospitals, and dialysis centers. Those contracts set the insurance: commonly $1,000,000 to $1,500,000 in auto liability, general liability, and specific endorsements, before you can accept a single trip.",
      "Passenger transportation may require specialized underwriting. Include vehicles and lifts, driver screening, trip volume, and contracts. Availability and pricing are determined during review, not by this website.",
    ],
    listTitle: "Coverage to discuss for NEMT operators",
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
        a: "Requirements vary by state, passenger capacity, operation, and contract. Provide the actual broker or program requirements for licensed professional review. Neither a quote request nor a certificate assures enrollment or contract acceptance.",
      },
      {
        q: "Is NEMT the same as ambulance insurance?",
        a: "No. NEMT is non-emergency transport without medical treatment en route. Ambulance operations carry medical professional exposure and a different set of markets. If you do both, the policy must be written for both.",
      },
      {
        q: "Can a new NEMT company get insured?",
        a: "A new NEMT business can request review, but acceptance is not assured. Insurers may consider drivers, vehicle and lift condition, contracts, state, and the services provided.",
      },
      {
        q: "What does the broker want on the certificate?",
        a: "Requirements may include specified limits, certificate-holder information, additional insured status, or endorsements. Send the written requirements to the servicing professional. A certificate reflects existing coverage and cannot create an endorsement or assure contract acceptance.",
      },
    ],
    ctaTitle: "Get an NEMT quote",
    ctaDescription: "Send the vehicles and written broker requirements for review. Eligibility, policy terms, and certificate wording must be confirmed by the authorized professional handling the policy.",
    carrierlensQuery: "NEMT",
  },
  {
    slug: "semi-truck-insurance",
    name: "Semi truck insurance",
    metaTitle: "Semi Truck Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Review semi truck insurance needs for owner-operators and fleets: liability, physical damage, cargo, and leased-operator coverage. Request an agent review.",
    eyebrow: "Semi trucks & 18-wheelers",
    title: "Semi truck insurance for the tractor, the trailer, and the freight.",
    description:
      "Whether you run one tractor or a fleet, include the freight, routes, and filing requirements in your request. Available coverage depends on the operation and underwriting.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Coverage considerations for a semi-truck operation",
    intro: [
      "A semi truck policy is a stack: primary auto liability at the limit the FMCSA and your shippers require, physical damage on a tractor that may be worth more than the house, motor truck cargo for what is on the trailer, and bobtail or non-trucking liability for the miles you run without a load. Underwriters price the stack on the driver's record, the radius, the freight, and the loss history.",
      "Owner-operators, leased-on drivers, fleets, and new authorities can submit details for review. The licensed professional handling the request must confirm insurer access, eligibility, and proposed terms; submission alone does not establish any of these.",
    ],
    listTitle: "Coverage to discuss for semi trucks",
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
        a: "Premiums depend on driver history, years of authority, radius, freight, equipment values, limits, and losses. Request an individual review. The website does not provide a live carrier quote or assure a particular price or number of options.",
      },
      {
        q: "What is the minimum insurance for a semi truck?",
        a: "For-hire interstate carriers hauling general freight must carry $750,000 in liability under FMCSA rules; hazardous materials require $1,000,000 or $5,000,000 depending on the material. Most brokers and shippers require $1,000,000 regardless. Cargo is not a federal requirement, but nearly every broker requires it.",
      },
      {
        q: "Does a leased-on owner-operator need their own policy?",
        a: "Review the lease, the motor carrier's policy, and how the tractor is used with a licensed professional. Liability, non-trucking liability, bobtail, and physical damage address different exposures. Dispatch status alone does not determine coverage.",
      },
      {
        q: "Can a new authority get semi truck insurance?",
        a: "Some insurers consider new authorities. Driver experience, equipment, freight, routes, state, and underwriting criteria affect eligibility. No particular combination of details assures a quote or policy.",
      },
    ],
    ctaTitle: "Get a semi truck quote",
    ctaDescription: "Send the tractor, trailer, freight, and driver information for a review of your requested coverage. Options depend on underwriting and authorized placement channels.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "bobtail-insurance",
    name: "Bobtail & non-trucking liability",
    metaTitle: "Bobtail Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Review bobtail and non-trucking liability for leased owner-operators: policy differences, lease requirements, and information to prepare for an agent review.",
    eyebrow: "Bobtail & non-trucking liability",
    title: "Bobtail and non-trucking liability insurance",
    description:
      "Leased to a carrier? Review your lease, how you use the tractor, and the actual policy terms before choosing bobtail or non-trucking liability.",
    image: "/images/owner-operator-premium.jpg",
    sectionTitle: "Two coverages, one gap",
    intro: [
      "Bobtail generally describes liability coverage for a tractor operated without a trailer. Non-trucking liability generally addresses personal, non-business use. They are not the same coverage: an empty truck or an off-dispatch trip can still serve a business purpose.",
      "Send Supreme the lease and explain your actual trips, including travel between loads and for maintenance. We help review the required coverage and the available policy forms rather than assuming the carrier's policy stops at a particular dispatch status.",
    ],
    listTitle: "Coverage to discuss for leased-on owner-operators",
    listItems: [
      "Bobtail liability — driving the tractor without a trailer",
      "Non-trucking liability for eligible personal, non-business use",
      "Physical damage needs for your own tractor",
      "Occupational accident or workers compensation requirements, reviewed separately",
      "Trailer interchange or non-owned trailer needs, based on the agreement",
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
        a: "Bobtail generally focuses on operating a tractor without a trailer; non-trucking liability generally focuses on personal, non-business use. The actual definitions and exclusions vary by policy. Do not use an off-dispatch status alone to decide whether a trip is covered.",
      },
      {
        q: "Does my motor carrier's insurance cover me?",
        a: "That depends on the lease, the carrier's policy, and what the truck is doing. Ask for a review of business use, personal use, travel between loads, and damage to your own tractor. Do not assume either full coverage or a gap based only on dispatch status.",
      },
      {
        q: "How much does bobtail insurance cost?",
        a: "Premiums depend on the actual use, driver record, limits, insurer, and policy terms. Physical damage is a separate consideration. Ask for an itemized review; no fixed price or savings is promised.",
      },
      {
        q: "I run under my own authority — do I need bobtail?",
        a: "Start by reviewing your primary auto liability policy and how the truck is used. Bobtail and non-trucking liability are commonly discussed for leased operators; they are not replacements for the primary liability your own-authority operation may need.",
      },
    ],
    ctaTitle: "Get a bobtail quote",
    ctaDescription: "Send your lease and tractor details for a review of non-trucking liability, bobtail, and physical damage needs, subject to available policy terms.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "car-hauler-insurance",
    name: "Car hauler insurance",
    metaTitle: "Car Hauler Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Compare car hauler insurance for auto transporters. Review liability, cargo for vehicles in transit, physical damage, and loading risks with Supreme.",
    eyebrow: "Auto haulers",
    title: "Car hauler insurance for the vehicles on your trailer.",
    description:
      "Auto transport is cargo that drives on and off the trailer, gets scratched at a dealer lot, and is often worth more than the truck. The markets that write it are few and specific.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "Why car haulers are a class of their own",
    intro: [
      "The cargo on a car hauler is high-value, exposed, and handled at every stop: loading damage, chipped windshields, hail on an open trailer, and the occasional total loss of a vehicle that came off a ramp. Standard motor truck cargo forms often limit or exclude vehicles in transit, and dealers, auctions, and brokers require a specific per-vehicle and per-load limit before they hand over the keys.",
      "Describe the single-car rig, wedge trailer, or multi-car transporter, plus lanes and contracts. Your request can then be reviewed by a licensed professional for available options through authorized channels.",
    ],
    listTitle: "Coverage to discuss for car haulers",
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
        a: "Discuss both per-vehicle and per-load values, including your highest-value loads and any contract requirements. A stated limit is not a promise that every vehicle or loss is covered; review valuation, exclusions, and endorsements in the actual policy.",
      },
      {
        q: "Does regular cargo insurance cover vehicles I haul?",
        a: "Policy forms may restrict vehicles in transit or apply sublimits and exclusions for loading, hail, or theft. Review the actual cargo form with the servicing professional before relying on coverage.",
      },
      {
        q: "Can I start car hauling with a pickup and a wedge trailer?",
        a: "You can submit that setup for review. Include the pickup, trailer, vehicle values, radius, and planned operations. Applicable authority, insurance requirements, insurer access, and underwriting eligibility must be confirmed; a clean record does not assure acceptance.",
      },
      {
        q: "Why is car hauler insurance harder to place?",
        a: "The claims are frequent and expensive relative to the premium: loading and unloading damage, weather on open trailers, and total losses. Fewer carriers write the class, and they want to see experience, equipment condition, and how you secure and inspect vehicles.",
      },
    ],
    ctaTitle: "Get a car hauler quote",
    ctaDescription: "Tell us the trailer, load values, and lanes for an auto-transport insurance request. A licensed professional must confirm available options and terms.",
    carrierlensQuery: "auto hauler",
  },
  {
    slug: "cargo-van-insurance",
    name: "Cargo van insurance",
    metaTitle: "Cargo Van Insurance | Supreme Trucking Insurance",
    metaDescription:
      "Cargo van and Sprinter insurance for couriers and delivery contractors. Review liability, cargo, physical damage, and certificates with Supreme.",
    eyebrow: "Cargo vans & Sprinters",
    title: "Cargo van insurance for expediting, courier, and delivery work.",
    description:
      "For-hire van work can have commercial insurance and contract requirements. Describe the van, freight, routes, and contracts for a licensed professional to review.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "Commercial coverage for a van that works for hire",
    intro: [
      "Cargo vans and Sprinters do expedited freight, medical courier runs, final-mile delivery, and contract routes for carriers and retailers. The moment the van hauls for pay, personal auto is out, and most contracts ask for $1,000,000 in liability, a cargo limit, and sometimes general liability — before the first load.",
      "Expediters, couriers, delivery contractors, and leased-on van operators can include their vehicle, freight, radius, and contract details in a request. Availability depends on the operation, state, and underwriting; no specific insurer access is represented.",
    ],
    listTitle: "Coverage to discuss for cargo vans",
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
        a: "Ask a licensed professional to review the lease and the motor carrier's actual policies. Physical damage, liability, cargo, and occupational accident needs depend on that arrangement and your use of the van; do not assume coverage from dispatch status alone.",
      },
      {
        q: "How much cargo coverage does a courier need?",
        a: "Requirements depend on the contracts, commodities, and load values. Provide those details for licensed professional review; a requested limit does not establish that specialized freight or a particular loss is covered.",
      },
      {
        q: "Is a cargo van cheaper to insure than a box truck?",
        a: "Not necessarily. Vehicle value, driver history, freight, radius, limits, and insurer criteria affect the premium. Compare actual terms for your operation rather than assuming a van will cost less.",
      },
    ],
    ctaTitle: "Get a cargo van quote",
    ctaDescription: "Send your van, work description, and contract requirements for review. A quote or coverage is not assured by submitting the request.",
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
      "The MCS-90 addresses specified public-liability obligations under federal financial-responsibility rules. It is not a promise that every claim is covered or paid.",
    image: "/images/highway-premium.jpg",
    sectionTitle: "What the MCS-90 does",
    intro: [
      "The MCS-90 endorsement concerns qualifying final judgments for public liability from negligence involving operations subject to federal financial-responsibility requirements. Its obligations, limits, exclusions, and reimbursement provisions depend on the endorsement and applicable law. It is not a substitute for reviewing your policy.",
      "The MCS-90 is an endorsement, while BMC-91 or BMC-91X is an insurer filing used as evidence of financial responsibility. Required limits vary with the operation and materials hauled. Ask the authorized professional handling your policy to confirm the requirements and documents that apply.",
    ],
    listTitle: "What the MCS-90 is — and is not",
    listItems: [
      "Required on the liability policy of every for-hire interstate carrier subject to FMCSA financial-responsibility rules",
      "Addresses certain qualifying final judgments, subject to the endorsement's conditions and limits; not every loss or judgment qualifies",
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
        a: "No. The endorsement addresses specified public-liability obligations and may require reimbursement of some insurer payments. It does not make every loss covered, and it is not an assurance that a particular claim will be paid. Review the endorsement and policy with a qualified professional.",
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
        a: "Insurers evaluate the obligations associated with the endorsement as part of underwriting. Pricing and eligibility depend on the account and insurer criteria; the website cannot confirm acceptance or a particular premium.",
      },
    ],
    ctaTitle: "Need liability with the MCS-90 and filings done right?",
    ctaDescription: "Include your operating authority and filing requirements in your request. Confirm eligibility, insurer filings, and effective dates with the authorized professional handling your policy.",
    carrierlensQuery: "trucking",
  },
  {
    slug: "amazon-relay-insurance-requirements",
    name: "Amazon Relay insurance requirements",
    metaTitle: "Amazon Relay Insurance Requirements | Supreme Trucking",
    metaDescription:
      "Review Amazon Relay insurance requirements, including liability, cargo, and certificate details. Prepare your coverage request with Supreme.",
    eyebrow: "Guide",
    title: "Amazon Relay insurance requirements, and how to meet them.",
    description:
      "Amazon Relay checks your certificate before you can book loads. The limits are higher than the federal minimums, and the certificate wording has to be exact.",
    image: "/images/hero-premium.jpg",
    sectionTitle: "What Amazon Relay checks",
    intro: [
      "Amazon Relay onboarding asks for a certificate of insurance showing commercial auto liability of at least $1,000,000 per occurrence covering owned, hired, and non-owned vehicles, commercial general liability, cargo coverage of at least $100,000, and — for carriers with employees — workers compensation as your state requires. Amazon must be listed as certificate holder and additional insured where the portal says so, and the coverage has to stay active: a lapse suspends your Relay account.",
      "Requirements change and vary by program; check Amazon's current carrier portal. Share those requirements with the licensed professional reviewing your request. Insurer eligibility, policy terms, certificate wording, and Amazon's acceptance are separate decisions and are not assured by this website.",
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
        a: "Amazon sets its own eligibility rules, separately from insurer underwriting. A new authority may request an insurance review, but neither insurer acceptance nor Amazon onboarding is assured.",
      },
      {
        q: "Is general liability really required for a trucking carrier?",
        a: "Check the current Relay requirements and ask the servicing professional about general liability and any required endorsements. A request or certificate does not assure Amazon's approval.",
      },
      {
        q: "What if my certificate is rejected?",
        a: "Ask the servicing professional to review the rejection notice, program requirements, and actual policy. An endorsement or other change may be needed, may be unavailable, or may still not satisfy the platform. A corrected certificate does not guarantee acceptance.",
      },
      {
        q: "Can I use a box truck for Amazon Relay?",
        a: "Yes — box trucks, tractors, and cargo vans all run Relay loads, each with its own program requirements. The insurance requirements are similar; the equipment type changes the market and the premium.",
      },
    ],
    ctaTitle: "Get a Relay-ready quote",
    ctaDescription: "Send your truck details and current Relay requirements for review. The servicing professional must confirm policy terms and any certificate; Amazon decides whether its requirements are met.",
    carrierlensQuery: "delivery",
  },
];

export function getClassPage(slug: string) {
  return classPages.find((page) => page.slug === slug);
}

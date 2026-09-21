import { servedStatePages } from "./statePages.ts";
import { stateCities, type LocationDirectoryEntry } from "./locationDirectory.ts";

type LocalSection = { heading: string; text: string };
export type CityPage = {
  state: string;
  slug: string;
  name: string;
  description: string;
  introduction: string;
  sections: LocalSection[];
  prepare: string[];
  faq: { q: string; a: string };
  sources: { label: string; href: string }[];
};

// Publish only individually reviewed guides. Directory names do not generate pages.
export const cityPages: CityPage[] = [
  {
    state: "washington", slug: "seattle", name: "Seattle",
    description: "Truck insurance for Seattle owner-operators and fleets. Review port drayage, cargo, equipment and delivery operations with Supreme.",
    introduction: "A Seattle container move, a local box-truck delivery and a long-haul run are different insurance submissions. Start with the work you actually do, including terminal visits, delivery stops and where your equipment stays overnight.",
    sections: [
      { heading: "Separate port drayage from delivery work", text: "The Northwest Seaport Alliance publishes a Seattle North Harbor truckers' guide and terminal resources. If you enter marine terminals, name them in your submission and describe the trip beyond the gate: a nearby warehouse, a transload facility or a longer inland delivery. Do not describe a mixed operation as local delivery alone." },
      { heading: "Explain whose chassis or trailer you use", text: "For container work, send any equipment interchange agreement with your insurance request. Ask the agent to compare its requirements with proposed trailer interchange or non-owned trailer coverage. Cargo coverage for the goods and protection for borrowed equipment are separate questions; one should not be assumed to replace the other." },
      { heading: "Include waiting, parking and handoffs", text: "Tell us whether loaded equipment waits at a yard, is dropped overnight or is handed to another carrier. For multi-stop deliveries, note who loads and unloads. These details let an agent ask about theft, unattended-load conditions, loading and unloading, and any storage limitations before a policy is selected." },
    ],
    prepare: ["Seattle-area terminal or warehouse destinations and your longest regular trip", "Equipment ownership and any chassis or trailer interchange agreements", "Highest cargo value, commodities and overnight parking arrangements"],
    faq: { q: "Does a port-ready truck automatically meet insurance requirements?", a: "No. Terminal access rules and your insurance policy are different matters. Check current terminal requirements with the operator and send the actual insurance requirements to your agent. A quote request or certificate does not by itself confirm terminal access or coverage for every load." },
    sources: [{ label: "Northwest Seaport Alliance: Seattle and Tacoma trucker resources", href: "https://www.nwseaportalliance.com/resources" }],
  },
  {
    state: "washington", slug: "tacoma", name: "Tacoma",
    description: "Trucking insurance for Tacoma port, warehouse and regional freight operations. Prepare your drayage and equipment details for a Supreme quote.",
    introduction: "For a Tacoma trucking business, insurance review should follow the full movement of a load, from terminal pickup through a yard or warehouse to its final delivery. An operation that also hauls non-container freight should describe both parts of the business.",
    sections: [
      { heading: "Describe your South Harbor work", text: "The Northwest Seaport Alliance provides a Tacoma South Harbor truckers' guide and information for facilities including Husky Terminal, Pierce County Terminal and Washington United Terminals. List the facilities you actually use, rather than assuming every Tacoma account has the same terminal or contract requirements." },
      { heading: "Document interchange and equipment values", text: "If you use another company's trailer or chassis, provide the written agreement and required limit. Separate those units from equipment you own or finance. An agent can then review interchange requirements alongside physical damage values, deductibles and lender information without confusing cargo with the equipment carrying it." },
      { heading: "Include regional legs and yard activity", text: "A short port pickup can be part of a longer regional trip. Include your delivery territory, where loaded units are held, and whether you perform transloading or storage. Describe those activities before requesting a certificate, so the proposed policy can be checked against the actual work rather than only a Tacoma mailing address." },
    ],
    prepare: ["Terminals, warehouse stops and regional delivery destinations", "Interchange requirements and owned, leased or financed equipment schedules", "Whether freight is stored, transferred or left loaded overnight"],
    faq: { q: "Can one submission include container drayage and other freight?", a: "Yes. Describe each activity and its approximate share of your work, with commodities, load values and territory. An agent can ask which markets will consider that combination. Do not leave out an activity simply because it happens less often." },
    sources: [{ label: "Northwest Seaport Alliance: South Harbor guides and terminal resources", href: "https://www.nwseaportalliance.com/resources" }],
  },
  {
    state: "washington", slug: "vancouver", name: "Vancouver",
    description: "Vancouver, WA trucking insurance from Supreme. Compare coverage for Southwest Washington and cross-river operations. Office visits by appointment.",
    introduction: "Supreme Trucking Insurance is based in Vancouver, Washington. We help trucking businesses explain their Southwest Washington operations, including work that crosses the Columbia River into Oregon. Vancouver, WA is not Vancouver, British Columbia; use your actual business and garaging addresses in the request.",
    sections: [
      { heading: "Show both sides of the Columbia River", text: "A business based in Vancouver may keep equipment in one state and deliver in another. Give the actual overnight garaging location, the states you enter and your typical destinations. Your mailing address alone does not describe your operating territory, and the website location is not a substitute for those details." },
      { heading: "Identify the port cargo, not just the port", text: "The Port of Vancouver USA handles multiple cargo categories, including bulk, breakbulk and project cargo. If you serve the port, explain the specific commodities, trailer type and highest load value. Oversized machinery, packaged freight and bulk loads should not be described as one interchangeable type of cargo." },
      { heading: "Choose phone, email or an office appointment", text: "Quote preparation can begin by phone or online without an office visit. If you prefer to meet at our Vancouver office, call ahead to arrange an appointment. Have your current declarations, driver and vehicle schedules, and any shipper requirements available so the meeting can focus on your actual renewal or new-business needs." },
    ],
    prepare: ["Actual Washington or Oregon garaging address, even if the mailing address differs", "Cross-river destinations, port work and the longest planned trip", "Cargo types, equipment values and current insurance documents"],
    faq: { q: "Can I visit the Supreme office in Vancouver?", a: "Yes, by appointment. Call (360) 936-7196 before visiting 201 NE Park Plaza Dr, Vancouver, WA 98684. Office hours are Monday-Friday, 8 AM-5 PM Pacific. You can also start online or by phone." },
    sources: [{ label: "Port of Vancouver USA: marine cargo operations", href: "https://www.portvanusa.com/business-opportunities/marine/" }],
  },
  {
    state: "washington", slug: "spokane", name: "Spokane",
    description: "Spokane trucking insurance for Inland Northwest routes, owner-operators and fleets. Discuss cargo, seasonal operations and garaging with Supreme.",
    introduction: "A Spokane-based carrier may handle urban delivery, rural pickups or interstate freight across the Inland Northwest. Your insurance submission should distinguish those jobs, especially when the equipment, cargo or operating season changes between contracts.",
    sections: [
      { heading: "Map the Inland Northwest routes you actually run", text: "WSDOT identifies US 395 as an important Spokane freight corridor and is developing the North Spokane Corridor connection with I-90. For your insurance request, list actual destinations and states traveled rather than a planned future road connection. Include Idaho or longer interstate trips when they are part of the operation." },
      { heading: "Describe seasonal changes before renewal", text: "If your work changes between general freight, agricultural loads or construction hauling, give each activity and its season. Note equipment added during busy periods and whether drivers change. A submission based only on the quietest month may leave out the operation you need an underwriter to review." },
      { heading: "Separate road conditions from a coverage promise", text: "For mountain or winter routes, describe the equipment, cargo and operating practices to your agent. Ask about physical damage deductibles and cargo conditions in the proposed policy. A regional label, weather forecast or generic estimate does not establish whether a particular loss would be covered." },
    ],
    prepare: ["Washington, Idaho and other destinations, with the longest regular haul", "Seasonal commodities, peak unit counts and any temporary equipment", "Garaging locations, vehicle values and available loss runs"],
    faq: { q: "Is a Spokane address enough to quote an interstate operation?", a: "No. The agent also needs where the trucks are kept and where they operate. Tell us about regular cross-state work, long trips and unusual loads even if most of your revenue comes from nearby deliveries." },
    sources: [{ label: "WSDOT: North Spokane Corridor and freight context", href: "https://apps.wsdot.wa.gov/construction-planning/major-projects/north-spokane-corridor" }],
  },
  {
    state: "oregon", slug: "portland", name: "Portland",
    description: "Portland trucking insurance for marine cargo, local delivery and regional fleets. Review freight, equipment and cross-state routes with Supreme.",
    introduction: "Portland freight work is not limited to one kind of truck or load. A quote for a container carrier, a vehicle hauler or a local delivery fleet should explain the particular operation instead of treating all port-adjacent businesses alike.",
    sections: [
      { heading: "Match the submission to the terminal and commodity", text: "The Port of Portland lists different capabilities across Terminals 4, 5 and 6, including vehicles, bulk products, breakbulk and containers. Identify the terminal and the freight you actually haul. Give the cargo value and trailer configuration, and flag specialized handling rather than relying on the phrase general freight." },
      { heading: "Explain warehouse and last-mile activity", text: "Tell us whether a port load goes straight to the receiver, waits at your yard, or is unloaded and redistributed. If box trucks make multiple deliveries afterward, include them in the schedule. Ask the agent how the proposed coverage treats loading, unloading, freight transfers and temporary storage." },
      { heading: "Keep cross-state routes visible", text: "For Portland-area operations that enter Southwest Washington or travel farther, provide the real territory and overnight parking locations. The agency is based in Vancouver, WA and can work with you by phone and online; this page does not represent a separate Portland branch office." },
    ],
    prepare: ["Terminal, warehouse or delivery work and exact commodities", "Highest load value, equipment ownership and any interchange agreement", "Oregon and out-of-state destinations plus actual garaging"],
    faq: { q: "Should I use my Oregon mailing address if trucks park in Washington?", a: "Give both the legal business address and the actual garaging address. Do not substitute one for the other. The agent and underwriting market need an accurate picture of where equipment is kept and used." },
    sources: [{ label: "Port of Portland: marine cargo and terminal capabilities", href: "https://portofportland.com/Marine" }],
  },
  {
    state: "oregon", slug: "eugene", name: "Eugene",
    description: "Eugene truck insurance for local deliveries and regional freight. Prepare cargo, garaging and equipment details for an operation-specific quote.",
    introduction: "For a Eugene-area carrier, a short delivery route and a regional freight schedule can require very different information at quote time. Explain how your truck is used, not just its size, and separate regular work from occasional contracts.",
    sections: [
      { heading: "Distinguish city stops from highway freight", text: "Eugene's Transportation System Plan identifies Highway 99, Beltline Highway, West 11th Avenue and I-105 as freight corridors. Tell us whether your vehicles make frequent city deliveries or use these connections for longer trips. Include the delivery territory beyond Eugene rather than reporting only the nearest pickup point." },
      { heading: "Describe handling at the delivery stop", text: "For local distribution, explain what the driver does after arriving: curbside drop-off, liftgate unloading, jobsite delivery or another activity. Send customer insurance requirements where available. Those details support a discussion of auto liability, cargo and any additional coverage for work outside the vehicle." },
      { heading: "Account for changing commodities and equipment", text: "If a Eugene business takes seasonal agricultural, building-material or other specialized loads, describe each instead of assuming a general-freight label includes everything. Give the maximum value on one load and identify trailers, attached equipment and financed units separately so proposed limits and values can be reviewed." },
    ],
    prepare: ["Local delivery stops versus regional or interstate destinations", "Loading and unloading responsibilities, including liftgate or jobsite work", "Seasonal cargo changes, maximum load value and truck or trailer schedules"],
    faq: { q: "Can I get an accurate price from the city and number of trucks alone?", a: "Those are starting details, not a complete quote. Drivers, commodities, load values, garaging, territory, loss history and requested coverage also need review. Supreme will explain what is still needed instead of treating a generic estimate as your offered premium." },
    sources: [{ label: "City of Eugene: Transportation System Plan, Volume 2", href: "https://www.eugene-or.gov/DocumentCenter/View/40991/ETSP-Volume2-Appendices" }],
  },
];

export function cityPagePath(city: Pick<CityPage, "state" | "slug">) {
  return `/trucking-insurance/${city.state}/${city.slug}`;
}

export function getCityPage(state: string, slug: string) {
  return cityPages.find(city => city.state === state && city.slug === slug);
}

export const locationDirectory: LocationDirectoryEntry[] = servedStatePages
  .map(state => ({
    slug: state.slug, name: state.name, abbreviation: state.abbreviation,
    cities: (stateCities[state.slug] ?? []).map(name => {
      const guide = cityPages.find(city => city.state === state.slug && city.name === name);
      return { name, ...(guide ? { href: cityPagePath(guide) } : {}) };
    }),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

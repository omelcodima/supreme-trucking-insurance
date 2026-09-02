/**
 * State-specific depth for the twelve state pages that already earn
 * impressions (Search Console, 2026-09: Nevada 1,657, Georgia 1,112, North
 * Carolina 643, Washington 601, California 560, Florida 499, Oregon 426,
 * Texas 417, Ohio 409, Illinois 393, Pennsylvania 389, Arizona 312). The
 * pages ranked 50–90 with template copy; this is what makes each one about
 * its state. Filing specifics are kept to what is stable; dollar minimums
 * are deliberately left to the quote.
 */
export type StateDeepDive = {
  heading: string;
  paragraphs: string[];
};

export const stateDeepDives: Record<string, StateDeepDive[]> = {
  texas: [
    {
      heading: "What Texas trucking looks like to an underwriter",
      paragraphs: [
        "Texas is the largest trucking market in the country and it prices like several states at once. Laredo is the busiest land port on the southern border, so cross-border and transload freight on I-35 is its own class of risk. Houston’s port and petrochemical corridor mean tankers, hazmat, and heavy haul. The Permian Basin and Eagle Ford run frac sand, water, and crude on short, heavy, hazardous trips. Dallas–Fort Worth and San Antonio are distribution and regional freight.",
        "Underwriters read the lane first: a dry-van operator running I-20 to Atlanta and an oilfield water hauler in Midland are different accounts with different markets, even if both are in Texas. Gulf Coast garaging adds a hurricane question to physical damage and cargo.",
      ],
    },
    {
      heading: "Texas filings and requirements",
      paragraphs: [
        "Interstate for-hire carriers file with the FMCSA through their insurer (BMC-91). Intrastate-only for-hire carriers register with the Texas Department of Motor Vehicles’ Motor Carrier Division and carry Texas minimums, which differ from the federal ones — we confirm which applies before the quote. Texas liability verdicts have pushed rates up statewide, and most brokers and shippers require $1,000,000 in auto liability regardless of what the filing requires.",
      ],
    },
    {
      heading: "Common Texas operations we insure",
      paragraphs: [
        "Long-haul and regional dry van and reefer out of DFW and Houston, cross-border drayage in Laredo and El Paso, oilfield hauling in West and South Texas, dump trucks and aggregate around the metros, hotshot rigs on the energy routes, and new authorities — Texas issues more new USDOT numbers than any other state, and first-year pricing is where a clean submission matters most.",
      ],
    },
  ],
  california: [
    {
      heading: "What California trucking looks like to an underwriter",
      paragraphs: [
        "The Ports of Los Angeles and Long Beach are the largest container gateway in the United States, and drayage out of San Pedro Bay — with trailer interchange, port credentials, and tight turn times — is the state’s signature trucking risk. Oakland does the same for Northern California. Inland, the Central Valley moves produce and dairy under refrigeration, and I-5 and I-10 carry long-haul freight east.",
        "California carries the highest liability costs in the West, a serious cargo-theft problem around Los Angeles warehousing, and wildfire exposure for garaging in the foothills. Markets price all three.",
      ],
    },
    {
      heading: "California filings and requirements",
      paragraphs: [
        "Intrastate for-hire carriers need a Motor Carrier Permit from the California DMV, which requires proof of insurance on file; interstate carriers file BMC-91 with the FMCSA. California’s emissions rules affect which tractors can operate — an older tractor may be a compliance problem before it is an insurance problem — and AB5 changed how many owner-operators contract with carriers, which changes who needs bobtail and non-trucking coverage versus full primary liability. We sort that out before the file goes to market.",
      ],
    },
    {
      heading: "Common California operations we insure",
      paragraphs: [
        "Port drayage and intermodal in Los Angeles, Long Beach, and Oakland; refrigerated produce out of the Central Valley and Salinas; regional dry van and LTL in the Inland Empire; owner-operators leased to carriers statewide; and new authorities that need a clean first year in an expensive state.",
      ],
    },
  ],
  florida: [
    {
      heading: "What Florida trucking looks like to an underwriter",
      paragraphs: [
        "Florida freight runs north–south on I-95 and I-75 and across the state on I-4, feeding ports in Miami, Jacksonville, Tampa, and Port Everglades. South Florida produce, nursery stock, and seafood ride under refrigeration; the rest is consumer goods and construction materials for a state that never stops building. Hurricane season, June through November, is a real line item: physical damage and cargo exposure for anything garaged near the coasts.",
        "Florida is also one of the most litigated states for trucking liability, and markets price that. A clean loss history and a described safety program matter more here than in most states.",
      ],
    },
    {
      heading: "Florida cargo and coverage requirements",
      paragraphs: [
        "Interstate for-hire carriers file BMC-91 with the FMCSA; intrastate registration and insurance requirements differ, and we confirm which apply. Cargo is the coverage Florida operators ask about most: produce and seafood need reefer breakdown coverage, brokers require $100,000 as a floor, and high-value loads out of the ports often need more. Motor truck cargo written for the freight you actually haul is the difference between a covered claim and a denied one.",
      ],
    },
    {
      heading: "Common Florida operations we insure",
      paragraphs: [
        "Refrigerated haulers out of South Florida, port drayage in Jacksonville and Miami, box trucks and final-mile delivery across the I-4 corridor, dump trucks and aggregate for construction, auto haulers serving the dealer auctions, and new authorities starting in a state where first-year rates run high.",
      ],
    },
  ],
  illinois: [
    {
      heading: "What Illinois trucking looks like to an underwriter",
      paragraphs: [
        "Chicago is the largest rail and intermodal hub in the country, so Illinois trucking is drayage: container moves between rail ramps, warehouses, and the I-80, I-55, I-57, and I-90 corridors. Trailer interchange and the UIIA agreement come with the territory — pulling a railroad’s or steamship line’s chassis requires the interchange coverage the agreement specifies. Downstate is agriculture, grain, and regional freight.",
        "Cook County litigation and winter weather are the two Illinois-specific pricing factors. Garaging in the collar counties versus the city changes the number.",
      ],
    },
    {
      heading: "Illinois filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate for-hire carriers register with the Illinois Commerce Commission, which sets its own insurance minimums. Intermodal operators also need to meet UIIA insurance requirements — trailer interchange at the required limit, with the interchange parties named — before they can pull equipment.",
      ],
    },
    {
      heading: "Common Illinois operations we insure",
      paragraphs: [
        "Intermodal and container drayage in Chicagoland, regional dry van and LTL on the interstates, grain and agricultural hauling downstate, dump trucks and construction hauling around the metro, and owner-operators leased to carriers who need bobtail and physical damage.",
      ],
    },
  ],
  georgia: [
    {
      heading: "What Georgia trucking looks like to an underwriter",
      paragraphs: [
        "Atlanta sits at the junction of I-75, I-85, and I-20 and is the distribution hub of the Southeast; the Port of Savannah is one of the fastest-growing container ports in the country. Georgia trucking is warehouse freight out of the metro, port drayage on I-16, and long-haul in every direction. Poultry, carpet out of Dalton, and agriculture round out the state’s freight.",
        "Georgia liability verdicts are among the highest in the Southeast, and markets price the state accordingly. A described safety program, clean MVRs, and a realistic radius earn better numbers here.",
      ],
    },
    {
      heading: "Georgia filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate for-hire carriers obtain a motor carrier certificate through the Georgia Department of Public Safety’s Motor Carrier Compliance Division, with Georgia’s own insurance minimums and filings. Most brokers and the port’s customers require $1,000,000 in liability and $100,000 in cargo regardless.",
      ],
    },
    {
      heading: "Common Georgia operations we insure",
      paragraphs: [
        "Port drayage in Savannah, distribution and regional freight out of Atlanta, long-haul dry van and reefer, dump trucks for the construction boom around the metro, and new authorities — Georgia is one of the busiest states for new trucking companies, and the first-year submission decides the rate.",
      ],
    },
  ],
  "north-carolina": [
    {
      heading: "What North Carolina trucking looks like to an underwriter",
      paragraphs: [
        "North Carolina freight runs I-40, I-85, and I-95, with Charlotte as the distribution and banking hub, the Triad and Triangle as manufacturing and research freight, and the Port of Wilmington on the coast. Furniture, textiles, poultry, and hogs make livestock and refrigerated hauling a bigger share of the book than in most states.",
        "Small fleets are the North Carolina story: many operations run three to ten trucks out of a single yard, and markets price them on driver turnover, garaging, and how the fleet is managed rather than on truck count alone.",
      ],
    },
    {
      heading: "Truck insurance for a small fleet in North Carolina",
      paragraphs: [
        "A five-truck fleet is quoted as a fleet, not as five owner-operators: one policy with a vehicle schedule, a driver list with MVRs, fleet safety practices, and loss runs for every year. Interstate carriers file BMC-91 with the FMCSA; intrastate registration and insurance requirements differ, and we confirm which apply. The cleaner the schedule and the driver file, the more markets will look at the account.",
      ],
    },
    {
      heading: "Common North Carolina operations we insure",
      paragraphs: [
        "Regional dry van and LTL out of Charlotte and Greensboro, refrigerated and livestock haulers in the east, port drayage in Wilmington, dump trucks and aggregate for the building boom around the Triangle, and small fleets renewing across the I-85 corridor.",
      ],
    },
  ],
  pennsylvania: [
    {
      heading: "What Pennsylvania trucking looks like to an underwriter",
      paragraphs: [
        "Pennsylvania is a pass-through and a destination: I-80, I-81, and the Turnpike carry Northeast freight, and the Lehigh Valley has become one of the largest warehousing corridors on the East Coast. Philadelphia’s port, Pittsburgh’s steel and energy freight, and Marcellus gas-field hauling add tankers and heavy haul to the mix.",
        "Winter on I-80 and the mountains, toll costs, and proximity to the New York metro all show up in the underwriting. Garaging address matters.",
      ],
    },
    {
      heading: "Pennsylvania filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate for-hire carriers obtain authority from the Pennsylvania Public Utility Commission, with the PUC’s own insurance minimums and filings. Warehouse and distribution contracts in the Lehigh Valley typically require $1,000,000 in liability, cargo, and general liability with the customer as additional insured.",
      ],
    },
    {
      heading: "Common Pennsylvania operations we insure",
      paragraphs: [
        "Regional and long-haul dry van on I-80 and I-81, warehouse and distribution freight in the Lehigh Valley, port drayage in Philadelphia, tankers and heavy haul in the gas fields, dump trucks and aggregate statewide, and owner-operators leased to carriers.",
      ],
    },
  ],
  ohio: [
    {
      heading: "What Ohio trucking looks like to an underwriter",
      paragraphs: [
        "Ohio is the crossroads of I-70, I-71, and I-75, within a day’s drive of most of the country’s population. Columbus has grown into a national logistics hub around the Rickenbacker inland port; Cincinnati, Cleveland, and Toledo carry manufacturing, auto-industry, and Great Lakes freight. Most Ohio accounts are regional: dry van, LTL, and dedicated routes within a few hundred miles.",
        "Winter weather and the density of the corridors are the Ohio pricing factors; the state is otherwise one of the more reasonable liability markets in the Midwest.",
      ],
    },
    {
      heading: "Ohio filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate for-hire carriers register with the Public Utilities Commission of Ohio, which sets its own insurance requirements. Automotive and distribution contracts commonly require $1,000,000 in liability and cargo, with the shipper named on the certificate.",
      ],
    },
    {
      heading: "Common Ohio operations we insure",
      paragraphs: [
        "Regional dry van and dedicated routes out of Columbus and Cincinnati, auto-industry and parts freight in the north, intermodal drayage at Rickenbacker, dump trucks and aggregate statewide, box trucks and final-mile delivery in the metros, and owner-operators across the I-70/I-71 corridors.",
      ],
    },
  ],
  arizona: [
    {
      heading: "What Arizona trucking looks like to an underwriter",
      paragraphs: [
        "Arizona is I-10 and I-40 — the southern and central routes between California and the rest of the country — plus I-17 between Phoenix and Flagstaff. Phoenix has become a major distribution market, and the Nogales port of entry is one of the largest gateways for Mexican produce, which makes refrigerated hauling north out of Santa Cruz County a Arizona specialty.",
        "Heat is the state’s physical-damage story: tire failures, refrigeration-unit strain, and cargo spoilage on a July crossing. Underwriters ask about equipment age and maintenance for a reason.",
      ],
    },
    {
      heading: "Arizona filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA; intrastate registration and insurance requirements differ from the federal ones, and we confirm which apply. Produce brokers out of Nogales require cargo with reefer breakdown coverage, and most require $100,000 or more per load.",
      ],
    },
    {
      heading: "Common Arizona operations we insure",
      paragraphs: [
        "Refrigerated produce haulers out of Nogales, long-haul dry van on I-10 and I-40, distribution and regional freight around Phoenix, dump trucks and aggregate for the metro’s construction, hotshot rigs serving the mines and solar projects, and new authorities starting in the Valley.",
      ],
    },
  ],
  nevada: [
    {
      heading: "Motor carrier insurance in Las Vegas and Reno",
      paragraphs: [
        "Nevada trucking is two markets. Las Vegas runs on I-15 to Southern California and I-11 toward Phoenix: distribution for the resorts, construction hauling for a metro that keeps growing, and long-haul freight passing through. Reno sits on I-80 and has become a Western distribution hub, with the industrial parks east of the city feeding warehouse freight in every direction.",
        "Las Vegas garaging is priced like a large metro — traffic density and liability claims — while rural Nevada is priced on the length of the haul and the distance from help when something breaks down between Ely and Tonopah.",
      ],
    },
    {
      heading: "Nevada filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate requirements in Nevada depend on what you haul — household goods, passengers, and towing are regulated differently from general freight — and we confirm which registration and insurance filing your operation actually needs before it goes to market. Most Las Vegas construction and distribution contracts require $1,000,000 in liability regardless.",
      ],
    },
    {
      heading: "Common Nevada operations we insure",
      paragraphs: [
        "Dump trucks and aggregate for Las Vegas construction, box trucks and final-mile delivery across the Valley, distribution and regional freight out of Reno and Sparks, long-haul dry van on I-15 and I-80, tow trucks serving the interstates, and new authorities starting in Clark County.",
      ],
    },
  ],
  oregon: [
    {
      heading: "What Oregon trucking looks like to an underwriter",
      paragraphs: [
        "Oregon freight runs I-5 through the Willamette Valley and I-84 up the Columbia Gorge. Portland’s port and rail yards, agriculture and nursery freight out of the valley, and timber — log trucks are still a real class here — define the book. Supreme is based just across the river in Vancouver, Washington, so the Portland metro is home ground for us.",
        "Mountain passes, winter chain requirements on I-84 and the Cascades, and long rural hauls east of the mountains are the Oregon-specific underwriting questions.",
      ],
    },
    {
      heading: "Oregon filings and requirements",
      paragraphs: [
        "Oregon is unusual: motor carriers pay a weight-mile tax and register with the Oregon Department of Transportation’s Commerce and Compliance Division, which also handles intrastate authority and insurance filings. Interstate carriers file BMC-91 with the FMCSA on top of that. We make sure the insurance filings match what ODOT and the FMCSA each expect, because a mismatch stops the truck.",
      ],
    },
    {
      heading: "Common Oregon operations we insure",
      paragraphs: [
        "Regional dry van and reefer on I-5, port drayage and intermodal in Portland, log trucks and forest-products hauling, agricultural and nursery freight in the valley, dump trucks and aggregate for the metro, and owner-operators leased to carriers across the Northwest.",
      ],
    },
  ],
  washington: [
    {
      heading: "What Washington trucking looks like to an underwriter",
      paragraphs: [
        "The Ports of Seattle and Tacoma — together the Northwest Seaport Alliance — make container drayage and intermodal the signature Washington trucking risk. I-5 carries the state north–south from Vancouver to the Canadian border; I-90 crosses the Cascades to Spokane and the wheat and apple country of the east. Refrigerated agricultural freight, forest products, and aerospace-supply freight fill out the book.",
        "Supreme is based in Vancouver, Washington. Snoqualmie Pass in winter, Seattle traffic density, and cross-border runs to British Columbia are the questions we already know to ask.",
      ],
    },
    {
      heading: "Washington filings and requirements",
      paragraphs: [
        "Interstate carriers file BMC-91 with the FMCSA. Intrastate registration and insurance requirements in Washington depend on what you haul, and we confirm which apply before the quote. Port drayage requires trailer interchange coverage that satisfies the interchange agreements, and most shippers require $1,000,000 in liability and $100,000 in cargo.",
      ],
    },
    {
      heading: "Common Washington operations we insure",
      paragraphs: [
        "Port drayage in Seattle and Tacoma, regional dry van and LTL on I-5, refrigerated apples and produce out of Yakima and Wenatchee, forest-products and log trucks, dump trucks and aggregate around Puget Sound and Clark County, and owner-operators across the state — many of them our neighbors.",
      ],
    },
  ],
};

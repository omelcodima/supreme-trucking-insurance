export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  intro: string;
  sections: {
    heading: string;
    body: string[];
  }[];
  takeaway: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-much-does-commercial-truck-insurance-cost",
    title: "How Much Does Commercial Truck Insurance Cost?",
    description:
      "A practical guide to commercial truck insurance pricing, why quotes vary, and what trucking companies can prepare before shopping.",
    category: "Pricing",
    date: "2026-05-09",
    readTime: "5 min read",
    intro:
      "Commercial truck insurance does not price like a simple auto policy. The same truck can receive very different indications depending on DOT history, state, radius, cargo, drivers, vehicle value, and filings.",
    sections: [
      {
        heading: "Why prices vary so much",
        body: [
          "Carrier underwriters are not only looking at the truck. They are looking at the whole operation: what you haul, how far you run, where the vehicle is garaged, driver experience, prior losses, and whether the DOT profile matches the story on the application.",
          "A clean file usually gets reviewed faster. Missing driver information, unclear cargo, wrong garaging, or incomplete loss runs can slow the process and limit market interest.",
        ],
      },
      {
        heading: "What affects the number",
        body: [
          "Primary liability, motor truck cargo, physical damage, general liability, and trailer-related coverage all price differently. A long-haul reefer operation and a local dry van operation may need very different coverage structures.",
          "New authority accounts can also be priced differently because markets have less operating history to review. Fleets add another layer because unit schedules, driver rosters, and renewal timing become more important.",
        ],
      },
      {
        heading: "How to prepare before shopping",
        body: [
          "Have the DOT or MC number, driver list, vehicle schedule, garaging address, cargo type, radius, current declarations page, and loss runs if available.",
          "If you do not have everything yet, start with the basics. A good trucking agency can tell you what is missing before the file goes to market.",
        ],
      },
    ],
    takeaway:
      "The goal is not only to get a low number. The goal is to present a clean trucking file so the right markets can review the account properly.",
  },
  {
    slug: "owner-operator-truck-insurance-checklist",
    title: "Owner Operator Truck Insurance Checklist",
    description:
      "A simple checklist for owner-operators preparing liability, cargo, physical damage, bobtail, and non-trucking insurance information.",
    category: "Owner Operators",
    date: "2026-05-09",
    readTime: "4 min read",
    intro:
      "Owner-operators often need coverage quickly, but the quote process works better when the file is organized from the beginning.",
    sections: [
      {
        heading: "Start with the operation",
        body: [
          "Before shopping, write down what you haul, where you run, whether you are leased to a carrier or operating under your own authority, and whether any broker or shipper has specific cargo limits.",
          "The coverage stack may include primary liability, motor truck cargo, physical damage, bobtail, non-trucking liability, or general liability depending on the arrangement.",
        ],
      },
      {
        heading: "Prepare the basic documents",
        body: [
          "Useful starting documents include your DOT or MC number, driver license information, vehicle VIN, vehicle value, garaging address, and any current or prior policy documents.",
          "If you have prior insurance, a declarations page and loss runs can help explain your history to markets.",
        ],
      },
      {
        heading: "Watch for common delays",
        body: [
          "Quotes often slow down when the garaging address does not match the operation, cargo type is unclear, driver history is missing, or requested filings are not known.",
          "Getting these details clean early can reduce back-and-forth and make the conversation more practical.",
        ],
      },
    ],
    takeaway:
      "A clear owner-operator file helps the agency understand whether you need independent authority coverage, leased coverage, or a mix of supporting policies.",
  },
  {
    slug: "fleet-trucking-insurance-renewal-tips",
    title: "Fleet Trucking Insurance Renewal Tips",
    description:
      "How fleets can prepare for renewal shopping with cleaner schedules, driver lists, loss runs, and market presentation.",
    category: "Fleets",
    date: "2026-05-09",
    readTime: "5 min read",
    intro:
      "Fleet insurance is won or lost before the renewal date. The better the file, the easier it is for trucking markets to understand the operation.",
    sections: [
      {
        heading: "Start earlier than you think",
        body: [
          "Fleet renewals should not wait until the last week. Markets need time to review drivers, units, cargo, losses, filings, radius, and coverage structure.",
          "Starting early also gives the agency time to correct missing documents and explain the account before underwriters make quick decisions.",
        ],
      },
      {
        heading: "Clean up the schedules",
        body: [
          "Vehicle schedules should show active units, values, VINs, and garaging. Driver lists should be current, and any inactive drivers should be removed before the account is presented.",
          "Loss runs are especially important for fleets because markets want to understand frequency, severity, open claims, and what changed after a loss.",
        ],
      },
      {
        heading: "Explain the business clearly",
        body: [
          "A fleet hauling general freight locally is not the same as a fleet running long-haul reefer. The submission should explain lanes, cargo, radius, safety practices, and customer mix.",
          "A strong renewal is not just a spreadsheet. It is a clean story that makes underwriting easier.",
        ],
      },
    ],
    takeaway:
      "For fleets, better presentation can matter as much as market access because underwriters need confidence in the risk.",
  },
  {
    slug: "motor-truck-cargo-insurance-basics",
    title: "Motor Truck Cargo Insurance Basics",
    description:
      "What motor truck cargo insurance is, why brokers ask for it, and how freight type and limit selection affect the quote.",
    category: "Cargo",
    date: "2026-05-09",
    readTime: "4 min read",
    intro:
      "Motor truck cargo insurance protects the freight being hauled. Many brokers and shippers ask for it before they release loads.",
    sections: [
      {
        heading: "What cargo insurance is for",
        body: [
          "Cargo coverage is designed around damage, theft, or loss of freight while it is in your care, custody, or control. The exact coverage depends on the policy form and endorsements.",
          "The cargo limit should match what you haul. General freight, reefer, car hauling, flatbed, and higher-value freight can all create different underwriting questions.",
        ],
      },
      {
        heading: "Why the freight type matters",
        body: [
          "A carrier may be comfortable with dry goods but more careful with refrigerated loads, autos, electronics, or specialized freight.",
          "If a broker requires a certain limit, bring that requirement into the quote conversation early so the policy can be structured around the real contract need.",
        ],
      },
      {
        heading: "What to prepare",
        body: [
          "Have the cargo type, typical load value, requested limit, radius, garaging, and any broker contract requirements ready.",
          "If you haul multiple commodities, list them clearly. Underwriters do not like vague descriptions when cargo exposure is involved.",
        ],
      },
    ],
    takeaway:
      "Cargo insurance works best when the freight is described clearly and the requested limit matches the loads you actually haul.",
  },
  {
    slug: "new-authority-trucking-insurance-first-steps",
    title: "New Authority Trucking Insurance: First Steps",
    description:
      "What new trucking authorities should prepare before getting filings, liability, cargo, and physical damage coverage.",
    category: "New Authority",
    date: "2026-05-09",
    readTime: "5 min read",
    intro:
      "Getting a new authority is exciting, but insurance needs to be handled carefully before the first load moves.",
    sections: [
      {
        heading: "Know what must be filed",
        body: [
          "New authorities may need filings connected to their liability coverage before they can operate. The filing need depends on authority type and operation.",
          "The insurance conversation should happen before hauling begins, not after a broker asks for a certificate.",
        ],
      },
      {
        heading: "Be specific about the plan",
        body: [
          "Markets will ask what you haul, where you run, how many trucks you have, who drives, where equipment is garaged, and whether you have prior trucking experience.",
          "If the plan changes from local general freight to long-haul reefer, the insurance file changes too.",
        ],
      },
      {
        heading: "Avoid the common mistakes",
        body: [
          "Do not guess on cargo, radius, garaging, or truck value. These details affect both price and whether the policy fits the real operation.",
          "A cleaner first submission gives a new venture a better chance of getting practical market feedback.",
        ],
      },
    ],
    takeaway:
      "A new authority should start with a clear DOT or MC profile, realistic operation details, and a coverage plan before taking loads.",
  },
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

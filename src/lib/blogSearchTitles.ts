// Editorial search titles preserve the article's meaning; the visible H1 stays intact.
export const blogSearchTitles: Record<string, string> = {
  "broker-transparency-email-fmcsa-tql-pink-cheetah":
    "Broker Transparency: The FMCSA Email Dispute",
  "trucking-excise-tax-fraud-oversight-capitol-hill-what-it-means":
    "Trucking Pushes Congress on Excise Tax and Freight Fraud",
  "new-bill-targets-chameleon-carriers-what-truck-fleets-should-know":
    "New Bill Targets Chameleon Carriers",
  "trucking-jobs-rebound-what-it-means-for-your-insurance":
    "Trucking Jobs Rebound: What It Means for Insurance",
  "texas-138-billion-transportation-plan-what-truckers-should-know":
    "Texas' $138 Billion Transportation Plan for Trucking",
  "tariff-whiplash-cross-border-trucking-insurance":
    "Tariff Changes and Cross-Border Trucking Insurance",
  "dot-cracks-down-on-cdl-fraud-what-trucking-fleets-should-do-now":
    "DOT Crackdown on CDL Fraud: Fleet Next Steps",
  "fmcsa-broker-transparency-rule-delay-what-truckers-should-do-now":
    "FMCSA Broker Transparency Delay: Carrier Next Steps",
  "house-resolution-national-truck-driver-appreciation-week":
    "House Resolution Honors Truck Driver Appreciation Week",
  "fmcsa-denies-epilepsy-seizure-disorder-exemption-applications-for-cmv-dr":
    "FMCSA Denies 52 Epilepsy and Seizure Exemption Requests",
  "fmcsa-epilepsy-seizure-exemptions-interstate-cmv-drivers-insurance-updat":
    "FMCSA Grants Seizure-Related Exemptions for 12 Drivers",
  "biggest-problems-in-trucking-what-matters-for-your-insurance":
    "Fuel, Parking and Fraud: Trucking Insurance Risks",
  "truckers-raise-concerns-over-hos-exemption-requests":
    "Truckers Raise Concerns Over HOS Exemption Requests",
  "fr8-solutions-lawsuit-settlement-rate-sheets-what-truckers-should-watch":
    "FR8 Solutions Lawsuit: Rate Sheets and Settlements",
  "fmcsa-denies-project-gap-cdl-eld-exemption-what-it-means-for-small-fleet":
    "FMCSA Denies Project GAP CDL and ELD Exemptions",
  "freight-rates-are-up-but-trucking-jobs-arent-what-it-means-for-your-insu":
    "Freight Rates Rise, Trucking Jobs Lag: Insurance Impact",
  "fmcsa-reviews-clearview-e-mirror-exemption-what-truckers-should-know":
    "FMCSA Reviews ClearView E-Mirror Exemption Request",
  "fmcsa-clearinghouse-icr-renewal-what-truck-fleets-need-to-know":
    "FMCSA Clearinghouse Data Collection Renewal",
  "fmcsa-english-language-out-of-service-rule-truck-drivers":
    "FMCSA Proposes English-Proficiency Out-of-Service Rule",
  "precision-fireworks-hos-exemption-what-truckers-should-know":
    "Precision Fireworks HOS Exemption Request",
  "fmcsa-technical-amendments-2026-what-truckers-should-know":
    "FMCSA 2026 Technical Amendments: What Changed",
  "ccs-transportation-hos-exemption-yard-moves-on-public-roads":
    "CCS Transportation Requests HOS Exemption for Yard Moves",
  "fmcsa-huntsman-transport-hos-exemption-what-it-means":
    "Huntsman Transport Requests HOS and Marking Exemptions",
  "fmcsa-denies-epilepsy-exemptions-what-trucking-fleets-need-to-know":
    "FMCSA Denies Epilepsy Exemptions for 18 Drivers",
  "fmcsa-renews-seizure-disorder-driving-exemptions-what-carriers-should-kn":
    "FMCSA Renews Seizure-Disorder Exemptions for 13 Drivers",
  "fmcsa-exemption-seizure-disorders-trucking-insurance":
    "FMCSA Grants Seizure-Disorder Exemptions for 63 Drivers",
  "fmcsa-cmv-marking-requirements-omb-review-trucking-insurance-what-carrie":
    "FMCSA Sends CMV Marking Paperwork for OMB Review",
  "fmcsa-renews-hearing-exemptions-for-interstate-cmv-drivers-what-carriers":
    "FMCSA Renews Hearing Exemptions for 28 CMV Drivers",
  "fmcsa-seizure-exemption-drivers-trucking-insurance-what-carriers-should":
    "FMCSA Grants Seizure Exemptions for 14 Drivers",
  "fmcsa-renews-hearing-exemptions-for-interstate-cmv-drivers-what-trucking":
    "FMCSA Renews Hearing Exemptions for 38 CMV Drivers",
};

export function getPostSearchTitle(post: { slug: string; title: string }) {
  const title = Object.hasOwn(blogSearchTitles, post.slug) ? blogSearchTitles[post.slug] : post.title;
  const branded = `${title} | Supreme Trucking Insurance`;
  return branded.length <= 60 ? branded : title;
}

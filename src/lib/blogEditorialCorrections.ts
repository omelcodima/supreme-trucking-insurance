import type { BlogPost } from "./blogPosts";

// Keep reviewed corrections at the rendering boundary so cached/CMS copies
// cannot restore claims while the remote editorial source is unavailable.
const corrections: Record<string, ReadonlyArray<readonly [string, string]>> = {
  "biggest-problems-in-trucking-what-matters-for-your-insurance": [[
    "When we shop your coverage or review limits, those documents help us explain to a carrier how you control your cargo risk instead of just chasing the next rate that pops up online.",
    "Those documents help the licensed professional reviewing your request understand how you manage cargo risk. A complete file does not assure insurer access, a quote, acceptance, or a particular price.",
  ]],
  "truckers-raise-concerns-over-hos-exemption-requests": [[
    "What we tell our clients is simple: you cannot control what exemptions FMCSA approves, but you can control how clean your hours and logs look. A consistent pattern of no HOS violations and no fatigue‑related crashes has real weight with underwriters when we shop your renewal, especially in a market where some carriers are getting pickier about long‑haul and night driving risks.",
    "Keep accurate hours-of-service records and document safety procedures. Underwriters may consider violations and crash history, but a clean record does not assure acceptance, renewal, lower pricing, or access to a particular insurer. Review your circumstances with the licensed professional handling the request.",
  ]],
  "fmcsa-huntsman-transport-hos-exemption-what-it-means": [
    [
      "Even if you never touch an exemption application, your day-to-day compliance with HOS and marking rules shows up when we shop or renew your trucking insurance.",
      "Hours-of-service and vehicle-marking records may be relevant to an insurance review even when you have not requested an exemption. Their effect depends on the insurer's underwriting criteria and your actual circumstances.",
    ],
    ["Underwriters routinely ask us to walk them through:", "Information a licensed professional may ask you to prepare includes:"],
    [
      "Whether or not you comment on the Huntsman case, this is a good moment to tighten up your own file. The same issues in any exemption request—hours, markings, safety track record—are exactly what we get asked about when we market your account.",
      "Whether or not you comment on the Huntsman case, review your records for accuracy. Hours, vehicle markings, and safety history may be relevant to underwriting. Providing those records does not assure a quote, insurer access, acceptance, or savings.",
    ],
  ],
  "english-proficiency-fmcsa-safety-rule-trucking-insurance-angle": [[
    "What we tell our clients: one inspection where an officer notes a serious communication problem is going to spark questions at renewal time. When we shop your policy, underwriters go line by line through your inspection history. If they see repeat issues tied to driver fitness or language, they may ask for:\n- Your written hiring criteria for language ability\n- Any training materials or orientation content that address communication\n- Notes or documentation showing how you handle drivers who struggle with English",
    "Inspection history may raise underwriting questions. A licensed professional may ask for written hiring criteria, relevant training or orientation material, and documented corrective actions. These records do not assure acceptance or renewal pricing; review applicable requirements with a qualified professional.",
  ]],
  "fmcsa-broker-transparency-rule-delay-what-truckers-should-do-now": [[
    "FMCSA’s broker transparency rule is delayed again, but your risk is not.\n\nNow is the time to tighten broker contracts, track which brokers are worth your truck, and get COIs, loss runs, and driver files in order.\n\nWe work with carriers every day on how broker agreements, cargo liability, and safety history affect insurance. If you are not sure what your paperwork is telling underwriters, it might be time for a review.\n\nInformational only: coverage always depends on underwriting, drivers, cargo, state, and carrier appetite.",
    "FMCSA's broker transparency rule remains under review. Keep broker agreements, certificates, loss runs, and driver records accurate, and discuss insurance questions with a licensed professional. Informational only: actual options depend on authorized access, underwriting, the operation, state, and policy terms. No quote, savings, or coverage is assured.",
  ]],
};

export function applyBlogEditorialCorrections(post: BlogPost): BlogPost {
  const entries = corrections[post.slug];
  if (!entries) return post;
  const correct = (value: string) => entries.find(([original]) => original === value)?.[1] ?? value;
  return {
    ...post,
    intro: correct(post.intro),
    takeaway: correct(post.takeaway),
    socialPost: post.socialPost === undefined ? undefined : correct(post.socialPost),
    sections: post.sections.map(section => ({ ...section, body: section.body.map(correct) })),
  };
}

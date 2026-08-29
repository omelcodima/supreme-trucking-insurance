export const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

export const socialProfiles = [
  {
    label: "Facebook",
    handle: "Supreme Trucking Insurance",
    href: "https://www.facebook.com/people/Supreme-Trucking-Insurance/61591659095758/",
  },
  {
    label: "Instagram",
    handle: "@supremetruckins",
    href: "https://www.instagram.com/supremetruckins/",
  },
  {
    label: "TikTok",
    handle: "@supremetruckins",
    href: "https://www.tiktok.com/@supremetruckins",
  },
  {
    label: "YouTube",
    handle: "@SupremeTruckingInsurance",
    href: "https://www.youtube.com/@SupremeTruckingInsurance",
  },
] as const;

export const organizationSameAs = [
  googleBusinessUrl,
  ...socialProfiles.map((profile) => profile.href),
];
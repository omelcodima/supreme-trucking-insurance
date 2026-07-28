export type SocialResultState = {
  network?: string;
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
};

type SocialEnvironment = Readonly<Record<string, string | undefined>>;

export function getConfiguredSocialNetworks(
  environment: SocialEnvironment = process.env,
) {
  const networks: string[] = [];

  if (environment.FB_PAGE_ID && environment.FB_PAGE_ACCESS_TOKEN) {
    networks.push("facebook");
  }
  if (environment.IG_BUSINESS_ID && environment.FB_PAGE_ACCESS_TOKEN) {
    networks.push("instagram");
  }
  if (environment.LINKEDIN_ORG_ID && environment.LINKEDIN_ACCESS_TOKEN) {
    networks.push("linkedin");
  }
  if (
    environment.X_API_KEY &&
    environment.X_API_SECRET &&
    environment.X_ACCESS_TOKEN &&
    environment.X_ACCESS_SECRET
  ) {
    networks.push("x");
  }

  return networks;
}

export function summarizeSocialResults(results: readonly SocialResultState[]) {
  return {
    attempted: results.some((result) => !result.skipped),
    posted: results.some((result) => result.ok),
  };
}

export type SocialResultState = {
  network?: string;
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
};

export function summarizeSocialResults(results: readonly SocialResultState[]) {
  return {
    attempted: results.some((result) => !result.skipped),
    posted: results.some((result) => result.ok),
  };
}

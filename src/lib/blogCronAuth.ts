type BlogCronEnvironment = {
  CRON_SECRET?: string;
  BLOG_CRON_SECRET?: string;
};

export function isBlogCronAuthorized(
  request: Request,
  environment: BlogCronEnvironment = {
    CRON_SECRET: process.env.CRON_SECRET,
    BLOG_CRON_SECRET: process.env.BLOG_CRON_SECRET,
  },
): boolean {
  const cronSecret = environment.CRON_SECRET?.trim() || environment.BLOG_CRON_SECRET?.trim();

  if (!cronSecret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

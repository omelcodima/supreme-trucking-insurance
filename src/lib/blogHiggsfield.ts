export const BLOG_IMAGE_PUBLIC_PREFIX = "/blog-images";
const SUPREME_ORIGIN = "https://supremetruckinginsurance.com";
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type BlogImagePromptInput = {
  title: string;
  intro?: string;
  sourceTitle?: string;
  imagePrompt?: string;
};

type ExistingBlogImage = {
  slug: string;
  date?: string;
  imageProvider?: string;
  imageUrl?: string;
};

function cleanContext(value: string | undefined, maxLength: number) {
  return (value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function requireSafeBlogSlug(slug: string) {
  if (!SAFE_SLUG.test(slug)) {
    throw new Error("Expected a safe blog slug containing lowercase letters, numbers, and hyphens only.");
  }

  return slug;
}

export function buildHiggsfieldBlogPrompt(input: BlogImagePromptInput) {
  const title = cleanContext(input.title, 500);
  const scene = cleanContext(input.imagePrompt, 900);
  const intro = cleanContext(input.intro, 650);
  const sourceTitle = cleanContext(input.sourceTitle, 400);
  const subjectContext = `${title} ${scene} ${intro} ${sourceTitle}`;
  const eMirrorConstraint = /\b(?:e[- ]?mirror|camera[- ]based mirror|camera pods?)\b/i.test(subjectContext)
    ? "For this camera-monitor-system subject, show a complete late-model American Class 8 tractor with an attached trailer; use compact, physically plausible camera pods in the normal mirror positions; do not show conventional protruding side mirrors."
    : "";

  const prompt = [
    `Article subject: ${title}.`,
    scene ? `Literal scene brief: ${scene}.` : "Create a literal scene that clearly matches the article subject.",
    eMirrorConstraint,
    "Honor replacement relationships literally: when the brief says one component replaces another, show the replacement and omit the displaced component.",
    intro ? `Editorial context: ${intro}.` : "",
    sourceTitle ? `Official source context: ${sourceTitle}.` : "",
    "Create ONE premium photorealistic editorial photograph for Supreme Trucking Insurance.",
    "Use an authentic modern American trucking environment, believable vehicle and safety details, cinematic natural lighting, a clear documentary focal point, and a polished magazine-quality 16:9 composition with useful negative space for responsive cropping.",
    "Responsible professional mood; no staged stock-photo look, no fantasy styling, no duplicate vehicles, no malformed wheels or equipment.",
    "No text, no logos, no watermarks, no readable signage or license plates, no fire or explosions, no crash scene, no graphic injury, and no close-up faces.",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return prompt.slice(0, 2_500);
}

export function getStableBlogImagePath(slug: string) {
  return `public${BLOG_IMAGE_PUBLIC_PREFIX}/${requireSafeBlogSlug(slug)}.webp`;
}

export function getStableBlogImageUrl(slug: string) {
  return `${SUPREME_ORIGIN}${BLOG_IMAGE_PUBLIC_PREFIX}/${requireSafeBlogSlug(slug)}.webp`;
}

export function needsHiggsfieldUpgrade(image: ExistingBlogImage) {
  const provider = cleanContext(image.imageProvider, 100).toLowerCase();
  const imageUrl = cleanContext(image.imageUrl, 2_000);

  return provider !== "higgsfield" || imageUrl !== getStableBlogImageUrl(image.slug);
}

export function isScheduledHiggsfieldUpgrade(image: ExistingBlogImage, currentDate: string) {
  const publicationDate = cleanContext(image.date, 20);
  const scheduledDate = cleanContext(currentDate, 20);

  return /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)
    && publicationDate === scheduledDate
    && needsHiggsfieldUpgrade(image);
}

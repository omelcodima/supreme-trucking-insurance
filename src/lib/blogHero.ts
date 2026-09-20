export const BLOG_IMAGE_PUBLIC_PREFIX = "/blog-images";
export const OPENAI_BLOG_IMAGE_PROVIDER = "OpenAI via Vercel AI Gateway";
export const OPENAI_BLOG_IMAGE_MODEL = "openai/gpt-image-2";
export const OPENAI_BLOG_IMAGE_SIZE = "2048x1152";
export const OPENAI_BLOG_IMAGE_QUALITY = "high";

const SUPREME_ORIGIN = "https://supremetruckinginsurance.com";
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_DECODED_IMAGE_BYTES = 30 * 1024 * 1024;

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

type GatewayImageData = {
  b64_json?: unknown;
  revised_prompt?: unknown;
  url?: unknown;
};

type GatewayImageResponse = {
  data?: unknown;
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

export function buildOpenAiBlogPrompt(input: BlogImagePromptInput) {
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
    "Create ONE premium photorealistic editorial photograph for Supreme Trucking Insurance using OpenAI GPT Image.",
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

export function buildOpenAiImageRequest(prompt: string) {
  const normalizedPrompt = cleanContext(prompt, 2_500);
  if (!normalizedPrompt) throw new Error("OpenAI image prompt is required.");

  return {
    model: OPENAI_BLOG_IMAGE_MODEL,
    prompt: normalizedPrompt,
    n: 1,
    size: OPENAI_BLOG_IMAGE_SIZE,
    quality: OPENAI_BLOG_IMAGE_QUALITY,
    output_format: "png",
    background: "opaque",
    moderation: "auto",
    stream: false,
  } as const;
}

export function decodeOpenAiImageResponse(payload: unknown, maxDecodedBytes = MAX_DECODED_IMAGE_BYTES) {
  if (!payload || typeof payload !== "object") throw new Error("OpenAI image response must be an object.");
  const response = payload as GatewayImageResponse;
  if (!Array.isArray(response.data) || response.data.length !== 1) {
    throw new Error("OpenAI image response must contain exactly one image.");
  }

  const item = response.data[0] as GatewayImageData;
  if (typeof item?.b64_json !== "string" || !item.b64_json.trim()) {
    throw new Error("OpenAI image response did not contain base64 image data.");
  }

  const encoded = item.b64_json.replace(/\s+/g, "");
  const maximumEncodedLength = Math.ceil(maxDecodedBytes / 3) * 4 + 4;
  if (encoded.length > maximumEncodedLength || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(encoded)) {
    throw new Error("OpenAI image response contained invalid or oversized base64 data.");
  }

  const bytes = Buffer.from(encoded, "base64");
  if (!bytes.length || bytes.length > maxDecodedBytes) {
    throw new Error("OpenAI image payload is empty or too large.");
  }

  return {
    bytes,
    revisedPrompt: typeof item.revised_prompt === "string" ? cleanContext(item.revised_prompt, 2_500) : "",
  };
}

export function getStableBlogImagePath(slug: string) {
  return `public${BLOG_IMAGE_PUBLIC_PREFIX}/${requireSafeBlogSlug(slug)}.webp`;
}

export function getStableBlogImageUrl(slug: string) {
  return `${SUPREME_ORIGIN}${BLOG_IMAGE_PUBLIC_PREFIX}/${requireSafeBlogSlug(slug)}.webp`;
}

export function needsOpenAiUpgrade(image: ExistingBlogImage) {
  const provider = cleanContext(image.imageProvider, 100).toLowerCase();
  const imageUrl = cleanContext(image.imageUrl, 2_000);

  return provider !== OPENAI_BLOG_IMAGE_PROVIDER.toLowerCase() || imageUrl !== getStableBlogImageUrl(image.slug);
}

export function isScheduledOpenAiUpgrade(image: ExistingBlogImage, currentDate: string) {
  const publicationDate = cleanContext(image.date, 20);
  const scheduledDate = cleanContext(currentDate, 20);

  return /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)
    && publicationDate === scheduledDate
    && needsOpenAiUpgrade(image);
}

export function isRepositoryBackedBlogImage(image: ExistingBlogImage) {
  const provider = cleanContext(image.imageProvider, 100).toLowerCase();
  return image.imageUrl === getStableBlogImageUrl(image.slug)
    && (provider === OPENAI_BLOG_IMAGE_PROVIDER.toLowerCase() || provider === "higgsfield");
}

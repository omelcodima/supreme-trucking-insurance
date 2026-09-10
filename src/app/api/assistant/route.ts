import { answerWebsiteQuestion, validateAssistantMessages } from "@/lib/websiteAssistant";
import { guardAssistant } from "@/lib/assistantRateLimit";
import { readLimitedText, RequestSizeError } from "@/lib/ownerIntake";

export const maxDuration = 30;
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ detail: "Please use the assistant on our website." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ detail: "Invalid request format." }, 415);
  let messages;
  try { messages = validateAssistantMessages(JSON.parse(await readLimitedText(request, 24_000))); }
  catch (error) {
    return json({ detail: error instanceof RequestSizeError ? "Question is too long." : error instanceof SyntaxError ? "Invalid request format." : error instanceof Error ? error.message : "Please check your question." }, error instanceof RequestSizeError ? 413 : 400);
  }
  const key = process.env.AI_GATEWAY_API_KEY;
  if (!key || process.env.WEBSITE_CHAT_ENABLED === "false") return json({ detail: "AI chat is unavailable right now. You can still request a quote or call us." }, 503);
  const limited = await guardAssistant(request);
  if (limited) return limited;
  try {
    return json(await answerWebsiteQuestion(messages, key));
  } catch {
    // Never log conversation text, contact data, provider bodies or credentials.
    console.error("Website assistant could not return an answer.");
    return json({ detail: "I could not get an answer right now. Please try again, request a quote, or call our team." }, 503);
  }
}

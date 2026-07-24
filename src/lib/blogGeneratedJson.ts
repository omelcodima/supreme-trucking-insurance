import { jsonrepair } from "jsonrepair";

export function parseGeneratedJson(text: string): unknown {
  let jsonText = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new SyntaxError("Generated output did not contain a JSON object.");
  }

  jsonText = jsonText.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(jsonText) as unknown;
  } catch {
    return JSON.parse(jsonrepair(jsonText)) as unknown;
  }
}

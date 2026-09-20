import type { AssistantMessage } from "./assistantLinks.ts";

// Keep complete turns so basic operation details survive the quote conversation.
// Match the server's nine-message / 8,000-character limits.
export function buildAssistantConversation(history: AssistantMessage[], question: string): AssistantMessage[] {
  const turns = history.slice(-8).map(({ role, content }) => ({ role, content }));
  const next: AssistantMessage = { role: "user", content: question.trim() };
  let length = turns.reduce((total, message) => total + message.content.length, next.content.length);
  while (turns.length && length > 8000) {
    length -= turns.splice(0, 2).reduce((total, message) => total + message.content.length, 0);
  }
  return [...turns, next];
}

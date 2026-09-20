import assert from "node:assert/strict";
import test from "node:test";
import { buildAssistantConversation } from "./assistantConversation.ts";
import { validateAssistantMessages, assistantInstructions } from "./websiteAssistant.ts";
import type { AssistantMessage } from "./assistantLinks.ts";

test("quote guidance retains state, fleet and cargo context across four complete turns", () => {
  const history: AssistantMessage[] = [
    { role: "user", content: "I need a quote." },
    { role: "assistant", content: "What state is your business based in?" },
    { role: "user", content: "Washington." },
    { role: "assistant", content: "How many power units do you operate?" },
    { role: "user", content: "Three." },
    { role: "assistant", content: "What cargo do you haul?" },
    { role: "user", content: "General freight, dry van." },
    { role: "assistant", content: "You can complete the full application for agent review." },
  ];
  const result = buildAssistantConversation(history, " What is the next step? ");
  assert.equal(result.length, 9);
  assert.ok(result.some(message => message.content === "Washington."));
  assert.ok(result.some(message => message.content === "Three."));
  assert.ok(result.some(message => message.content === "General freight, dry van."));
  assert.equal(validateAssistantMessages({ consent: true, messages: result }).length, 9);
  assert.equal(history.length, 8);
});

test("long chat history drops entire oldest turns and stays within server limits", () => {
  const history: AssistantMessage[] = Array.from({ length: 20 }, (_, index) => ({
    role: index % 2 ? "assistant" : "user", content: "x".repeat(index % 2 ? 2400 : 1000),
  }));
  const result = buildAssistantConversation(history, "y".repeat(1000));
  assert.equal(result.length, 5);
  assert.ok(result.reduce((length, message) => length + message.content.length, 0) <= 8000);
  assert.equal(validateAssistantMessages({ consent: true, messages: result }).length, 5);
  assert.deepEqual(buildAssistantConversation([], " Hello "), [{ role: "user", content: "Hello" }]);
});

test("quote guidance offers an application without demanding personal details or making coverage promises", () => {
  assert.match(assistantInstructions, /at most one useful operational question per reply/);
  assert.match(assistantInstructions, /never infer the business state from a browsing location/);
  assert.match(assistantInstructions, /invite the visitor to complete the full application for agent review/);
  assert.match(assistantInstructions, /Do not collect personal contact details in chat/);
  assert.match(assistantInstructions, /NO tools, CRM access, email access or upload capability/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const template = readFileSync(
  new URL("../application/template.html", import.meta.url),
  "utf8",
);
const logic = template.match(
  /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/,
)?.[1];
assert.ok(logic, "The application component must be present");

interface Application {
  state: {
    step: number;
    form: Record<string, unknown>;
    drivers: Record<string, unknown>[];
    equipment: Record<string, unknown>[];
    claims: Record<string, unknown>[];
    unitHistory: { units: string }[];
    sentVia: string | null;
    validationMessage: string;
  };
  onSubmitOnline(): Promise<void>;
  buildSummary(): string;
  onStartFresh(): void;
  componentDidMount(): void;
}

function createApplication(
  deliver: (body: string) => Promise<{ ok: boolean; json?: () => Promise<unknown> }>,
  saved?: object,
) {
  class DCLogic {
    state: Record<string, unknown> = {};
    setState(
      update:
        | Record<string, unknown>
        | ((state: Record<string, unknown>) => Record<string, unknown>),
    ) {
      this.state = {
        ...this.state,
        ...(typeof update === "function" ? update(this.state) : update),
      };
    }
  }
  const Component = runInNewContext(`${logic}\nComponent`, {
    DCLogic,
    confirm: () => true,
    localStorage: { getItem: () => saved ? JSON.stringify(saved) : null, removeItem: () => {} },
    fetch: async (_url: string, options: { body: string }) => {
      const response = await deliver(options.body);
      return { ...response, json: response.json || (async () => ({ ok: response.ok })) };
    },
  }) as new (props: object) => Application;
  return new Component({});
}

test("published application bundle matches the readable template", () => {
  const bundle = readFileSync(
    new URL("../../public/quote-application.html", import.meta.url),
    "utf8",
  );
  const serialized = bundle.match(
    /<script type="__bundler\/template">([\s\S]*?)<\/script>/,
  )?.[1];
  assert.ok(serialized);
  assert.equal(JSON.parse(serialized), template);
});

test("future plans binds the textarea value instead of serializing a template object", () => {
  assert.match(template, /<textarea data-field="futurePlans" value="\{\{ form\.futurePlans \}\}"[^>]*><\/textarea>/);
});

test("new applications have empty unit counts and require real contact details", async () => {
  let calls = 0;
  const app = createApplication(async () => {
    calls++;
    return { ok: true };
  });
  assert.ok(app.state.unitHistory.every((row) => row.units === ""));
  assert.equal(app.state.form.state, "");
  assert.equal(app.state.form.garagingState, "");
  assert.equal(app.state.form.radius, "");
  assert.equal((app.state.form.states as string[]).length, 0);
  assert.equal(app.state.form.agentEmail, "info@supremetruckinginsurance.com");
  await app.onSubmitOnline();
  assert.equal(calls, 0);
  assert.equal(app.state.step, 1);
  assert.match(app.state.validationMessage, /valid contact email/);
});

test("empty editable rows do not become drivers, equipment or a claim-free history", async () => {
  let submitted = "";
  const app = createApplication(async body => { submitted = body; return { ok: true }; });
  app.state.form.legalName = "TEST ONLY";
  app.state.form.email = "test@example.invalid";
  await app.onSubmitOnline();
  const payload = JSON.parse(submitted);
  assert.deepEqual(payload.drivers, []);
  assert.deepEqual(payload.equipment, []);
  assert.deepEqual(payload.claims, []);
  assert.match(payload.summary, /States: Not provided/);
  assert.match(payload.summary, /Radius: Not provided/);
  assert.match(payload.summary, /DRIVERS \(0 entered\)/);
  assert.match(payload.summary, /does not indicate a claim-free history/);
  assert.equal(app.state.drivers.length, 2, "Editable rows remain in the form");
});

test("partial records and explicit zero-loss prior policies remain in the submission", async () => {
  let submitted = "";
  const app = createApplication(async body => { submitted = body; return { ok: true }; });
  app.state.form.legalName = "TEST ONLY";
  app.state.form.email = "test@example.invalid";
  app.state.drivers[0].name = "Test Driver";
  app.state.equipment[0].acv = "50000";
  app.state.claims[0].carrier = "Test prior carrier";
  await app.onSubmitOnline();
  const payload = JSON.parse(submitted);
  assert.equal(payload.drivers.length, 1);
  assert.equal(payload.equipment.length, 1);
  assert.equal(payload.claims.length, 1);
  assert.equal(payload.equipment[0].acv, "50000");
  assert.match(payload.summary, /ACV 50000/);
  assert.equal(payload.claims[0].num, "0");
  assert.match(payload.summary, /Test Driver/);
});

test("saved operation details are preserved until the user explicitly resets", () => {
  const saved = { form: { state: "WA", garagingState: "OR", states: ["WA", "OR"], radius: "Local (0-50 mi)" } };
  const app = createApplication(async () => ({ ok: true }), saved);
  app.componentDidMount();
  assert.equal(app.state.form.state, "WA");
  assert.equal(app.state.form.garagingState, "OR");
  assert.equal((app.state.form.states as string[]).join(","), "WA,OR");
  assert.equal(app.state.form.radius, "Local (0-50 mi)");
  app.onStartFresh();
  assert.equal(app.state.form.state, "");
  assert.equal(app.state.form.garagingState, "");
  assert.equal((app.state.form.states as string[]).length, 0);
  assert.equal(app.state.form.radius, "");
});

test("submission blocks duplicate payloads but allows edited applications", async () => {
  const payloads: string[] = [];
  const app = createApplication(async (body) => {
    payloads.push(body);
    return { ok: true };
  });
  app.state.form.legalName = "TEST ONLY";
  app.state.form.email = "test@example.invalid";
  app.state.form.eldProvider = "Custom provider";
  app.state.unitHistory[0].units = "5";
  await app.onSubmitOnline();
  await app.onSubmitOnline();
  assert.equal(payloads.length, 1);
  assert.equal(JSON.parse(payloads[0]).unitHistory[0].units, "5");
  assert.equal(JSON.parse(payloads[0]).form.eldProvider, "Custom provider");
  app.state.form.legalName = "TEST ONLY UPDATED";
  await app.onSubmitOnline();
  assert.equal(payloads.length, 2);
  assert.equal(app.state.sentVia, "submitEmail");
});

test("a failed application can be retried without losing data", async () => {
  let calls = 0;
  const app = createApplication(async () => ({ ok: ++calls > 1 }));
  app.state.form.legalName = "TEST ONLY";
  app.state.form.email = "test@example.invalid";
  await app.onSubmitOnline();
  assert.equal(app.state.sentVia, "submitError");
  assert.equal(app.state.form.legalName, "TEST ONLY");
  await app.onSubmitOnline();
  assert.equal(calls, 2);
  assert.equal(app.state.sentVia, "submitEmail");
});

test("HTTP success without an explicit acceptance never completes an application", async () => {
  for (const json of [async () => ({ ok: false }), async () => ({}), async () => { throw new Error("Not JSON"); }]) {
    const app = createApplication(async () => ({ ok: true, json }));
    app.state.form.legalName = "TEST ONLY";
    app.state.form.email = "test@example.invalid";
    await app.onSubmitOnline();
    assert.equal(app.state.sentVia, "submitError");
    assert.equal(app.state.form.legalName, "TEST ONLY");
  }
});

test("embedded application reports acceptance, not just an HTTP success", async () => {
  const bundle = readFileSync(new URL("../../public/quote-application.html", import.meta.url), "utf8");
  const instrumentation = [...bundle.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((script) => script.includes("const originalFetch = window.fetch.bind(window)"));
  assert.ok(instrumentation);
  for (const [status, body, phase] of [[200, '{"ok":true}', "success"], [200, '{"ok":false}', "error"], [200, "bad json", "error"], [502, '{"ok":true}', "error"]] as const) {
    const messages: { phase: string }[] = [];
    const window = {
      fetch: async () => new Response(body, { status }),
      location: { href: "https://example.test/quote-application.html", origin: "https://example.test" },
      parent: { postMessage: (message: { phase: string }) => messages.push(message) },
    };
    runInNewContext(instrumentation, { window, URL, Request });
    const fetch = window.fetch as typeof globalThis.fetch;
    const response = await fetch("/api/full-application", { method: "POST" });
    assert.equal(await response.text(), body, "Instrumentation must not consume the caller's response");
    assert.deepEqual(messages.map((message) => message.phase), ["attempt", phase]);
    await fetch("/api/dot-lookup?dot=95050");
    assert.equal(messages.length, 2, "Registry lookups are not application attempts");
  }
});

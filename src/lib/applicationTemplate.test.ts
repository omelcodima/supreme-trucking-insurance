import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { smsDisclosure } from "./smsConsent.ts";

const template = readFileSync(
  new URL("../application/template.html", import.meta.url),
  "utf8",
).replace("__SMS_DISCLOSURE_JSON__", JSON.stringify(smsDisclosure));
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
    role: string;
    smsAccepted: boolean;
    smsMobile: string;
    smsError: string;
  };
  onSubmitOnline(): Promise<void>;
  buildSummary(): string;
  onStartFresh(): void;
  componentDidMount(): void;
  onSmsMobile(event: { target: { value: string } }): void;
  onRoleClick(event: { currentTarget: { dataset: { role: string } } }): void;
  onNext(): void;
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

test("full application consent is never restored from draft or retained on reset, number or role change", () => {
  const app = createApplication(async () => ({ ok: true }), { smsAccepted: true, smsMobile: "3605550123", form: { legalName: "TEST" } });
  app.componentDidMount();
  assert.equal(app.state.smsAccepted, false); assert.equal(app.state.smsMobile, "");
  app.state.smsAccepted = true;
  app.onSmsMobile({ target: { value: "3605550124" } });
  assert.equal(app.state.smsAccepted, false);
  app.state.smsAccepted = true;
  app.onRoleClick({ currentTarget: { dataset: { role: "Agent" } } });
  assert.equal(app.state.smsAccepted, false); assert.equal(app.state.smsMobile, "");
  app.state.smsAccepted = true;
  app.onStartFresh();
  assert.equal(app.state.smsAccepted, false);
});

test("both application submit paths include the same valid optional SMS choice", async () => {
  const bodies: string[] = [];
  const app = createApplication(async body => { bodies.push(body); return { ok: true }; });
  app.state.form.legalName = "TEST"; app.state.form.email = "test@example.invalid";
  app.state.smsAccepted = true; app.state.smsMobile = "123";
  await app.onSubmitOnline();
  assert.equal(bodies.length, 0); assert.match(app.state.smsError, /mobile number/);
  app.state.smsMobile = "(360) 555-0123";
  await app.onSubmitOnline();
  assert.deepEqual(JSON.parse(bodies[0]).smsConsent, { accepted: true, mobile: "+13605550123", version: smsDisclosure.version });
  assert.equal(JSON.parse(bodies[0]).submitterRole, "Customer");
  app.state.form.legalName = "TEST FINISH"; app.state.step = 7;
  app.onNext();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(JSON.parse(bodies[1]).smsConsent, JSON.parse(bodies[0]).smsConsent);
  app.state.role = "Agent"; app.state.form.legalName = "TEST AGENT";
  await app.onSubmitOnline();
  assert.equal(JSON.parse(bodies[2]).smsConsent.accepted, false);
  assert.equal(JSON.parse(bodies[2]).smsConsent.mobile, "");
});

test("full application cannot be used while template handlers are still unbound", () => {
  assert.match(template, /class="application-root" inert aria-busy="true"/);
  const bridge = readFileSync(new URL("../../public/application-bridge.js", import.meta.url), "utf8");
  for (const ready of [false, true]) {
    const root = {
      inert: true,
      querySelector: (selector: string) => ({ textContent: ready ? (selector.startsWith("footer") ? "Continue" : "Company") : "{{ onNext }}" }),
      hasAttribute: () => true,
      removeAttribute: () => {},
    };
    const window: { parent?: unknown; addEventListener: () => void } = { addEventListener: () => {} };
    window.parent = window;
    runInNewContext(bridge, {
      window,
      document: { querySelector: () => root, addEventListener: () => {}, body: {}, documentElement: {} },
      MutationObserver: class { observe() {} }, ResizeObserver: class { observe() {} },
      requestAnimationFrame: (callback: () => void) => callback(),
    });
    assert.equal(root.inert, !ready, "Readiness protection also applies outside an iframe");
  }
});

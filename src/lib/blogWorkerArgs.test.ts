import assert from "node:assert/strict";
import test from "node:test";

import { parseOptionalSlugArg } from "./blogWorkerArgs.ts";

test("accepts no slug", () => {
  assert.equal(parseOptionalSlugArg([]), "");
});

test("accepts positional and --slug forms", () => {
  const slug = "fmcsa-broker-transparency-rule-delay-what-truckers-should-do-now";
  assert.equal(parseOptionalSlugArg([slug]), slug);
  assert.equal(parseOptionalSlugArg(["--slug", slug]), slug);
});

test("rejects missing, unsafe, or ambiguous slug arguments", () => {
  assert.throws(() => parseOptionalSlugArg(["--slug"]), /Expected an optional safe slug/);
  assert.throws(() => parseOptionalSlugArg(["--slug", "../unsafe"]), /Expected an optional safe slug/);
  assert.throws(() => parseOptionalSlugArg(["one", "two"]), /Expected an optional safe slug/);
});
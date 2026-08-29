import assert from "node:assert/strict";
import test from "node:test";

import {
  googleBusinessUrl,
  organizationSameAs,
  socialProfiles,
} from "./socialProfiles.ts";

test("publishes only the verified Supreme social profile set", () => {
  assert.deepEqual(
    socialProfiles.map((profile) => profile.label),
    ["Facebook", "Instagram", "TikTok", "YouTube"],
  );

  assert.equal(organizationSameAs[0], googleBusinessUrl);
  assert.equal(organizationSameAs.length, socialProfiles.length + 1);
  assert.equal(new Set(organizationSameAs).size, organizationSameAs.length);
  assert.equal(
    organizationSameAs.some((href) => /linkedin\.com|(?:^|\.)x\.com/i.test(new URL(href).hostname)),
    false,
  );
});

test("every published identity URL is a valid HTTPS URL", () => {
  for (const href of organizationSameAs) {
    const url = new URL(href);
    assert.equal(url.protocol, "https:");
    assert.ok(url.hostname);
  }
});
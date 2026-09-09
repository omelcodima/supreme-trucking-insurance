import { readFileSync, writeFileSync } from "node:fs";

// The readable template is the source; preserve the bundled runtime and fonts.
const target = new URL("../public/quote-application.html", import.meta.url);
const smsDisclosure = JSON.parse(readFileSync(new URL("../src/lib/smsConsentDisclosure.json", import.meta.url), "utf8"));
const source = readFileSync(
  new URL("../src/application/template.html", import.meta.url),
  "utf8",
);
if (!source.includes("__SMS_DISCLOSURE_JSON__")) throw new Error("SMS disclosure marker is missing");
const template = source.replace("__SMS_DISCLOSURE_JSON__", JSON.stringify(smsDisclosure));
const bundle = readFileSync(target, "utf8");
const pattern = /(<script type="__bundler\/template">)[\s\S]*?(<\/script>)/;
if (!pattern.test(bundle))
  throw new Error("Application bundle template marker is missing");
writeFileSync(
  target,
  bundle.replace(
    pattern,
    (_, start, end) =>
      start +
      "\n" +
      JSON.stringify(template).replaceAll("</script", "<\\/script") +
      "\n" +
      end,
  ),
);

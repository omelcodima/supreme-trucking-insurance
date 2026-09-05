import { readFileSync, writeFileSync } from "node:fs";

// The readable template is the source; preserve the bundled runtime and fonts.
const target = new URL("../public/quote-application.html", import.meta.url);
const template = readFileSync(
  new URL("../src/application/template.html", import.meta.url),
  "utf8",
);
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

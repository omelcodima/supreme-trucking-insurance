import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createApplicationPdf, wrapPdfLine } from "./applicationPdf.ts";

test("application PDF supports multilingual names and is a readable PDF", async () => {
  const bytes = await createApplicationPdf("TEST ONLY\nCompany: Supreme verification\nContact: Дмитрий\nGaraging: Same as company\nELD: Samsara\nDash cam: Motive\n2026-2027: 13 planned units");
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  const document = await PDFDocument.load(bytes);
  assert.equal(document.getPageCount(), 1);
  assert.equal(document.getTitle(), "Supreme Trucking Insurance - Application");
});

test("long applications paginate", async () => {
  const bytes = await createApplicationPdf(Array.from({ length: 160 }, (_, i) => `Equipment ${i + 1}: ${"Long notes ".repeat(12)}`).join("\n"));
  const document = await PDFDocument.load(bytes);
  assert.ok(document.getPageCount() > 3);
  assert.ok(document.getPages().every(page => page.getWidth() === 612 && page.getHeight() === 792));
});

test("PDF line wrapping handles unbroken long values within margins", async () => {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const text = "a".repeat(220) + "@example.com";
  const lines = wrapPdfLine(text, font, 200);
  assert.equal(lines.join(""), text);
  assert.ok(lines.every(line => font.widthOfTextAtSize(line, 10) <= 200));
  assert.deepEqual(wrapPdfLine("", font, 200), [""]);
});

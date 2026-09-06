import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";

const margin = 44;
const fontSize = 10;
const lineHeight = 16;
const pageWidth = 612;
const pageHeight = 792;

export function wrapPdfLine(text: string, font: PDFFont, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && font.widthOfTextAtSize(`${line} ${word}`, fontSize) <= maxWidth) {
      line += ` ${word}`;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    // Long email addresses, VIN lists and unbroken notes must also wrap.
    for (const character of word) {
      if (line && font.widthOfTextAtSize(line + character, fontSize) > maxWidth) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  lines.push(line);
  return lines;
}

export async function createApplicationPdf(text: string) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const fontBytes = await readFile(path.join(process.cwd(), "src/assets/fonts/NotoSans-Regular.ttf"));
  const font = await document.embedFont(fontBytes, { subset: true });
  document.setTitle("Supreme Trucking Insurance - Application");
  document.setAuthor("Supreme Trucking Insurance");

  const addPage = () => {
    const page = document.addPage([pageWidth, pageHeight]);
    page.drawText("SUPREME TRUCKING INSURANCE", { x: margin, y: 753, size: 14, font, color: rgb(0.15, 0.18, 0.17) });
    page.drawLine({ start: { x: margin, y: 741 }, end: { x: pageWidth - margin, y: 741 }, thickness: 2, color: rgb(0.78, 0.28, 0.02) });
    return page;
  };
  let page = addPage();
  let y = 719;
  const cleanText = text.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
  for (const paragraph of cleanText.split("\n")) {
    for (const line of wrapPdfLine(paragraph, font, pageWidth - margin * 2)) {
      if (y < 64) {
        page = addPage();
        y = 719;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.15, 0.18, 0.17) });
      y -= lineHeight;
    }
  }
  const pages = document.getPages();
  pages.forEach((current, index) => {
    current.drawText("Application only. Not a quote or confirmation of coverage.", { x: margin, y: 36, size: 8, font, color: rgb(0.38, 0.42, 0.4) });
    current.drawText(`${index + 1} / ${pages.length}`, { x: pageWidth - margin - 40, y: 36, size: 8, font });
  });
  return Buffer.from(await document.save());
}

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { assessmentHarness } from "../src/lib/testing/assessmentHarness.ts";

// Disposable, loopback-only preview. It cannot access production records or send email.
const port = Number(process.env.QA_PORT || 3221);
const origin = `http://127.0.0.1:${port}`;
const h = assessmentHarness(origin);
const pdf = await PDFDocument.create(); pdf.addPage().drawText("Synthetic QA resume. Not a real candidate.");
const fixture = join(tmpdir(), "supreme-careers-qa-resume.pdf");
await writeFile(fixture, await pdf.save());
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url!, origin).pathname;
    if (path === "/qa-candidate") {
      const data = new FormData();
      for (const [key, value] of Object.entries({ name: "QA Candidate", email: "candidate@example.test", phone: "", role: "Service and certificate support", introduction: "Synthetic local verification only.", consent: "true", website: "" })) data.set(key, value);
      data.set("resume", new File([Uint8Array.from(await readFile(fixture))], "synthetic-resume.pdf", { type: "application/pdf" }));
      const response = await h.handle(new Request(`${origin}/api/team-assessment/applications`, { method: "POST", headers: { Origin: origin, "X-UI-Language": "en" }, body: data }), "applications");
      if (response.status !== 201) throw new Error("Unable to seed QA application");
      res.writeHead(303, { "Set-Cookie": response.headers.get("set-cookie")!, Location: "/team-assessment?apply=1" }); res.end(); return;
    }
    if (path === "/qa-owner") {
      res.writeHead(303, { "Set-Cookie": "qa_owner=yes; HttpOnly; SameSite=Strict; Path=/", Location: "/admin/assessments" }); res.end(); return;
    }
    if (path.startsWith("/api/team-assessment/")) {
      const headers = new Headers(); for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(",") : value);
      const request = new Request(origin + req.url, { method: req.method, headers, ...(req.method === "GET" ? {} : { body: Readable.toWeb(req), duplex: "half" }) } as RequestInit);
      const response = await h.handle(request, path.slice("/api/team-assessment/".length));
      res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer())); return;
    }
    const assets: Record<string, [string, string]> = {
      "/team-assessment": ["src/lib/assessment/templates/index.html", "text/html; charset=utf-8"],
      "/admin/assessments": ["src/lib/assessment/templates/reviewer.html", "text/html; charset=utf-8"],
      "/team-assessment/i18n.js": ["public/team-assessment/i18n.js", "text/javascript; charset=utf-8"],
      "/team-assessment/application.js": ["public/team-assessment/application.js", "text/javascript; charset=utf-8"],
      "/team-assessment/application.css": ["public/team-assessment/application.css", "text/css; charset=utf-8"],
    };
    if (!assets[path]) { res.writeHead(404); res.end("Not part of the disposable preview"); return; }
    const [file, type] = assets[path]; res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }); res.end(await readFile(file));
  } catch { res.writeHead(500); res.end("Local QA failure"); }
});
server.listen(port, "127.0.0.1", () => console.log(`Preview: ${origin}/team-assessment?apply=1\nResume fixture: ${fixture}\nMock owner: ${origin}/qa-owner`));

// One command: every paid month's email, PDF receipt and WhatsApp image, the year's statement and the tenant page.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { ElementsError, formatDiagnostics, render, validate, type Diagnostic } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { tenancy } from "../src/tenancy";
import { paid } from "../src/rules";
import ReceiptEmail from "../src/templates/ReceiptEmail";
import ReceiptPdf from "../src/templates/ReceiptPdf";
import WhatsAppCard from "../src/templates/WhatsAppCard";
import AnnualStatement from "../src/templates/AnnualStatement";
import TenantPage from "../src/templates/TenantPage";

const font = (file: string) => readFile(new URL(`../fonts/${file}.ttf`, import.meta.url));
const fonts = [
  { family: "Hind", src: await font("Hind-Regular"), weight: 400 },
  { family: "Hind", src: await font("Hind-SemiBold"), weight: 600 },
  { family: "Hind", src: await font("Hind-Bold"), weight: 700 },
  { family: "Kalam", src: await font("Kalam-Regular"), weight: 400 },
  { family: "Kalam", src: await font("Kalam-Bold"), weight: 700 },
];

let errors = 0;
function report(name: string, diagnostics: Diagnostic[]) {
  const shown = diagnostics.filter((d) => d.severity !== "info");
  if (shown.length) console.log(`-- ${name}\n${formatDiagnostics(shown)}`);
  errors += diagnostics.filter((d) => d.severity === "error").length;
}

const out = new URL("../out/", import.meta.url);
for (const dir of ["receipts/", "emails/", "whatsapp/"]) await mkdir(new URL(dir, out), { recursive: true });

try {
  for (const p of paid(tenancy)) {
    const m = p.month;
    const email = <ReceiptEmail t={tenancy} month={m} />;
    report(`email ${m}`, validate(email).diagnostics);
    const { html, text } = await render(email);
    await writeFile(new URL(`emails/receipt-${m}.html`, out), html);
    await writeFile(new URL(`emails/receipt-${m}.txt`, out), text);

    const pdf = await renderPdf(<ReceiptPdf t={tenancy} month={m} />, { fonts });
    report(`pdf ${m}`, pdf.diagnostics);
    await writeFile(new URL(`receipts/receipt-${m}.pdf`, out), pdf.pdf);

    const img = await renderImage(<WhatsAppCard t={tenancy} month={m} />, { fonts, scale: 2 });
    report(`image ${m}`, img.diagnostics);
    await writeFile(new URL(`whatsapp/receipt-${m}.png`, out), img.image);
  }
  const statement = await renderPdf(<AnnualStatement t={tenancy} />, { fonts });
  report("statement", statement.diagnostics);
  await writeFile(new URL("statement.pdf", out), statement.pdf);

  const page = <TenantPage t={tenancy} />;
  report("page", validate(page).diagnostics);
  await writeFile(new URL("index.html", out), (await render(page)).html);
} catch (e) {
  if (!(e instanceof ElementsError)) throw e;
  console.error(formatDiagnostics(e.diagnostics));
  process.exit(1);
}
console.log(`Built ${paid(tenancy).length} receipts (email + PDF + image each), the statement and the page in out/. Errors: ${errors}`);
if (errors) process.exit(1);

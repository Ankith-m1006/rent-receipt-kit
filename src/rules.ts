import type { Payment, Tenancy } from "./tenancy";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** ₹18,500 in Indian grouping (₹2,22,000 for lakhs). */
export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowHundred(n: number): string {
  return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
}
function belowThousand(n: number): string {
  const h = Math.floor(n / 100), r = n % 100;
  return [h ? ONES[h] + " Hundred" : "", r ? belowHundred(r) : ""].filter(Boolean).join(" ");
}

/** Amount in words the Indian way: crore, lakh, thousand. 222000 → "Two Lakh Twenty Two Thousand". */
export function inWords(n: number): string {
  if (!Number.isInteger(n) || n < 0) throw new Error(`inWords needs a whole number of rupees, got ${n}`);
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 1e7), lakh = Math.floor((n % 1e7) / 1e5), thousand = Math.floor((n % 1e5) / 1e3), rest = n % 1e3;
  return [
    crore ? inWords(crore) + " Crore" : "",
    lakh ? belowHundred(lakh) + " Lakh" : "",
    thousand ? belowHundred(thousand) + " Thousand" : "",
    rest ? belowThousand(rest) : "",
  ].filter(Boolean).join(" ");
}

/** "2026-04" → "April 2026". */
export function monthName(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "2026-04-02" → "2 April 2026". */
export function dateName(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "FY 2026–27". */
export function fyLabel(t: Tenancy): string {
  const s = t.financialYear.start;
  return `FY ${s}–${String(s + 1).slice(2)}`;
}

export const paid = (t: Tenancy) => t.payments.filter((p) => p.paidOn);
export const totalPaid = (t: Tenancy) => paid(t).length * t.monthlyRent;
export const annualRent = (t: Tenancy) => t.payments.length * t.monthlyRent;

/**
 * Income-tax rule for HRA: an employee must give the landlord's PAN to the employer
 * when the rent paid in the year is more than ₹1,00,000.
 */
export const panRequired = (t: Tenancy) => annualRent(t) > 100000;

/** Indian Stamp Act: a receipt for more than ₹5,000 paid in cash carries a ₹1 revenue stamp. */
export const stampRequired = (p: Payment, amount: number) => p.mode === "Cash" && amount > 5000;

/** Receipt number, the serial printed in a receipt book: R-2026-27/03. */
export function receiptNo(t: Tenancy, p: Payment): string {
  const i = t.payments.indexOf(p) + 1;
  return `R-${fyLabel(t).slice(3).replace("–", "-")}/${String(i).padStart(2, "0")}`;
}

export function payment(t: Tenancy, month: string): Payment {
  const p = t.payments.find((x) => x.month === month);
  if (!p) throw new Error(`No month ${month} in tenancy.payments`);
  if (!p.paidOn) throw new Error(`${monthName(month)} is not paid yet: add paidOn and mode before making its receipt`);
  return p;
}

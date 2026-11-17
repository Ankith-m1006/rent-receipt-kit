import { test } from "node:test";
import assert from "node:assert/strict";
import { annualRent, fyLabel, inWords, panRequired, receiptNo, rupees, stampRequired, totalPaid, payment } from "../src/rules";
import { tenancy } from "../src/tenancy";

test("amounts are grouped and spelt the Indian way", () => {
  assert.equal(rupees(222000), "₹2,22,000");
  assert.equal(inWords(18500), "Eighteen Thousand Five Hundred");
  assert.equal(inWords(148000), "One Lakh Forty Eight Thousand");
  assert.equal(inWords(12500000), "One Crore Twenty Five Lakh");
  assert.throws(() => inWords(18500.5));
});

test("landlord PAN is required only above ₹1,00,000 a year", () => {
  assert.equal(annualRent(tenancy), 222000);
  assert.equal(panRequired(tenancy), true);
  assert.equal(panRequired({ ...tenancy, monthlyRent: 8000 }), false); // ₹96,000
  assert.equal(panRequired({ ...tenancy, monthlyRent: 8334 }), true); // ₹1,00,008
});

test("revenue stamp only for cash receipts above ₹5,000", () => {
  assert.equal(stampRequired({ month: "2026-06", paidOn: "2026-06-05", mode: "Cash" }, 18500), true);
  assert.equal(stampRequired({ month: "2026-06", paidOn: "2026-06-05", mode: "Cash" }, 5000), false);
  assert.equal(stampRequired({ month: "2026-07", paidOn: "2026-07-02", mode: "UPI" }, 18500), false);
});

test("receipt numbers follow the financial year", () => {
  assert.equal(fyLabel(tenancy), "FY 2026–27");
  assert.equal(receiptNo(tenancy, payment(tenancy, "2026-06")), "R-2026-27/03");
  assert.equal(totalPaid(tenancy), 8 * 18500);
  assert.throws(() => payment(tenancy, "2027-01"), /not paid yet/);
});

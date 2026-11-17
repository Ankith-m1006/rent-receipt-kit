// The one file you edit. Every email, PDF, image and page in this kit is drawn from it.
// All people, places and numbers here are invented.

export type PaymentMode = "UPI" | "Bank transfer" | "Cheque" | "Cash";

export interface Payment {
  /** Month the rent is for, as "2026-04". */
  month: string;
  /** Day it was received, as "2026-04-03". Leave out for a month not yet paid. */
  paidOn?: string;
  mode?: PaymentMode;
  /** UPI reference, UTR or cheque number. */
  reference?: string;
}

export const tenancy = {
  landlord: {
    name: "Lakshmi Narayana Rao",
    pan: "ABCPR4321K",
    phone: "+91 98450 00000",
    email: "lakshmi.rao@example.com",
    upiId: "lnrao@okbank",
  },
  tenant: {
    name: "Priya Hegde",
    email: "priya.hegde@example.com",
    employer: "Halcyon Software Pvt Ltd",
  },
  property: {
    line1: "No. 214, 2nd Floor, 9th Cross",
    line2: "Jayanagar 4th Block",
    city: "Bengaluru",
    pin: "560011",
  },
  monthlyRent: 18500,
  /** Indian financial year the statement covers: April to March. */
  financialYear: { start: 2026 },
  /** Where the web page and PDFs are published, for the email's links. */
  publishUrl: "https://rent.example.com/priya",
  payments: [
    { month: "2026-04", paidOn: "2026-04-02", mode: "UPI", reference: "UPI 410238877123" },
    { month: "2026-05", paidOn: "2026-05-03", mode: "UPI", reference: "UPI 412519002457" },
    { month: "2026-06", paidOn: "2026-06-05", mode: "Cash" },
    { month: "2026-07", paidOn: "2026-07-02", mode: "UPI", reference: "UPI 418806314409" },
    { month: "2026-08", paidOn: "2026-08-04", mode: "Bank transfer", reference: "UTR HDFCR52026080412" },
    { month: "2026-09", paidOn: "2026-09-02", mode: "UPI", reference: "UPI 424617730551" },
    { month: "2026-10", paidOn: "2026-10-03", mode: "Cheque", reference: "Cheque 004417" },
    { month: "2026-11", paidOn: "2026-11-02", mode: "UPI", reference: "UPI 430154468820" },
    { month: "2026-12" },
    { month: "2027-01" },
    { month: "2027-02" },
    { month: "2027-03" },
  ] as Payment[],
};

export type Tenancy = typeof tenancy;

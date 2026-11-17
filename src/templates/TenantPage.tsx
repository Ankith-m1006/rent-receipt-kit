import { Button, Column, Grid, Heading, Link, Page, Row, Section, Text, token } from "@hyper-elements/react";
import { receiptBook, webFonts } from "../theme";
import { ReceiptSlip } from "../slip";
import { annualRent, dateName, fyLabel, monthName, paid, receiptNo, rupees, totalPaid } from "../rules";
import { tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

const desk = { colors: { background: "#2A2D36", foreground: "#FFFFFF" } };

/** The tenant's page for the year: the receipt book open on the desk, what's paid, what's next. */
export default function TenantPage({ t = defaultTenancy }: { t?: Tenancy }) {
  const done = paid(t);
  const latest = done[done.length - 1];
  const next = t.payments.find((p) => !p.paidOn);
  return (
    <Page
      theme={receiptBook}
      width={920}
      fonts={webFonts}
      title={`Rent ${fyLabel(t)}: ${t.tenant.name}`}
      description={`Rent receipts for ${t.property.line2}, ${t.property.city}, ${fyLabel(t)}.`}
      style={{ gap: 0, backgroundColor: "#2A2D36" }}
    >
      <Section tokens={desk} style={{ padding: [56, 24, 28, 24], gap: 10, mobile: { padding: [32, 16, 18, 16] } }}>
        <Text style={{ fontSize: 14, color: "#B9BCC6" }}>
          {t.tenant.name} · {t.property.line2}, {t.property.city} · {fyLabel(t)}
        </Text>
        <Heading level={1} style={{ fontSize: 46, lineHeight: 1.1, color: "#FFFFFF", mobile: { fontSize: 32 } }}>
          {rupees(totalPaid(t))} paid of {rupees(annualRent(t))}
        </Heading>
        <Text style={{ fontSize: 17, color: "#D8DAE0" }}>
          {done.length} of 12 months paid{next ? `. ${monthName(next.month)} is due by the 5th.` : ". The year is complete."}
        </Text>
      </Section>

      <Section tokens={desk} style={{ padding: [8, 24, 28, 24], mobile: { padding: [6, 16, 20, 16] } }}>
        <Grid columns={6} style={{ gap: 8, rowGap: 8 }} stackOnMobile={false}>
          {t.payments.map((p) => (
            <Column
              key={p.month}
              style={{
                padding: [10, 8],
                gap: 2,
                borderRadius: 3,
                backgroundColor: p.paidOn ? token("colors.paper") : "#2A2D36",
                border: p.paidOn ? { width: 1, style: "solid", color: token("colors.paper") } : { width: 1, style: "dashed", color: "#5D6170" },
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 700, color: p.paidOn ? token("colors.print") : "#8D91A0" }}>{monthName(p.month).slice(0, 3)}</Text>
              {p.paidOn ? (
                <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
                  <Link href={`receipts/receipt-${p.month}.pdf`} style={{ color: token("colors.stamp"), textDecoration: "none" }}>
                    PAID
                  </Link>
                </Text>
              ) : (
                <Text style={{ fontSize: 11, letterSpacing: 1, color: "#8D91A0" }}>due</Text>
              )}
            </Column>
          ))}
        </Grid>
      </Section>

      <Section tokens={desk} style={{ padding: [12, 24, 40, 24], gap: 14, mobile: { padding: [8, 16, 28, 16] } }}>
        <Row style={{ gap: 32, alignItems: "start" }}>
          <Column style={{ flex: 1.5, gap: 12 }}>
            <Text style={{ fontSize: 14, color: "#B9BCC6" }}>Latest receipt</Text>
            <ReceiptSlip t={t} p={latest} to="page" />
          </Column>
          <Column style={{ flex: 1, gap: 14, padding: [30, 0, 0, 0], mobile: { padding: [8, 0, 0, 0] } }}>
            <Heading level={2} style={{ color: "#FFFFFF" }}>For your employer</Heading>
            <Text style={{ fontSize: 15, color: "#D8DAE0" }}>
              Payroll asks for a whole financial year of rent receipts, with the landlord's PAN once the rent is over ₹1,00,000. This
              statement has both, on one page.
            </Text>
            <Button href="statement.pdf" style={{ backgroundColor: token("colors.paper"), color: token("colors.print"), hover: { backgroundColor: "#FFFFFF" } }}>
              Download the {fyLabel(t)} statement
            </Button>
            <Text style={{ fontSize: 13, color: "#8D91A0" }}>
              Last paid {dateName(latest.paidOn!)} · Receipt {receiptNo(t, latest)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section tokens={desk} style={{ padding: [20, 24, 44, 24], gap: 4, border: { top: { width: 1, style: "solid", color: "#3B3F4A" } }, mobile: { padding: [18, 16, 30, 16] } }}>
        <Text style={{ fontSize: 13, color: "#8D91A0" }}>
          Landlord: {t.landlord.name} · {t.landlord.phone} · UPI {t.landlord.upiId}
        </Text>
      </Section>
    </Page>
  );
}

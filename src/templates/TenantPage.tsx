import { Button, Column, Grid, Heading, Link, Page, Row, Section, Text, token } from "@hyper-elements/react";
import { receiptBook, webFonts } from "../theme";
import { ReceiptSlip } from "../slip";
import { annualRent, dateName, fyLabel, monthName, paid, receiptNo, rupees, totalPaid } from "../rules";
import { tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/** The tenant's page for the year: what's paid, what's next, and every receipt one tap away. */
export default function TenantPage({ t = defaultTenancy }: { t?: Tenancy }) {
  const done = paid(t);
  const latest = done[done.length - 1];
  const next = t.payments.find((p) => !p.paidOn);
  return (
    <Page
      theme={receiptBook}
      width={880}
      fonts={webFonts}
      title={`Rent ${fyLabel(t)}: ${t.tenant.name}`}
      description={`Rent receipts for ${t.property.line2}, ${t.property.city}, ${fyLabel(t)}.`}
      style={{ gap: 0 }}
    >
      <Section style={{ padding: [48, 24, 20, 24], gap: 8, mobile: { padding: [28, 16, 12, 16] } }}>
        <Text style={{ apply: ["label"] }}>
          {t.property.line1}, {t.property.line2}, {t.property.city}
        </Text>
        <Heading level={1} style={{ fontSize: 40, lineHeight: 1.15, mobile: { fontSize: 30 } }}>
          {rupees(totalPaid(t))} paid of {rupees(annualRent(t))}
        </Heading>
        <Text style={{ fontSize: 17 }}>
          {t.tenant.name}'s rent for {fyLabel(t)}. {done.length} of 12 months paid
          {next ? `; ${monthName(next.month)} is due by the 5th.` : "; the year is complete."}
        </Text>
      </Section>

      <Section style={{ padding: [12, 24], gap: 10, mobile: { padding: [8, 16] } }}>
        <Grid columns={6} style={{ gap: 8, rowGap: 8 }} stackOnMobile={false}>
          {t.payments.map((p) => (
            <Column
              key={p.month}
              style={{
                padding: [10, 8],
                gap: 0,
                borderRadius: 4,
                backgroundColor: p.paidOn ? token("colors.paper") : token("colors.background"),
                border: p.paidOn ? "1px solid #C7D0E2" : { width: 1, style: "dashed", color: token("colors.muted") },
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: 600, color: p.paidOn ? token("colors.foreground") : token("colors.muted") }}>
                {monthName(p.month).slice(0, 3)}
              </Text>
              {p.paidOn ? (
                <Text style={{ fontSize: 15 }}>
                  <Link href={`receipts/receipt-${p.month}.pdf`} style={{ fontFamily: token("fonts.hand"), color: token("colors.ink"), textDecoration: "none" }}>
                    paid
                  </Link>
                </Text>
              ) : (
                <Text style={{ fontSize: 13, color: token("colors.muted") }}>due</Text>
              )}
            </Column>
          ))}
        </Grid>
      </Section>

      <Section style={{ padding: [20, 24, 12, 24], gap: 14, mobile: { padding: [16, 16, 8, 16] } }}>
        <Row style={{ gap: 28, alignItems: "start" }}>
          <Column style={{ flex: 1.4, gap: 10 }}>
            <Heading level={2}>Latest receipt, {monthName(latest.month)}</Heading>
            <ReceiptSlip t={t} p={latest} web />
          </Column>
          <Column style={{ flex: 1, gap: 12 }}>
            <Heading level={2}>For your employer</Heading>
            <Text style={{ fontSize: 14 }}>
              Payroll teams ask for rent receipts for the whole financial year, with the landlord's PAN when the rent is over ₹1,00,000. This
              statement has both.
            </Text>
            <Button href="statement.pdf">Download the {fyLabel(t)} statement</Button>
            <Text style={{ apply: ["label"] }}>
              Last paid {dateName(latest.paidOn!)} · Receipt {receiptNo(t, latest)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ padding: [24, 24, 48, 24], gap: 4, mobile: { padding: [20, 16, 32, 16] } }}>
        <Text style={{ apply: ["label"] }}>
          Landlord: {t.landlord.name} · {t.landlord.phone} · UPI {t.landlord.upiId}
        </Text>
      </Section>
    </Page>
  );
}

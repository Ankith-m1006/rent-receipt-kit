import { Button, Column, Email, Heading, Link, Row, Section, Text, token } from "@hyper-elements/react";
import { receiptBook, webFonts } from "../theme";
import { ReceiptSlip } from "../slip";
import { fyLabel, monthName, paid, rupees, totalPaid } from "../rules";
import { payment, tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/** The email the landlord sends the day the rent arrives. */
export default function ReceiptEmail({ t = defaultTenancy, month = "2026-11" }: { t?: Tenancy; month?: string }) {
  const p = payment(t, month);
  const file = `receipt-${month}.pdf`;
  return (
    <Email
      theme={receiptBook}
      width={600}
      fonts={webFonts}
      title={`Rent receipt, ${monthName(month)}`}
      previewText={`${rupees(t.monthlyRent)} received for ${monthName(month)}. Your receipt is attached.`}
      style={{ gap: 0 }}
    >
      <Section style={{ padding: [32, 24, 12, 24], gap: 10 }}>
        <Text style={{ apply: ["label"] }}>{t.property.line2}, {t.property.city}</Text>
        <Heading level={1}>Rent received for {monthName(month)}</Heading>
        <Text>
          Hi {t.tenant.name.split(" ")[0]}, thank you. Your rent of {rupees(t.monthlyRent)} reached me on time. The receipt is below and
          attached as a PDF for your records.
        </Text>
      </Section>
      <Section style={{ padding: [12, 24], gap: 0 }}>
        <ReceiptSlip t={t} p={p} to="email" />
      </Section>
      <Section style={{ padding: [12, 24, 8, 24], gap: 14 }}>
        <Row style={{ gap: 12 }}>
          <Button href={`${t.publishUrl}/${file}`}>Download the receipt</Button>
          <Button
            href={t.publishUrl}
            style={{ backgroundColor: "#FFFFFF", color: token("colors.print"), border: "1px solid #9E1C33" }}
          >
            See the whole year
          </Button>
        </Row>
        <Column style={{ backgroundColor: token("colors.tint"), padding: [14, 16], borderRadius: 4, gap: 4 }}>
          <Text style={{ fontWeight: 600 }}>For your HRA claim</Text>
          <Text style={{ fontSize: 14 }}>
            {paid(t).length} of 12 months paid in {fyLabel(t)}, {rupees(totalPaid(t))} so far. The whole year comes as one statement with my
            PAN, ready for your employer's tax-proof deadline.
          </Text>
        </Column>
      </Section>
      <Section style={{ padding: [16, 24, 32, 24], gap: 4 }}>
        <Text style={{ apply: ["label"] }}>
          {t.landlord.name} · {t.landlord.phone} · <Link href={`mailto:${t.landlord.email}`}>{t.landlord.email}</Link>
        </Text>
        <Text style={{ apply: ["label"] }}>Next rent is due by the 5th. UPI: {t.landlord.upiId}</Text>
      </Section>
    </Email>
  );
}

import { Column, Document, Heading, PageFooter, PageNumber, Row, Span, Table, TableCell, TableRow, Text, token } from "@hyper-elements/react";
import { receiptBook } from "../theme";
import { signature } from "../slip";
import { annualRent, dateName, fyLabel, inWords, monthName, paid, panRequired, receiptNo, rupees, stampRequired, totalPaid } from "../rules";
import { tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/** The one PDF an employer's payroll team asks for: every month of the financial year, the total, and the landlord's PAN. */
export default function AnnualStatement({ t = defaultTenancy }: { t?: Tenancy }) {
  const months = paid(t).length;
  const cashStamped = t.payments.some((p) => p.paidOn && stampRequired(p, t.monthlyRent));
  return (
    <Document theme={receiptBook} size="A4" margin={44} title={`Rent statement ${fyLabel(t)}`} style={{ backgroundColor: "#FFFFFF", gap: 18 }}>
      <PageFooter style={{ padding: [10, 0, 0, 0], border: { top: { width: 1, style: "solid", color: token("colors.rule") } } }}>
        <Text style={{ apply: ["label"], fontSize: 10 }}>
          Rent statement {fyLabel(t)} · {t.tenant.name} · page <PageNumber /> of <PageNumber total />
        </Text>
      </PageFooter>
      <Row style={{ alignItems: "end", justifyContent: "space-between" }} stackOnMobile={false}>
        <Column style={{ gap: 2 }}>
          <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>RENT STATEMENT FOR HRA</Text>
          <Heading level={1}>{fyLabel(t)}</Heading>
          <Text style={{ apply: ["label"] }}>April {t.financialYear.start} to March {t.financialYear.start + 1}</Text>
        </Column>
        <Text style={{ fontSize: 13, fontWeight: 600, color: token("colors.serial") }}>{months} receipts</Text>
      </Row>

      <Row style={{ gap: 16 }} stackOnMobile={false}>
        <Column style={{ flex: 1, gap: 2, backgroundColor: token("colors.tint"), padding: [12, 14], borderRadius: 4 }}>
          <Text style={{ apply: ["label"] }}>Tenant</Text>
          <Text style={{ fontWeight: 600 }}>{t.tenant.name}</Text>
          <Text style={{ fontSize: 13 }}>{t.tenant.employer}</Text>
        </Column>
        <Column style={{ flex: 1, gap: 2, backgroundColor: token("colors.tint"), padding: [12, 14], borderRadius: 4 }}>
          <Text style={{ apply: ["label"] }}>Landlord</Text>
          <Text style={{ fontWeight: 600 }}>{t.landlord.name}</Text>
          <Text style={{ fontSize: 13 }}>PAN {t.landlord.pan}</Text>
        </Column>
        <Column style={{ flex: 1.3, gap: 2, backgroundColor: token("colors.tint"), padding: [12, 14], borderRadius: 4 }}>
          <Text style={{ apply: ["label"] }}>Rented premises</Text>
          <Text style={{ fontSize: 13 }}>{t.property.line1}, {t.property.line2}, {t.property.city} {t.property.pin}</Text>
        </Column>
      </Row>

      <Table style={{ cellPadding: [7, 8], rowBorder: { width: 1, style: "solid", color: token("colors.rule") }, fontSize: 13 }}>
        <TableRow header style={{ backgroundColor: token("colors.tint") }}>
          <TableCell>Month</TableCell>
          <TableCell>Receipt</TableCell>
          <TableCell>Paid on</TableCell>
          <TableCell>How</TableCell>
          <TableCell style={{ textAlign: "right" }}>Amount</TableCell>
        </TableRow>
        {t.payments.map((p) => (
          <TableRow key={p.month}>
            <TableCell>{monthName(p.month)}</TableCell>
            <TableCell style={{ color: token("colors.serial") }}>{p.paidOn ? receiptNo(t, p) : ""}</TableCell>
            <TableCell>{p.paidOn ? dateName(p.paidOn) : <Span style={{ color: token("colors.muted") }}>Not yet due</Span>}</TableCell>
            <TableCell>{p.paidOn ? (p.reference ?? p.mode) : ""}</TableCell>
            <TableCell style={{ textAlign: "right", fontWeight: p.paidOn ? 600 : 400, color: p.paidOn ? token("colors.foreground") : token("colors.muted") }}>
              {p.paidOn ? rupees(t.monthlyRent) : "–"}
            </TableCell>
          </TableRow>
        ))}
        <TableRow footer>
          <TableCell colSpan={4} style={{ fontWeight: 700 }}>Paid so far ({months} of 12 months)</TableCell>
          <TableCell style={{ textAlign: "right", fontWeight: 700 }}>{rupees(totalPaid(t))}</TableCell>
        </TableRow>
      </Table>
      <Text style={{ fontSize: 13 }}>
        In words: <Span style={{ fontFamily: token("fonts.hand"), color: token("colors.ink"), fontSize: 15 }}>Rupees {inWords(totalPaid(t))} only</Span>
      </Text>

      <Column style={{ gap: 6, border: { left: { width: 3, style: "solid", color: token("colors.ink") } }, padding: [4, 0, 4, 12] }}>
        <Text style={{ fontSize: 13 }}>
          {panRequired(t)
            ? `Rent for the full year is ${rupees(annualRent(t))}, above ₹1,00,000, so the landlord's PAN is given above as the income-tax rules for HRA require.`
            : `Rent for the full year is ${rupees(annualRent(t))}, not above ₹1,00,000, so the landlord's PAN is not required.`}
        </Text>
        {cashStamped ? (
          <Text style={{ fontSize: 13 }}>Months paid in cash above ₹5,000 have their own receipts with a ₹1 revenue stamp.</Text>
        ) : null}
      </Column>

      <Row style={{ gap: 24, alignItems: "end", padding: [18, 0, 0, 0] }} stackOnMobile={false}>
        <Text style={{ flex: 1, fontSize: 13 }}>
          I confirm that I received the rent above from {t.tenant.name} for the premises named here.
        </Text>
        <Column style={{ width: 220, flex: "none", gap: 0, alignItems: "end" }}>
          <Text style={{ apply: ["hand"], fontSize: 22 }}>{signature(t.landlord.name)}</Text>
          <Text style={{ apply: ["label"], fontSize: 12, border: { top: { width: 1, style: "solid", color: token("colors.foreground") } }, padding: [4, 0, 0, 0] }}>
            {t.landlord.name}, landlord
          </Text>
        </Column>
      </Row>
    </Document>
  );
}

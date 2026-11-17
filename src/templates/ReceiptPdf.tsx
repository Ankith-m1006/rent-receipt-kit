import { Column, Document, Row, Text, token } from "@hyper-elements/react";
import { receiptBook } from "../theme";
import { ReceiptSlip } from "../slip";
import { dateName, fyLabel, monthName, receiptNo, rupees } from "../rules";
import { payment, tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/**
 * The printable receipt: A5 landscape, with the counterfoil the landlord keeps on the left,
 * torn along the dashed line, as in a receipt book.
 */
export default function ReceiptPdf({ t = defaultTenancy, month = "2026-11" }: { t?: Tenancy; month?: string }) {
  const p = payment(t, month);
  return (
    <Document theme={receiptBook} size="A5" orientation="landscape" margin={22} title={`Rent receipt ${receiptNo(t, p)}`} style={{ backgroundColor: "#FFFFFF" }}>
      <Row style={{ gap: 0, alignItems: "stretch" }} stackOnMobile={false}>
        <Column
          style={{
            width: 132,
            flex: "none",
            padding: [10, 14, 10, 4],
            gap: 8,
            border: { right: { width: 1, style: "dashed", color: token("colors.muted") } },
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>COUNTERFOIL</Text>
          <Text style={{ fontSize: 12, fontWeight: 600, color: token("colors.serial") }}>No. {receiptNo(t, p)}</Text>
          <Text style={{ apply: ["label"], fontSize: 10 }}>Date</Text>
          <Text style={{ apply: ["hand"], fontSize: 13 }}>{dateName(p.paidOn!)}</Text>
          <Text style={{ apply: ["label"], fontSize: 10 }}>From</Text>
          <Text style={{ apply: ["hand"], fontSize: 13 }}>{t.tenant.name}</Text>
          <Text style={{ apply: ["label"], fontSize: 10 }}>For</Text>
          <Text style={{ apply: ["hand"], fontSize: 13 }}>{monthName(p.month)}</Text>
          <Text style={{ apply: ["hand"], fontSize: 15, fontWeight: 700 }}>{rupees(t.monthlyRent)}/-</Text>
          <Text style={{ apply: ["label"], fontSize: 10 }}>{p.mode}</Text>
        </Column>
        <Column style={{ flex: 1, padding: [0, 0, 0, 16], gap: 10 }}>
          <ReceiptSlip t={t} p={p} compact />
          <Text style={{ apply: ["label"], fontSize: 10, lineHeight: 1.4 }}>
            Rent receipt for House Rent Allowance under section 10(13A) of the Income-tax Act. Keep it with your tax papers until the
            assessment for {fyLabel(t)} is closed.
          </Text>
        </Column>
      </Row>
    </Document>
  );
}

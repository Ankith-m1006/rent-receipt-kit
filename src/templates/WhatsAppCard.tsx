import { Canvas, Column, Text, token } from "@hyper-elements/react";
import { receiptBook } from "../theme";
import { ReceiptSlip } from "../slip";
import { monthName, rupees } from "../rules";
import { payment, tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/**
 * The receipt as a picture for the WhatsApp chat, where most landlords and tenants actually talk:
 * the torn-out page on a dark desk. Drawn at 540×675 and written at scale 2, a 1080×1350 image.
 */
export default function WhatsAppCard({ t = defaultTenancy, month = "2026-11" }: { t?: Tenancy; month?: string }) {
  const p = payment(t, month);
  return (
    <Canvas theme={receiptBook} width={540} height={675} style={{ backgroundColor: "#2A2D36", padding: 26, gap: 14, justifyContent: "center" }}>
      <Column style={{ gap: 0 }}>
        <Text style={{ fontSize: 15, color: "#B9BCC6" }}>Rent received for {monthName(month)}</Text>
        <Text style={{ fontFamily: token("fonts.hand"), fontSize: 40, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 }}>{rupees(t.monthlyRent)}</Text>
      </Column>
      <ReceiptSlip t={t} p={p} to="image" width={488} />
      <Text style={{ fontSize: 12, color: "#B9BCC6", textAlign: "center" }}>The PDF receipt is in your email. Keep it for your HRA claim.</Text>
    </Canvas>
  );
}

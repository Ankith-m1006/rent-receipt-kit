import { Canvas, Column, Text, token } from "@hyper-elements/react";
import { receiptBook } from "../theme";
import { ReceiptSlip } from "../slip";
import { monthName, rupees } from "../rules";
import { payment, tenancy as defaultTenancy, type Tenancy } from "../tenancy-api";

/**
 * The receipt as a picture for the WhatsApp chat, where most landlords and tenants actually talk.
 * Drawn at 540×675 and written at scale 2: a 1080×1350 portrait image.
 */
export default function WhatsAppCard({ t = defaultTenancy, month = "2026-11" }: { t?: Tenancy; month?: string }) {
  const p = payment(t, month);
  return (
    <Canvas theme={receiptBook} width={540} height={675} style={{ backgroundColor: "#E9EDF4", padding: 26, gap: 16, justifyContent: "center" }}>
      <Column style={{ gap: 0 }}>
        <Text style={{ fontSize: 15, color: token("colors.muted") }}>Rent received for {monthName(month)}</Text>
        <Text style={{ fontFamily: token("fonts.hand"), fontSize: 38, fontWeight: 700, color: token("colors.ink"), lineHeight: 1.2 }}>{rupees(t.monthlyRent)}</Text>
      </Column>
      <ReceiptSlip t={t} p={p} compact />
      <Text style={{ fontSize: 13, color: token("colors.muted"), textAlign: "center" }}>
        The PDF receipt is in your email. Keep it for your HRA claim.
      </Text>
    </Canvas>
  );
}

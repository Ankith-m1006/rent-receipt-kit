import { Column, Row, Span, Text, token } from "@hyper-elements/react";
import type { Payment, Tenancy } from "./tenancy";
import { dateName, inWords, monthName, receiptNo, rupees, stampRequired } from "./rules";

const rule = { bottom: { width: 1, style: "dashed" as const, color: token("colors.rule") } };

/** One printed label and the landlord's handwritten entry on the line after it. */
export function Field({ label, children, size = 18, web = false }: { label: string; children: React.ReactNode; size?: number; web?: boolean }) {
  return (
    <Row style={{ gap: 10, alignItems: "end", ...(web ? { mobile: { gap: 0 } } : {}) }} stackOnMobile={web}>
      <Text style={{ apply: ["label"], width: 112, flex: "none" }}>{label}</Text>
      <Text style={{ apply: ["hand"], fontSize: size, lineHeight: 1.3, border: rule, padding: [0, 0, 2, 0], flex: 1 }}>{children}</Text>
    </Row>
  );
}

/**
 * The receipt itself: the same element tree is drawn into the email, the web page,
 * the PDF and the WhatsApp image, so all four always say the same thing.
 */
export function ReceiptSlip({ t, p, compact = false, web = false }: { t: Tenancy; p: Payment; compact?: boolean; web?: boolean }) {
  const amount = t.monthlyRent;
  const stamp = stampRequired(p, amount);
  const via = p.mode === "Cash" ? "in cash" : `by ${p.mode}${p.reference ? ` (${p.reference.replace(/^(UPI|UTR|Cheque) /, "")})` : ""}`;
  return (
    <Column style={{ apply: ["paper"], padding: compact ? [20, 22] : [26, 30], gap: compact ? 12 : 14, ...(web ? { mobile: { padding: [18, 16] } } : {}) }}>
      <Row style={{ alignItems: "center" }} stackOnMobile={false}>
        <Text style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: token("colors.foreground"), flex: 1 }}>RENT RECEIPT</Text>
        <Text style={{ fontSize: 15, fontWeight: 600, color: token("colors.serial"), textAlign: "right" }}>
          No. {receiptNo(t, p)}
        </Text>
      </Row>
      <Text style={{ apply: ["label"], textAlign: "right" }}>
        Date{" "}<Span style={{ fontFamily: token("fonts.hand"), color: token("colors.ink"), fontSize: 16 }}>{dateName(p.paidOn!)}</Span>
      </Text>
      <Field web={web} label="Received with thanks from">{t.tenant.name}</Field>
      <Field web={web} label="the sum of Rupees">{inWords(amount)} only</Field>
      <Field web={web} label="paid">{via}</Field>
      <Field web={web} label="towards rent for">{monthName(p.month)}</Field>
      <Field web={web} label="of the premises at" size={16}>
        {t.property.line1}, {t.property.line2}, {t.property.city} {t.property.pin}
      </Field>
      <Row style={{ gap: 14, alignItems: "center", padding: [6, 0, 0, 0] }} stackOnMobile={false}>
        <Column style={{ border: "2px solid #2B2F3A", padding: [6, 14], flex: "none" }}>
          <Text style={{ fontFamily: token("fonts.hand"), fontSize: 24, fontWeight: 700, color: token("colors.ink") }}>
            {rupees(amount)}/-
          </Text>
        </Column>
        {stamp ? (
          <Column style={{ width: 88, flex: "none", border: { width: 1, style: "dashed", color: token("colors.serial") }, padding: [8, 4] }}>
            <Text style={{ fontSize: 11, color: token("colors.serial"), textAlign: "center", lineHeight: 1.2 }}>Affix ₹1 revenue stamp</Text>
          </Column>
        ) : null}
      </Row>
      <Column style={{ gap: 0, alignItems: "end" }}>
        <Text style={{ fontFamily: token("fonts.hand"), fontSize: 21, color: token("colors.ink") }}>{signature(t.landlord.name)}</Text>
        <Text style={{ apply: ["label"] }}>Landlord, PAN {t.landlord.pan}</Text>
      </Column>
    </Column>
  );
}

/** The landlord's signature as written: first and last name. */
export const signature = (name: string) => {
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : name;
};

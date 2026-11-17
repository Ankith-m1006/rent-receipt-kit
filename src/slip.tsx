import { Circle, Column, Row, Span, Svg, Text, token } from "@hyper-elements/react";
import type { Payment, Tenancy } from "./tenancy";
import { dateName, inWords, monthName, receiptNo, rupees, stampRequired } from "./rules";

/** Where the slip is drawn: phone styles only exist in an email or a page, shapes (Svg) everywhere but an email. */
export type Destination = "email" | "page" | "print" | "image";

const rule = { bottom: { width: 1, style: "solid" as const, color: token("colors.rule") } };

/** One printed label and the landlord's ballpoint entry on the ruled line beside it. */
export function Field({ label, children, size = 18, to }: { label: string; children: React.ReactNode; size?: number; to: Destination }) {
  const web = to === "email" || to === "page";
  return (
    <Row style={{ gap: 10, alignItems: "end", ...(web ? { mobile: { gap: 0 } } : {}) }} stackOnMobile={web}>
      <Text style={{ apply: ["label"], width: 118, flex: "none" }}>{label}</Text>
      <Text style={{ apply: ["hand"], fontSize: size, lineHeight: 1.3, border: rule, padding: [0, 0, 2, 4], flex: 1 }}>{children}</Text>
    </Row>
  );
}

/** The row of holes a receipt book's page is torn along. */
function Perforation({ width, to }: { width: number; to: Destination }) {
  if (to === "email" || to === "page") return null; // fluid width: a dotted edge is drawn as the slip's border instead
  const n = Math.floor(width / 14);
  return (
    <Svg width={width} height={10} viewBox={`0 0 ${width} 10`} title="Perforated edge">
      {Array.from({ length: n }, (_, i) => (
        <Circle key={i} cx={7 + i * 14} cy={5} r={2.6} style={{ fill: "#2A2D36" }} />
      ))}
    </Svg>
  );
}

/** The landlord's rubber stamp, in the purple ink every Indian office uses. */
export function PaidStamp({ day, light = false }: { day: string; light?: boolean }) {
  const ink = light ? "#FFFFFF" : token("colors.stamp");
  return (
    <Column style={{ border: { width: 2, style: "solid", color: ink }, borderRadius: 6, padding: 3, flex: "none" }}>
      <Column style={{ border: { width: 1, style: "solid", color: ink }, borderRadius: 4, padding: [4, 12], gap: 0, alignItems: "center" }}>
        <Text style={{ color: ink, fontSize: 20, fontWeight: 700, letterSpacing: 5, lineHeight: 1.1, textAlign: "center" }}>PAID</Text>
        <Text style={{ color: ink, fontSize: 10, fontWeight: 600, letterSpacing: 1, textAlign: "center" }}>{day.toUpperCase()}</Text>
      </Column>
    </Column>
  );
}

/**
 * A page from a rent receipt book: the printed header with the landlord's name, the red serial number,
 * ruled lines filled in by hand, the amount box and the rubber stamp. The same element tree is drawn
 * into the email, the web page, the PDF and the WhatsApp image, so all four always say the same thing.
 */
export function ReceiptSlip({ t, p, to, width = 540 }: { t: Tenancy; p: Payment; to: Destination; width?: number }) {
  const amount = t.monthlyRent;
  const cashStamp = stampRequired(p, amount);
  const web = to === "email" || to === "page";
  const via = p.mode === "Cash" ? "in cash" : `by ${p.mode}${p.reference ? ` (${p.reference.replace(/^(UPI|UTR|Cheque) /, "")})` : ""}`;
  return (
    <Column
      style={{
        backgroundColor: token("colors.paper"),
        gap: 0,
        border: web ? { top: { width: 4, style: "dotted", color: token("colors.desk") } } : undefined,
      }}
    >
      <Perforation width={width} to={to} />
      <Row style={{ backgroundColor: token("colors.print"), padding: [12, 22], alignItems: "center", gap: 12 }} stackOnMobile={false}>
        <Column style={{ flex: 1, gap: 0 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{t.landlord.name}</Text>
          <Text style={{ color: "#F6D7DC", fontSize: 11, letterSpacing: 1 }}>
            {t.property.line2}, {t.property.city}
          </Text>
        </Column>
        <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 700, letterSpacing: 3, textAlign: "right" }}>RENT RECEIPT</Text>
      </Row>
      <Column style={{ padding: [16, 22, 20, 22], gap: 12, ...(web ? { mobile: { padding: [14, 14, 18, 14] } } : {}) }}>
        <Row style={{ alignItems: "end", gap: 12 }} stackOnMobile={false}>
          <Text style={{ flex: 1, fontSize: 15, fontWeight: 700, color: token("colors.serial") }}>
            No.{"\u00a0"}<Span style={{ fontSize: 19 }}>{receiptNo(t, p).split("/")[1]}</Span>
            <Span style={{ fontSize: 11, fontWeight: 600, color: token("colors.label") }}>{"\u00a0/\u00a0"}{receiptNo(t, p).split("/")[0]}</Span>
          </Text>
          <Text style={{ apply: ["label"], textAlign: "right" }}>
            Date{"\u00a0"}
            <Span style={{ fontFamily: token("fonts.hand"), color: token("colors.ink"), fontSize: 16 }}>{dateName(p.paidOn!)}</Span>
          </Text>
        </Row>
        <Field to={to} label="Received with thanks from">{t.tenant.name}</Field>
        <Field to={to} label="the sum of Rupees">{inWords(amount)} only</Field>
        <Field to={to} label="paid">{via}</Field>
        <Field to={to} label="towards rent for">{monthName(p.month)}</Field>
        <Field to={to} label="of the premises at" size={15}>
          {t.property.line1}, {t.property.line2}, {t.property.city} {t.property.pin}
        </Field>
        <Row style={{ gap: 12, alignItems: "center", padding: [8, 0, 0, 0] }} stackOnMobile={false}>
          <Column style={{ border: { width: 2, style: "solid", color: token("colors.print") }, padding: [5, 12], flex: "none", backgroundColor: "#FFFFFF" }}>
            <Text style={{ fontFamily: token("fonts.hand"), fontSize: 23, fontWeight: 700, color: token("colors.ink") }}>{rupees(amount)}/-</Text>
          </Column>
          <PaidStamp day={dateName(p.paidOn!)} />
          {cashStamp ? (
            <Column style={{ width: 86, flex: "none", border: { width: 1, style: "dashed", color: token("colors.print") }, padding: [6, 4] }}>
              <Text style={{ fontSize: 10, color: token("colors.print"), textAlign: "center", lineHeight: 1.2 }}>Affix ₹1 revenue stamp</Text>
            </Column>
          ) : null}
        </Row>
        <Column style={{ gap: 0, alignItems: "end" }}>
          <Text style={{ fontFamily: token("fonts.hand"), fontSize: 22, color: token("colors.ink"), lineHeight: 1.1 }}>{signature(t.landlord.name)}</Text>
          <Text style={{ apply: ["label"], fontSize: 11 }}>Landlord's signature · PAN {t.landlord.pan}</Text>
        </Column>
      </Column>
    </Column>
  );
}

/** The landlord's signature as written: first and last name. */
export const signature = (name: string) => {
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : name;
};

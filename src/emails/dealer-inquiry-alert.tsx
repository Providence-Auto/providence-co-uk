import { Link, Section, Text } from "@react-email/components";
import { whatsappLink } from "@/config/contact";
import { formatBudget } from "@/lib/currencies";
import { conditionLabel } from "@/lib/vehicle-inquiry";
import EmailLayout from "./layout";

// Internal alert to the consultant a dealer inquiry was assigned to. Carries
// everything they need to make the first call without opening the admin panel.

export interface DealerInquiryAlertCar {
  make: string;
  model: string;
  condition: string;
  yearRange: string | null;
  mileage: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  specs: string | null;
  budgetAmount: number;
  budgetCurrency: string;
  importTimeline: string;
}

export interface DealerInquiryAlertProps {
  reference: string;
  country: string;
  /** True when the country is not on our destination list yet. */
  unlistedMarket: boolean;
  dealershipName: string;
  website: string | null;
  socialMedia: string | null;
  contactName: string;
  designation: string;
  email: string;
  /** E.164. */
  whatsapp: string;
  /** Display name of the preferred source market, or "". */
  sourceMarket: string;
  cars: DealerInquiryAlertCar[];
  notes: string | null;
  assignedToName: string;
}

export const DealerInquiryAlertEmail = (props: DealerInquiryAlertProps) => {
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dealer-inquiries`;
  const whatsappUrl = whatsappLink(undefined, props.whatsapp);
  const carCount = props.cars.length;

  return (
    <EmailLayout
      preview={`${props.dealershipName} (${props.country}) — ${
        carCount ? `${carCount} car${carCount > 1 ? "s" : ""}` : "sourcing"
      } request ${props.reference}`}
      heading="New Dealer Inquiry"
    >
      <Text style={textStyle}>
        {props.dealershipName} in {props.country} sent a sourcing request from
        the dealer page. It is assigned to {props.assignedToName}.
      </Text>

      {props.unlistedMarket && (
        <Text style={warningStyle}>
          {props.country} is not on our destination list yet. Confirm we can
          ship there before quoting.
        </Text>
      )}

      <Section style={containerStyle}>
        <Text style={labelStyle}>Dealership</Text>
        <Text style={{ ...valueStyle, fontWeight: "bold" }}>
          {props.dealershipName}
        </Text>
        <Text style={valueStyle}>Market: {props.country}</Text>
        {props.website && (
          <Text style={valueStyle}>
            Website: <Link href={props.website}>{props.website}</Link>
          </Text>
        )}
        {props.socialMedia && (
          <Text style={valueStyle}>
            Social: <Link href={props.socialMedia}>{props.socialMedia}</Link>
          </Text>
        )}

        <div style={dividerStyle} />

        <Text style={labelStyle}>Contact</Text>
        <Text style={valueStyle}>
          {props.contactName} · {props.designation}
        </Text>
        <Text style={valueStyle}>
          <Link href={`mailto:${props.email}`}>{props.email}</Link>
        </Text>
        <Text style={valueStyle}>
          WhatsApp:{" "}
          {whatsappUrl ? (
            <Link href={whatsappUrl}>{props.whatsapp}</Link>
          ) : (
            props.whatsapp
          )}
        </Text>

        <div style={dividerStyle} />

        <Text style={labelStyle}>What they want</Text>
        {props.sourceMarket && (
          <Text style={valueStyle}>
            Preferred source{" "}
            {props.sourceMarket.includes(",") ? "markets" : "market"}:{" "}
            {props.sourceMarket}
          </Text>
        )}
        {carCount === 0 && !props.sourceMarket && (
          <Text style={valueStyle}>No market or car named.</Text>
        )}
        {props.cars.map((car, index) => (
          <Section key={`${car.make}-${car.model}-${index}`} style={carStyle}>
            <Text style={{ ...valueStyle, fontWeight: "bold" }}>
              {index + 1}. {conditionLabel(car.condition)} {car.make}{" "}
              {car.model}
            </Text>
            {car.condition === "Used" && (car.yearRange || car.mileage) && (
              <Text style={valueStyle}>
                {[car.yearRange, car.mileage].filter(Boolean).join(" · ")}
              </Text>
            )}
            {(car.exteriorColor || car.interiorColor) && (
              <Text style={valueStyle}>
                {[
                  car.exteriorColor && `Exterior: ${car.exteriorColor}`,
                  car.interiorColor && `Interior: ${car.interiorColor}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            )}
            <Text style={valueStyle}>
              Budget: {formatBudget(car.budgetAmount, car.budgetCurrency)} ·
              Timeline: {car.importTimeline}
            </Text>
            {car.specs && <Text style={quoteStyle}>"{car.specs}"</Text>}
          </Section>
        ))}

        {props.notes && (
          <>
            <div style={dividerStyle} />
            <Text style={labelStyle}>Note from the dealer</Text>
            <Text style={quoteStyle}>"{props.notes}"</Text>
          </>
        )}
      </Section>

      <Text style={{ ...textStyle, fontSize: "13px", color: "#71717a" }}>
        Reference {props.reference}
      </Text>

      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Link href={adminUrl} style={buttonStyle}>
          Open Dealer Inquiries
        </Link>
      </Section>
    </EmailLayout>
  );
};

export default DealerInquiryAlertEmail;

// --- STYLES ---
const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#52525b",
  marginBottom: "16px",
};
const warningStyle = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#92400e",
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "0 0 16px 0",
};
const containerStyle = {
  backgroundColor: "#fafafa",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};
const carStyle = {
  borderLeft: "3px solid #0ea5e9",
  paddingLeft: "12px",
  margin: "12px 0",
};
const dividerStyle = { margin: "20px 0", borderBottom: "1px solid #e4e4e7" };
const labelStyle = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#a1a1aa",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px 0",
};
const valueStyle = { fontSize: "14px", color: "#18181b", margin: "0 0 4px 0" };
const quoteStyle = {
  ...valueStyle,
  marginTop: "6px",
  fontSize: "14px",
  fontStyle: "italic",
  color: "#71717a",
};
const buttonStyle = {
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};

import { Link, Section, Text } from "@react-email/components";
import { GENERAL_WHATSAPP_NUMBER, whatsappLink } from "@/config/contact";
import { conditionLabel } from "@/lib/vehicle-inquiry";
import EmailLayout from "./layout";

// The dealer's copy of what they sent, from the consultant it was assigned to.
// Deliberately a receipt, not a pitch: the reference, what they asked for, and
// who to talk to. It makes no claim about timing or service that the page
// itself does not make.

export interface DealerInquiryConfirmationProps {
  contactName: string;
  dealershipName: string;
  reference: string;
  country: string;
  /** Display name of the preferred source market, or "". */
  sourceMarket: string;
  cars: { make: string; model: string; condition: string }[];
  /** Null when no one could be assigned — the email then signs off as the company. */
  agent: {
    name: string;
    email: string;
    image: string;
    whatsappNumber?: string;
  } | null;
}

export const DealerInquiryConfirmationEmail = ({
  contactName,
  dealershipName,
  reference,
  country,
  sourceMarket,
  cars,
  agent,
}: DealerInquiryConfirmationProps) => {
  const firstName = contactName.trim().split(/\s+/)[0] || "there";
  const agentFirstName = agent?.name.trim().split(/\s+/)[0] ?? "";
  // The dealership name is optional.
  const fromDealership = dealershipName ? ` from ${dealershipName}` : "";
  const hasAgentWhatsapp = Boolean(agent?.whatsappNumber?.trim());
  const whatsappUrl = whatsappLink(
    hasAgentWhatsapp
      ? `Hi ${agentFirstName}, this is ${firstName}${fromDealership} — about request ${reference}.`
      : `Hi Providence Auto, this is ${firstName}${fromDealership} — about request ${reference}.`,
    hasAgentWhatsapp
      ? (agent?.whatsappNumber as string)
      : GENERAL_WHATSAPP_NUMBER,
  );

  return (
    <EmailLayout
      preview={`Your sourcing request ${reference}${dealershipName ? ` for ${dealershipName}` : ""}`}
      heading={`Your request is in, ${firstName}`}
      profile={
        agent
          ? { name: agent.name, image: agent.image, role: "Sales Consultant" }
          : undefined
      }
      footerNote={
        agent
          ? `Replies to this email go to ${agent.name}.`
          : "Replies to this email go to our sales team."
      }
    >
      <Text style={textStyle}>
        {agent
          ? `I'm ${agent.name}, and I'm your consultant for this request. Here is what ${dealershipName || "you"} sent us:`
          : `Here is what ${dealershipName || "you"} sent us:`}
      </Text>

      <Section style={containerStyle}>
        <Text style={labelStyle}>Reference</Text>
        <Text style={{ ...valueStyle, fontWeight: "bold" }}>{reference}</Text>

        <div style={dividerStyle} />

        <Text style={labelStyle}>Importing into</Text>
        <Text style={valueStyle}>{country}</Text>

        {sourceMarket && (
          <>
            <div style={dividerStyle} />
            <Text style={labelStyle}>
              {sourceMarket.includes(",") ? "Source markets" : "Source market"}
            </Text>
            <Text style={valueStyle}>{sourceMarket}</Text>
          </>
        )}

        {cars.length > 0 && (
          <>
            <div style={dividerStyle} />
            <Text style={labelStyle}>
              {cars.length === 1 ? "The car" : `The ${cars.length} cars`}
            </Text>
            {cars.map((car, index) => (
              <Text
                key={`${car.make}-${car.model}-${index}`}
                style={valueStyle}
              >
                {conditionLabel(car.condition)} {car.make} {car.model}
              </Text>
            ))}
          </>
        )}
      </Section>

      <Text style={textStyle}>
        {agent
          ? "Reply to this email, or message me on WhatsApp, and quote your reference."
          : "Reply to this email, or message us on WhatsApp, and quote your reference."}
      </Text>

      {whatsappUrl && (
        <Section style={{ textAlign: "center", marginTop: "8px" }}>
          <Link href={whatsappUrl} style={buttonStyle}>
            {hasAgentWhatsapp
              ? `Message ${agentFirstName} on WhatsApp`
              : "Message us on WhatsApp"}
          </Link>
        </Section>
      )}
    </EmailLayout>
  );
};

export default DealerInquiryConfirmationEmail;

// --- STYLES ---
const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#52525b",
  marginBottom: "16px",
};
const containerStyle = {
  backgroundColor: "#fafafa",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};
const dividerStyle = { margin: "16px 0", borderBottom: "1px solid #e4e4e7" };
const labelStyle = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#a1a1aa",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px 0",
};
const valueStyle = { fontSize: "14px", color: "#18181b", margin: "0 0 4px 0" };
const buttonStyle = {
  backgroundColor: "#25D366",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};

import { Link, Section, Text } from "@react-email/components";
import EmailLayout from "./layout";

// Sent to the customer when the team confirms their sale (Sales Confirmed):
// their personal link to the KYC form. It carries the link and nothing the
// customer has told us — no ID, address or bank detail travels by email.

export interface KycRequestEmailProps {
  firstName: string;
  link: string;
  /** "Toyota Land Cruiser", when the sale is on a lead with a car. */
  vehicle?: string | null;
  /** The link reopens a KYC they already sent, pre-filled. */
  prefilled: boolean;
  validDays: number;
  consultant?: { name: string; image?: string | null } | null;
}

export const KycRequestEmail = ({
  firstName,
  link,
  vehicle,
  prefilled,
  validDays,
  consultant,
}: KycRequestEmailProps) => (
  <EmailLayout
    preview="Your sale is confirmed. Complete your KYC details so your proforma invoice can be issued."
    heading="Your sale is confirmed"
    profile={
      consultant
        ? {
            name: consultant.name,
            image: consultant.image,
            role: "Sales Consultant",
          }
        : undefined
    }
    footerNote={
      consultant
        ? `Replies to this email go to ${consultant.name}.`
        : "Replies to this email go to the Providence Auto team."
    }
  >
    <Text style={textStyle}>Hi {firstName},</Text>
    <Text style={textStyle}>
      {vehicle
        ? `Your sale is confirmed for the ${vehicle}. `
        : "Your sale is confirmed. "}
      The next step is your KYC details: UK anti-money-laundering rules require
      us to verify who you are before your proforma invoice is issued.
    </Text>
    <Text style={textStyle}>
      {prefilled
        ? "We've kept what you already sent us, so you only need to answer the new questions and add the documents we're missing."
        : "It takes about ten minutes on your phone. Have your passport (or your company certificate) and a recent utility bill or bank statement ready — photos are fine."}
    </Text>
    <Section style={{ margin: "28px 0" }}>
      <Link href={link} style={buttonStyle}>
        Complete your KYC details
      </Link>
    </Section>
    <Text style={smallStyle}>
      This link is personal to you and works for {validDays} days. Please don't
      forward it. If the button doesn't work, copy this address into your
      browser: <Link href={link}>{link}</Link>
    </Text>
  </EmailLayout>
);

export default KycRequestEmail;

const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#52525b",
  marginBottom: "16px",
};

const smallStyle = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#71717a",
};

const buttonStyle = {
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "999px",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};

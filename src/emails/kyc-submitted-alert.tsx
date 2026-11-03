import { Link, Text } from "@react-email/components";
import EmailLayout from "./layout";

// Internal alert that a customer has sent their KYC details. Deliberately
// thin: the name and our reference only. The ID, address and payment details
// stay behind the admin sign-in rather than travelling through inboxes.

export interface KycSubmittedAlertProps {
  reference: string;
  fullName: string;
  id: string;
}

export const KycSubmittedAlertEmail = (props: KycSubmittedAlertProps) => {
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/kyc/${props.id}`;
  return (
    <EmailLayout
      preview={`${props.fullName} sent their KYC details — ${props.reference}`}
      heading="New KYC Submission"
    >
      <Text style={textStyle}>
        {props.fullName} has sent their KYC details ({props.reference}). Link it
        to their lead and assign it from the record.
      </Text>
      <Text style={textStyle}>
        Review the ID and download the record from the admin panel:{" "}
        <Link href={adminUrl}>{adminUrl}</Link>
      </Text>
    </EmailLayout>
  );
};

export default KycSubmittedAlertEmail;

const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#52525b",
  marginBottom: "16px",
};

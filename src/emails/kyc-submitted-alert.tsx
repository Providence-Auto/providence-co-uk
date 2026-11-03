import { Link, Text } from "@react-email/components";
import EmailLayout from "./layout";

// Internal alert that a customer has sent their KYC details. Deliberately
// thin: the name and our reference only. The ID, address and payment details
// stay behind the admin sign-in rather than travelling through inboxes.

export interface KycSubmittedAlertProps {
  reference: string;
  fullName: string;
  id: string;
  assignedToName: string | null;
}

export const KycSubmittedAlertEmail = (props: KycSubmittedAlertProps) => {
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/kyc/${props.id}`;
  return (
    <EmailLayout
      preview={`${props.fullName} sent their KYC details — ${props.reference}`}
      heading="New KYC Submission"
    >
      <Text style={textStyle}>
        {props.fullName} has sent their KYC details ({props.reference})
        {props.assignedToName
          ? `. It is assigned to ${props.assignedToName}.`
          : ". It came in without a rep link, so it is not assigned to anyone."}
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

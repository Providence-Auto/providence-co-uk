// Renders the two dealer-inquiry emails and checks the parts that break
// silently: who the WhatsApp buttons dial, the reference, and the warning for a
// market we have not listed yet.

import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { GENERAL_WHATSAPP_NUMBER, whatsappDigits } from "@/config/contact";
import DealerInquiryAlertEmail from "@/emails/dealer-inquiry-alert";
import DealerInquiryConfirmationEmail from "@/emails/dealer-inquiry-confirmation";

const CAR = {
  make: "Toyota",
  model: "Aqua",
  condition: "Used",
  yearRange: "2016 – 2019",
  mileage: "Up to 80,000 mi",
  exteriorColor: "Pearl white",
  interiorColor: null,
  specs: "Hybrid, grade 4.5",
  budgetAmount: 1_500_000,
  budgetCurrency: "KES",
  importTimeline: "1–3 months",
};

const ALERT = {
  reference: "DI-E1F89DF4",
  country: "Kenya",
  unlistedMarket: false,
  dealershipName: "Nairobi Motor Traders",
  website: "https://nairobimotortraders.co.ke",
  socialMedia: null,
  contactName: "Wanjiru Kamau",
  designation: "Purchasing Manager",
  email: "wanjiru@example.co.ke",
  whatsapp: "+254712345678",
  sourceMarket: "Japan",
  cars: [CAR],
  notes: "Monthly volume of ten",
  assignedToName: "Abdallah",
};

describe("DealerInquiryAlertEmail", () => {
  it("carries the dealer's details, each car and a WhatsApp link to them", async () => {
    const html = await render(DealerInquiryAlertEmail(ALERT));
    expect(html).toContain("Nairobi Motor Traders");
    expect(html).toContain("DI-E1F89DF4");
    expect(html).toContain("https://wa.me/254712345678");
    expect(html).toContain("Toyota");
    expect(html).toContain("Aqua");
    expect(html).toContain("KES 1,500,000");
    expect(html).toContain("/admin/dealer-inquiries");
    expect(html).not.toContain("not on our destination list");
  });

  it("warns the consultant when the market is not on our list", async () => {
    const html = await render(
      DealerInquiryAlertEmail({
        ...ALERT,
        country: "Namibia",
        unlistedMarket: true,
      }),
    );
    expect(html).toContain("not on our destination list yet");
  });
});

describe("DealerInquiryConfirmationEmail", () => {
  const BASE = {
    contactName: "Wanjiru Kamau",
    dealershipName: "Nairobi Motor Traders",
    reference: "DI-E1F89DF4",
    country: "Kenya",
    sourceMarket: "Japan",
    cars: [CAR],
  };

  it("comes from the consultant and dials their WhatsApp", async () => {
    const html = await render(
      DealerInquiryConfirmationEmail({
        ...BASE,
        agent: {
          name: "Abdallah K",
          email: "abdallah@providenceauto.uk.com",
          image: "https://cdn.example.com/abdallah.jpg",
          whatsappNumber: "+44 7700 900123",
        },
      }),
    );
    expect(html).toContain("Your request is in, Wanjiru");
    expect(html).toContain("DI-E1F89DF4");
    expect(html).toContain("Abdallah K");
    expect(html).toContain("https://wa.me/447700900123");
    expect(html).toContain("Message Abdallah on WhatsApp");
    // It invites a reply, so the footer must not say "do not reply".
    expect(html).toContain("Replies to this email go to Abdallah K.");
    expect(html).not.toContain("Please do not reply directly");
  });

  it("falls back to the general WhatsApp line with no consultant", async () => {
    const html = await render(
      DealerInquiryConfirmationEmail({ ...BASE, agent: null }),
    );
    expect(html).toContain(
      `https://wa.me/${whatsappDigits(GENERAL_WHATSAPP_NUMBER)}`,
    );
    expect(html).toContain("Message us on WhatsApp");
  });

  it("makes no claim the page does not make", async () => {
    const html = (
      await render(DealerInquiryConfirmationEmail({ ...BASE, agent: null }))
    ).toLowerCase();
    for (const banned of [
      "handle everything",
      "door-to-door",
      "hassle-free",
      "within 24 hours",
    ]) {
      expect(html).not.toContain(banned);
    }
  });
});

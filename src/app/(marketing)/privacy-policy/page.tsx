import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { OFFICE_COUNTRIES_SENTENCE } from "@/config/countries";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/privacy-policy";
const URL = `${SITE}${PATH}`;
const TITLE = "Privacy Policy | Providence Auto";
const DESCRIPTION =
  "How Providence Auto collects, uses and shares your personal data, how long we keep it and how to use your rights. Contact us with any privacy request.";
const OG_IMAGE = `${SITE}/og/default.jpg`;

// Bump this, and the "Last updated" line renders it, whenever the policy text
// changes in substance.
const UPDATED_ISO = "2026-11-01";
const UPDATED_LABEL = "1 November 2026";

const PRIVACY_EMAIL = "info@providenceauto.uk.com";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Providence Auto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": URL,
  url: URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "en-GB",
  dateModified: UPDATED_ISO,
  publisher: {
    "@type": "Organization",
    name: "Providence Auto",
    legalName: "Providence Trading Limited",
    url: SITE,
    email: PRIVACY_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "468 Church Lane, Kingsbury",
      addressLocality: "London",
      postalCode: "NW9 8UA",
      addressCountry: "GB",
    },
  },
};

// The lawful basis for each thing we do with an inquiry or account. Kept as
// data so the table and its mobile layout read the same list.
const PURPOSES: { purpose: string; basis: string }[] = [
  {
    purpose:
      "Answering your inquiry, preparing your quote and assigning a consultant to it",
    basis: "Steps you asked us to take before a contract",
  },
  {
    purpose:
      "Running your import: export clearance, shipping, documents and payment",
    basis: "Performing our contract with you",
  },
  {
    purpose: "Keeping business, accounting, tax and customs records",
    basis: "Legal obligation",
  },
  {
    purpose:
      "Contacting you about your inquiry by email, phone or WhatsApp, using the details you gave us",
    basis:
      "Steps you asked us to take before a contract, or our legitimate interest in following up an inquiry you sent",
  },
  {
    purpose:
      "Keeping your account signed in and secure, and stopping spam and abuse of our forms",
    basis: "Our legitimate interest in running a secure website",
  },
  {
    purpose:
      "Measuring which pages and adverts bring inquiries, and telling Google and Meta which adverts led to one",
    basis:
      "Our legitimate interest in knowing which advertising works. You can object at any time",
  },
];

const RIGHTS: { name: string; detail: string }[] = [
  {
    name: "Access",
    detail: "ask for a copy of the personal data we hold about you.",
  },
  {
    name: "Correction",
    detail: "ask us to fix anything that is wrong or incomplete.",
  },
  {
    name: "Erasure",
    detail:
      "ask us to delete your data where we no longer have a reason to keep it.",
  },
  {
    name: "Restriction",
    detail: "ask us to pause using your data while a question is resolved.",
  },
  {
    name: "Objection",
    detail:
      "object to anything we do on the basis of legitimate interests, including advertising measurement.",
  },
  {
    name: "Portability",
    detail:
      "ask for the data you gave us in a machine-readable format, or for us to send it to someone else.",
  },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-zinc-200 pt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-base font-light leading-relaxed text-zinc-700">
        {children}
      </div>
    </section>
  );
}

function Bullets({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-zinc-400">
      {children}
    </ul>
  );
}

const linkClass =
  "text-black underline decoration-zinc-300 underline-offset-4 hover:decoration-black";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MinimalHeader />

      <article className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 sm:pt-40">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm font-light text-zinc-500">
          Last updated <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
        </p>

        <p className="mt-8 text-lg font-light leading-relaxed text-zinc-700">
          Providence Trading Limited, trading as Providence Auto, collects the
          details you give us when you send an inquiry, open an account or
          import a car, and uses them to answer you and run your import. This
          page says what we collect, who receives it and how long we keep it.
        </p>

        <div className="mt-14 space-y-14">
          <Section id="who-we-are" title="Who we are">
            <p>
              Providence Auto is the trading name of Providence Trading Limited,
              whose registered head office is at 468 Church Lane, Kingsbury,
              London NW9 8UA, United Kingdom. We are the controller of the
              personal data described on this page.
            </p>
            <p>
              For any privacy question or request, email{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass}>
                {PRIVACY_EMAIL}
              </a>
              , call{" "}
              <a href="tel:+442080043000" className={linkClass}>
                +44 208 004 3000
              </a>{" "}
              or write to us at the address above.
            </p>
          </Section>

          <Section id="what-we-collect" title="The personal data we collect">
            <p>
              <strong className="font-medium text-black">
                When you send a car inquiry
              </strong>{" "}
              — from a car page, a campaign page or the request form: your name,
              email address, phone number and dialling code, the country you are
              importing to, the car you want (make, model, grade, year, mileage,
              colour, steering side, budget and timing), anything you write
              about the specification, and when and how you would like us to
              contact you.
            </p>
            <p>
              <strong className="font-medium text-black">
                When you send a dealer inquiry
              </strong>{" "}
              — your name, job title, WhatsApp number, email address and
              country, your dealership&apos;s name, website and social media if
              you give them, the market you want to import from, the cars you
              list and any notes.
            </p>
            <p>
              <strong className="font-medium text-black">
                When you open an account
              </strong>{" "}
              — your name, email address and password (stored only in hashed
              form), and a WhatsApp number if you add one. If you sign in with
              Google, Facebook or Discord, we receive the name, email address
              and profile picture that service shares with us. While you are
              signed in we record your IP address and browser type against the
              session, to keep it secure.
            </p>
            <p>
              <strong className="font-medium text-black">
                While your import is under way
              </strong>{" "}
              — shipping details (vessel, container and ports), the documents
              your import needs, payment records and our team&apos;s notes of
              our conversations with you.
            </p>
            <p>
              <strong className="font-medium text-black">
                How you reached us
              </strong>{" "}
              — depending on the form, an inquiry stores the page you first
              landed on and the page you sent it from, the site that referred
              you, any campaign tags in the link, the advert click identifiers
              Google and Meta add to a link (and Meta&apos;s cookie values
              described below), and the code from a consultant&apos;s referral
              link if you used one.
            </p>
            <p>
              <strong className="font-medium text-black">
                How you use the website
              </strong>{" "}
              — Google Tag Manager loads Google Analytics, Google Ads and the
              Meta pixel, which record the pages you visit and the forms you
              send, along with technical details such as your browser and
              device.
            </p>
          </Section>

          <Section id="how-we-use-it" title="How we use it, and why we may">
            <p>
              UK data protection law requires a lawful basis for each use of
              your data. These are ours:
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="hidden bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:table-header-group">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      What we do
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Lawful basis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {PURPOSES.map((row) => (
                    <tr key={row.purpose} className="block sm:table-row">
                      <td className="block px-4 pt-3 font-normal text-black sm:table-cell sm:py-3 sm:align-top">
                        {row.purpose}
                      </td>
                      <td className="block px-4 pt-1 pb-3 text-zinc-600 sm:table-cell sm:py-3 sm:align-top">
                        {row.basis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section
            id="advertising"
            title="What we share with Google and Meta about your inquiry"
          >
            <p>
              When you send an inquiry we tell Meta that it happened, and as it
              progresses — to a qualified lead, an order or, for a dealer, an
              opened account — we may tell Meta and Google Ads again. With each
              notice we send your email address and phone number in hashed form
              (SHA-256), together with the advert click identifier from your
              visit. Hashing turns them into a code that Google and Meta match
              against their own users to tell us which advert worked; they do
              not receive the readable address or number from us.
            </p>
            <p>
              You can object to this by emailing{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass}>
                {PRIVACY_EMAIL}
              </a>
              . You can also limit ad tracking in your{" "}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google ad settings
              </a>{" "}
              and{" "}
              <a
                href="https://www.facebook.com/adpreferences"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Meta ad preferences
              </a>
              .
            </p>
          </Section>

          <Section id="cookies" title="Cookies and browser storage">
            <Bullets>
              <li>
                <strong className="font-medium text-black">
                  Sign-in cookie
                </strong>{" "}
                — set by us to keep you signed in to your account. It ends when
                you sign out or the session expires.
              </li>
              <li>
                <strong className="font-medium text-black">
                  Meta cookies (_fbp and _fbc)
                </strong>{" "}
                — set by the Meta pixel to connect your visit to a Meta advert.
                Our forms read them so the inquiry can be matched to that
                advert.
              </li>
              <li>
                <strong className="font-medium text-black">
                  Google cookies
                </strong>{" "}
                — set by Google Analytics and Google Ads to count visits and
                connect your visit to a Google advert.
              </li>
              <li>
                <strong className="font-medium text-black">
                  Browser storage
                </strong>{" "}
                — we keep a consultant&apos;s referral code for seven days so an
                inquiry you send later still reaches them, and small preferences
                such as the market you last chose in a guide. These never leave
                your browser except as part of an inquiry you send.
              </li>
            </Bullets>
            <p>
              You can block or delete cookies in your browser settings. The site
              works without the Google and Meta cookies; without the sign-in
              cookie you cannot stay signed in.
            </p>
          </Section>

          <Section id="who-receives-it" title="Who receives your data">
            <Bullets>
              <li>
                <strong className="font-medium text-black">
                  Our own teams
                </strong>{" "}
                in the countries we work in — the consultant handling your
                inquiry and the colleagues working on your import.
              </li>
              <li>
                <strong className="font-medium text-black">
                  Service providers acting for us
                </strong>
                : Railway (website hosting and database), Cloudflare (website
                delivery and file storage), Resend (email delivery), Google (Tag
                Manager, Analytics, Google Ads and Google sign-in), Meta (the
                Meta pixel, conversion reporting, Facebook sign-in and WhatsApp,
                if you message us there) and Discord (sign-in, only if you
                choose it).
              </li>
              <li>
                <strong className="font-medium text-black">
                  Those your import needs
                </strong>
                : export and inspection authorities in the country your car
                leaves from, and the shipping line and agents that carry it.
              </li>
              <li>
                <strong className="font-medium text-black">Authorities</strong>{" "}
                where the law requires us to share it.
              </li>
            </Bullets>
          </Section>

          <Section id="transfers" title="When your data leaves the UK">
            <p>
              Our teams work in {OFFICE_COUNTRIES_SENTENCE}, and several of the
              providers above are based in the United States, so your data may
              be accessed or stored outside the UK. When it is, we rely on UK
              adequacy regulations or on the safeguards UK data protection law
              provides for international transfers.
            </p>
          </Section>

          <Section id="retention" title="How long we keep it">
            <Bullets>
              <li>
                <strong className="font-medium text-black">
                  Inquiries that do not go ahead
                </strong>{" "}
                — for as long as we have a business reason to, such as answering
                a follow-up about the same car.
              </li>
              <li>
                <strong className="font-medium text-black">
                  Imports, orders and payments
                </strong>{" "}
                — for as long as tax, accounting and customs law requires, which
                in the UK is at least six years.
              </li>
              <li>
                <strong className="font-medium text-black">Accounts</strong> —
                until you ask us to close yours.
              </li>
            </Bullets>
          </Section>

          <Section id="your-rights" title="Your rights over your data">
            <p>Under UK data protection law you have the right to:</p>
            <Bullets>
              {RIGHTS.map((right) => (
                <li key={right.name}>
                  <strong className="font-medium text-black">
                    {right.name}
                  </strong>{" "}
                  — {right.detail}
                </li>
              ))}
            </Bullets>
            <p>
              To use any of them, email{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass}>
                {PRIVACY_EMAIL}
              </a>
              . We reply within one month. If you are unhappy with how we have
              handled your data, you can complain to the Information
              Commissioner&apos;s Office at{" "}
              <a
                href="https://ico.org.uk/make-a-complaint/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                ico.org.uk
              </a>{" "}
              or on 0303 123 1113.
            </p>
          </Section>

          <Section id="security" title="How we protect it">
            <p>
              The website is served only over encrypted connections, passwords
              are stored hashed, and inquiries are visible only to staff signed
              in to our admin system.
            </p>
          </Section>

          <Section id="changes" title="Changes to this policy">
            <p>
              When we change this policy we update this page and the date at the
              top. For anything else, see our{" "}
              <Link href="/about-us" className={linkClass}>
                about page
              </Link>{" "}
              or email us.
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import MinimalHeader from "@/components/MinimalHeader";
import {
  CONTACT_EMAIL,
  GENERAL_WHATSAPP_LINK,
  GENERAL_WHATSAPP_NUMBER,
  HEAD_OFFICE_PHONE,
} from "@/config/contact";
import { OFFICE_COUNTRIES_SENTENCE } from "@/config/countries";
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

// The contact page (seo-page-rules.md P-21), built 2026-11-03 because brand
// searches ask for one and /contact used to 404. Every channel comes from
// src/config/contact.ts; London is the one visitable office
// (business-context.md §3, §4.4). No opening hours are published, so none are
// stated here.

const PATH = "/contact";
const TITLE = "Contact Providence Auto | London Head Office";
const DESCRIPTION =
  "Contact Providence Auto: call our London head office, email or message us on WhatsApp. Our own teams in seven countries answer import questions.";

const ADDRESS = {
  street: "468 Church Lane",
  locality: "Kingsbury, London",
  postcode: "NW9 8UA",
  country: "United Kingdom",
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  url: `${SITE_URL}${PATH}`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Providence Auto",
    legalName: "Providence Trading Limited",
    url: SITE_URL,
    telephone: HEAD_OFFICE_PHONE,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.locality,
      postalCode: ADDRESS.postcode,
      addressCountry: "GB",
    },
  },
};

const CHANNELS = [
  {
    label: "Phone",
    value: HEAD_OFFICE_PHONE,
    href: `tel:${HEAD_OFFICE_PHONE.replace(/\s/g, "")}`,
  },
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  {
    label: "WhatsApp",
    value: GENERAL_WHATSAPP_NUMBER,
    href: GENERAL_WHATSAPP_LINK,
  },
  {
    label: "Head office",
    value: `${ADDRESS.street}, ${ADDRESS.locality} ${ADDRESS.postcode}, ${ADDRESS.country}`,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <JsonLd
        data={[
          contactPageJsonLd,
          breadcrumbJsonLd([{ name: "Contact", path: PATH }]),
        ]}
      />
      <MinimalHeader />

      <article className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 sm:pt-40">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact Providence Auto
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-600">
          You can reach Providence Auto by phone, email or WhatsApp. Our head
          office is in London, the one office you can visit by arrangement, and
          our own teams in {OFFICE_COUNTRIES_SENTENCE} answer questions about
          importing a car from their country.
        </p>

        <table className="mt-10 w-full text-left text-base">
          <caption className="sr-only">How to contact Providence Auto</caption>
          <tbody className="divide-y divide-black/5 border-y border-black/5">
            {CHANNELS.map((channel) => (
              <tr key={channel.label}>
                <th
                  scope="row"
                  className="py-4 pr-6 align-top font-semibold text-zinc-900"
                >
                  {channel.label}
                </th>
                <td className="py-4 text-zinc-600">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="text-black underline decoration-zinc-300 underline-offset-4 hover:decoration-black"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    channel.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          You can ask for a landed quote from the page for your car or country.
        </h2>
        <ul className="mt-5 space-y-3 text-base text-zinc-600">
          <li>
            Importing one car for yourself:{" "}
            <Link
              href="/import-cars-from"
              className="text-black underline decoration-zinc-300 underline-offset-4 hover:decoration-black"
            >
              import cars from Japan, the UK and five more countries
            </Link>
            .
          </li>
          <li>
            Importing stock for a dealership or your own clients:{" "}
            <Link
              href="/b2b-inquiry"
              className="text-black underline decoration-zinc-300 underline-offset-4 hover:decoration-black"
            >
              send a dealer sourcing inquiry
            </Link>
            .
          </li>
          <li>
            Speaking to one person by name:{" "}
            <Link
              href="/team"
              className="text-black underline decoration-zinc-300 underline-offset-4 hover:decoration-black"
            >
              meet our sales team
            </Link>
            .
          </li>
        </ul>
      </article>
    </main>
  );
}

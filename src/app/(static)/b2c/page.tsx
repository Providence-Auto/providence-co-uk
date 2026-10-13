import type { Metadata } from "next";
import ToolDemos from "@/components/tool-demos/ToolDemos";
import B2CClient from "./B2CClient";

// The page body is a client component (framer-motion hero), and a client
// component cannot export metadata — which is why /b2c shipped with no
// canonical. It is a thin server wrapper rather than a layout.tsx on purpose:
// /b2c has children (/b2c/gallery and every car page under it), and metadata
// set in a layout is INHERITED by children that do not set their own. A
// `canonical: "/b2c"` in a layout here would quietly canonicalise every car
// page to /b2c and de-index the entire gallery. A page-level export cannot
// leak downward, so this is the safe shape for any route that has children.
const PATH = "/b2c";
const TITLE = "Import Your Dream Car from Any Market";
const DESCRIPTION =
  "Import your dream car anywhere in the world, direct from the markets the trade imports from. Our teams in seven countries export it to your port.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: `https://www.providenceauto.co.uk${PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  // The tracking demo is left out: the process rail above it already draws
  // the voyage on this page.
  return (
    <B2CClient
      tools={<ToolDemos cards={["inspection", "landed", "documents"]} />}
    />
  );
}

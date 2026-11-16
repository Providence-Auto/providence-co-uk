import { notFound } from "next/navigation";

// Every campaign that existed has its own landing page, and next.config.ts
// 308s each of the three slugs to it. This route used to be a client page that
// rendered the LHD campaign for any slug at all — /campaigns/anything answered
// 200 with a copy of /japanese-luxury-cars-lhd under the root title and no
// canonical (seo-page-rules.md T-13). Anything that reaches it now is a 404.
export default function CampaignPage() {
  notFound();
}

import { ImageResponse } from "next/og";
import { DEALER_SOURCE_MARKETS } from "@/config/dealer-sourcing";

// Branded 1200×630 share card for /car-sourcing-for-dealers. Type only, no car
// photograph: a dealer page for dozens of markets has no photo whose number
// plate could match them all (car-imagery-checklist.md).
export const alt = "Car Sourcing for Dealers — Providence Auto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 85% 10%, rgba(14,165,233,0.35), transparent 45%), radial-gradient(circle at 10% 100%, rgba(139,92,246,0.30), transparent 50%)",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", color: "#ffffff" }}>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Providence</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#0ea5e9" }}>
          &nbsp;Auto
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          Car Sourcing for Dealers
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            fontWeight: 600,
            color: "#a1a1aa",
          }}
        >
          {DEALER_SOURCE_MARKETS.map((m) => m.name).join(" · ")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontWeight: 600,
          color: "#e4e4e7",
        }}
      >
        Check your market, then request up to five cars.
      </div>
    </div>,
    { ...size },
  );
}

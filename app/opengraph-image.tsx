import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "BuyEOD — Businesses owned by EOD techs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const badgePath = path.join(process.cwd(), "public", "master-badge.png");
  const badgeDataUrl = `data:image/png;base64,${fs
    .readFileSync(badgePath)
    .toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 88px",
          backgroundColor: "#fffaf6",
          backgroundImage:
            "radial-gradient(900px 520px at 8% -10%, rgba(208,74,23,0.32), transparent 55%), radial-gradient(800px 460px at 105% 5%, rgba(212,146,15,0.22), transparent 60%)",
          color: "#1d1d1f",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(208,74,23,0.25)",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#d04a17",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#d04a17",
              }}
            />
            Explosive Ordnance Disposal
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.0,
            marginTop: 32,
          }}
        >
          Businesses owned by EOD techs.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 32,
            color: "#3a3a3d",
            marginTop: 28,
            lineHeight: 1.35,
          }}
        >
          <span style={{ fontWeight: 600, color: "#1d1d1f" }}>
            Support one of our own.
          </span>
          <span>The community is open for business.</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeDataUrl} width={104} height={80} alt="" />
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: -1,
                color: "#1d1d1f",
              }}
            >
              BuyEOD
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#6e6e73",
            }}
          >
            buyeod.co
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

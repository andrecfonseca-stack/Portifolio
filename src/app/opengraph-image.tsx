import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ecebe7",
          color: "#242426",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6d6d6b",
            fontFamily: "sans-serif",
          }}
        >
          <span>{siteConfig.docLabel}</span>
          <span>{siteConfig.year}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 108, lineHeight: 0.94 }}>
            {profile.coverWord}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#A93F21",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            {`${profile.name} — ${profile.rolePill}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #cac9c6",
            paddingTop: 22,
            fontSize: 22,
            color: "#6d6d6b",
            fontFamily: "sans-serif",
          }}
        >
          <span>{profile.location}</span>
          <span style={{ color: "#A93F21", fontWeight: 600 }}>
            Ciência · Clínica · Engenharia
          </span>
        </div>
      </div>
    ),
    size,
  );
}

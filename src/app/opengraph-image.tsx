import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background:
            "linear-gradient(135deg, #5047EB, #B45AED 50%, #ED5AB0)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 108,
                height: 108,
                borderRadius: 28,
                background: "rgba(255,255,255,0.2)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 56,
                  height: 48,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 13,
                    top: 0,
                    width: 30,
                    height: 11,
                    border: "7px solid #ffffff",
                    borderRadius: 9,
                    borderBottom: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    width: 56,
                    height: 38,
                    background: "#ffffff",
                    borderRadius: 9,
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: 84, fontWeight: 800, color: "#ffffff" }}>
              {SITE_NAME}
            </div>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

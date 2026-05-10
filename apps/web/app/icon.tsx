import { ImageResponse } from "next/og";

// Browser tab favicon — kept in sync with the header brand mark
// (gradient navy → orange + GraduationCap glyph from lucide).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          // --brand (#1b263b) → --cta (#f57a00); mirrors design tokens in globals.css.
          background:
            "linear-gradient(135deg, #1b263b 0%, #314768 55%, #f57a00 100%)",
        }}
      >
        {/* Lucide GraduationCap, 24x24 viewBox, scaled to ~20px */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}

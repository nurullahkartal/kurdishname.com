import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface AdSlotProps {
  /** Google AdSense Slot ID (e.g., "1234567890") */
  slot: string;
  /** Google AdSense Publisher ID (e.g., "ca-pub-XXXXXXXXXXXXXXXX"). Overrides default. */
  client?: string;
  /** Ad format type: 'auto', 'fluid', 'rectangle', 'horizontal', 'vertical' */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  /** Full width responsive sizing */
  responsive?: "true" | "false";
  /** Custom class name for wrapping div */
  className?: string;
  /** Optional inline CSS style override */
  style?: React.CSSProperties;
}

// Default publisher client (can be changed to user's AdSense ID)
const DEFAULT_CLIENT_ID = "ca-pub-6367485410843937";

const sponsoredLabels: Record<string, string> = {
  tr: "Sponsorlu Bağlantı",
  en: "Sponsored Link",
  de: "Gesponserter Link",
  ar: "رابط ممول"
};

export default function AdSlot({
  slot,
  client = DEFAULT_CLIENT_ID,
  format = "auto",
  responsive = "true",
  className = "",
  style = {},
}: AdSlotProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "tr";
  const label = sponsoredLabels[lang] || sponsoredLabels.en;

  // Dynamically reserve space based on the ad format to prevent layout shifts (CLS)
  let minHeight = "120px";
  if (format === "vertical") {
    minHeight = "250px";
  } else if (format === "rectangle") {
    minHeight = "250px";
  }

  const initialized = useRef(false);

  useEffect(() => {
    // Only execute on browser client side and if AdSense is loaded
    if (typeof window === "undefined") return;

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Skip actual ad initialization on localhost to prevent AdSense account ban
    if (isLocalhost) return;

    try {
      if (!initialized.current) {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      }
    } catch (e) {
      console.warn("AdSense script execution skipped or blocked:", e);
    }
  }, [slot]);

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const finalMinHeight = style.minHeight || minHeight;

  if (client === "FIX_ME_REAL_ADSENSE_ID") {
    return isLocalhost ? (
      <div
        className={`adsense-holder ${className}`}
        style={{
          minHeight: finalMinHeight,
          margin: "1.5rem auto",
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          position: "relative",
          borderRadius: "var(--r-md)",
          backgroundColor: "var(--surface-alt)",
          border: "1px dashed var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-faint)",
          fontSize: "0.8rem",
          fontWeight: 600,
          ...style,
        }}
      >
        Ad Space (Disabled: ID Missing)
      </div>
    ) : null;
  }

  return (
    <div
      className={`adsense-holder ${className}`}
      style={{
        minHeight: finalMinHeight,
        margin: "1.5rem auto",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "relative",
        borderRadius: "var(--r-md)",
        backgroundColor: "var(--surface-alt)",
        border: "1px solid var(--border-dim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {!isLocalhost && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight: finalMinHeight, zIndex: 1, position: "relative" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      )}
      {/* Background Skeleton Placeholder (Visible until ad finishes loading and overlays it) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          color: "var(--text-faint)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <span style={{ fontSize: "1rem", opacity: 0.35 }}>✨</span>
        <span style={{ opacity: 0.35 }}>{label}</span>
      </div>
    </div>
  );
}


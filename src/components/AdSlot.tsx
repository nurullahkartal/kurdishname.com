import { useEffect, useRef } from "react";

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
}

// Default publisher client (can be changed to user's AdSense ID)
const DEFAULT_CLIENT_ID = "ca-pub-6367485410843937";

export default function AdSlot({
  slot,
  client = DEFAULT_CLIENT_ID,
  format = "auto",
  responsive = "true",
  className = "",
}: AdSlotProps) {
  // Dynamically reserve space based on the ad format to prevent layout shifts (CLS)
  let minHeight = "90px";
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

  if (client === "FIX_ME_REAL_ADSENSE_ID") {
    return isLocalhost ? (
      <div
        className={`adsense-holder ${className}`}
        style={{
          minHeight,
          margin: "1.5rem auto",
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          position: "relative",
          borderRadius: "var(--r-md)",
          backgroundColor: "var(--surface-2)",
          border: "1px dashed var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
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
        minHeight,
        margin: "1.5rem auto",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "relative",
        borderRadius: "var(--r-md)",
        backgroundColor: isLocalhost ? "var(--surface-2)" : "transparent",
        border: isLocalhost ? "1px dashed var(--border)" : "none",
      }}
    >
      {!isLocalhost && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      )}
    </div>
  );
}

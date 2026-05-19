import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return "light";
      } catch (e) {
        // Fallback for sandboxed environments or crawlers with restricted storage
        return "light";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // Safe fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        color: "var(--text-muted)",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
      className="hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
      aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
      title={theme === "light" ? "Koyu Tema" : "Açık Tema"}
    >
      {theme === "light" ? (
        <Moon size={18} strokeWidth={2.5} />
      ) : (
        <Sun size={18} strokeWidth={2.5} />
      )}
    </button>
  );
}

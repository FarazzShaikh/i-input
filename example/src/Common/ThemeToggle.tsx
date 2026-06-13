import { useTheme } from "./theme";

export function ThemeToggle() {
  const { mode, palette, toggle } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: 999,
        border: `1px solid ${palette.sectionBorder}`,
        background: palette.sectionBg,
        color: palette.text,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
      {isDark ? "Dark" : "Light"}
    </button>
  );
}

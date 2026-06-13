import type { ReactNode } from "react";
import { useTheme } from "./theme";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const { palette } = useTheme();
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        <span
          style={{
            flex: "0 0 90px",
            width: 90,
            textAlign: "right",
            color: palette.label,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            flex: "0 0 180px",
            width: 180,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {children}
        </span>
      </span>
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          minHeight: 15,
        }}
      >
        <span style={{ flex: "0 0 90px", width: 90 }} />
        <span
          style={{
            flex: "0 0 180px",
            width: 180,
            textAlign: "left",
            color: palette.muted,
            fontStyle: "italic",
          }}
        >
          {hint}
        </span>
      </span>
    </label>
  );
}

import type { ReactNode } from "react";

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        gridColumn: "1 / -1",
        margin: "12px 0 2px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: "#4a7fb8",
      }}
    >
      {children}
    </h3>
  );
}

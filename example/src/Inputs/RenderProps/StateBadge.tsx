import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function StateBadge({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(20);
  return (
    <Field label="Live state" hint="render-prop reads state">
      <ThemedInput value={value} onChange={setValue} tabIndex={tabIndex}>
        {(state) => {
          const label = state.editing
            ? "edit"
            : state.dragging
              ? "drag"
              : state.hovering
                ? "hover"
                : null;
          if (!label) return null;
          return (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -6,
                padding: "1px 6px",
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                background: "#4a7fb8",
                color: "#fff",
                pointerEvents: "none",
              }}
            >
              {label}
            </span>
          );
        }}
      </ThemedInput>
    </Field>
  );
}

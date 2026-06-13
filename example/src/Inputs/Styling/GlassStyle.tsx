import { IInput } from "i-input";
import { useState } from "react";
import { Field } from "../../Common";

export function GlassStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(72);
  return (
    <Field label="Glass" hint="frosted blur">
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          padding: 6,
          borderRadius: 14,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 15% 20%, #f472b6 0, transparent 45%)," +
            "radial-gradient(circle at 85% 30%, #38bdf8 0, transparent 45%)," +
            "radial-gradient(circle at 50% 90%, #facc15 0, transparent 50%)," +
            "linear-gradient(135deg, #6d28d9, #2563eb)",
        }}
      >
        <IInput
          value={value}
          onChange={setValue}
          tabIndex={tabIndex}
          styles={{
            root: {
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              borderRadius: 10,
              color: "#ffffff",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
            },
            input: { color: "#ffffff", fontWeight: 600 },
          }}
        />
      </span>
    </Field>
  );
}

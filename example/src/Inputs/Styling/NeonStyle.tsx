import { UniversalInput } from "i-input";
import { useState } from "react";
import { Field } from "../../Common";

export function NeonStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(99);
  return (
    <Field label="Neon" hint="glowing outline">
      <UniversalInput
        value={value}
        onChange={setValue}
        tabIndex={tabIndex}
        styles={{
          root: {
            background: "#0d0221",
            border: "1px solid #ff2bd1",
            borderRadius: 6,
            color: "#ff2bd1",
            boxShadow:
              "0 0 6px #ff2bd1, 0 0 16px rgba(255, 43, 209, 0.6), inset 0 0 8px rgba(255, 43, 209, 0.35)",
          },
          input: { color: "#ff2bd1", fontWeight: 700 },
        }}
      />
    </Field>
  );
}

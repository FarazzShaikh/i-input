import { IInput } from "i-input";
import { useState } from "react";
import { Field } from "../../Common";

export function PillStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(42);
  return (
    <Field label="Pill" hint="rounded gradient">
      <IInput
        value={value}
        onChange={setValue}
        tabIndex={tabIndex}
        styles={{
          root: {
            background: "linear-gradient(135deg, #6d28d9, #db2777)",
            border: "none",
            borderRadius: 999,
            color: "#fff",
            boxShadow: "0 4px 14px rgba(219, 39, 119, 0.45)",
          },
          input: { color: "#fff", fontWeight: 600 },
        }}
      />
    </Field>
  );
}

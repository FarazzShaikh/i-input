import { UniversalInput } from "i-input";
import { useState } from "react";
import { Field } from "../../Common";

export function TerminalStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1337);
  return (
    <Field label="Terminal" hint="monospace green">
      <UniversalInput
        value={value}
        onChange={setValue}
        tabIndex={tabIndex}
        styles={{
          root: {
            background: "#0b0f0b",
            border: "1px solid #1f3d1f",
            borderRadius: 2,
            color: "#39ff14",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            letterSpacing: 1,
            boxShadow: "inset 0 0 12px rgba(57, 255, 20, 0.15)",
          },
          input: {
            color: "#39ff14",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            letterSpacing: 1,
          },
        }}
      />
    </Field>
  );
}

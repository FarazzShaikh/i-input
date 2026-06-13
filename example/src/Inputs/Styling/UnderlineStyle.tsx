import { IInput } from "i-input";
import { useState } from "react";
import { Field } from "../../Common";

export function UnderlineStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(3.5);
  return (
    <Field label="Underline" hint="minimal">
      <IInput
        value={value}
        onChange={setValue}
        step={0.5}
        precision={1}
        tabIndex={tabIndex}
        styles={{
          root: {
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #f59e0b",
            borderRadius: 0,
            color: "#f59e0b",
            boxShadow: "none",
          },
          input: { color: "#f59e0b", fontWeight: 600 },
        }}
      />
    </Field>
  );
}

import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Precision({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(3.14159);
  return (
    <Field label="Precision = 2" hint="rounds display to 2 decimals">
      <ThemedInput
        value={value}
        onChange={setValue}
        precision={2}
        step={0.01}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

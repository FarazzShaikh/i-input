import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function SoftLimited({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(5);
  return (
    <Field label="Soft 0–10" hint="scrub/step clamp; typing can exceed">
      <ThemedInput
        value={value}
        onChange={setValue}
        softMin={0}
        softMax={10}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

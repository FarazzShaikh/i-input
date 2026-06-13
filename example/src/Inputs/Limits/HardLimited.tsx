import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function HardLimited({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(50);
  return (
    <Field label="Hard 0–100" hint="absolute clamp, even when typing">
      <ThemedInput
        value={value}
        onChange={setValue}
        hardMin={0}
        hardMax={100}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

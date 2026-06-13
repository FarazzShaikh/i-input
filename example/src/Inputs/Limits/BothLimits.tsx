import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function BothLimits({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(5);
  return (
    <Field label="Soft + hard" hint="soft 0–10, hard 0–20">
      <ThemedInput
        value={value}
        onChange={setValue}
        softMin={0}
        softMax={10}
        hardMin={0}
        hardMax={20}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Step({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Step = 5" hint="custom step amount">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={5}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function UnitLabel({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(50);
  return (
    <Field label="Unit label" hint='display-only suffix unit="%"'>
      <ThemedInput
        value={value}
        onChange={setValue}
        unit="%"
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

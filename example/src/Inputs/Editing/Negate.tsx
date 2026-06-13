import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Negate({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(8);
  return (
    <Field label="Negate" hint='press "-" while not editing to flip sign'>
      <ThemedInput
        value={value}
        onChange={setValue}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Expression({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(10);
  return (
    <Field label="Expressions" hint='type math e.g. "3 * 2 + 1"'>
      <ThemedInput
        value={value}
        onChange={setValue}
        precision={2}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

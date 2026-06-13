import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Functions({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1.414);
  return (
    <Field label="Functions" hint='try "sqrt(2)", "pi * 3", "sin(pi/6)"'>
      <ThemedInput
        value={value}
        onChange={setValue}
        precision={4}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

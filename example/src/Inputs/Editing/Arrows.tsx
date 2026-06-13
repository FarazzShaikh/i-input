import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Arrows({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Keys & wheel" hint="focus, then ⬆/⬇ or scroll">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={1}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

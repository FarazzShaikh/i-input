import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Disabled() {
  const [value] = useState(100);
  return (
    <Field label="Disabled" hint="non-interactive">
      <ThemedInput value={value} onChange={() => {}} disabled />
    </Field>
  );
}

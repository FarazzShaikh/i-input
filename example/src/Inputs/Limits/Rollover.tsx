import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Rollover({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Rollover 0–12" hint="wraps past the ends (e.g. clock)">
      <ThemedInput
        value={value}
        onChange={setValue}
        softMin={0}
        softMax={12}
        wrapMode="soft-limit"
        tabIndex={tabIndex}
      />
    </Field>
  );
}

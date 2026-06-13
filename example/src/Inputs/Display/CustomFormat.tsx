import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function CustomFormat({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1234.5);
  return (
    <Field label="Custom format" hint="formatDisplay with thousands separators">
      <ThemedInput
        value={value}
        onChange={setValue}
        precision={2}
        formatDisplay={({ value }) => value.toLocaleString("en-US")}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

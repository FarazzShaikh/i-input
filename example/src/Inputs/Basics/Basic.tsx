import { useState } from "react";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function Basic({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Basic" hint="click to type, ⬆/⬇ or wheel to step">
      <ThemedInput value={value} onChange={setValue} tabIndex={tabIndex}>
        {(state) => <ScrubIndicator state={state} direction="free" />}
      </ThemedInput>
    </Field>
  );
}

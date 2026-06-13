import { useState } from "react";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function FreeScrub({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Free" hint="drag any direction (default)">
      <ThemedInput value={value} onChange={setValue} tabIndex={tabIndex}>
        {(state) => <ScrubIndicator state={state} direction="free" />}
      </ThemedInput>
    </Field>
  );
}

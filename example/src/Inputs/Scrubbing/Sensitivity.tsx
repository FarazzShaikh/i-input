import { useState } from "react";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function Sensitivity({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Sensitivity" hint="scrubSensitivity = 0.25 (slower)">
      <ThemedInput
        value={value}
        onChange={setValue}
        scrubSensitivity={0.25}
        tabIndex={tabIndex}
      >
        {(state) => <ScrubIndicator state={state} direction="free" />}
      </ThemedInput>
    </Field>
  );
}

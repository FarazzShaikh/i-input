import { useState } from "react";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function ScrubX({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Drag X" hint="horizontal only">
      <ThemedInput
        value={value}
        onChange={setValue}
        scrubDirection="x"
        tabIndex={tabIndex}
      >
        {(state) => <ScrubIndicator state={state} direction="x" />}
      </ThemedInput>
    </Field>
  );
}

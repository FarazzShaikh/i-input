import { useState } from "react";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function ScrubY({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Drag Y" hint="vertical only">
      <ThemedInput
        value={value}
        onChange={setValue}
        scrubDirection="y"
        tabIndex={tabIndex}
      >
        {(state) => <ScrubIndicator state={state} direction="y" />}
      </ThemedInput>
    </Field>
  );
}

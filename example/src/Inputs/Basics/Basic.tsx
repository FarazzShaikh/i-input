import { useState } from "react";
import { isMobile } from "react-device-detect";
import { Field, ScrubIndicator, ThemedInput } from "../../Common";

export function Basic({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);

  const hint = isMobile ? "tap to type" : "click to type, ⬆/⬇ or wheel to step";

  return (
    <Field label="Basic" hint={hint}>
      <ThemedInput value={value} onChange={setValue} tabIndex={tabIndex}>
        {(state) => <ScrubIndicator state={state} direction="free" />}
      </ThemedInput>
    </Field>
  );
}

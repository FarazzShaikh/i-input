import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function NoScrub({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Scrub off" hint="scrub={false}: click to edit, no drag">
      <ThemedInput
        value={value}
        onChange={setValue}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

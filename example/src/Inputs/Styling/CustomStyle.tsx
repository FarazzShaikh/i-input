import { useState } from "react";
import { Field, ThemedInput, useTheme } from "../../Common";

export function CustomStyle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(42);
  const { palette } = useTheme();
  return (
    <Field label="Custom style" hint="styles prop overrides the defaults">
      <ThemedInput
        value={value}
        onChange={setValue}
        scrub={false}
        tabIndex={tabIndex}
        classNames={palette.accentInputClassNames}
      />
    </Field>
  );
}

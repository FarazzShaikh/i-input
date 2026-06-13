import { distanceUnits, formatComposite } from "i-input";
import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Composite({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1.8); // meters, shown as ft/in
  return (
    <Field label="Composite" hint="formatDisplay → feet & inches">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={0.01}
        precision={4}
        unit="m"
        unitSystem={distanceUnits}
        formatDisplay={({ value }) =>
          formatComposite(value, distanceUnits, "m", [
            { unit: "'" },
            { unit: '"', precision: 0 },
          ])
        }
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

import { distanceUnits } from "i-input";
import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function CustomUnit({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0.5); // meters, with custom "px" unit
  return (
    <Field label="Custom unit" hint='adds "px" to the distance system'>
      <ThemedInput
        value={value}
        onChange={setValue}
        step={0.01}
        precision={4}
        unit="ft"
        unitSystem={distanceUnits}
        customUnits={[
          // 1 px ≈ 0.0002645833 m (CSS reference pixel, 96dpi)
          { names: ["px", "pixel", "pixels"], toBase: 0.0002645833 },
        ]}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

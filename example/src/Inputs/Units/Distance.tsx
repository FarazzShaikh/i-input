import { distanceUnits } from "i-input";
import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Distance({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1); // meters
  return (
    <Field label="Distance" hint='type "5km", "3ft 2in", "1m + 2cm"'>
      <ThemedInput
        value={value}
        onChange={setValue}
        step={0.1}
        precision={4}
        unit="m"
        unitSystem={distanceUnits}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

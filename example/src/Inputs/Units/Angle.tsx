import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function Angle({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0); // degrees, with radians input
  return (
    <Field label="Angle" hint="rolls over 360° → 0°">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={1}
        unit="°"
        softMin={0}
        softMax={360}
        wrapMode="soft-limit"
        unitSystem={{
          baseNames: ["°", "deg", "degree", "degrees"],
          units: [
            { names: ["rad", "radian", "radians"], toBase: 180 / Math.PI },
          ],
        }}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

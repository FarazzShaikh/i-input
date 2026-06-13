import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

export function SliderFill({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(50);
  return (
    <Field label="Slider fill" hint="normalized value drives a fill bar">
      <ThemedInput
        value={value}
        onChange={setValue}
        hardMin={0}
        hardMax={100}
        unit="%"
        tabIndex={tabIndex}
      >
        {(state) => (
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${state.normalized * 100}%`,
              background: "#4a7fb8",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />
        )}
      </ThemedInput>
    </Field>
  );
}

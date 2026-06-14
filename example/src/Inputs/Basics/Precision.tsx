import { useState } from "react";
import { Field, StepButton, ThemedInput } from "../../Common";

export function Precision({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(3.14159);
  return (
    <Field label="Precision = 2" hint="rounds display to 2 decimals">
      <ThemedInput
        value={value}
        onChange={setValue}
        precision={2}
        step={0.01}
        scrub={false}
        tabIndex={tabIndex}
      >
        {(state, actions) => {
          const { editing, dragging } = state;
          const showArrows = !editing && !dragging;
          if (!showArrows) return null;
          return (
            <>
              <StepButton side="left" onClick={() => actions.stepBy(-1)}>
                ‹
              </StepButton>
              <StepButton side="right" onClick={() => actions.stepBy(1)}>
                ›
              </StepButton>
            </>
          );
        }}
      </ThemedInput>
    </Field>
  );
}

import { useState } from "react";
import { Field, StepButton, ThemedInput } from "../../Common";

export function Step({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(0);
  return (
    <Field label="Step = 5" hint="custom step amount">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={5}
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

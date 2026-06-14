import { useState } from "react";
import { Field, StepButton, ThemedInput } from "../../Common";

export function StepButtons({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(3);
  return (
    <Field label="Step buttons" hint="‹ › arrows to step up/down">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={1}
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

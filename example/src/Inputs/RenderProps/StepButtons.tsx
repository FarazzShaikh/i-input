import { useState } from "react";
import { Field, StepButton, ThemedInput } from "../../Common";

export function StepButtons({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(3);
  return (
    <Field label="Step buttons" hint="‹ › arrows appear on hover">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={1}
        tabIndex={tabIndex}
      >
        {(state, actions) => {
          const { editing, hovering, dragging } = state;
          const showArrows = hovering && !editing && !dragging;
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

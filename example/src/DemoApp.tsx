import { distanceUnits, formatComposite } from "i-input";
import { useState } from "react";
import "./App.css";
import {
  Field,
  StepButton,
  ThemedInput,
  ThemeProvider,
  useTheme,
} from "./Common";

/**
 * A standalone, square demo page intended for screen recordings / social media.
 * Open it with `?demo` in the URL (handled in main.tsx). It shows a compact
 * 2-column grid of the most important input types with a small heading.
 */
export function DemoApp() {
  return (
    <ThemeProvider>
      <DemoStage />
    </ThemeProvider>
  );
}

function DemoStage() {
  const { mode, palette } = useTheme();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: palette.pageBg,
      }}
    >
      <section
        className={mode === "light" ? "app-light" : undefined}
        style={{
          width: "min(480px, 96vw)",
          aspectRatio: "1 / 1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 40,
          boxSizing: "border-box",
          border: `1px solid ${palette.sectionBorder}`,
          borderRadius: 16,
          background: palette.sectionBg,
          color: palette.text,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          fontSize: 13,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 24,
            rowGap: 10,
            justifyItems: "center",
          }}
        >
          <Basic />
          <Stepped />
          <Limited />
          <Expression />
          <Distance />
          <Composite />
        </div>
      </section>
    </div>
  );
}

function Basic() {
  const [v, setV] = useState(42);
  return (
    <Field label="Basic" hint="Basic input">
      <ThemedInput value={v} onChange={setV} scrub={false} />
    </Field>
  );
}

function Stepped() {
  const [v, setV] = useState(1.5);
  return (
    <Field label="Step" hint="step = 0.25">
      <ThemedInput value={v} onChange={setV} step={0.25} precision={2}>
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

function Limited() {
  const [v, setV] = useState(60);
  return (
    <Field label="Percent" hint="clamped 0–100">
      <ThemedInput
        value={v}
        onChange={setV}
        hardMin={0}
        hardMax={100}
        unit="%"
      />
    </Field>
  );
}

function Expression() {
  const [v, setV] = useState(10);
  return (
    <Field label="Math" hint='type "3 * 4 + 2"'>
      <ThemedInput value={v} onChange={setV} precision={2} scrub={false} />
    </Field>
  );
}

function Distance() {
  const [v, setV] = useState(1.8);
  return (
    <Field label="Units" hint='type "5ft 2in"'>
      <ThemedInput
        value={v}
        onChange={setV}
        step={0.1}
        precision={3}
        unit="m"
        unitSystem={distanceUnits}
      />
    </Field>
  );
}

function Composite() {
  const [v, setV] = useState(1.8);
  return (
    <Field label="Format" hint="feet & inches">
      <ThemedInput
        value={v}
        onChange={setV}
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
      />
    </Field>
  );
}

# i-input

A Blender-style universal number input for React.

Drag-to-scrub, inline math
expressions (`3 * 2 + 1`), pluggable unit systems (`5km`, `3ft 2in`,
`1m + 2cm`), soft/hard limits, value rollover, and fully custom rendering.

Ships a styled `<UniversalInput />` component and a headless `useUniversalInput`
hook.

## Contents

- [Install](#install)
- [Quick start](#quick-start)
- [Options](#options) — shared props for the component and hook
- [`UniversalInput` component](#universalinput-component) — extra props
- [Custom rendering (child function)](#custom-rendering-child-function)
- [`useUniversalInput` hook](#useuniversalinput-hook)
- [Units](#units)
- [Helpers](#helpers)
- [Interactions](#interactions)
- [Development](#development)
- [License](#license)

## Install

```sh
npm install i-input
# or
yarn add i-input
```

`react` and `react-dom` >= 18 are peer dependencies.

## Quick start

```tsx
import { useState } from "react";
import { UniversalInput } from "i-input";

function Example() {
  const [value, setValue] = useState(0);
  return <UniversalInput value={value} onChange={setValue} />;
}
```

## Options

Accepted by both the `UniversalInput` component and the `useUniversalInput`
hook.

| Name               | Type                                     | Default   | Description                                                                       |
| ------------------ | ---------------------------------------- | --------- | --------------------------------------------------------------------------------- |
| `value`            | `number`                                 | —         | **Required.** The current value (controlled).                                     |
| `onChange`         | `(value: number) => void`                | —         | **Required.** Called with the next value.                                         |
| `step`             | `number`                                 | `1`       | Increment for arrow keys, wheel, and scrubbing.                                   |
| `precision`        | `number`                                 | `3`       | Max decimal places shown in the default display.                                  |
| `disabled`         | `boolean`                                | `false`   | Disables all interaction.                                                         |
| `scrub`            | `boolean`                                | `true`    | Enable drag-to-scrub. When `false`, click/tap edits instead.                      |
| `scrubSensitivity` | `number`                                 | `1`       | Multiplier for scrub speed (`< 1` is slower).                                     |
| `scrubDirection`   | `"x" \| "y" \| "free"`                   | `"free"`  | Scrub axis. `"free"` responds to both (drag right/up to increase).                |
| `hardMin`          | `number`                                 | `-∞`      | Absolute lower bound; enforced even when typing.                                  |
| `hardMax`          | `number`                                 | `+∞`      | Absolute upper bound; enforced even when typing.                                  |
| `softMin`          | `number`                                 | `hardMin` | Lower bound for scrub/step; typing can exceed it.                                 |
| `softMax`          | `number`                                 | `hardMax` | Upper bound for scrub/step; typing can exceed it.                                 |
| `wrapMode`         | `"none" \| "hard-limit" \| "soft-limit"` | `"none"`  | Wrap past the bounds instead of clamping (e.g. an angle 360° → 0°).               |
| `unit`             | `string`                                 | —         | Display/parse unit suffix (e.g. `"%"`, `"m"`).                                    |
| `unitSystem`       | `UnitSystem`                             | —         | Recognized units for parsing & display (see [Units](#units)).                     |
| `customUnits`      | `UnitDefinition[]`                       | —         | Extra units appended to `unitSystem` (or used standalone).                        |
| `formatDisplay`    | `(info) => string`                       | —         | Custom display formatter. `info` = `{ value, unit, unitSystem, defaultDisplay }`. |

## `UniversalInput` component

Renders a styled, interactive input. Accepts every [option](#options) above
plus the following.

| Name           | Type                                            | Default | Description                                                            |
| -------------- | ----------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `children`     | `(state, actions) => ReactNode`                 | —       | Render overlay content. See [below](#custom-rendering-child-function). |
| `styles`       | `UniversalInputStyles`                          | —       | Inline style overrides per part (see table below).                     |
| `classNames`   | `UniversalInputClassNames`                      | —       | Class name overrides per part (same keys as `styles`).                 |
| `style`        | `CSSProperties`                                 | —       | Shortcut for `styles.root`.                                            |
| `className`    | `string`                                        | —       | Shortcut for `classNames.root`.                                        |
| `placeholder`  | `string`                                        | —       | Input placeholder while editing.                                       |
| `name` / `id`  | `string`                                        | —       | Forwarded to the `<input>`.                                            |
| `autoFocus`    | `boolean`                                       | `false` | Focus the input when editing starts.                                   |
| `readOnly`     | `boolean`                                       | `false` | Forwarded to the `<input>`.                                            |
| `required`     | `boolean`                                       | `false` | Forwarded to the `<input>`.                                            |
| `autoComplete` | `string`                                        | `"off"` | Forwarded to the `<input>`.                                            |
| `inputMode`    | `HTMLAttributes<HTMLInputElement>["inputMode"]` | —       | Forwarded to the `<input>`.                                            |
| `tabIndex`     | `number`                                        | —       | Forwarded to the root element.                                         |
| `aria-*`       | `string \| boolean`                             | —       | `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`.   |

### Style / className parts

`styles` and `classNames` share these keys:

| Key            | Applies to                                |
| -------------- | ----------------------------------------- |
| `root`         | The outer wrapper element.                |
| `input`        | The `<input>` shown while editing.        |
| `display`      | The text shown while not editing.         |
| `rootInvalid`  | The root when the typed text is invalid.  |
| `inputInvalid` | The input when the typed text is invalid. |

```tsx
<UniversalInput
  value={value}
  onChange={setValue}
  styles={{
    root: { borderRadius: 999, background: "#10243a" },
    input: { color: "#dbeafe" },
  }}
/>
```

## Custom rendering (child function)

Pass a function as `children` to render overlay content (fill bars, icons,
buttons…) on top of the input. It receives the current `state` and `actions`.

```tsx
<UniversalInput value={value} onChange={setValue} hardMin={0} hardMax={100}>
  {(state, actions) => (
    <>
      {/* a fill bar driven by the normalized value */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${state.normalized * 100}%`,
          background: "#4a7fb8",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {state.hovering && <button onClick={() => actions.stepBy(1)}>+</button>}
    </>
  )}
</UniversalInput>
```

`state` and `actions` are the same objects the hook returns — see below.

## `useUniversalInput` hook

For full control over markup, use the headless hook. It accepts every
[option](#options) and returns binding props plus state and actions.

```tsx
import { useUniversalInput } from "i-input";

function MyInput(props) {
  const { bindRoot, bindInput, state } = useUniversalInput(props);
  return (
    <div {...bindRoot}>
      {state.editing ? <input {...bindInput} /> : <span>{state.display}</span>}
    </div>
  );
}
```

### Returns

| Property    | Type                    | Description                                          |
| ----------- | ----------------------- | ---------------------------------------------------- |
| `bindRoot`  | props + `ref`           | Spread onto your wrapper element.                    |
| `bindInput` | props + `ref`           | Spread onto your `<input>` (rendered while editing). |
| `state`     | `UniversalInputState`   | Current state (see below).                           |
| `actions`   | `UniversalInputActions` | Imperative helpers (see below).                      |

### `state`

| Field         | Type                  | Description                                  |
| ------------- | --------------------- | -------------------------------------------- |
| `editing`     | `boolean`             | The text input is active.                    |
| `hovering`    | `boolean`             | Pointer is over the control.                 |
| `dragging`    | `boolean`             | A scrub drag is in progress.                 |
| `text`        | `string`              | Current raw text in the input.               |
| `isTextValid` | `boolean`             | Whether `text` parses to a finite number.    |
| `display`     | `string`              | Formatted value shown when not editing.      |
| `displayUnit` | `string \| undefined` | Unit suffix appended to the display, if any. |
| `normalized`  | `number`              | Value mapped to `0–1` across the soft range. |

### `actions`

| Method        | Description                                  |
| ------------- | -------------------------------------------- |
| `stepBy(dir)` | Step by `±step` (`dir` is `-1` or `1`).      |
| `negate()`    | Flip the sign of the current value.          |
| `set(value)`  | Set the value (clamped/wrapped accordingly). |

## Units

A `UnitSystem` defines a base unit and the units recognized when parsing and
displaying. A built-in `distanceUnits` system (base = meter) is provided.

```tsx
import { UniversalInput, distanceUnits } from "i-input";

<UniversalInput
  value={meters}
  onChange={setMeters}
  unit="m"
  unitSystem={distanceUnits}
/>;
// accepts "5km", "3ft 2in", "1m + 2cm" → stored in meters
```

Define your own:

```tsx
const unitSystem = {
  baseNames: ["px"],
  units: [
    { names: ["px"], toBase: 1 },
    { names: ["rem"], toBase: 16 },
  ],
};
```

### `customUnits`

Use `customUnits` to add extra `UnitDefinition`s without redefining a whole
system. They are appended to `unitSystem` (later definitions win on name
clashes); if no `unitSystem` is given, they form a standalone unitless system.

```tsx
// extend the built-in distance system with a CSS pixel
<UniversalInput
  value={meters}
  onChange={setMeters}
  unit="m"
  unitSystem={distanceUnits}
  customUnits={[{ names: ["px", "pixel", "pixels"], toBase: 0.0002645833 }]}
/>;
// now "100px" parses alongside "5km", "3ft 2in", ...
```

Each `UnitDefinition` is `{ names: string[]; toBase: number }` — `names` are the
case-insensitive aliases (canonical name first) and `toBase` converts that unit
into the system's base.

## Helpers

Exported alongside the component and hook:

| Export                                                | Kind      | Description                                                                                  |
| ----------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| `distanceUnits`                                       | `UnitSystem` | Built-in distance system (base = meter): km, m, cm, mm, mi, yd, ft, in, …                  |
| `extendUnitSystem(system, custom)`                    | function  | Returns a new `UnitSystem` with `custom` units appended (later definitions win on clashes).  |
| `findUnit(system, name)`                              | function  | Look up a `UnitDefinition` by any of its names (case-insensitive); `null` if not found.      |
| `formatComposite(value, system, valueUnit, parts)`    | function  | Format a value across multiple units, e.g. `5' 10.87"` or `1h 23m`.                          |

```tsx
import { findUnit, formatComposite, distanceUnits } from "i-input";

findUnit(distanceUnits, "ft"); // → { names: ["'", "ft", ...], toBase: 0.3048 }

formatComposite(1.8, distanceUnits, "m", [{ unit: "'" }, { unit: '"' }]);
// → "5' 10.866\""
```

`formatComposite` parts are `{ unit, suffix?, separator?, precision? }`: earlier
parts are floored to whole counts and the final part absorbs the remainder.

### Types

Exported types: `UniversalInputProps`, `UseUniversalInputOptions`,
`UniversalInputState`, `UniversalInputActions`, `UniversalInputHook`,
`UniversalInputStyles`, `UniversalInputClassNames`, `UnitSystem`,
`UnitDefinition`, `CompositePart`.

## Interactions

- **Drag** the control to scrub (hold `Shift` for fine steps, `Ctrl`/`Cmd` for
  precision).
- **Click / tap** to type. Inline math and units are evaluated on commit.
- **Arrow Up/Down** or **mouse wheel** to step by `step`.
- **`-`** while not editing negates the value.
- **Enter** commits, **Escape** cancels.

## Development

This repo is a [Yarn workspaces](https://yarnpkg.com/features/workspaces)
monorepo — `package/` is the library, `example/` is a Vite playground.

```sh
yarn install      # install
yarn dev          # run the example app
yarn build        # build the library
yarn typecheck    # type-check all workspaces
```

## License

MIT © [Faraz Shaikh](https://farazzshaikh.com)

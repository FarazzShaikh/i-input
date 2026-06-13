# i-input

A Blender-style universal number input for React.

- **Drag to scrub** values, or click to type.
- **Expression evaluation**: type `3*2`, `1/8`, `(4+5)/2`.
- **Unit systems**: built-in `distanceUnits`, or bring your own. Type
  `2ft 3in`, `5km, 3m`, `1m + 2cm`.
- **Headless** `useUniversalInput` hook, plus a styled `UniversalInput`
  component.

## Install

```sh
yarn add i-input
```

`react` and `react-dom` (>= 18) are peer dependencies.

## Usage

```tsx
import { useState } from "react";
import { UniversalInput, distanceUnits } from "i-input";

function Example() {
  const [length, setLength] = useState(1.8);
  return (
    <UniversalInput
      value={length}
      onChange={setLength}
      unitSystem={distanceUnits}
      step={0.1}
      precision={3}
    />
  );
}
```

For full control, use the headless hook:

```tsx
import { useUniversalInput } from "i-input";

const { bindRoot, bindInput, state, actions } = useUniversalInput({
  value,
  onChange,
});
```

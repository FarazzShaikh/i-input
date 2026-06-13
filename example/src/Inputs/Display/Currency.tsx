import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Currency({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(19.99);
  return (
    <Field label="Currency" hint="formatDisplay → $ amount">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={0.01}
        precision={2}
        formatDisplay={({ value }) => usd.format(value)}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

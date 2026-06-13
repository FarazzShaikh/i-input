import { useState } from "react";
import { Field, ThemedInput } from "../../Common";

function formatBytes(n: number): string {
  if (n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(n) / Math.log(1024)),
  );
  return `${(n / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function Bytes({ tabIndex }: { tabIndex?: number }) {
  const [value, setValue] = useState(1048576);
  return (
    <Field label="File size" hint="formatDisplay → B/KB/MB">
      <ThemedInput
        value={value}
        onChange={setValue}
        step={1024}
        precision={0}
        hardMin={0}
        formatDisplay={({ value }) => formatBytes(value)}
        scrub={false}
        tabIndex={tabIndex}
      />
    </Field>
  );
}

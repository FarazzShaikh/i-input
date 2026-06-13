import { UniversalInput, type UniversalInputProps } from "i-input";
import { useTheme } from "./theme";

/**
 * Wraps the library's UniversalInput and injects the active theme's
 * `classNames`, so light/dark mode is driven entirely through the library's
 * className props. Per-instance `classNames` are appended after the theme's.
 */
export function ThemedInput({ classNames, ...props }: UniversalInputProps) {
  const { palette } = useTheme();
  const join = (a?: string, b?: string) =>
    [a, b].filter(Boolean).join(" ") || undefined;
  return (
    <UniversalInput
      {...props}
      classNames={{
        ...classNames,
        root: join(palette.inputClassNames.root, classNames?.root),
        input: join(palette.inputClassNames.input, classNames?.input),
      }}
    />
  );
}

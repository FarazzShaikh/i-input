import type React from "react";
import { useIInput, type IInputHook, type UseIInputOptions } from "./useIInput";

export {
  useIInput,
  type IInputActions,
  type IInputHook,
  type IInputState,
  type UseIInputOptions,
} from "./useIInput";

export {
  distanceUnits,
  extendUnitSystem,
  findUnit,
  formatComposite,
  type CompositePart,
  type UnitDefinition,
  type UnitSystem,
} from "./utils/units";

export interface IInputStyles {
  root?: React.CSSProperties;
  input?: React.CSSProperties;
  display?: React.CSSProperties;
  rootInvalid?: React.CSSProperties;
  inputInvalid?: React.CSSProperties;
}

export interface IInputClassNames {
  root?: string;
  input?: string;
  display?: string;
  rootInvalid?: string;
  inputInvalid?: string;
}

export type IInputProps = UseIInputOptions & {
  children?: (
    state: IInputHook["state"],
    actions: IInputHook["actions"],
  ) => React.ReactNode;

  // Styling
  styles?: IInputStyles;
  classNames?: IInputClassNames;

  // Shortcut for root styles/class when no input/display customization is needed.
  style?: React.CSSProperties;
  className?: string;

  // Other
  name?: string;
  id?: string;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  tabIndex?: number;
};

export function IInput({
  children,
  styles,
  classNames,
  style,
  className,
  name,
  id,
  placeholder,
  autoFocus,
  readOnly,
  required,
  autoComplete,
  inputMode,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  tabIndex,
  ...props
}: IInputProps) {
  const { bindRoot, bindInput, state, actions } = useIInput(props);
  const { disabled = false, scrub = true, scrubDirection = "free" } = props;
  const { editing, display, displayUnit, isTextValid } = state;
  const invalid = editing && !isTextValid;

  const rootStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    height: 32,
    minWidth: 150,
    padding: "0 10px",
    background: "#2a2a2a",
    border: "1px solid #3b3b3b",
    borderRadius: 6,
    color: "#ddd",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    fontSize: 16,
    overscrollBehavior: "contain",
    touchAction: editing || disabled || !scrub ? "auto" : "none",
    cursor: editing
      ? "text"
      : disabled
        ? "not-allowed"
        : !scrub
          ? "text"
          : scrubDirection === "y"
            ? "ns-resize"
            : scrubDirection === "free"
              ? "move"
              : "ew-resize",
    userSelect: "none",
    boxSizing: "border-box",
    opacity: disabled ? 0.5 : 1,
    overflow: "hidden",
    borderColor: "transparent",
    ...styles?.root,
    ...(invalid
      ? styles?.rootInvalid || {
          color: "#f66",
          borderColor: "#f66",
        }
      : null),
    ...style,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    minWidth: 0,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "inherit",
    font: "inherit",
    padding: 0,
    textAlign: "center",
    overscrollBehavior: "contain",
    ...styles?.input,
    ...(invalid ? styles?.inputInvalid : null),
  };

  const displayStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    flex: 1,
    textAlign: "center",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...styles?.display,
  };

  return (
    <div
      {...bindRoot}
      tabIndex={tabIndex}
      aria-disabled={disabled || undefined}
      className={
        [
          classNames?.root,
          invalid ? classNames?.rootInvalid : undefined,
          className,
        ]
          .filter(Boolean)
          .join(" ") || undefined
      }
      style={rootStyle}
    >
      {children?.(state, actions)}

      {editing ? (
        <input
          {...bindInput}
          size={1}
          name={name}
          id={id}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete ?? "off"}
          inputMode={inputMode}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          className={
            [classNames?.input, invalid ? classNames?.inputInvalid : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          style={inputStyle}
        />
      ) : (
        <span className={classNames?.display} style={displayStyle}>
          {display}
          {displayUnit ? ` ${displayUnit}` : ""}
        </span>
      )}
    </div>
  );
}

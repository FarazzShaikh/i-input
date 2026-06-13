import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  axisDelta,
  clamp,
  evaluateText,
  formatNumber,
  getPixelsPerStep,
  getUnitToBase,
  nextStep,
  normalize,
  resolveUnitSystem,
  wrap,
  type DragState,
} from "./utils";
import type { UnitDefinition, UnitSystem } from "./utils/units";

export interface UseUniversalInputOptions {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  precision?: number;
  formatDisplay?: (info: {
    value: number;
    unit: string | undefined;
    unitSystem: UnitSystem | undefined;
    defaultDisplay: string;
  }) => string;

  disabled?: boolean;

  // Scrub
  scrub?: boolean;
  scrubSensitivity?: number;
  /**
   * Axis the scrub gesture follows. `"free"` (default) responds to both axes
   * (drag right / up to increase). `"x"` is horizontal-only, `"y"` is
   * vertical-only.
   */
  scrubDirection?: "x" | "y" | "free";

  // Limits
  hardMin?: number;
  hardMax?: number;
  softMin?: number;
  softMax?: number;
  wrapMode?: "none" | "hard-limit" | "soft-limit";

  // Units
  unit?: string;
  unitSystem?: UnitSystem;
  customUnits?: UnitDefinition[];
}

export interface UniversalInputState {
  editing: boolean;
  hovering: boolean;
  dragging: boolean;
  text: string;
  isTextValid: boolean;
  display: string;
  displayUnit: string | undefined;
  normalized: number;
}

export interface UniversalInputActions {
  stepBy: (dir: -1 | 1) => void;
  negate: () => void;
  set: (value: number) => void;
}

export interface UniversalInputHook {
  state: UniversalInputState;
  actions: UniversalInputActions;
  bindRoot: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefCallback<HTMLDivElement>;
  };
  bindInput: React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefCallback<HTMLInputElement>;
  };
}

const HARD_DEFAULT_MIN = -Infinity;
const HARD_DEFAULT_MAX = Infinity;
const DRAG_THRESHOLD_PX = 3;

export function useUniversalInput(
  options: UseUniversalInputOptions,
): UniversalInputHook {
  const {
    value,
    onChange,
    hardMin = HARD_DEFAULT_MIN,
    hardMax = HARD_DEFAULT_MAX,
    softMin,
    softMax,
    wrapMode = "none",
    step = 1,
    precision = 3,
    scrub = true,
    scrubDirection = "free",
    scrubSensitivity = 1,
    unit,
    unitSystem,
    customUnits,
    formatDisplay,
    disabled = false,
  } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [text, setText] = useState("");
  const [isTextValid, setIsTextValid] = useState(true);

  const softLow = softMin ?? hardMin;
  const softHigh = softMax ?? hardMax;

  // Resolve the active wrap range based on `wrapMode`, falling back to clamping
  // when the chosen range isn't finite.
  const wrapLow = wrapMode === "hard-limit" ? hardMin : softLow;
  const wrapHigh = wrapMode === "hard-limit" ? hardMax : softHigh;
  const canWrap =
    wrapMode !== "none" &&
    Number.isFinite(wrapLow) &&
    Number.isFinite(wrapHigh);

  const clampHard = (next: number) =>
    canWrap ? wrap(next, wrapLow, wrapHigh) : clamp(next, hardMin, hardMax);
  const clampSoft = (next: number) =>
    canWrap ? wrap(next, wrapLow, wrapHigh) : clamp(next, softLow, softHigh);

  const activeUnitSystem = useMemo(
    () => resolveUnitSystem(unitSystem, customUnits),
    [unitSystem, customUnits],
  );

  const valueUnitToBase = useMemo(
    () => getUnitToBase(activeUnitSystem, unit),
    [activeUnitSystem, unit],
  );

  const displayUnit = formatDisplay
    ? undefined
    : (unit ?? activeUnitSystem?.baseNames[0]);

  const formatValue = (next: number) => formatNumber(next, precision);
  const evalText = (raw: string) =>
    evaluateText(raw, activeUnitSystem, unit, valueUnitToBase);

  const commitValue = (next: number) => {
    const clamped = clampHard(next);
    if (clamped !== value) onChange(clamped);
    return clamped;
  };

  useEffect(() => {
    if (!editing) setText(formatValue(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editing, precision, unit, activeUnitSystem]);

  const display = useMemo(() => {
    const defaultDisplay = formatValue(value);
    return formatDisplay
      ? formatDisplay({
          value,
          unit,
          unitSystem: activeUnitSystem,
          defaultDisplay,
        })
      : defaultDisplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, precision, unit, activeUnitSystem, formatDisplay]);

  const normalized = useMemo(
    () => normalize(value, softLow, softHigh),
    [value, softLow, softHigh],
  );

  const startEditing = (selectAll = true) => {
    if (disabled) return;
    setText(formatValue(value));
    setIsTextValid(true);
    setEditing(true);
    queueMicrotask(() => {
      inputRef.current?.focus();
      if (selectAll) inputRef.current?.select();
    });
  };

  const stopEditing = () => setEditing(false);

  const commitEdit = () => {
    if (!editing) return;
    const parsed = evalText(text);
    if (parsed !== null && Number.isFinite(parsed)) commitValue(parsed);
    stopEditing();
  };

  const set = (next: number) => {
    if (!disabled) commitValue(next);
  };

  const negate = () => set(-value);

  const stepBy = (dir: -1 | 1) => {
    if (disabled) return;
    const parsed = editing ? evalText(text) : null;
    const base = parsed !== null && Number.isFinite(parsed) ? parsed : value;
    const next = commitValue(clampSoft(nextStep(base, step, dir)));

    setText(formatValue(next));
    setIsTextValid(true);
    queueMicrotask(() => inputRef.current?.select());
  };

  // React attaches `wheel` as a passive listener, so `preventDefault()` inside
  // a synthetic `onWheel` handler is ignored and the page still scrolls. Attach
  // a non-passive native listener instead so we can both step and prevent the
  // page from scrolling while interacting with the input.
  const onWheelRef = useRef<(event: WheelEvent) => void>(() => {});
  onWheelRef.current = (event: WheelEvent) => {
    if (disabled) return;
    event.preventDefault();
    stepBy(event.deltaY > 0 ? 1 : -1);
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const handler = (event: WheelEvent) => onWheelRef.current(event);
    node.addEventListener("wheel", handler, { passive: false });
    return () => node.removeEventListener("wheel", handler);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || editing || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.dataset.role === "step") return;

    if (!scrub) {
      event.preventDefault();
      startEditing(true);
      return;
    }

    event.preventDefault();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startValue: value,
      moved: false,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const deltaPx = axisDelta(event, drag, scrubDirection);
    if (!drag.moved) {
      if (Math.abs(deltaPx) < DRAG_THRESHOLD_PX) return;
      drag.moved = true;
      setDragging(true);
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      return;
    }

    const pxPerStep = getPixelsPerStep({
      element: event.currentTarget,
      direction: scrubDirection,
      sensitivity: scrubSensitivity,
      precision: event.ctrlKey || event.metaKey,
      step,
      softMin: softLow,
      softMax: softHigh,
    });

    let delta = (deltaPx / pxPerStep) * step;
    if (!event.shiftKey) delta = Math.round(delta / step) * step;
    set(clampSoft(drag.startValue + delta));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return drag;
    if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
    return drag;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = endDrag(event);
    // A press without movement is a tap → begin editing.
    if (drag && !drag.moved) startEditing(true);
  };

  // `pointercancel` fires when the browser takes over the gesture (common on
  // touch). Abort the drag but do NOT treat it as a tap, otherwise scrubbing
  // would instantly fall back to editing on touch devices.
  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && editing) {
      event.preventDefault();
      commitEdit();
      return;
    }

    if (event.key === "Escape" && editing) {
      event.preventDefault();
      stopEditing();
      return;
    }

    if (event.key === "Tab" && editing) {
      commitEdit();
      return;
    }

    if (event.key === "-" && !editing && !disabled) {
      event.preventDefault();
      negate();
      return;
    }

    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !editing) {
      event.preventDefault();
      stepBy(event.key === "ArrowUp" ? 1 : -1);
    }
  };

  const bindRoot: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefCallback<HTMLDivElement>;
  } = {
    ref: (element) => {
      rootRef.current = element;
    },
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerEnter: () => setHovering(true),
    onPointerLeave: () => setHovering(false),
    onKeyDown,
  };

  const bindInput: React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefCallback<HTMLInputElement>;
  } = {
    ref: (element) => {
      inputRef.current = element;
    },
    type: "text",
    value: text,
    onChange: (event) => {
      const nextText = event.target.value;
      setText(nextText);
      const parsed = evalText(nextText);
      setIsTextValid(parsed !== null && Number.isFinite(parsed));
    },
    onBlur: commitEdit,
    onKeyDown: (event) => {
      if (event.key === "-") {
        const input = event.currentTarget;
        const allSelected =
          input.value.length > 0 &&
          input.selectionStart === 0 &&
          input.selectionEnd === input.value.length;
        if (allSelected) {
          const parsed = evalText(text);
          if (parsed !== null && Number.isFinite(parsed)) {
            event.preventDefault();
            const next = formatValue(-parsed);
            setText(next);
            setIsTextValid(true);
            queueMicrotask(() => inputRef.current?.select());
          }
        }
        return;
      }
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      stepBy(event.key === "ArrowUp" ? 1 : -1);
    },
  };

  return {
    state: {
      editing,
      hovering,
      dragging,
      text,
      isTextValid,
      display,
      displayUnit,
      normalized,
    },
    actions: { stepBy, negate, set },
    bindRoot,
    bindInput,
  };
}

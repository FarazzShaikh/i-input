import type React from "react";
import { evaluateExpression } from "./evaluateExpression";
import {
  extendUnitSystem,
  findUnit,
  preprocessUnits,
  type UnitDefinition,
  type UnitSystem,
} from "./units";

const DEFAULT_PX_PER_STEP = 4;
const STEP_EPSILON = 1e-9;

export type DragState = {
  startX: number;
  startY: number;
  startValue: number;
  moved: boolean;
  pointerId: number;
};

export function resolveUnitSystem(
  unitSystem: UnitSystem | undefined,
  customUnits: UnitDefinition[] | undefined,
): UnitSystem | undefined {
  if (unitSystem) return extendUnitSystem(unitSystem, customUnits);
  if (customUnits && customUnits.length > 0) {
    return { baseNames: [""], units: customUnits };
  }
  return undefined;
}

export function getUnitToBase(
  system: UnitSystem | undefined,
  unit: string | undefined,
) {
  if (!system || !unit) return 1;
  return findUnit(system, unit)?.toBase ?? 1;
}

export function evaluateText(
  raw: string,
  activeUnitSystem: UnitSystem | undefined,
  unit: string | undefined,
  valueUnitToBase: number,
): number | null {
  if (!activeUnitSystem) return evaluateExpression(stripUnitSuffix(raw, unit));

  const { text, hasUnit } = preprocessUnits(raw, activeUnitSystem);
  const parsed = evaluateExpression(text);
  if (parsed === null) return null;
  return hasUnit ? parsed / valueUnitToBase : parsed;
}

export function formatNumber(value: number, precision: number): string {
  if (!Number.isFinite(value)) return String(value);
  if (value === 0) return "0";
  if (Math.abs(value) < Math.pow(10, -precision)) {
    return value.toExponential(Math.max(0, precision - 1));
  }
  return trimTrailingZeros(value.toFixed(precision));
}

export function nextStep(value: number, step: number, dir: -1 | 1) {
  return dir > 0
    ? Math.floor(value / step + STEP_EPSILON) * step + step
    : Math.ceil(value / step - STEP_EPSILON) * step - step;
}

export function getPixelsPerStep(options: {
  element: HTMLDivElement;
  direction: "x" | "y" | "free";
  sensitivity: number;
  precision: boolean;
  step: number;
  softMin: number;
  softMax: number;
}) {
  const { element, direction, sensitivity, precision, step, softMin, softMax } =
    options;
  let pxPerStep = DEFAULT_PX_PER_STEP;

  if (
    direction === "x" &&
    Number.isFinite(softMin) &&
    Number.isFinite(softMax)
  ) {
    const range = (softMax - softMin) / step;
    const width = element.getBoundingClientRect().width || 1;
    if (range > 0) pxPerStep = width / range;
  }

  if (sensitivity > 0) pxPerStep /= sensitivity;
  if (precision) pxPerStep *= 10;
  return pxPerStep;
}

export function axisDelta(
  event: React.PointerEvent<HTMLDivElement>,
  drag: DragState,
  direction: "x" | "y" | "free",
) {
  if (direction === "y") return drag.startY - event.clientY;
  if (direction === "x") return event.clientX - drag.startX;
  // "free": combine horizontal (right = +) and vertical (up = +) movement.
  return event.clientX - drag.startX + (drag.startY - event.clientY);
}

export function normalize(value: number, min: number, max: number) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0;
  return (clamp(value, min, max) - min) / (max - min);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Wrap `value` into the half-open range [min, max). Useful for cyclic values
 * like angles, where exceeding `max` rolls back to `min` (e.g. 360° → 0°).
 */
export function wrap(value: number, min: number, max: number) {
  const range = max - min;
  if (!(range > 0)) return value;
  return min + ((((value - min) % range) + range) % range);
}

function trimTrailingZeros(value: string): string {
  if (!value.includes(".")) return value;
  return value.replace(/\.?0+$/, (match) =>
    match.startsWith(".") ? "" : match,
  );
}

function stripUnitSuffix(text: string, unit?: string): string {
  if (!unit) return text;
  const trimmed = text.trimEnd();
  if (trimmed.toLowerCase().endsWith(unit.toLowerCase())) {
    return trimmed.slice(0, -unit.length);
  }
  return text;
}

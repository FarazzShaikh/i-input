/**
 * Unit system support for `IInput`.
 *
 * A `UnitSystem` defines:
 *   - a base unit (used to store / emit values), and
 *   - a set of recognized units, each with a multiplier to the base.
 *
 * Inputs like "1m", "2ft 3in", "5km, 3m" or "1m + 2cm" are pre-processed
 * into pure numeric expressions before being handed to `evaluateExpression`.
 *
 * Adjacent unit-suffixed quantities (separated by whitespace or commas) are
 * treated as addition, matching Blender's behavior (e.g. `1m 3mm`).
 */

export interface UnitDefinition {
  /**
   * All names/aliases that match this unit in input (case-insensitive).
   * E.g. `["m", "meter", "meters"]` or `["'", "ft", "foot", "feet"]`.
   * List the canonical display name first.
   */
  names: string[];
  /** Multiplier converting from this unit into the system's base unit. */
  toBase: number;
}

export interface UnitSystem {
  /** Canonical name(s) for the base unit. First entry is used for display. */
  baseNames: string[];
  /** All recognized units, including the base (factor 1). */
  units: UnitDefinition[];
}

/** Distance units, base = meter. */
export const distanceUnits: UnitSystem = {
  baseNames: ["m", "meter", "meters"],
  units: [
    // Metric
    { names: ["km", "kilometer", "kilometers"], toBase: 1000 },
    { names: ["m", "meter", "meters"], toBase: 1 },
    { names: ["cm", "centimeter", "centimeters"], toBase: 0.01 },
    { names: ["mm", "millimeter", "millimeters"], toBase: 0.001 },
    { names: ["um", "µm", "micrometer", "micrometers"], toBase: 1e-6 },
    { names: ["nm", "nanometer", "nanometers"], toBase: 1e-9 },
    // Imperial
    { names: ["mi", "mile", "miles"], toBase: 1609.344 },
    { names: ["yd", "yard", "yards"], toBase: 0.9144 },
    { names: ["f", "ft", "foot", "feet", "'"], toBase: 0.3048 },
    { names: ["i", "in", "inch", "inches", '"'], toBase: 0.0254 },
    { names: ["thou", "mil"], toBase: 0.0000254 },
  ],
};

/**
 * Build a derived unit system by appending custom unit definitions to a base
 * system. Later definitions take precedence over earlier ones when names
 * collide.
 */
export function extendUnitSystem(
  system: UnitSystem,
  custom: UnitDefinition[] = [],
): UnitSystem {
  if (custom.length === 0) return system;
  return {
    baseNames: system.baseNames,
    units: [...system.units, ...custom],
  };
}

export interface PreprocessUnitsResult {
  /** Rewritten expression where each unit-suffixed quantity is multiplied
   *  by its `toBase` factor, so the result is in the system's base unit. */
  text: string;
  /** True if at least one unit token was matched. When false, the original
   *  text was returned unchanged. Callers can use this to decide whether
   *  the bare number should be interpreted as base units or as the caller's
   *  preferred display unit. */
  hasUnit: boolean;
}

/**
 * Rewrite a user-typed expression with units into a pure numeric expression
 * (in base units). Returns the original text unchanged when no `system` is
 * given, or when no unit tokens are found.
 *
 * Examples (with `distanceUnits`):
 *   "1m"            -> "(1*1)"
 *   "2ft 3in"       -> "(2*0.3048)+(3*0.0254)"
 *   "5km, 3m"       -> "(5*1000)+(3*1)"
 *   "1m + 2cm"      -> "(1*1) + (2*0.01)"
 *   "3*2"           -> "3*2"          (no units → passthrough)
 */
export function preprocessUnits(
  text: string,
  system?: UnitSystem,
): PreprocessUnitsResult {
  if (!system) return { text, hasUnit: false };

  // Flatten into (name, toBase) pairs, longest name first so e.g. "mm" wins
  // over "m" and "feet" wins over "ft".
  const flat = system.units
    .flatMap((u) => u.names.map((n) => ({ name: n, toBase: u.toBase })))
    .sort((a, b) => b.name.length - a.name.length);

  const isLetter = (c: string | undefined) => !!c && /[a-zA-Z]/.test(c);
  const isWord = (c: string | undefined) => !!c && /[a-zA-Z0-9_]/.test(c);

  let out = "";
  let i = 0;
  let anyUnit = false;

  while (i < text.length) {
    // Try to read a number starting at i.
    const rest = text.slice(i);
    const numMatch = rest.match(/^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?/);
    if (numMatch) {
      const num = numMatch[0];
      const afterNum = i + num.length;

      // Skip whitespace between number and potential unit.
      let k = afterNum;
      while (text[k] === " " || text[k] === "\t") k++;

      // Try the longest matching unit at position k.
      let matched: { name: string; toBase: number } | null = null;
      for (const u of flat) {
        const slice = text.slice(k, k + u.name.length);
        if (slice.toLowerCase() !== u.name.toLowerCase()) continue;
        // If the unit name ends with a letter, the next char must not be
        // part of a longer identifier (avoid matching "min" inside "minute"
        // when "minute" isn't defined, or "m" inside "min").
        const lastIsLetter = isLetter(u.name[u.name.length - 1]);
        const after = text[k + u.name.length];
        if (lastIsLetter && isWord(after)) continue;
        matched = u;
        break;
      }

      if (matched) {
        out += `(${num}*${matched.toBase})`;
        i = k + matched.name.length;
        anyUnit = true;
        continue;
      }

      // No unit: emit the raw number and advance.
      out += num;
      i = afterNum;
      continue;
    }

    out += text[i];
    i++;
  }

  if (!anyUnit) return { text, hasUnit: false };

  // Adjacent quantities → implicit addition.
  //   "(1*1) (3*0.001)"  -> "(1*1)+(3*0.001)"
  //   "(5*1000), (3*1)"  -> "(5*1000)+(3*1)"
  out = out.replace(/\)\s*,\s*\(/g, ")+(");
  out = out.replace(/\)\s+\(/g, ")+(");

  return { text: out, hasUnit: true };
}

/**
 * Look up a unit definition by one of its names (case-insensitive).
 * Returns `null` if no match is found.
 */
export function findUnit(
  system: UnitSystem,
  name: string,
): UnitDefinition | null {
  const n = name.toLowerCase();
  for (const u of system.units) {
    if (u.names.some((alias) => alias.toLowerCase() === n)) return u;
  }
  return null;
}

/**
 * Format a base-unit numeric value for display using the first base name.
 * Used by `IInput` when no explicit `unit` prop is provided.
 */
export function formatBase(value: number, system: UnitSystem): string {
  return `${value} ${system.baseNames[0]}`;
}

export interface CompositePart {
  /** Unit name (looked up in `system.units` via `findUnit`). */
  unit: string;
  /** Optional explicit suffix; defaults to `unit`. */
  suffix?: string;
  /**
   * Optional separator placed before this part (default `" "`).
   * Ignored for the first part.
   */
  separator?: string;
  /**
   * Decimal places. If omitted, this part is rendered as an integer for
   * all but the last part, and as a decimal for the last part.
   */
  precision?: number;
}

/**
 * Break `value` (expressed in `valueUnit`) into composite unit parts.
 *
 * Useful for displays like `5' 10.87"` (feet + inches), `1h 23m`, etc.
 * The earlier parts are floored to whole counts; the final part absorbs
 * the remainder.
 *
 *   formatComposite(1.8, distanceUnits, "m", [{ unit: "'" }, { unit: '"' }])
 *     // → `5' 10.866"`
 */
export function formatComposite(
  value: number,
  system: UnitSystem,
  valueUnit: string,
  parts: CompositePart[],
): string {
  if (parts.length === 0) return String(value);

  const valueDef = findUnit(system, valueUnit);
  if (!valueDef) return String(value);
  let remainingBase = value * valueDef.toBase;
  const sign = remainingBase < 0 ? "-" : "";
  remainingBase = Math.abs(remainingBase);

  const pieces: string[] = [];
  parts.forEach((part, i) => {
    const def = findUnit(system, part.unit);
    if (!def) return;
    const isLast = i === parts.length - 1;
    const inUnit = remainingBase / def.toBase;
    const count = isLast ? inUnit : Math.floor(inUnit);
    remainingBase -= count * def.toBase;

    const precision = part.precision ?? (isLast ? 3 : 0);
    const numStr = trimTrailingZeros(count.toFixed(precision));
    const suffix = part.suffix ?? part.unit;
    const sep = i === 0 ? "" : (part.separator ?? " ");
    pieces.push(`${sep}${numStr}${suffix}`);
  });

  return sign + pieces.join("");
}

function trimTrailingZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m));
}

/**
 * Safely evaluate a math expression.
 *
 * Supports:
 *   - Operators: + - * / % ^ ** (right-associative power), unary + / -
 *   - Parentheses
 *   - Constants: pi, e, tau
 *   - Functions: sqrt, abs, floor, ceil, round, trunc, sign,
 *                sin, cos, tan, asin, acos, atan, atan2,
 *                log, log2, log10, exp, min, max, pow
 *
 * Returns null when the expression is invalid or empty.
 * Implemented as a hand-written recursive-descent parser (no eval).
 */
export function evaluateExpression(input: string): number | null {
  const expr = input.trim();
  if (expr === "") return null;

  type Token =
    | { type: "num"; value: number }
    | { type: "op"; value: "+" | "-" | "*" | "/" | "%" | "^" }
    | { type: "ident"; value: string }
    | { type: "comma" }
    | { type: "lparen" }
    | { type: "rparen" };

  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma" });
      i++;
      continue;
    }
    if (ch === "*" && expr[i + 1] === "*") {
      tokens.push({ type: "op", value: "^" });
      i += 2;
      continue;
    }
    if (ch === "^") {
      tokens.push({ type: "op", value: "^" });
      i++;
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "%") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let j = i;
      let hasDot = false;
      while (j < expr.length) {
        const c = expr[j];
        if (c >= "0" && c <= "9") {
          j++;
        } else if (c === "." && !hasDot) {
          hasDot = true;
          j++;
        } else {
          break;
        }
      }
      // Scientific notation: 1e-3, 2.5E+10
      if (expr[j] === "e" || expr[j] === "E") {
        let k = j + 1;
        if (expr[k] === "+" || expr[k] === "-") k++;
        let digits = 0;
        while (expr[k] >= "0" && expr[k] <= "9") {
          k++;
          digits++;
        }
        if (digits > 0) j = k;
      }
      const num = parseFloat(expr.slice(i, j));
      if (!Number.isFinite(num)) return null;
      tokens.push({ type: "num", value: num });
      i = j;
      continue;
    }
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_") {
      let j = i;
      while (
        j < expr.length &&
        ((expr[j] >= "a" && expr[j] <= "z") ||
          (expr[j] >= "A" && expr[j] <= "Z") ||
          (expr[j] >= "0" && expr[j] <= "9") ||
          expr[j] === "_")
      ) {
        j++;
      }
      tokens.push({ type: "ident", value: expr.slice(i, j).toLowerCase() });
      i = j;
      continue;
    }
    return null;
  }

  if (tokens.length === 0) return null;

  const constants: Record<string, number> = {
    pi: Math.PI,
    e: Math.E,
    tau: Math.PI * 2,
  };

  const fns: Record<string, (args: number[]) => number | null> = {
    sqrt: ([x]) => Math.sqrt(x),
    abs: ([x]) => Math.abs(x),
    floor: ([x]) => Math.floor(x),
    ceil: ([x]) => Math.ceil(x),
    round: ([x]) => Math.round(x),
    trunc: ([x]) => Math.trunc(x),
    sign: ([x]) => Math.sign(x),
    sin: ([x]) => Math.sin(x),
    cos: ([x]) => Math.cos(x),
    tan: ([x]) => Math.tan(x),
    asin: ([x]) => Math.asin(x),
    acos: ([x]) => Math.acos(x),
    atan: ([x]) => Math.atan(x),
    atan2: (a) => (a.length === 2 ? Math.atan2(a[0], a[1]) : null),
    log: ([x]) => Math.log(x),
    log2: ([x]) => Math.log2(x),
    log10: ([x]) => Math.log10(x),
    exp: ([x]) => Math.exp(x),
    min: (a) => (a.length ? Math.min(...a) : null),
    max: (a) => (a.length ? Math.max(...a) : null),
    pow: (a) => (a.length === 2 ? Math.pow(a[0], a[1]) : null),
  };

  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const parseFactor = (): number | null => {
    const t = peek();
    if (!t) return null;

    if (t.type === "op" && (t.value === "+" || t.value === "-")) {
      consume();
      const v = parseFactor();
      if (v === null) return null;
      return t.value === "-" ? -v : v;
    }
    if (t.type === "lparen") {
      consume();
      const v = parseExpression();
      if (v === null) return null;
      const next = peek();
      if (!next || next.type !== "rparen") return null;
      consume();
      return v;
    }
    if (t.type === "num") {
      consume();
      return t.value;
    }
    if (t.type === "ident") {
      consume();
      if (peek()?.type === "lparen") {
        consume();
        const args: number[] = [];
        if (peek()?.type !== "rparen") {
          while (true) {
            const v = parseExpression();
            if (v === null) return null;
            args.push(v);
            if (peek()?.type === "comma") {
              consume();
              continue;
            }
            break;
          }
        }
        const close = peek();
        if (!close || close.type !== "rparen") return null;
        consume();
        const fn = fns[t.value];
        if (!fn) return null;
        return fn(args);
      }
      if (t.value in constants) return constants[t.value];
      return null;
    }
    return null;
  };

  const parsePower = (): number | null => {
    const base = parseFactor();
    if (base === null) return null;
    const t = peek();
    if (t && t.type === "op" && t.value === "^") {
      consume();
      const exponent = parsePower(); // right-associative
      if (exponent === null) return null;
      return Math.pow(base, exponent);
    }
    return base;
  };

  const parseTerm = (): number | null => {
    let left = parsePower();
    if (left === null) return null;
    while (true) {
      const t = peek();
      if (!t || t.type !== "op") break;
      if (t.value !== "*" && t.value !== "/" && t.value !== "%") break;
      consume();
      const right = parsePower();
      if (right === null) return null;
      if (t.value === "*") left = left * right;
      else if (t.value === "/") {
        if (right === 0) return null;
        left = left / right;
      } else {
        if (right === 0) return null;
        left = left % right;
      }
    }
    return left;
  };

  const parseExpression = (): number | null => {
    let left = parseTerm();
    if (left === null) return null;
    while (true) {
      const t = peek();
      if (!t || t.type !== "op") break;
      if (t.value !== "+" && t.value !== "-") break;
      consume();
      const right = parseTerm();
      if (right === null) return null;
      left = t.value === "+" ? left + right : left - right;
    }
    return left;
  };

  const result = parseExpression();
  if (result === null) return null;
  if (pos !== tokens.length) return null;
  return result;
}

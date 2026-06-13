import type { IInputClassNames } from "i-input";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export interface ThemePalette {
  pageBg: string;
  /** Solid base color applied to the document body. */
  baseBg: string;
  text: string;
  textHeading: string;
  muted: string;
  label: string;
  sectionBg: string;
  sectionBorder: string;
  sectionDivider: string;
  accent: string;
  accentGlow: string;
  /** Classes passed to every IInput so the library matches the theme. */
  inputClassNames: IInputClassNames;
  /** Accent "pill" classes for the custom-styled input demo. */
  accentInputClassNames: IInputClassNames;
}

const dark: ThemePalette = {
  pageBg:
    "radial-gradient(1200px 600px at 50% -10%, #1c2230 0%, #141417 55%, #101012 100%)",
  baseBg: "#141417",
  text: "#dddddd",
  textHeading: "#f0f3f8",
  muted: "#8b93a1",
  label: "#c4cad6",
  sectionBg: "#15171d",
  sectionBorder: "rgba(120,150,200,0.18)",
  sectionDivider: "rgba(120,150,200,0.15)",
  accent: "#6ea3da",
  accentGlow: "rgba(110,163,218,0.8)",
  inputClassNames: {
    root: "ii-root ii-root-dark",
    input: "ii-field ii-field-dark",
  },
  accentInputClassNames: {
    root: "ii-accent-root ii-accent-root-dark",
    input: "ii-accent-field ii-accent-field-dark",
  },
};

const light: ThemePalette = {
  pageBg:
    "radial-gradient(1200px 600px at 50% -10%, #ffffff 0%, #eef1f6 55%, #e4e8ef 100%)",
  baseBg: "#eef1f6",
  text: "#3a3f4a",
  textHeading: "#1a1d23",
  muted: "#7a8190",
  label: "#4a505c",
  sectionBg: "#ffffff",
  sectionBorder: "rgba(40,70,120,0.16)",
  sectionDivider: "rgba(40,70,120,0.12)",
  accent: "#3b6fb0",
  accentGlow: "rgba(59,111,176,0.45)",
  inputClassNames: {
    root: "ii-root ii-root-light",
    input: "ii-field ii-field-light",
  },
  accentInputClassNames: {
    root: "ii-accent-root ii-accent-root-light",
    input: "ii-accent-field ii-accent-field-light",
  },
};

const palettes: Record<ThemeMode, ThemePalette> = { light, dark };

interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemePalette;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemMode(): ThemeMode {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getSystemMode);
  // Once the user manually toggles, stop following the system preference.
  const userOverrode = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!userOverrode.current) setMode(event.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.background = palettes[mode].baseBg;
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      palette: palettes[mode],
      toggle: () => {
        userOverrode.current = true;
        setMode((m) => (m === "dark" ? "light" : "dark"));
      },
    }),
    [mode],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

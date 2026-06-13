import "./App.css";
import {
  Footer,
  GitHubButton,
  InstallTabs,
  Section,
  SectionNav,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "./Common";
import {
  Angle,
  Basic,
  Bytes,
  Composite,
  CustomFormat,
  CustomStyle,
  CustomUnit,
  Disabled,
  Distance,
  Expression,
  FreeScrub,
  Functions,
  GlassStyle,
  HardLimited,
  Negate,
  NeonStyle,
  NoScrub,
  PillStyle,
  Precision,
  Rollover,
  ScrubX,
  ScrubY,
  Sensitivity,
  SliderFill,
  SoftLimited,
  StateBadge,
  Step,
  StepButtons,
  TerminalStyle,
  UnderlineStyle,
  UnitLabel,
} from "./Inputs";

const SECTION_TITLES = [
  "Basics",
  "Math",
  "Units",
  "Display",
  "Scrubbing",
  "Limits",
  "Render props",
  "Styling & state",
];

export function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { mode, palette } = useTheme();
  return (
    <section
      className={mode === "light" ? "app-light" : undefined}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 6,
        padding: "40px 24px",
        background: palette.pageBg,
        color: palette.text,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        fontSize: 12,
        boxSizing: "border-box",
      }}
    >
      <a
        className="app-byline"
        href="https://farazzshaikh.com"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "absolute",
          top: 20,
          left: "max(24px, calc((100% - 960px) / 2))",
        }}
      >
        by Faraz Shaikh
      </a>

      <div
        style={{
          position: "absolute",
          top: 20,
          right: "max(24px, calc((100% - 960px) / 2))",
          display: "flex",
          gap: 8,
        }}
      >
        <GitHubButton />
        <ThemeToggle />
      </div>

      <SectionNav titles={SECTION_TITLES} />

      <header className="app-header">
        <div className="app-intro">
          <h1 className="app-title">
            <span className="app-title-i">i</span>
            <span className="app-title-dash">-</span>
            Input
          </h1>
          <p className="app-tagline">
            A Blender-style universal number input for React
          </p>
        </div>

        <InstallTabs />
      </header>

      <div
        style={{
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Section title="Basics" sourceDir="example/src/Inputs/Basics">
          <Basic tabIndex={1} />
          <Step tabIndex={2} />
          <Precision tabIndex={3} />
        </Section>

        <Section title="Math" sourceDir="example/src/Inputs/Editing">
          <Expression tabIndex={4} />
          <Functions tabIndex={5} />
          <Negate tabIndex={6} />
        </Section>

        <Section title="Units" sourceDir="example/src/Inputs/Units">
          <UnitLabel tabIndex={7} />
          <Distance tabIndex={8} />
          <CustomUnit tabIndex={9} />
          <Angle tabIndex={10} />
        </Section>

        <Section title="Display" sourceDir="example/src/Inputs/Display">
          <Composite tabIndex={11} />
          <CustomFormat tabIndex={12} />
          <Bytes tabIndex={13} />
        </Section>

        <Section title="Scrubbing" sourceDir="example/src/Inputs/Scrubbing">
          <FreeScrub tabIndex={14} />
          <ScrubX tabIndex={15} />
          <ScrubY tabIndex={16} />
          <Sensitivity tabIndex={17} />
          <NoScrub tabIndex={18} />
        </Section>

        <Section title="Limits" sourceDir="example/src/Inputs/Limits">
          <SoftLimited tabIndex={19} />
          <HardLimited tabIndex={20} />
          <Rollover tabIndex={21} />
        </Section>

        <Section
          title="Render props"
          sourceDir="example/src/Inputs/RenderProps"
        >
          <StepButtons tabIndex={22} />
          <SliderFill tabIndex={23} />
          <StateBadge tabIndex={24} />
        </Section>

        <Section title="Styling & state" sourceDir="example/src/Inputs/Styling">
          <CustomStyle tabIndex={25} />
          <PillStyle tabIndex={26} />
          <NeonStyle tabIndex={27} />
          <TerminalStyle tabIndex={28} />
          <GlassStyle tabIndex={29} />
          <UnderlineStyle tabIndex={30} />
          <Disabled />
        </Section>
      </div>

      <Footer />
    </section>
  );
}

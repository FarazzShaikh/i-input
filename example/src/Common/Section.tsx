import type { ReactNode } from "react";
import { repoDirUrl } from "./constants";
import { GitHubIcon } from "./GitHubIcon";
import { useTheme } from "./theme";

/** Stable anchor id derived from a section title. */
export function sectionId(title: string): string {
  return `section-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export function Section({
  title,
  sourceDir,
  children,
}: {
  title: string;
  /** Workspace-relative folder for this section's components, linked on GitHub. */
  sourceDir?: string;
  children: ReactNode;
}) {
  const { palette } = useTheme();
  return (
    <section
      id={sectionId(title)}
      style={{
        padding: "20px 24px 22px",
        border: `1px solid ${palette.sectionBorder}`,
        borderRadius: 12,
        background: palette.sectionBg,
        scrollMarginTop: 24,
      }}
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: "0 0 12px",
          paddingBottom: 8,
          borderBottom: `1px solid ${palette.sectionDivider}`,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: palette.textHeading,
        }}
      >
        <span
          style={{
            width: 5,
            height: 14,
            borderRadius: 3,
            background: palette.accent,
            boxShadow: `0 0 10px ${palette.accentGlow}`,
          }}
        />
        {title}
        {sourceDir ? (
          <a
            className="app-section-source"
            href={repoDirUrl(sourceDir)}
            target="_blank"
            rel="noreferrer"
            title={`View ${title} components on GitHub`}
          >
            <GitHubIcon size={14} />
            Source
          </a>
        ) : null}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          alignItems: "start",
          justifyItems: "center",
          columnGap: 20,
          rowGap: 12,
        }}
      >
        {children}
      </div>
    </section>
  );
}

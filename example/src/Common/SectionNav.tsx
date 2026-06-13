import { useEffect, useState } from "react";
import { sectionId } from "./Section";
import { useTheme } from "./theme";

export function SectionNav({ titles }: { titles: string[] }) {
  const { palette } = useTheme();
  const [active, setActive] = useState(titles[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const title = titles.find((t) => sectionId(t) === visible.target.id);
          if (title) setActive(title);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    for (const t of titles) {
      const el = document.getElementById(sectionId(t));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [titles]);

  const jumpTo = (title: string) => {
    document
      .getElementById(sectionId(title))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="app-nav" aria-label="Sections">
      {titles.map((title) => {
        const isActive = title === active;
        return (
          <button
            key={title}
            type="button"
            className={
              isActive ? "app-nav-item app-nav-item-active" : "app-nav-item"
            }
            onClick={() => jumpTo(title)}
            style={{
              color: isActive ? palette.accent : palette.muted,
            }}
          >
            <span
              className="app-nav-dot"
              style={{
                background: isActive ? palette.accent : "transparent",
                borderColor: isActive ? palette.accent : palette.muted,
              }}
            />
            <span className="app-nav-label">{title}</span>
          </button>
        );
      })}
    </nav>
  );
}

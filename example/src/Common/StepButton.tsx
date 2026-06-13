import type { ReactNode } from "react";

export function StepButton({
  side,
  onClick,
  children,
}: {
  side: "left" | "right";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-role="step"
      aria-label={side === "left" ? "Decrement" : "Increment"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: "#bbb",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
        padding: 0,
        zIndex: 2,
      }}
    >
      {children}
    </button>
  );
}

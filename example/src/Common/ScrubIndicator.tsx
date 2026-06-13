import type { IInputState } from "i-input";

/**
 * A small overlay icon shown on the right of an input while a scrub drag is
 * active. Render it from a IInput render-prop child:
 *
 *   <ThemedInput ...>
 *     {(state) => <ScrubIndicator state={state} direction="free" />}
 *   </ThemedInput>
 */
export function ScrubIndicator({
  state,
  direction = "free",
}: {
  state: IInputState;
  direction?: "x" | "y" | "free";
}) {
  if (!state.dragging) return null;
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        zIndex: 2,
        top: "50%",
        right: 6,
        transform: "translateY(-50%)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        color: "#5a8fc8",
      }}
    >
      <ScrubIcon direction={direction} />
    </span>
  );
}

function ScrubIcon({ direction }: { direction: "x" | "y" | "free" }) {
  if (direction === "free") {
    return (
      <svg
        width={12}
        height={12}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M8 2v12M8 2 6 4M8 2l2 2M8 14l-2-2M8 14l2-2" />
        <path d="M2 8h12M2 8l2-2M2 8l2 2M14 8l-2-2M14 8l-2 2" />
      </svg>
    );
  }
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={direction === "y" ? { transform: "rotate(90deg)" } : undefined}
      aria-hidden
    >
      <path d="M4 5.5 1.5 8 4 10.5" />
      <path d="M12 5.5 14.5 8 12 10.5" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" />
    </svg>
  );
}

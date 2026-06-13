import { useState } from "react";

const COMMANDS = {
  npm: "npm install i-input",
  yarn: "yarn add i-input",
} as const;

type Manager = keyof typeof COMMANDS;

export function InstallTabs() {
  const [manager, setManager] = useState<Manager>("npm");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(COMMANDS[manager]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="app-install">
      <div className="app-install-tabs">
        {(Object.keys(COMMANDS) as Manager[]).map((key) => (
          <button
            key={key}
            type="button"
            className={
              key === manager
                ? "app-install-tab app-install-tab-active"
                : "app-install-tab"
            }
            onClick={() => setManager(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="app-code">
        <code className="app-code-grid">
          {/* Every command shares one grid cell so the block sizes to the
              widest command and never jumps when switching tabs. */}
          {(Object.keys(COMMANDS) as Manager[]).map((key) => (
            <span
              key={key}
              className="app-code-line"
              aria-hidden={key !== manager}
              style={{ visibility: key === manager ? "visible" : "hidden" }}
            >
              <span className="app-code-prompt">$</span> {COMMANDS[key]}
            </span>
          ))}
        </code>
        <button
          type="button"
          className="app-code-copy"
          onClick={copy}
          aria-label="Copy install command"
          title="Copy"
        >
          {copied ? "Copied!" : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
    </svg>
  );
}

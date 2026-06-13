import { REPO_URL } from "./constants";
import { GitHubIcon } from "./GitHubIcon";

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-row">
        <span>
          <span className="app-title-i">i</span>
          <span className="app-title-dash">-</span>Input
        </span>
        <span className="app-footer-sep">·</span>
        <span>MIT Licensed</span>
        <span className="app-footer-sep">·</span>
        <a
          className="app-footer-link"
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={14} />
          GitHub
        </a>
      </div>
      <div className="app-footer-row app-footer-author">
        <span>
          Built by{" "}
          <a
            className="app-footer-link"
            href="https://farazzshaikh.com"
            target="_blank"
            rel="noreferrer"
          >
            Faraz Shaikh
          </a>
        </span>
        <span className="app-footer-sep">·</span>
        <a
          className="app-footer-link"
          href="https://github.com/Farazzshaikh"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={14} />
          Farazzshaikh
        </a>
        <span className="app-footer-sep">·</span>
        <a className="app-footer-link" href="mailto:farazzshaikh@gmail.com">
          farazzshaikh@gmail.com
        </a>
      </div>
    </footer>
  );
}

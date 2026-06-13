import { REPO_URL } from "./constants";
import { GitHubIcon } from "./GitHubIcon";

export function GitHubButton() {
  return (
    <a
      className="app-github-btn"
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
    >
      <GitHubIcon size={16} />
      View on GitHub
    </a>
  );
}

export const REPO_URL = "https://github.com/FarazzShaikh/i-input";

/** Build a link to a workspace file on the repo's main branch. */
export function repoFileUrl(path: string): string {
  return `${REPO_URL}/blob/main/${path}`;
}

/** Build a link to a workspace directory on the repo's main branch. */
export function repoDirUrl(path: string): string {
  return `${REPO_URL}/tree/main/${path}`;
}

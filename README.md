# i-input

A Blender-style universal number input for React — drag-to-scrub, expression
evaluation (`1m + 2cm`), and pluggable unit systems.

This is a [Yarn workspaces](https://yarnpkg.com/features/workspaces) monorepo.

## Packages

| Workspace | Path       | Description                          |
| --------- | ---------- | ------------------------------------ |
| `i-input` | `package/` | The publishable React library.       |
| `example` | `example/` | A Vite playground app for local dev. |

## Getting started

```sh
yarn install
```

## Scripts

Run from the repo root:

- `yarn build` — build the `i-input` library.
- `yarn dev` — start the example app's dev server.
- `yarn typecheck` — type-check every workspace.
- `yarn clean` — remove build artifacts in every workspace.

## License

MIT

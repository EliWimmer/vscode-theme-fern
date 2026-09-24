# Palette at the repo root, one port per app

`fern/` was a folder wrapped around the `vscode-theme-fern` git repo. The palette is the source of truth and each app is a port, so the VS Code extension stops being the root of the repo.

`fern/` is the repo root. The palette sits beside `ports/vscode` and `ports/ghostty`. The VS Code port keeps the extension, both workbenches, and the icon theme. Ghostty keeps a role map. The build writes the theme files, and those files stay uncommitted. The existing commits become the history of `fern/`. The GitHub repo stays `vscode-theme-fern` until a rename is worth doing.

Leaving the extension at the repo root was the other option. Its package metadata, icons, and release tooling would have stayed the front door of a multi-app repo.

See also: [Fern](../context/CONTEXT.md)

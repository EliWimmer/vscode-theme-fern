# Fern

Fern is a color palette and the ports of that palette.

`palette/roles.txt` is the only place a color value is written. A port assigns those roles to an app's slots. `node scripts/build.mjs` fills the hex values in.

- `ports/vscode` is the VS Code extension. `workbenches/` holds Fern and Fern Flat. The icon theme stays in this port.
- `ports/ghostty/fern` is the Ghostty role map.
- `ports/neovim/fern.json` maps roles to Neovim highlight groups and terminal colors.
- `ports/zed/fern.json` is the Zed role map.

The build writes the VS Code theme files locally and installs the Ghostty, Neovim, and Zed themes into the chezmoi source. Generated theme files are not committed in this repo.

See `docs/context/CONTEXT.md` for the language.

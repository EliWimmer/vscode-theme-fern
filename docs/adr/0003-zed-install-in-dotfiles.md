# Rendered Zed theme is committed in dotfiles

Zed loads themes from `~/.config/zed/themes`, and chezmoi applies that directory. The fern repo does not commit generated theme files, and a symlink to this checkout would dangle on a machine without the repo.

The fern build writes the rendered theme into the chezmoi source as `dot_config/zed/themes/fern.json` and sets the dark theme to Fern. That rendered file is committed in dotfiles. Color values are still authored only in the palette.

Publishing a Zed extension from this repo was the other option. Zed on this machine is configured from dotfiles, so the install belongs there.

See also: [Fern](../context/CONTEXT.md)

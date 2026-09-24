# Rendered Ghostty theme is committed in dotfiles

Ghostty's config is applied by chezmoi from the dotfiles repo. The fern repo does not commit generated theme files, and a symlink to this checkout would dangle on a machine without the repo.

The fern build writes the rendered theme into the chezmoi source as `themes/fern`, removes `fern-ghostty`, and sets `theme = fern`. That rendered file is committed in dotfiles. Color values are still authored only in the palette.

A symlink from chezmoi to the fern build output was the other option. Apply has to work without that checkout.

See also: [Fern](../context/CONTEXT.md)

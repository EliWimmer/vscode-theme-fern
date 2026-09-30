# Fern

Fern is a color palette and the ports of that palette into apps.

## Language

**Palette**:
The named colors that define Fern. The only place a color value is written.
_Avoid_: Theme, scheme, color set

**Role**:
A named color in the Palette.
_Avoid_: Hex, token, slot

**Port**:
An app's assignment of Roles to that app's slots, and the theme file produced from that assignment.
_Avoid_: Theme, export, target

**Variant**:
A shipped reading of the Palette that changes which colors fill the same roles.
_Avoid_: Flavor, style, contrast mode, theme

**Fern**:
The reference workbench of the VS Code port. Layered chrome, editor on the hard background.
_Avoid_: Fern Hard, Fern Hard (WIP), Fern Dark Medium, variant

**Fern Flat**:
The flat workbench of the VS Code port. Same palette reading as Fern. Chrome surfaces use the editor background.
_Avoid_: Fern Hard Flat, variant, soft

**Workbench**:
A presentation of the VS Code port. The palette reading stays the same across workbenches.
_Avoid_: Variant, flavor, contrast

**Sel**:
The role for selection, hover, and widget borders.

**Float**:
The role for floating surfaces, and for text on a badge.

**Gutter**:
The role for line numbers.

**Edge**:
The role for the scrollbar and the peek highlight.

**Faint**:
The role for punctuation, code lens, and terminal white.

**Mist**:
The role for the find ruler and the dim syntax slots that use it.

**Install**:
The rendered port placed where an app loads it.
_Avoid_: Config copy, theme file

## Relationships

- One **Palette** holds every **Role**. A **Port** refers to **Roles** and never to raw color values.
- A **Variant** would select different **Roles** for the same slots. None ship today.
- A **Port** renders **Fern** for one app
- The VS Code **Port** has two **Workbenches**: **Fern** and **Fern Flat**
- A **Port** for an app with a single background, such as a terminal, has no **Fern Flat**
- The Ghostty **Port** uses the reference workbench's terminal roles. `purple1` is not a role.
- The Neovim **Port** maps **Roles** to highlight groups and terminal ANSI colors.
- The Zed **Port** assigns **Roles** from **Fern**. It has no **Fern Flat**.
- An **Install** is produced from a **Port**. Color values are not authored there.

## Example dialogue

> **Dev:** "Should Ghostty ship Fern and Fern Flat?"
> **Domain expert:** "No. **Fern Flat** is a **Workbench**. Ghostty has one background, so it gets one **Port** of **Fern**."

## Flagged ambiguities

- "Theme" was used for the **Palette**, a **Port**, and a **Variant**. Resolved: those are three separate things.
- "Fern Hard (WIP)" and "Fern Dark Medium" named the reference file. Resolved: that reading is **Fern**.
- "Hard" and "soft" named a contrast axis. Resolved: those names are gone.
- "Fern Flat" was proposed as a second **Variant**. Resolved: it is a **Workbench**. Syntax colors match **Fern**. Chrome surfaces that used the old editor background move onto Fern's editor background.
- The file icon set was treated as part of Fern. Resolved: it belongs to the VS Code **Port** only. Other ports do not receive it.
- `colors.txt` and the reference workbench named different sets of colors. Resolved: the reference workbench decides which **Roles** exist. Their values are written only in the **Palette**.
- Ten hexes in the reference workbench had no name. Resolved: notebook cell and dropdown use `bg0-h`, ignored git files use `gray`, the active tab border uses `blue1`. The other six are **Sel**, **Float**, **Gutter**, **Edge**, **Faint**, and **Mist**. `bg0-s` and `fg5` are not roles.
- `purple1` was unused by the reference workbench, while the Ghostty file used it for magenta. Resolved: the Ghostty **Port** uses the workbench's terminal roles. Both magentas are `purple2`. `purple1` is not a role.
- The Ghostty file in dotfiles could be hand-edited. Resolved: it is an **Install**, written by the build. The **Palette** stays the only place a color value is authored.
- Zed calls the loaded file a theme. Resolved: that file is an **Install** of the Zed **Port**.

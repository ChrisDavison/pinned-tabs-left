# Pinned Tabs Left

Keeps pinned tabs at the left of every tab group, the way browsers do, so new tabs always open after them.

## Why

Obsidian lets you pin a tab, but it does not move it. A pinned tab stays wherever it was, so after a while your pinned notes end up scattered between ordinary tabs. New tabs and links can also open between pinned tabs, and dragging or restoring a workspace can shuffle them further.

This plugin keeps each tab group in a predictable order: pinned tabs first, in the order you pinned them, then everything else.

## What it does

- When you pin a tab, it moves to the end of the pinned tabs at the left.
- When you unpin a tab, it moves to just after the remaining pinned tabs.
- Whenever the layout or active tab changes (a new tab opens, a tab is dragged, a workspace loads), each tab group is re-sorted so pinned tabs stay at the left.
- The relative order of pinned tabs, and of unpinned tabs, is preserved. The active tab stays active.
- It works in every tab group, including split panes, sidebars, and pop-out windows.

There are no settings or commands. Enable it and pin tabs as usual: right-click a tab and choose **Pin**.

## How it compares with other plugins

Several plugins in the community directory deal with pinned tabs. Most change how pinned tabs look rather than where they sit.

| Plugin | What it does |
| --- | --- |
| [Shrink pinned tabs](https://github.com/nicosomb/obsidian-shrink-pinned-tabs) | Makes pinned tabs compact, with optional note icons and colours. Does not reorder tabs. |
| [Pinned Tabs Customizer](https://github.com/diegomarzaa/obsidian-pinned-tabs-customizer) | Resizes pinned tabs and assigns icons by file name, folder, pattern, or tag. Does not reorder tabs. |
| [Pinned Tabs Row](https://github.com/tnmyk/pinned-tabs-row) | Pure CSS: shows pinned tabs in a separate row above the tab bar, like VS Code. Tabs are not moved, so their underlying order is unchanged. Needs Obsidian 1.13. |
| [Pinned Tabs](https://github.com/nameiskyro/compact-pinned-tabs) (`compact-pinned-tabs`) | Chrome-style compact, icon-only pinned tabs with accidental-close protection and pin recovery. Its left grouping is visual only and does not change Obsidian's tab order. Desktop only. |
| [Pinned Tab Utils](https://github.com/narwhai/pinned-tab-utils) | Closest to this plugin: moves pinned tabs to the left of the tab bar and adds a command to reorder on demand. Desktop only. |

Pinned Tabs Left changes Obsidian's actual tab order, so the next and previous tab commands, numbered tab shortcuts, and saved workspaces all see pinned tabs first. It does nothing else: no styling, no settings, no commands. It leaves Obsidian to redraw the tab bar itself rather than moving tab elements by hand, and is not marked desktop-only. If you want compact or restyled pinned tabs, combine it with one of the visual plugins above.

## Install

### Community plugins

Open **Settings → Community plugins → Browse**, search for **Pinned Tabs Left**, then install and enable it.

### BRAT

Until the plugin is listed in the directory, install it with [BRAT](https://github.com/TfTHacker/obsidian42-brat): choose **Add beta plugin** and enter `ChrisDavison/pinned-tabs-left`.

### Manual

Download `main.js` and `manifest.json` from the [latest release](https://github.com/ChrisDavison/pinned-tabs-left/releases/latest) into `<vault>/.obsidian/plugins/pinned-tabs-left/`, then enable the plugin under **Settings → Community plugins**.

## Limitations

Obsidian has no public API for reordering tabs, so this plugin relies on undocumented internals of the workspace's tab groups. It checks that those internals exist before using them, so if a future Obsidian release changes them the plugin stops reordering rather than breaking anything, but it may need an update to work again.

To catch pinning changes immediately, it wraps Obsidian's `setPinned` method using [monkey-around](https://github.com/pjeby/monkey-around), which cooperates with other plugins that wrap the same method and is removed cleanly when the plugin is disabled.

## Development

```sh
npm install
npm run build   # bundles src/main.js into main.js
npm run dev     # rebuilds on change
```

Copy `main.js` and `manifest.json` into a vault's `.obsidian/plugins/pinned-tabs-left/` folder to try a local build. `main.js` is committed because it is the release asset.

## Licence

[MIT](LICENSE)

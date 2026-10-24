// Keeps pinned tabs at the left of every tab group.
//
// Obsidian has no public API for reordering tabs, so this relies on internals
// of WorkspaceTabs (children, currentTab, updateTabDisplay) and on
// WorkspaceLeaf.setPinned. Every internal is checked before use: if a future
// Obsidian release changes them, the plugin does nothing instead of throwing.
const { Plugin, WorkspaceLeaf } = require("obsidian");
const { around } = require("monkey-around");

function isTabGroup(group) {
  return (
    !!group &&
    Array.isArray(group.children) &&
    typeof group.currentTab === "number" &&
    typeof group.updateTabDisplay === "function"
  );
}

module.exports = class PinnedTabsLeftPlugin extends Plugin {
  onload() {
    this.frame = null;
    this.register(() => {
      if (this.frame !== null) window.cancelAnimationFrame(this.frame);
    });

    this.app.workspace.onLayoutReady(() => {
      const schedule = () => this.scheduleSort();
      this.registerEvent(this.app.workspace.on("layout-change", schedule));
      this.registerEvent(this.app.workspace.on("active-leaf-change", schedule));
      this.patchPinning();
      this.sortAll();
    });
  }

  // Pinning or unpinning does not always fire layout-change, so wrap setPinned.
  // monkey-around composes with other plugins that wrap the same method and
  // unpatches cleanly when this plugin unloads.
  patchPinning() {
    const proto = WorkspaceLeaf && WorkspaceLeaf.prototype;
    if (!proto || typeof proto.setPinned !== "function") return;
    const plugin = this;
    this.register(
      around(proto, {
        setPinned(next) {
          return function (...args) {
            const result = next.apply(this, args);
            plugin.scheduleSort();
            return result;
          };
        },
      })
    );
  }

  scheduleSort() {
    if (this.frame !== null) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null;
      this.sortAll();
    });
  }

  sortAll() {
    const groups = new Set();
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (isTabGroup(leaf.parent)) groups.add(leaf.parent);
    });
    let changed = false;
    groups.forEach((group) => {
      if (this.sortGroup(group)) changed = true;
    });
    if (changed) this.app.workspace.requestSaveLayout();
  }

  // Moves pinned tabs to the front, keeping the relative order of pinned and
  // unpinned tabs. Returns true if the group was reordered.
  sortGroup(group) {
    const children = group.children;
    if (!children.every((c) => c && typeof c.pinned === "boolean")) return false;
    const pinned = children.filter((c) => c.pinned);
    if (pinned.length === 0) return false;
    const sorted = pinned.concat(children.filter((c) => !c.pinned));
    if (sorted.every((c, i) => c === children[i])) return false;

    const current = children[group.currentTab];
    children.splice(0, children.length, ...sorted);
    group.currentTab = Math.max(0, children.indexOf(current));
    group.updateTabDisplay();
    return true;
  }
};

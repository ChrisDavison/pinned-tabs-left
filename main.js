// Keeps pinned tabs at the left of every tab group. Relies on Obsidian's
// internal WorkspaceTabs API (children, currentTab, updateTabDisplay).
const { Plugin } = require("obsidian");

module.exports = class PinnedTabsLeftPlugin extends Plugin {
  onload() {
    const schedule = () => this.scheduleSort();
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(this.app.workspace.on("layout-change", schedule));
      this.registerEvent(this.app.workspace.on("active-leaf-change", schedule));
      this.patchPinning();
      this.sortAll();
    });
  }

  onunload() {
    if (this.unpatch) this.unpatch();
  }

  // Pinning or unpinning does not always fire layout-change, so wrap setPinned.
  patchPinning() {
    const leaf = this.app.workspace.getLeaf(false);
    const proto = leaf && Object.getPrototypeOf(leaf);
    if (!proto || typeof proto.setPinned !== "function") return;
    const original = proto.setPinned;
    const plugin = this;
    proto.setPinned = function (...args) {
      const result = original.apply(this, args);
      plugin.scheduleSort();
      return result;
    };
    this.unpatch = () => { proto.setPinned = original; };
  }

  scheduleSort() {
    if (this.pending) return;
    this.pending = true;
    window.requestAnimationFrame(() => {
      this.pending = false;
      this.sortAll();
    });
  }

  sortAll() {
    const groups = new Set();
    this.app.workspace.iterateAllLeaves((leaf) => {
      const parent = leaf.parent;
      if (parent && Array.isArray(parent.children) && typeof parent.updateTabDisplay === "function") {
        groups.add(parent);
      }
    });
    groups.forEach((group) => this.sortGroup(group));
  }

  sortGroup(group) {
    const children = group.children;
    const pinned = children.filter((c) => c.pinned);
    if (pinned.length === 0) return;
    const sorted = pinned.concat(children.filter((c) => !c.pinned));
    if (sorted.every((c, i) => c === children[i])) return;

    const current = children[group.currentTab];
    children.splice(0, children.length, ...sorted);
    group.currentTab = Math.max(0, children.indexOf(current));
    group.updateTabDisplay();
    this.app.workspace.requestSaveLayout();
  }
};

# Easy Account List Context

- Choose `query.basic` for up to six independent query fields; `query.advanced` remains shadow until a golden case proves expansion and dependent filters.
- Use a `12px` outer content inset and two white sibling modules: query conditions and result table. Each module has `16px` inner padding, an `8px` radius and a stable `16px` gap.
- Query actions are right-aligned at `8px` gaps in the final grid column: reset, query, then expand/collapse. The expand/collapse label precedes its icon, which is the rightmost control; its left padding is `8px` and right padding is `0`.
- When one result set has explicit business categories, render Ant Design Tabs in place of the list title. Switching tabs preserves entered filters and returns pagination to page 1.
- Table states must cover loading, empty, error and permission-denied. Amount cells include currency. Every status cell uses an Ant Design Tag with explicit text and a semantic color; never render a Badge, standalone dot or color-only status.
- Column settings is an icon-only tool with a visible accessible label. Confirmed row actions must explain the affected account and resulting state.
- `list.modalCreate` may add a compact create Modal when it preserves the list context; `detail.drawer` may open read-only account details when the displayed information has a clear boundary.

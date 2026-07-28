# Template 01 Extraction - Framework Shell

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=76-11037&m=dev

Figma node: `76:11037`

Figma name: `框架层`

Status: extracted as locked shell baseline

## Canonical HTML Baseline

The canonical visual and interaction baseline for the Boss Ledger framework shell is:

`modules/boss-ledger/shell/`

The template includes the complete framework layer:

1. Top information bar
2. Primary navigation
3. Left secondary / tertiary navigation
4. Collapsed sider state and collapse control
5. Multi-tab strip and tab interactions
6. Business content viewport and scroll boundary
7. Platform footer inside the content scroll flow

Historical page previews are visual QA references only. Query panels, summaries, tables, pagination, drawers, fields, records, and business copy are not part of the framework shell.

New Boss Ledger outputs must preserve the baseline shell structure, class responsibilities, dimensions, visual states, and Ant Design component choices. Do not copy the baseline business content into unrelated pages.

## Frozen Shell Boundary

The following framework responsibilities are frozen and must not be redesigned per generation:

- DOM region order: topbar, primary navigation, shell, sider, workspace, multi-tabs, content viewport.
- Topbar, primary navigation, sider, collapsed sider, tabs, workspace, and content viewport dimensions and spacing.
- Boss Ledger logo placement and canonical logo asset.
- Ant Design `Menu` as the secondary / tertiary navigation runtime.
- Ant Design `Tabs` with `type="editable-card"` and `hideAdd` for the multi-tab runtime.
- Active, hover, selected, collapsed, overflow, and scroll behavior.
- Content scrolling below Tabs; navigation and Tabs remain outside the business-content scroll.
- Validation markers: `data-boss-shell`, `data-boss-sider-collapse`, and `data-boss-tab-static-icon`.
- Platform footer structure, copy fallback, height, zero margin, and placement after the business content body.

Generated preview pages must run `scripts/scaffold-boss-ledger-preview.mjs` and use the copied canonical Shell assets. Only `preview-app.js` and `business.css` are editable. Production projects may use an equivalent shared Shell component, but must preserve the same structure and tokens.

## Dynamic Shell Configuration

The framework is fixed, but its information and routing are configuration-driven. Every generation may replace:

- Topbar identity and login metadata.
- Primary navigation labels, keys, order, route targets, and active key.
- Secondary / tertiary menu labels, keys, hierarchy, route targets, open keys, and selected key.
- Tab labels, keys, route targets, closable state, order, and active key.
- Route-to-business-content mapping.

Changing these values must not change the shell component hierarchy or CSS contract. Navigation depth remains limited to primary navigation plus secondary / tertiary Menu levels.

Recommended configuration shape:

```js
{
  topbar: { left: "...", right: "..." },
  primaryNav: [{ key, label, route }],
  sideMenusByPrimary: { [primaryKey]: [{ key, label, route, children }] },
  tabs: [{ key, label, route, closable }],
  activePrimaryKey,
  selectedMenuKey,
  openMenuKeys,
  activeTabKey
}
```

## Multi-Tab Contract

Multi-tabs are part of the framework shell, not business content.

- Use Ant Design `Tabs` with the baseline editable-card appearance; do not handwrite tab buttons.
- Only the active tab label renders the static `ReloadOutlined` icon and `data-boss-tab-static-icon` marker.
- Inactive tabs do not render a left icon.
- Clicking a menu route activates an existing matching tab or opens a new tab from route configuration.
- Clicking a tab changes the active route and business content.
- Closing the active tab activates an adjacent available tab; the platform must not enter a no-active-tab state.
- A route without implemented business content still activates normally and renders Ant Design `Empty` inside the full-height white `.boss-shell-empty` business module, vertically and horizontally centered in the available content viewport. A bare `Empty` on the gray workspace is forbidden.
- Tab copy and routes are dynamic; tab height, shape, spacing, colors, overflow treatment, icon rule, and interaction model are frozen.

## Canvas

- Frame size: `1440 x 778`
- Page background: `#F4F4F4`
- Source variables found:
  - `Neutral / 11`: `#1F1F1F`
  - `主色`: `#F36046`

## Layer Measurements

| Region | Node | X | Y | Width | Height | Notes |
|---|---:|---:|---:|---:|---:|---|
| Top info bar | `76:11041` | 0 | 0 | 1440 | 28 | dark bar |
| Primary nav | `76:11070` | 0 | 28 | 1440 | 64 | white top nav |
| Left sider | `76:11060` | 0 | 92 | 208 | 686 | white menu |
| Collapse control | `76:11069` | 0 | 730 | 208 | 48 | bottom of sider |
| Multi-tab bar | `76:11080` | 224 | 96 | 542 | 44 | starts 16px right of sider |
| Content group | `76:11085` | 224 | 140 | 1200 | 619 | starts immediately after tabs |
| First module | `76:11086` | 224 | 140 | 1200 | 160 | white rounded module |
| Second module | `76:11120` | 224 | 316 | 1200 | 443 | 16px gap below first module |

## Fixed Navigation Content In This Example

Top info bar:

- Last login time
- Last login IP
- Reserved information status
- Merchant identity text
- Two right-side icons

Primary nav:

- Logo at `x=48`, `y=14`, `112 x 36`
- Top navigation items aligned to the right:
  - 首页
  - 数据报表
  - 帐号管理
  - 资金管理, selected
  - 终端服务
  - 对账管理

Left sider:

- Second-level collapsed default item: 资金管理
- Second-level selected expanded item: 银行清分
- Third-level items:
  - 账户及绑卡管理
  - 银行分账管理
  - 银行提现管理, selected

Multi-tabs:

- Inactive tabs:
  - 数据报表
  - 我的账号
  - 操作员管理
- Active tab:
  - 银行提现管理
- Active tab is `180 x 44`
- Inactive tab examples are `116 x 44` and `130 x 44`

## Shell Contract Extracted From This Node

- Top info bar height is exactly `28px`.
- Primary nav begins at `y=28` and height is exactly `64px`.
- Sider begins at `y=92`, width is exactly `208px`.
- Content x origin is `224px`, which equals `208px sider + 16px gutter`.
- Content max working width in this frame is `1200px`.
- Right page gutter is `16px`, because `224 + 1200 + 16 = 1440`.
- Multi-tab bar begins at `y=96`, `4px` below the primary nav bottom.
- Content modules begin at `y=140`, exactly after the `44px` multi-tab height.
- Content modules use white backgrounds and `8px` radius.
- Stacked content modules use `16px` vertical gap.

## What This Node Is Not

This node is not a business-specific page template. It is the locked shell baseline that all business templates must inherit.


## Mandatory Generation Contract

- This template is not a reference example; it is the mandatory generation skeleton for its corresponding Boss Ledger page type.
- When generating this class of Boss Ledger page, the AI must reuse this template structure.
- Business requirements may replace business content only; they must not redesign the template skeleton.
- If a business requirement conflicts with this template, the currently selected template and `modules/boss-ledger/design.md` take priority.

## Replacement Rules

Allowed replacement:

- Page / Tab copy
- Primary navigation / left menu copy
- Query fields
- Table columns
- Status enums
- Action buttons
- Form fields
- Detail fields
- Statistic metrics
- Chart data
- Mock data

Forbidden replacement:

- Shell structure
- Top info bar height
- Primary navigation height
- Left navigation width
- Tabs shape
- Content area origin
- Module spacing
- Query area layout
- Table area layout
- Pagination position
- Modal / Drawer / Steps / Result / Empty base structure

## Ant Design Runtime Rules

- Must use real Ant Design components or project wrappers based on Ant Design.
- Must not use native `input`, `select`, `table`, or `button` as substitutes.
- Must not handwrite Menu, Tabs, Pagination, Modal, Drawer, or Table.
- Icons must use Ant Design Icons.
- Charts must use Ant Design Charts or a project chart wrapper.
- All default copy must be localized to Chinese. The preview must not contain `Start date`, `End date`, `OK`, `Cancel`, `No data`, or `items/page`.

# HTML Preview: {{change_title}}

## Purpose

本模板用于生成 `changes/{{change_id}}/preview.html`。

`preview.html` 是页面设计或页面实现任务的快速预览文件，用于让用户在浏览器中查看当前页面效果。

即使用户要求“不用写代码”或“不要写代码”，也必须生成 `preview.html`。这里的 HTML 是产品 / 设计评审预览产物，不是正式生产前端代码。页面类任务生成视觉预览；非页面任务生成可读 HTML 摘要页。

---

## Output File

```text
changes/{{change_id}}/preview.html
```

---

## Required Inputs

- Change title: `{{change_title}}`
- Original request: `{{user_request}}`
- Selected theme: `{{theme}}`
- Theme source: `{{theme_source}}`
- Page template: `{{page_type}}`
- Page design source: `changes/{{change_id}}/page-design.md`
- Common specs:
  - `specs/theme-routing.md`
  - `specs/template-routing.md`
  - `specs/design-system.md`
  - `specs/page-templates.md`
  - `specs/components.md`
  - `specs/frontend.md`

---

## HTML Structure

`preview.html` should include:

1. HTML document shell
2. Metadata and page title
3. Required CSS and runtime dependencies
4. Root container
5. Preview page implementation
6. Mock data
7. Basic interactions

---

## Dependency Rules

- Prefer official component libraries defined by `specs/components.md`.
- For Ant Design previews, use React, ReactDOM, Ant Design, Ant Design Icons, and dayjs when needed.
- Dependencies may come from local `vendor/` files or stable CDN links.
- Do not handwrite fake controls when the selected component library provides the component.
- Do not mix multiple incompatible component libraries in one preview.

---

## Theme Rules

- `preview.html` must apply the selected theme from `{{theme_source}}`.
- Boss Ledger pages must follow `specs/themes/boss-ledger.md`.
- YOP / YeePay Open Platform pages must follow `specs/themes/yeepay-开放平台-DESIGN.md`.
- Page generation must choose exactly one theme according to `specs/theme-routing.md`.
- Boss Ledger pages must not read or mix `specs/themes/yeepay-开放平台-DESIGN.md`.
- Common page and component rules come from:
  - `specs/design-system.md`
  - `specs/page-templates.md`
  - `specs/components.md`

### Boss Ledger Hard Contract

When `{{theme}}` is Boss Ledger, `specs/themes/boss-ledger.md` is the highest-priority source of truth.

Boss Ledger previews must:

- Re-read the current `specs/themes/boss-ledger.md` before generation and apply the latest rules in that file, not an older change package or prior conversation memory.
- Use `templates/boss-ledger-shell/` as the sole reusable framework-shell implementation and visual/interaction baseline. Reuse its topbar, primary navigation, Ant Design Menu sider, collapse control, multi-tabs, workspace, and content viewport; do not select a historical change package as the shell source.
- Treat primary / secondary / tertiary navigation labels and routes, selected/open menu keys, tab labels and routes, and route-to-content mappings as dynamic configuration. These values may change without changing the framework component hierarchy or CSS contract.
- Treat multi-tabs as framework UI. Preserve their Ant Design editable-card implementation, size, appearance, active-only ReloadOutlined rule, switching, closing, and overflow behavior; replace only their configured data and routes.
- Do not copy settlement-specific query fields, summary, table, pagination, drawer, records, or copy from the framework baseline into unrelated business content.
- Use exactly one main page template according to `specs/template-routing.md` and read the required `specs/themes/boss-ledger-extractions/template-xx-*.md` files.
- Reuse the latest validated Boss Ledger shell and Ant Design implementation pattern.
- Use React, Ant Design, Ant Design Icons, dayjs, and `ConfigProvider` with Boss Ledger tokens.
- Use Ant Design `Menu`, `Tabs`, `Form`, `Input`, `Select`, `DatePicker`, `Button`, `Table`, `Pagination`, `Dropdown`, `Modal`, `Drawer`, `Descriptions`, `Empty`, and `message` where applicable.
- Always render the left secondary / tertiary navigation with Ant Design `Menu` or a project wrapper based on Ant Design Menu. This is mandatory even for one-item menus, empty/result pages, collapsed siders, and static previews.
- Ant Design Menu submenu expand/collapse must be genuinely interactive. If using controlled `openKeys`, wire `onOpenChange` and update state; do not hard-code `openKeys` so the official submenu arrow cannot toggle.
- Keep the bottom-left sider collapse / expand icon left-aligned in both expanded and collapsed states, and mark the control with `data-boss-sider-collapse`.
- Render `ReloadOutlined` as the static left refresh icon only on the active tab label and mark that icon with `data-boss-tab-static-icon`; inactive tabs must not display a left icon. All tabs must be clickable. Tabs without implemented data must activate and show an Ant Design `Empty` state vertically centered in the content area.
- Use the canonical Boss Ledger logo from `specs/boss logo.svg`. New previews should reference `../../specs/boss logo.svg` when generated under `changes/{change-id}/`, or copy that exact file into page assets without modification. Never draw or generate a custom Boss Ledger logo.
- Render detail label-value sections with Ant Design `Descriptions` default non-bordered style. Do not use `Descriptions bordered`, table-like description lists, or custom grid/table layouts for drawer details, audit details, or configuration summaries.
- Render Ant Design `Steps` with a concise `description` on every step item for Boss Ledger Wizard pages; do not ship title-only steps.
- Render modals with official Ant Design `Modal` / `Modal.confirm` components. All Boss Ledger submit confirmations and second-confirmation interactions must use Ant Design `Modal.confirm`; never use a normal controlled `Modal`, `Popconfirm`, handwritten confirm shell, or custom dialog for these cases. `Modal.confirm` must preserve the official confirm DOM and interaction model, and `.ant-modal-body` must hard-code `padding: 24px !important` on all four sides. Every Boss Ledger preview that includes `Modal.confirm` must include `.ant-modal-confirm .ant-modal-body { padding: 24px !important; }`; normal Modal body rules and Ant Design injected styles must not override this Confirm padding. Boss Ledger previews must explicitly guarantee full-width `.ant-modal-header` bottom gray divider and full-width `.ant-modal-footer` top gray divider for normal non-confirm modals; `.ant-modal-content` must not keep horizontal padding that shortens those lines. Normal non-confirm `.ant-modal-body` must use `padding: 24px 24px 0`, so the body has top/left/right 24px and no bottom padding. Normal form modals should use `480-520px` width; confirmation modals remain `416px`. Modal/Drawer form labels must align within each form: mixed label lengths use one fixed label width based on the longest label, while equal-length labels may use content-adaptive width. Do not handwrite modal shells or replace Ant Design's official DOM, focus, mask, close, footer, and keyboard behavior.
- Keep Logo, top info bar, primary navigation, left navigation, Tabs, query panel, table panel, pagination, column setting, Modal, and Drawer behavior consistent with `boss-ledger.md`.
- Keep the platform footer inside the content scroll flow after business modules. The footer must declare `.footer { margin-top: 12px; }`, with that 12px as external spacing above the footer and not part of the footer's own `32px` height.
- Table column setting buttons must be icon-only `SettingOutlined` controls with no visible border line, outline stroke, or button shadow in normal, hover, focus, and active states.
- Table row operation columns may show at most two direct text actions. If more than two operations are available, render the first two high-frequency actions and move the rest into an Ant Design `Dropdown` named `更多`.
- Only replace business content: navigation labels, menu labels, tabs, filters, metrics, charts, table columns, mock data, and actions.
- Never handwrite native `input`, `select`, `table`, `button`, fake menus, fake tabs, fake pagination, fake modal, fake drawer, Unicode icons, emoji icons, or CSS/SVG mock charts as substitutes for Ant Design or platform components.
- Before final output, audit the preview against `boss-ledger.md` Mandatory Latest-Rule Execution Contract and Boss Ledger Self-Check, including current rules for module spacing, form placeholders, table operation weight, query-list statistics, query expand/collapse visibility, and data-dashboard white statistic modules.
- Stop and update the theme spec/template first if the requested page cannot be generated under the latest Boss Ledger rules.

### Boss Ledger Required Validation Markers

Boss Ledger previews should include stable validation markers so automated checks can verify layout without guessing:

- `data-boss-shell="topbar"` on the top info bar.
- `data-boss-shell="primary-nav"` on the first-level navigation.
- `data-boss-shell="sider"` on the left menu shell.
- `data-boss-shell="tabs"` on the Tabs area.
- `data-boss-shell="content"` on the business content area.
- `data-boss-sider-collapse` on the bottom-left sider collapse / expand icon control.
- `data-boss-tab-static-icon` on the active tab's static `ReloadOutlined` left icon.
- `data-boss-query-grid="3"` on query modules that use the three-column grid.
- `data-boss-query-actions` on the query action area. It must sit in the rightmost grid column.
- When a query form has exactly 6 query fields, `data-boss-query-actions` must be rendered as a separate 7th grid slot on a new row in the rightmost third column. Mark it with `data-boss-query-action-slot="7"` and declare `grid-column: 3` plus a new-row placement such as `grid-row: 3`; do not place action buttons inside the 6th field cell.
- `data-boss-table-module` on the table/result module.
- `data-boss-query-summary` on query-list statistics when present. It must be inside `data-boss-table-module`.

After generation, run:

```text
node scripts/validate-boss-ledger-preview.mjs changes/{{change_id}}/preview.html
```

If any output line is `failed`, fix the preview and rerun before delivery.

The script saves the Chrome regression screenshot as `changes/{{change_id}}/preview.screenshot.png` by default.

---

## Preview Scope

The preview should include enough UI to validate:

- Layout structure
- Navigation or page frame, when required by the theme
- Page title or Tabs area
- Query / filter area, when applicable
- Table / list / document content, when applicable
- Form, modal, drawer, or detail area, when applicable
- Empty, loading, error, and status examples when relevant
- Page actions and row actions

---

## Interaction Scope

The preview should support lightweight browser-side interactions when useful:

- Tab switching
- Query reset
- Expand / collapse filters
- Open / close modal
- Open / close drawer
- Column visibility setting
- Pagination display
- Button loading feedback
- Message or notification feedback

The preview does not need to connect to real backend APIs unless explicitly requested.

---

## Output Notes

In `review.md`, record:

- Whether `preview.html` was generated
- Which theme source was applied
- Which dependencies were used
- The exact `validate-boss-ledger-preview.mjs` status lines for Boss Ledger previews
- Any known preview limitations

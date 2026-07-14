---
name: yeepay-page-skill
description: Use when the user asks to generate, update, review, or implement Yeepay business platform pages. Automatically apply the Boss Ledger generation workflow for Boss Ledger, boss, 运营后台, 商户后台, 审核后台, 查询列表, 审核列表, 配置列表, 商户资料, 结算记录, 数据首页, Dashboard, 表单, Modal 表单, Drawer 表单, Full-page 表单, 详情, Drawer 详情, 步骤页, Wizard, Result, Empty State, and similar admin pages; do not require the user to repeat spec paths, template paths, or validation commands.
---

# Yeepay Page Skill

## Goal

Generate a Yeepay business platform page plan and frontend implementation from a one-sentence product requirement.

This skill defaults to Boss Ledger and can be extended to multiple Yeepay business platform themes.

The skill turns a short business request into:

- Product requirement analysis.
- Page information architecture and interaction design.
- Platform theme selection.
- Ant Design based component selection.
- React + TypeScript implementation guidance.
- Review checklist and quality self-check.
- A traceable change package under `changes/`.

## Required Workflow

1. Understand the user's one-sentence requirement.
2. Select exactly one target platform theme using `specs/theme-routing.md`.
3. Select exactly one main page template using `specs/template-routing.md`.
4. Read all relevant files under `specs/` before producing a plan or code.
5. Read both `specs/design-system.md` and the selected theme spec under `specs/themes/`.
6. Select and apply the appropriate output templates from `templates/`.
7. Create a new change directory under `changes/` for every request.
8. Store proposal, design, task breakdown, implementation notes, preview validation output, screenshot result, and review result in that change directory.
9. Move completed or superseded change directories to `archive/` only when explicitly asked.

## Boss Ledger Default Mandatory Flow

This flow is automatic. The user does not need to mention these files, template names, validation commands, or hard constraints in the prompt.

Trigger this flow whenever the user asks for any Boss Ledger or operational admin page, including but not limited to:

- Boss Ledger, boss, 运营后台, 商户后台, 审核后台
- 查询列表, 审核列表, 配置列表
- 商户资料, 结算记录, 财务记录, 对账记录, 交易记录, 退款记录
- 数据首页, Dashboard, 经营数据, 首页
- 表单, Modal 表单, Drawer 表单, Full-page 表单
- 详情, Drawer 详情
- 步骤页, Wizard, Result, Empty State

Mandatory automatic reading order:

1. Read `specs/theme-routing.md`.
2. Read `specs/template-routing.md`.
3. Read `specs/themes/boss-ledger.md`.
4. Read `specs/themes/boss-ledger-extractions/template-01-framework-shell.md` for every Boss Ledger page.
5. Read the selected Boss Ledger page template from `specs/themes/boss-ledger-extractions/` according to the page type.

Canonical framework baseline:

- Use `templates/boss-ledger-shell/` as the sole reusable Boss Ledger shell implementation and visual/interaction baseline.
- Treat topbar, primary navigation, left Menu, sider collapse control, multi-tabs, workspace, and content viewport as an immutable platform shell.
- Do not derive shell structure from any historical change package.
- Do not copy the baseline settlement query panel, table, pagination, drawer, or business copy into unrelated content templates.
- Primary / secondary / tertiary navigation data, routes, selected/open keys, tab data, and route-to-content mapping remain dynamic configuration.

Template selection map:

| User intent / page type | Required template files |
|---|---|
| 查询列表页, 审核列表, 配置列表, regular query list | `template-01-framework-shell.md` + `template-03-query-list-regular.md` |
| 轻量汇总查询列表, inline summary query list | `template-01-framework-shell.md` + `template-04-query-list-inline-summary.md` |
| 卡片汇总查询列表, card summary query list | `template-01-framework-shell.md` + `template-05-query-list-card-summary.md` |
| Dashboard, 数据首页, 首页 | `template-01-framework-shell.md` + `template-02-dashboard-home.md` |
| Modal 表单 | `template-01-framework-shell.md` + `template-06-modal-form.md` |
| Drawer 表单 | `template-01-framework-shell.md` + `template-07-drawer-form.md` |
| Full-page 表单 | `template-01-framework-shell.md` + `template-08-full-page-form.md` |
| Drawer 详情, 详情 | `template-01-framework-shell.md` + `template-09-drawer-detail.md` |
| Wizard, 步骤页, 分步流程 | `template-01-framework-shell.md` + `template-10-wizard.md` |
| Result, 结果页 | `template-01-framework-shell.md` + `template-11-result.md` |
| Empty State, 空状态页 | `template-01-framework-shell.md` + `template-12-empty-state.md` |

Boss Ledger generation hard limits:

- Do not redesign the page.
- Do not invent a new shell, layout, density, navigation, Tabs, query area, table area, pagination, Modal, Drawer, Wizard, Result, or Empty State structure.
- Do not regenerate or redesign the Boss Ledger framework shell as part of each page proposal. Reuse the canonical shell contract and document only the dynamic shell configuration for the current page.
- Multi-tabs belong to the fixed framework shell. Keep their component, structure, dimensions, appearance, overflow behavior, active icon rule, switching behavior, and close behavior unchanged; only tab data and routes may change.
- Left secondary navigation must always be rendered by Ant Design `Menu` or a project wrapper based on Ant Design Menu, regardless of page type, menu depth, data size, or collapsed state; it must remain collapsible and must never be replaced by handwritten `div` lists, custom tree controls, or static navigation blocks.
- Ant Design Menu submenu expand/collapse must use the official submenu behavior. If `openKeys` is controlled, wire `onOpenChange` and state updates; never hard-code `openKeys` so the official submenu arrow cannot toggle.
- The bottom-left sider collapse / expand control icon must always be left-aligned inside the sider, in both expanded and collapsed states; do not center it, right-align it, add text next to it, or move it into the content area.
- Multi-tab labels must show the `ReloadOutlined` static refresh icon only on the active tab; inactive tabs must not display a left icon. All tab labels must remain clickable. Clicking a tab without implemented data must activate that tab and show an Ant Design `Empty` state centered vertically in the content area.
- Table column setting entry must be an icon-only `SettingOutlined` button with no text, no visible border line, no outline stroke, and no button shadow in normal, hover, and focus states.
- Table row operation columns may show at most two text actions directly. When a row has more than two available operations, show the first two high-frequency actions and move all remaining actions into an Ant Design `Dropdown` entry named `更多`.
- Dashboard / homepage summary statistics must use the standard summary capability: one primary total metric is placed on the top row, and child metrics are placed below it in a grid of up to four columns and two rows. A single summary module may contain at most eight child metrics; when more child metrics are needed, split them into another module or ranking/list module instead of adding a third row.
- Boss Ledger logo must come from the canonical spec asset `specs/boss logo.svg`. New change packages and previews must reference or copy this spec logo asset; do not invent, redraw, regenerate, or freely design a custom Boss Ledger logo.
- Detail-style label-value information must use Ant Design `Descriptions` in its default non-bordered style. Do not use `Descriptions bordered`, table-shaped description lists, or custom table-like grids for details, audit info, configuration summaries, or drawer detail views.
- Boss Ledger Wizard / Steps pages must give every Ant Design `Steps` item a concise `description`; do not render title-only steps.
- Modal must use the official Ant Design `Modal` / `Modal.confirm` component structure, and Boss Ledger business rules must explicitly guarantee full-width gray dividers below the modal header and above the footer. All submit confirmations and all second-confirmation interactions must use Ant Design `Modal.confirm`; do not implement them with a normal controlled `Modal`, `Popconfirm`, handwritten confirm shell, or custom dialog. `Modal.confirm` must preserve the official confirm DOM and interaction model, and its `.ant-modal-body` must hard-code `padding: 24px !important` on all four sides. This Confirm padding is a hard rule: generated previews and production guidance must include `.ant-modal-confirm .ant-modal-body { padding: 24px !important; }`, and normal Modal body rules such as `padding: 24px 24px 0` must never override Confirm. For normal non-confirm modals, `.ant-modal-content` must not keep horizontal padding that shortens divider lines. The editable content area `.ant-modal-body` must use `padding: 24px 24px 0`: top/left/right are `24px`, bottom padding is `0` because the footer divider and footer actions own the lower spacing. Normal form modals should be constrained to `480-520px` width; confirmation modals remain `416px`. Modal and Drawer form labels must align per form: when labels in the same form have mixed visual widths, set one fixed label width based on the longest label; when all labels in the same form have the same visual width, content-adaptive label width is allowed. Keep the label-to-control gap at `8px`. Do not handwrite modal shells; use Ant Design Modal slots/classes, tokens, or project wrappers to enforce these rules while preserving official focus, mask, close, keyboard, and button behavior.
- Query forms with 6 or fewer fields must show all fields by default and must not render or reserve any expand/collapse entry. Render `icon + 展 开` / `icon + 收 起` only when the query form has more than 6 fields. Query action buttons are a separate query-grid display slot, not part of any query field. When a query form has exactly 6 fields, render all 6 fields as two complete rows of three fields, then place `重 置` / `查 询` as the 7th slot on a new row in the rightmost third column. Do not combine `重 置` / `查 询` with the 6th field in the same grid cell.
- Platform footer must remain inside the content scroll flow after the business modules, and it must have exactly `12px` top spacing before the footer text area. Generated Boss Ledger previews and production guidance must declare this as `.footer { margin-top: 12px; }`; this spacing is outside the footer's own `32px` height and must not be replaced by extra padding inside the table module or by fixed/sticky footer positioning.
- Only replace business fields, table columns, action buttons, status enums, form/detail fields, statistic metrics, chart data, and mock data.
- Keep all UI copy in Chinese unless the business name is intentionally English.
- Generate a standalone `preview.html` for page outputs.
- For Boss Ledger lightweight inline summary query lists, query statistics and the result-section title are mutually exclusive: when inline statistics are shown, do not render the `查询列表` heading; render the statistics in that same left-side toolbar position, aligned in the same row as the right-side operation buttons.
- After generating or modifying a Boss Ledger `preview.html`, run `node scripts/validate-boss-ledger-preview.mjs changes/{change-id}/preview.html`.
- Validation is a hard gate: if any required line fails, automatically fix the preview and rerun validation.
- Never deliver a Boss Ledger page with `failed`, `pass with notes`, or an unresolved validation issue.

## Command Routing Rules

When the user input starts with one of these commands, route to the matching execution mode.

- `/yeepay:prd` or `/yeepay prd`
  - Mode: Product Only
  - Output: `proposal.md`
  - Do not generate `preview.html`.
  - Do not generate production frontend code.

- `/yeepay:design` or `/yeepay design`
  - Mode: Design Only
  - Output: `proposal.md`, `page-design.md`, `preview.html`
  - Do not generate production frontend code.

- `/yeepay:full` or `/yeepay full`
  - Mode: Full Workflow
  - Output: `proposal.md`, `page-design.md`, `tasks.md`, `implementation.md`, `preview.html`, `review.md`
  - Do not modify production project source unless the user also explicitly asks to implement into a project.

- `/yeepay:code` or `/yeepay code`
  - Mode: Production Code Implementation
  - May modify React/TypeScript project source.
  - Must read the target project structure first.
  - Must use existing project conventions, routes, components, API patterns, and styling rules.
  - Must run available checks after implementation when feasible.

- `/yeepay:review` or `/yeepay review`
  - Mode: Review Only
  - Output: `review.md`, `preview.html` when a change package is involved.

- `/yeepay:spec` or `/yeepay spec`
  - Mode: Spec Update Only
  - Output: relevant files under `specs/`, `preview.html`.

- `/yeepay:archive` or `/yeepay archive`
  - Mode: Archive
  - Move completed or superseded change directories to `archive/` only when explicitly requested.

## Adaptive Execution Rules

Yeepay Page Skill supports adaptive execution.

Do not always force the full workflow. Select the minimum required outputs based on the user's request.

### Full Workflow

Use the full workflow when the user asks to generate a complete page from a requirement.

Output:

1. proposal.md
2. page-design.md
3. tasks.md
4. implementation.md
5. preview.html
6. review.md

### Product Only

Use this mode when the user asks for requirement analysis, PRD, product plan, or acceptance criteria only.

Output:

1. proposal.md

Do not generate production frontend code.

Important: Product Only mode is the only mode that does not generate `preview.html` by default. A user request such as "不用写代码", "不要写代码", "no code", or "do not implement frontend" still means "do not generate production frontend code"; it does not change the selected execution mode.

### Design Only

Use this mode when the user asks for page design, interaction design, field design, page structure, or design review only.

Output:

1. proposal.md
2. page-design.md
3. preview.html

Do not generate frontend code unless explicitly requested.

### Implementation Only

Use this mode when the user already provides clear product and design requirements and asks for code implementation only.

Output:

1. implementation.md
2. preview.html
3. review.md

Use the provided requirement and design context. If critical information is missing, list assumptions.

### Review Only

Use this mode when the user asks to check, review, audit, or validate an existing page or change.

Output:

1. review.md
2. preview.html

### Template Only

Use this mode when the user asks to create or update templates.

Output:

1. The requested template files
2. preview.html

### Spec Update Only

Use this mode when the user asks to update rules, design specs, page templates, component rules, frontend rules, or quality rules.

Output:

1. The relevant files under `specs/`
2. preview.html

### Skip Rules

A step may be skipped when:

- The user explicitly says they do not need it.
- The user only asks for one specific output.
- The required information is already provided.
- The request is a review or spec update task.
- The request is a small modification to an existing change.

When skipping a step, briefly state the skipped step and reason.

HTML preview exception:

- Product Only mode does not generate `preview.html` by default.
- Except Product Only mode, every Yeepay Page Skill request that creates or updates a change package must include `preview.html`.
- Page-related output should use `preview.html` as a visual page preview.
- Non-page output, such as review, spec update, template update, or skill rule update, should still include `preview.html` as a readable HTML summary of the generated artifact, rule change, or review result unless the selected mode is Product Only.
- "不用写代码", "不要写代码", "no code", and similar phrases mean "do not generate production frontend code"; they do not mean "skip HTML preview".
- Skip `preview.html` only when the user explicitly says not to output HTML.

## Theme Selection Rules

Select exactly one platform theme for every request. `specs/theme-routing.md` is the required routing contract.

- If the requirement includes Boss Ledger, boss, 运营后台, 商户后台, 审核后台, 查询列表, 审核列表, 配置列表, 商户资料, 结算记录, 数据首页, Dashboard, 表单, 详情, 步骤页, 风控审核, or similar operational admin keywords, use `specs/themes/boss-ledger.md`.
- If the requirement includes YOP, 开放平台, 开发者中心, API 文档, 产品文档中心, 接口详情, 错误码, 接入流程, SDK, 示例代码, or similar developer platform keywords, use `specs/themes/yeepay-开放平台-DESIGN.md`.
- If the user does not specify a platform, default to Boss Ledger and document this in `proposal.md` 的“合理假设”.
- Do not mix different platforms' primary colors, layout styles, or exclusive component rules.
- Page generation must always read both the common rules in `specs/design-system.md` and the selected theme rules under `specs/themes/`.
- Boss Ledger 页面只允许读取 `specs/themes/boss-ledger.md` 作为主题规范，不得读取或混用 `specs/themes/yeepay-开放平台-DESIGN.md`。

Theme reading requirements:

- 当需求属于 Boss Ledger、运营后台、商户后台、审核后台、查询列表、审核列表、配置列表、商户资料、结算记录、数据首页、Dashboard、表单、详情、步骤页、配置管理等场景时，必须读取 `specs/themes/boss-ledger.md`。
- 当需求属于 YOP、开放平台、开发者中心、API 文档、产品文档中心、接口详情、错误码、接入流程等场景时，读取 `specs/themes/yeepay-开放平台-DESIGN.md`。
- 如果用户未说明平台，默认使用 Boss Ledger，并在 `proposal.md` 的“合理假设”中说明。
- 页面生成时必须同时读取 `specs/design-system.md` 和对应的 `specs/themes/` 主题文件。

## Template Routing Rules

Select exactly one main page template for every page request. `specs/template-routing.md` is the required routing contract.

- Every Boss Ledger page must first read `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`.
- 查询列表页 / 审核列表 / 配置列表：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-03-query-list-regular.md`
- 轻量汇总查询列表：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-04-query-list-inline-summary.md`
- 卡片汇总查询列表：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-05-query-list-card-summary.md`
- Dashboard / 数据首页 / 首页：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-02-dashboard-home.md`
- Modal 表单：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-06-modal-form.md`
- Drawer 表单：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-07-drawer-form.md`
- Full-page 表单：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-08-full-page-form.md`
- Drawer 详情 / 详情：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-09-drawer-detail.md`
- Wizard / 步骤页 / 分步流程：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-10-wizard.md`
- Result / 结果页：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-11-result.md`
- Empty State / 空状态页：`specs/themes/boss-ledger-extractions/template-01-framework-shell.md` + `specs/themes/boss-ledger-extractions/template-12-empty-state.md`

Do not recreate or rewrite the existing `specs/themes/boss-ledger-extractions/template-01` to `template-12` files. They are the page template library.

## HTML Preview Output Rules

Yeepay Page Skill supports HTML preview output.

Except Product Only mode, every Yeepay Page Skill request that creates or updates a change package must generate a standalone HTML preview file.

Output path:

```text
changes/{change-id}/preview.html
```

Rules:

- Use `templates/html-preview.md` as the output contract for `preview.html`.
- Generate `preview.html` when the execution mode is Full Workflow, Design Only, or Implementation Only.
- Generate `preview.html` for every Yeepay Page Skill output that creates or updates a change package, except Product Only mode.
- For page-related output, `preview.html` must be a visual page preview.
- For non-page output, `preview.html` must be a readable HTML summary page for design, review, spec, or template content unless the selected mode is Product Only.
- If the user says "不用写代码", "不要写代码", "no code", or similar, still generate `preview.html` unless the selected mode is Product Only; only production frontend code is skipped.
- Skip `preview.html` only when the user explicitly says not to output HTML.
- `preview.html` must be a complete standalone HTML file that can be opened directly in a browser.
- `preview.html` is not production code. It is only for product, design, and frontend review.
- `preview.html` must apply the selected theme and must not mix another platform's visual rules.
- Boss Ledger previews must follow `specs/themes/boss-ledger.md`.
- YOP / YeePay Open Platform previews must follow `specs/themes/yeepay-开放平台-DESIGN.md`.
- Common page structure and component behavior must follow `specs/design-system.md`, `specs/page-templates.md`, and `specs/components.md`.
- Theme and template routing must follow `specs/theme-routing.md` and `specs/template-routing.md`.
- The preview must be generated according to the current theme source after Theme Selection Rules are applied.
- For Boss Ledger, `specs/themes/boss-ledger.md` is the highest-priority preview contract: `preview.html` must use React + Ant Design + Ant Design Icons real runtime components and the latest Boss Ledger shell rules, while still remaining directly openable in a browser through local `vendor/` files or approved CDN dependencies.
- The general lightweight HTML / JavaScript preview rule only applies to themes that do not define a stricter runtime contract.
- `preview.html` must not require production project build tools or a project dev server to open; this does not prohibit Boss Ledger previews from loading React and Ant Design browser runtime files.
- If `preview.html` is skipped, briefly state the skipped step and reason in the final output.

## Boss Ledger Preview Validation

After every Boss Ledger `preview.html` is generated or modified, run:

```text
node scripts/validate-boss-ledger-preview.mjs changes/{change-id}/preview.html
```

The script output is a hard gate and must be quoted or summarized in `review.md`.

Hard rules:

- If any validation line is `failed`, do not deliver the change.
- Automatically fix `preview.html` and rerun the script until all required lines pass.
- Do not describe a failed Boss Ledger preview as “基本可用”, “可接受”, or “Pass with Notes”.
- Screenshot regression is mandatory for Boss Ledger previews and is included in the validation script.
- The required review status lines are:
  - `validate: pass / failed`
  - `screenshot: pass / failed`
  - `charts: pass / failed`
  - `中文文案: pass / failed`

## Specs Reading Rules

Always treat `specs/` as the source of truth.

- Read `specs/product.md` for requirement analysis.
- Read `specs/theme-routing.md` before selecting a theme.
- Read `specs/template-routing.md` before selecting a page template, then read the current selected template file under `specs/themes/boss-ledger-extractions/`.
- Read `specs/design-system.md` for cross-platform visual, layout, interaction, and accessibility rules.
- Read the selected theme spec under `specs/themes/` for platform-specific design rules.
- Read `specs/page-templates.md` for page pattern selection.
- Read `specs/components.md` for Ant Design component rules.
- Read `specs/frontend.md` for React + TypeScript implementation rules.
- Read `specs/quality.md` before final review.

If specs conflict, prefer the selected theme rule over the common design-system rule, and prefer a more specific rule over a general rule. If a required rule is missing, document the assumption in the change output.

Boss Ledger conflict rule:

- For Boss Ledger requests, always apply `specs/themes/boss-ledger.md` as the latest hard constraint over all general skill, template, component, frontend, and change-package instructions.
- If `SKILL.md`, `templates/html-preview.md`, or common specs appear to allow a simpler generic preview, native HTML controls, self-drawn menus, or non-Ant Design components, ignore that allowance for Boss Ledger and follow `boss-ledger.md`.
- Before generating or modifying a Boss Ledger page, re-read the current `boss-ledger.md`; do not rely on an older change package or prior conversation snapshot.

## Template Rules

Use templates as structured output contracts.

- `templates/proposal.md` for product方案.
- `templates/page-design.md` for page design方案.
- `templates/tasks.md` for implementation task breakdown.
- `templates/implementation.md` for frontend implementation notes.
- `templates/html-preview.md` for browser preview HTML.
- `templates/review.md` for self-check and review results.

Do not remove required sections from a template. If a section does not apply, write `N/A` and explain why.

## Changes Rules

Each user requirement must create one directory under `changes/`.

Recommended naming:

```text
changes/YYYYMMDD-short-feature-name/
```

Each change directory should contain generated artifacts based on the selected execution mode. A full workflow change contains:

```text
proposal.md
page-design.md
tasks.md
implementation.md
preview.html
review.md
```

A Product Only change contains only:

```text
proposal.md
```

Keep change output specific to the current requirement. Do not mix unrelated product requests in one change directory.

## Archive Rules

`archive/` is reserved for completed, deprecated, or superseded changes.

- Keep `archive/` empty until an explicit archive action is requested.
- Do not archive active work.
- Do not delete archived content unless explicitly requested.
- Preserve original change directory names when moving items into `archive/`.

## Output Standard

Final output should include:

- The generated or updated change directory path.
- The selected platform theme and reason.
- A concise summary of product, design, and implementation decisions.
- Any assumptions or unresolved questions.
- The review result using `templates/review.md`.

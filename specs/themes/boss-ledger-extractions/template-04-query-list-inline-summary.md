# Template 04 Extraction - Query List Summary

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=74-5033&m=dev

Figma node: `74:5033`

Figma name: `Query List 查询列表/汇总`

Status: extracted as query-list summary template

## Content Structure

- Inherits Template 03 query module and table module geometry.
- Content frame: `x=224`, `y=140`, `w=1200`, `h=619`
- Query module: `w=1200`, `h=160`
- Result module: `y=176`, `w=1200`, `h=443`

## Summary Toolbar Variant

The result toolbar left side is a lightweight inline statistics area, not a card row.

This lightweight inline statistics area replaces the regular result title position. It must be in the same toolbar row as the right-side operation buttons.

Required structure:

- Label: 查询统计：
- Metric 1: 总金额, value example `920.00`, unit 元
- Vertical divider
- Metric 2: 总笔数, value example `240`
- Right toolbar actions remain available.
- The result title `查询列表` must not be rendered in this template. Lightweight inline summary and the result-section title are mutually exclusive; if the summary is present, the only left-side text in the result toolbar is the summary, and it uses the same position as the removed title.

## Template Intent

Use this template when the list needs a small aggregated summary that belongs to the table query result.

Do not use it when the summary needs large statistic cards; use Template 05 instead.


## Mandatory Generation Contract

- This template is not a reference example; it is the mandatory generation skeleton for its corresponding Boss Ledger page type.
- When generating this class of Boss Ledger page, the AI must reuse this template structure.
- Business requirements may replace business content only; they must not redesign the template skeleton.
- If a business requirement conflicts with this template, the currently selected template and `specs/themes/boss-ledger.md` take priority.

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

## Query List Mandatory Rules

- Query Module and Result Module must be two sibling white modules.
- Query Module and Result Module must not be wrapped inside one shared white shell.
- Query fields must use a three-column grid.
- Query action area must always sit in the rightmost column of the three-column grid and align right.
- Query action order is fixed: 展开 / 收起, 重 置, 查 询.
- Result Module must contain Toolbar, Ant Design Table, Pagination, and Column Setting.
- Result Module must not contain the `查询列表` title when lightweight inline statistics are rendered.
- Lightweight inline statistics and right toolbar actions must be rendered in the same Toolbar row; do not render statistics as a separate row above the toolbar actions.
- Pagination must stay inside Result Module and must not leave the table white module.
- Column Setting must use `SettingOutlined`.
- Operation column must be fixed on the rightmost side.
- Operation-column text buttons must not be bold.

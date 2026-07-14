# Template 05 Extraction - Query List Card Summary

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=15-4272&m=dev

Figma node: `15:4272`

Figma name: `Query List 查询列表/卡片汇总`

Status: extracted as query-list card-summary template

## Content Structure

- Inherits Template 03 query module geometry.
- Query module: `w=1200`, `h=160`
- Result module: `y=176`, `w=1200`, `h=416`

## Card Summary Region

- Stats region: `x=16`, `y=0`, `w=1168`, `h=111`
- Four statistic cards.
- Each card: `w=280`, `h=95`
- Card x positions: `0`, `296`, `592`, `888`
- Card y position: `16`
- Gap between cards: `16px`

## Table Region

- Table region starts at `x=16`, `y=111`, `w=1168`, `h=305`
- Toolbar height: `56px`
- Table height: `249px`
- Pagination area height: `64px`

## Template Intent

Use this template when the query result needs prominent summary cards before the table.


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
- If there are 6 or fewer query fields, show all fields by default and do not render, reserve, or display any expand/collapse entry, including `icon + 展 开`, `icon + 收 起`, text-only expand/collapse, arrows, or placeholder buttons. Expand/collapse is allowed and required only when there are more than 6 query fields.
- Result Module must contain Toolbar, Ant Design Table, Pagination, and Column Setting.
- Pagination must stay inside Result Module and must not leave the table white module.
- Column Setting must use `SettingOutlined`.
- Column Setting must be icon-only with no visible border line, outline stroke, or button shadow in normal, hover, focus, and active states.
- Operation column must be fixed on the rightmost side.
- Operation-column text buttons must not be bold.
- Operation column may show at most two direct text actions. When more than two row operations are available, show the first two high-frequency actions and move all remaining operations into an Ant Design Dropdown named `更多`.
- Use this card-summary template only when the number of statistic metrics is greater than 3.
- Statistic cards must stay inside Result Module and above Table.
- Statistic cards must not leave Result Module or become an independent module.

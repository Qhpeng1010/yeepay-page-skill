# Template 03 Extraction - Query List Regular

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=2-1512&m=dev

Figma node: `2:1512`

Figma name: `Query List 查询列表/常规`

Status: extracted as regular query-list template

## Content Structure

- Content frame: `x=224`, `y=140`, `w=1200`, `h=619`
- Query module: `w=1200`, `h=160`
- Result module: `y=176`, `w=1200`, `h=443`
- Module gap: `16px`

## Query Module

- Inner padding: `16px`
- Row 1: `x=16`, `y=16`, `w=1168`, `h=32`
- Main field width: `460px`
- Quick date group starts at `x=470`, width `288px`
- Quick date options: 今日, 昨日, 本周, 上周, 本月, 上月
- Row 2 block: `x=16`, `y=64`, `w=1168`, `h=80`
- Filter controls use Ant Form, Input, Select, DatePicker, or RangePicker.
- Action buttons are right-aligned in the second row: 重 置, 查 询.

## Result Module

- Toolbar: `x=16`, `y=0`, `w=1168`, `h=56`
- Toolbar title example: 提现记录
- Right toolbar group: `x=928`, `y=12`, `w=240`, `h=32`
- Toolbar actions: dropdown trigger, secondary button, column setting icon button.
- Table: `x=16`, `y=56`, `w=1168`, `h=387`
- Table columns area height: `323px`
- Pagination area height: `64px`
- Operation column is the rightmost column.

## Template Intent

Use this template for ordinary query-and-table pages with no summary statistics above the table.


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
- Query action area is an independent grid display slot, equivalent to a new condition slot. It must not be merged into the last query field cell.
- If there are exactly 6 query fields, render the 6 fields as two complete rows of three fields, then render the action area as the 7th slot on a new row in the rightmost third column.
- Query action order is fixed: 展开 / 收起, 重 置, 查 询.
- If there are 6 or fewer query fields, show all fields by default and do not render, reserve, or display any expand/collapse entry, including `icon + 展 开`, `icon + 收 起`, text-only expand/collapse, arrows, or placeholder buttons. Expand/collapse is allowed and required only when there are more than 6 query fields.
- Result Module must contain Toolbar, Ant Design Table, Pagination, and Column Setting.
- Pagination must stay inside Result Module and must not leave the table white module.
- Pagination must show the page-size changer by default, with Chinese page-size text such as `10 条/页` and `20 条/页`.
- Pagination page-size dropdown must not be clipped or covered by the table module, content scroller, or footer; avoid wrapping Pagination in `overflow: hidden`, and mount the dropdown to `document.body` or an equivalent top-level container when needed.
- Column Setting must use `SettingOutlined`.
- Column Setting must be icon-only with no visible border line, outline stroke, or button shadow in normal, hover, focus, and active states.
- Operation column must be fixed on the rightmost side.
- Operation-column text buttons must not be bold.
- Operation column may show at most two direct text actions. When more than two row operations are available, show the first two high-frequency actions and move all remaining operations into an Ant Design Dropdown named `更多`.
- Operation-column clickable text buttons must use Ant Design Table link-style hover: text color may change, but gray backgrounds, outlined backgrounds, block backgrounds, and button-like hover fills are forbidden.
- Operation-column clickable text buttons must use Boss Ledger primary color `#F36046`; do not render secondary row actions in gray unless the action is disabled or unavailable.

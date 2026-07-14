# Template 12 Extraction - Empty State

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=74-10828&m=dev

Figma node: `74:10828`

Figma name: `空状态`

Status: extracted as empty-state template

## Content Structure

- Uses locked shell and multi-tab bar.
- Sider sample includes two expanded second-level groups.
- Multi-tab width in sample: `498`
- Active tab width in sample: `136`
- Content frame: `x=224`, `y=140`, `w=1200`, `h=611`
- Empty module: `x=0`, `y=0`, `w=1200`, `h=573`

## Empty State Region

- Illustration: `x=428.7`, `y=166.19`, `w=342.59`, `h=199.62`
- Message: `x=432`, `y=389.81`, `w=336`, `h=17`
- Message example: 退出区域商户暂不支持修改结算账户信息，请联系运营
- Optional platform footer: `x=483.5`, `y=589`, `w=233`, `h=22`

## Template Intent

Use this template when a business operation is unavailable, no data exists, or the user lacks the prerequisite state.


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

# Template 11 Extraction - Result

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=2-3488&m=dev

Figma node: `2:3488`

Figma name: `Result 结果页`

Status: extracted as result feedback template

## Content Structure

- Uses locked shell and multi-tab bar.
- Multi-tab width in sample: `642`
- Active tab width in sample: `136`
- Content module: `x=224`, `y=140`, `w=1200`, `h=622`

## Result Region

- Result group: `x=256.83`, `y=100`, `w=686.33`, `h=324`
- Result component: `x=0`, `y=0`, `w=686.33`, `h=214`
- Detail summary strip: `x=0`, `y=254`, `w=686.33`, `h=70`
- Summary strip inner row: `x=40`, `y=24`, `w=606.33`, `h=22`
- Three summary details, evenly distributed.
- Summary strip uses a `6px` border radius.
- The primary result action is the leftmost button; secondary return actions follow it on the right.
- The result module must fill the complete available content area after Tabs and Footer are reserved; do not let the white module shrink to the content's intrinsic height.
- The Result component, summary strip, and actions form one vertical alignment group centered within that full-height module.
- The implementation must use a stable `min-height`/flex calculation based on the available workspace height, not rely only on `height: 100%`.

## Template Intent

Use this template after a submit, create, review, payment, transfer, or setup flow finishes.


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

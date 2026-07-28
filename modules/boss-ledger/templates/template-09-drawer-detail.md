# Template 09 Extraction - Drawer Detail

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=74-6471&m=dev

Figma node: `74:6471`

Figma name: `Detail 详情/基础`

Status: extracted as drawer detail template

## Drawer Structure

- Drawer: `x=632`, `y=0`, `w=808`, `h=778`
- Header: `h=56`
- Header title x: `24`
- Close icon x: `768`
- Body: `x=0`, `y=56`, `w=808`, `h=666`
- Footer: `x=0`, `y=722`, `w=808`, `h=56`
- Footer contains one right-aligned button.
- Drawer header keeps Ant Design's default height, padding, typography, and close-button sizing; only the title-left / close-icon-right distribution is customized. No status, Badge, auxiliary copy, or business action may appear in the header.
- Any business operation belongs in the Ant Design Drawer `footer` action area and must not be placed inside the detail body.
- Footer actions are always right-aligned.
- Detail body content must not add a second business-level inner padding layer; use the Drawer content area's default inset and set any detail wrapper to `padding: 0` unless a specific business requirement says otherwise.

## Detail Content

- Detail content frame: `x=24`, `y=24`, `w=760`, `h=540`
- Three detail sections in sample.
- Section width: `760`
- Section height: `158`
- Section y positions: `0`, `191`, `382`
- Divider y positions: `174`, `365`
- Detail grid columns:
  - Column x positions: `0`, `280`, `560`
  - Column width: `200`
- Status uses dot plus text.

## Template Intent

Use this template for read-only detail views opened from a table row.


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

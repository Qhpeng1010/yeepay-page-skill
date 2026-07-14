# Template 07 Extraction - Drawer Form

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=74-5631&m=dev

Figma node: `74:5631`

Figma name: `Drawer Form 抽屉编辑`

Status: extracted as drawer edit/create template

## Drawer Structure

- Drawer: `x=800`, `y=0`, `w=640`, `h=778`
- Header: `h=56`
- Title position: `x=24`
- Close icon position: `x=600`
- Body: `x=0`, `y=56`, `w=640`, `h=666`
- Footer: `x=0`, `y=722`, `w=640`, `h=56`
- Footer button group: `x=490`, `y=12`, `w=134`, `h=32`

## Form Structure

- Field block x: `24`
- Field block width: `592`
- Field block height: `60`
- Label is above the control.
- Control y offset: `28`
- Control height: `32`
- Four vertical fields in sample.
- Field y positions: `24`, `100`, `176`, `252`

## Template Intent

Use this template when a create/edit flow has more content than a small modal but does not need a full standalone page.


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

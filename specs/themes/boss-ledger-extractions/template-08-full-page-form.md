# Template 08 Extraction - Full Page Form

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=15-5134&m=dev

Figma node: `15:5134`

Figma name: `Form 新增编辑`

Status: extracted as full-page create/edit form template

## Content Structure

- Uses locked shell and multi-tab bar.
- Active tab width in sample: `136px`
- Section 1: `x=224`, `y=140`, `w=1200`, `h=290`
- Section 2: `x=224`, `y=446`, `w=1200`, `h=290`
- Section gap: `16px`
- Fixed bottom action bar: `x=209`, `y=730`, `w=1231`, `h=48`

## Section Structure

- Inner content: `x=24`, `y=20`, `w=1152`, `h=250`
- Section title at top.
- Form grid starts below section title.
- Three-column grid:
  - Column 1 width: about `373`
  - Column 2 width: about `374`
  - Column 3 width: about `373`
  - Column x positions: `0`, `389`, `779`
- Row y positions: `0`, `76`, `152`
- Control y offset inside item: `28`
- Control height: `32`

## Bottom Actions

- Fixed at the bottom of the viewport.
- Actions are right-aligned.
- Cancel button before primary submit button.

## Template Intent

Use this template for larger create/edit tasks that require grouped sections and a persistent save action.


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

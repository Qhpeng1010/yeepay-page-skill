# Template 06 Extraction - Modal Form

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=2-2116&m=dev

Figma node: `2:2116`

Figma name: `Modal Form 弹窗编辑`

Status: extracted as modal edit/create template

## Modal Structure

- Modal: `x=480`, `y=185`, `w=480`, `h=408`
- Header: `h=56`
- Title position: `x=24`, `y=16`
- Close icon position: `x=440`, `y=20`
- Content: `x=0`, `y=56`, `w=480`, `h=300`
- Footer: `x=0`, `y=356`, `w=480`, `h=52`
- Footer buttons are right-aligned: cancel then confirm.
- Use the official Ant Design Modal header, body, and footer structure.
- Header must have a full-width `1px solid #F0F0F0` bottom divider.
- Footer must have a full-width `1px solid #F0F0F0` top divider.
- `.ant-modal-content` must not keep horizontal padding that shortens header/footer divider lines.
- Modal body must use `padding: 24px 24px 0`: top/left/right 24px, bottom 0.
- Modal form uses horizontal layout with right-aligned labels. Use one fixed label width calculated from the longest label in the current form so all controls start on the same x position.
- Normal form modal width must stay between `480px` and `520px`.
- Modal form labels must align within the same form. If labels have mixed visual widths, use one fixed label width based on the longest label. If all labels have the same visual width, content-adaptive label width is allowed.
- Do not handwrite the modal shell or replace Ant Design's official focus, mask, close, footer, and keyboard behavior.

## Form Structure

- Form content x origin: `24`
- Usable width: `432`
- Label width in form rows: `87`
- Control x origin: `95`
- Control width: `337`
- Control height: `32`
- Total rows in sample: 6
- Editable field rows in sample: 4
- Field y positions: `100`, `148`, `196`, `244`

## Template Intent

Use this template for create/edit flows with 6 fields or fewer, especially simple bank-card information maintenance.


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
- Full-width modal header divider, full-width footer divider, `.ant-modal-body` `padding: 24px 24px 0`, horizontal right-aligned labels, per-form label width strategy, and normal form modal width `480-520px`

## Ant Design Runtime Rules

- Must use real Ant Design components or project wrappers based on Ant Design.
- Must not use native `input`, `select`, `table`, or `button` as substitutes.
- Must not handwrite Menu, Tabs, Pagination, Modal, Drawer, or Table.
- Icons must use Ant Design Icons.
- Charts must use Ant Design Charts or a project chart wrapper.
- All default copy must be localized to Chinese. The preview must not contain `Start date`, `End date`, `OK`, `Cancel`, `No data`, or `items/page`.

# Template 10 Extraction - Wizard

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=74-7372&m=dev

Figma node: `74:7372`

Figma name: `Wizard 步骤页`

Status: extracted as step-by-step wizard template

## Content Structure

- Uses locked shell and multi-tab bar.
- Active tab width in sample: `165px`
- Content group: `x=224`, `y=140`, `w=1200`, `h=574`
- Fixed bottom action bar: `x=209`, `y=730`, `w=1231`, `h=48`

## Steps Region

- Steps: `x=304`, `y=188`, `w=1040`, `h=54`
- Step item widths: `370`, `370`, `220`
- Use Ant Steps behavior with YEEPAY spacing.
- Every Ant Design Steps item must include a concise `description`.
- Step descriptions explain the step output or validation focus and must not repeat the title verbatim.
- Title-only Steps are forbidden in Boss Ledger Wizard pages.

## Form Region

- Form container: `x=304`, `y=290`, `w=1040`, `h=342`
- Left form area: `w=700`
- Right illustration area: `x=700`, `w=340`, `h=335`
- Common form layout is two columns.
- Field width: about `342`
- Column gap: `16px`
- Row y positions include `0`, `76`, `152`, `256`
- Supports helper text, tooltip labels, mixed input groups, select plus time controls.

## Template Intent

Use this template for multi-step configuration, onboarding, or rule setup flows.

## Bottom Action Bar Rules

- Wizard bottom actions must use a full-width fixed action bar within the right-side workspace.
- The bar starts at the workspace left edge after the Boss Ledger sider and spans to the viewport right edge.
- The bar must not render as a small floating button group or a narrow right-side patch.
- Buttons stay right-aligned inside the full-width bar.
- Required action order: `上一步`、`下一步`、`提 交`.
- When `提 交` is present, it is clickable by default. Clicking it should validate the relevant form data and then show the confirmation or validation feedback; do not disable it only because the current step is not the final step.
- Wizard submit confirmation must use Ant Design `Modal.confirm`; do not use a normal controlled `Modal`, `Popconfirm`, handwritten confirm shell, or custom dialog for submit confirmation.
- Sider collapsed state must update the action bar left offset so the bar still remains full-width in the workspace.


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

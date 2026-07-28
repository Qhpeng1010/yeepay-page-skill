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

## Wizard Content Header Boundary

- The active Boss Ledger Tab is the only page title. Do not add a second business title, eyebrow, H1/H2 title card, or combined module-name / flow-name header above the Steps region.
- Wizard content starts with the Ant Design `Steps` component. Do not render `wizard-header`, `wizard-page-title`, `boss-wizard-page-header`, or equivalent title wrappers before it.
- Do not place `返回列表`, `返回查询`, `退出新增`, or equivalent list-return actions in the top Wizard header. A return action belongs on the Result success page; leaving an unfinished flow must use a bottom secondary action with `Modal.confirm` when required.
- Do not reserve blank space for a removed header. The Steps region keeps the template's vertical centering and begins directly below the active Tab.

## Wizard Visual Hard Rules

- Wizard preview business content stays white and uses no decorative divider lines: confirmation summaries must not use gray blocks such as `#F6F6F6`, and the form / illustration split must not use `border-left`, vertical rules, or equivalent separators.
- Success pages must use Ant Design `Result status="success"` with its official default icon, title, subtitle, and `extra` actions. Do not pass a custom `icon`, override `.ant-result-icon`, or draw a replacement success graphic.
- The bottom action bar is `position: fixed`, exactly `48px` high, spans the full right-side workspace, and sits above the platform Footer. Do not implement it as a module-local `sticky` bar or an in-flow button row.
- The complete Wizard content group (Steps plus form / confirmation and illustration) is vertically centered within the remaining workspace after reserving Tabs, Footer, and the fixed action bar; centering only one inner panel is insufficient.
- The Steps region and the form / illustration region must share one alignment container: the same max width, the same left/right inset, and the same horizontal start/end edges. Do not give Steps and the content split independent widths that create visible misalignment.

## Form Region

- Form container: `x=304`, `y=290`, `w=1040`, `h=342`
- Left form area: `65%` of the wizard content group.
- Right illustration area: `35%` of the wizard content group; the default illustration itself uses at least `70%` of the right illustration area's width and stays centered above its copy.
- Wizard content split: left form / confirmation region 65%, right illustration and copy region 35%; do not implement a literal 65% + 45% grid that overflows the workspace.
- Right illustration uses the canonical Boss Ledger asset from `modules/boss-ledger/haipeng_A_happy_b111oss_with_a_big_beard_in_a_white_suit_front_vie_06d8a20a-8e56-4833-8592-73eeb5b35bb8 1.png`; all generated pages reuse this same asset.
- The right-side Wizard guide must use the canonical resource image together with a default text block below it, vertically stacked in one centered column. The block contains a primary description (`.wizard-guide-title`, `16px`) and a secondary description (`.wizard-guide-text`, `14px`); both are required and must be business-specific copy. The guide column must use `flex-direction: column`, `min-width: 0`, and wrapping text so the copy never collapses into a vertical strip at narrow widths. Do not treat the copy as a decorative mark or omit it when the resource image is present.
- Common form layout is two equal-width columns on the left form area.
- Field width: about `342`
- Column gap: `16px`
- Row y positions include `0`, `76`, `152`, `256`
- Supports helper text, tooltip labels, mixed input groups, select plus time controls.
- Form helper copy defaults to an Ant Design `InfoCircleOutlined` icon on the right side of the label with `Tooltip` content; do not use persistent Form `extra` copy for ordinary field guidance.
- Wizard form columns are equal-width tracks and every field control fills its track; all form spacing is uniformly `16px`: grid row gap, grid column gap, Form.Item outer gap, and the gap between the form region and the illustration region. Do not inherit Ant Design's default `24px` Form.Item bottom margin.
- The wizard alignment container uses a restrained horizontal inset (normally `32px` to `48px` per side) so the form and illustration sit visually inside the Steps edges rather than touching the workspace boundary.
- The Wizard content group is vertically centered within the available workspace height after reserving Tabs, Footer and the `48px` action bar, with responsive natural scrolling when content exceeds the viewport.

## Template Intent

Use this template for multi-step configuration, onboarding, or rule setup flows.

## Bottom Action Bar Rules

- Wizard bottom actions must use a full-width fixed action bar within the right-side workspace, layered above the platform Footer rather than participating in the Footer document flow.
- Fixed bottom action bar height: exactly `48px`, including its final rendered box height.
- The bar starts at the workspace left edge after the Boss Ledger sider and spans to the viewport right edge.
- The bar must not render as a small floating button group or a narrow right-side patch.
- Buttons stay right-aligned inside the full-width bar.
- Required action order: `上一步`、`下一步`、`提 交`.
- When `提 交` is present, it is clickable by default. Clicking it should validate the relevant form data and then show the confirmation or validation feedback; do not disable it only because the current step is not the final step.
- Wizard submit confirmation must use Ant Design `Modal.confirm`; do not use a normal controlled `Modal`, `Popconfirm`, handwritten confirm shell, or custom dialog for submit confirmation.
- Sider collapsed state must update the action bar left offset so the bar still remains full-width in the workspace.
- The action bar must remain above Footer in both expanded and collapsed sider states and must not cover the form's primary content region.
- The action bar must use a stable `48px` height in every step and viewport state.


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

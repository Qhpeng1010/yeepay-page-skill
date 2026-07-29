# Template 13 Extraction - Guided Simple Form

Status: fixed full-page form template for an independent, single-stage task that needs a concise operational reminder.

## Content Structure

- Reuses the locked Boss Ledger Shell and active Tab.
- The page body is one white content surface with a two-column grid: form area `65%`, guide area `35%`, separated by a `16px` gap.
- The form area uses a two-column, label-above-control grid. A field that needs full width explicitly spans both columns.
- The guide is textual operational assistance, not a marketing panel or illustration: title, one concise explanation, optional structured warning points.
- The guide is visible at desktop widths and hidden at `768px` and below. The form then occupies the full content width.
- The page uses the standard workspace-level fixed bottom action bar. Cancel precedes the primary action.

## Template Intent

Use only for a simple, one-stage form whose task risk or business context requires a short right-side explanation. It is a distinct template from the Wizard: there is no Steps region, review phase, upload parsing or decorative guide image.

## Combination Boundary

- Allowed: `form.simple`, `form.sideGuide`, `form.stickyActions`.
- Forbidden: grouped form, Steps, upload/review workflow, dense table, secondary business card, or Wizard illustration.
- When the user must review multiple groups or finish dependent stages, use `template-08-full-page-form` or `template-10-wizard` instead.

## Runtime Rules

- Use real Ant Design Form, Input, Select and Button components.
- Preserve the fixed Shell, content origin, action-bar position and standard Chinese copy.
- The guide must never become a narrow column or cover the form at responsive breakpoints.

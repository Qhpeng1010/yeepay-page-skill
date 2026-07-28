---
name: yeepay-page-skill
description: Generate, design, update, implement, or review Yeepay business-platform pages from routed Markdown specifications. Use for Boss Ledger operations, merchant, audit, finance, query-list, dashboard, form, detail, wizard, result, empty-state, YOP, Open Platform, API documentation, SDK, error-code, and integration-guide requests. Produces traceable changes and browser-reviewable previews while enforcing the canonical Boss Ledger shell and validation gates.
---

# Yeepay Page Skill

Use the progressive workflow in `workflows/delivery.md`. This Skill is intentionally Markdown-first: `modules/**/*.md` are the canonical rule sources, while JSON is used only for machine routing and never as a replacement for a Markdown specification.

## Commands

Support these logical modes:

| Command | Mode | Output boundary |
|---|---|---|
| `/yeepay:prd` or `/yeepay prd` | Product | Write the proposal and requirement record; do not modify production source. |
| `/yeepay:design` or `/yeepay design` | Design | Write proposal, page design, and a reviewable preview where the routed mode supports one. |
| `/yeepay:full` or `/yeepay full` | Full workflow | Route, write PRD/design/tasks/implementation, generate preview, validate, and review. |
| `/yeepay:review` or `/yeepay review` | Review | Review and validate an existing Change without introducing new product scope. |

`/yeepay:code`, `/yeepay:spec`, and `/yeepay:archive` remain explicit maintenance modes from the v3 contract. They do not bypass routing or the Markdown loading contract. Without a command, infer the smallest mode that completes the request; a new page defaults to Full workflow.

## Progressive Loading Contract

Do not scan all `modules/`, `changes/`, or templates into context. Preserve this order:

1. Read `references/registry.yaml` only.
2. Run `node scripts/resolve-resources.mjs --request "<verbatim request>" --stage all` once. This single response is the request context: route, intent, page type, selected template, stage resources, adapter-provided commands, and assumptions. Do not call `route-business.mjs` and `resolve-resources.mjs` repeatedly for the same request.
3. If the result is `clarify`, ask the emitted product/page-type question before design or generation. If no platform is named, the router defaults to Boss Ledger and the assumption must be recorded.
4. Read only the routed `modules/<module>/DOMAIN.md`.
5. Read only the returned stage `resources` paths from the single context response. The selected module's `domain.json` adapter owns this resource boundary, template assembly and optional execution commands. Every returned rule source must be a Markdown file; do not replace it with a JSON contract or a historical Change.
6. Persist the route, intent, page type, implementation mode, assumptions, and resource paths in the current Change artifacts.

The module index files under `modules/` explain the loading boundary but do not duplicate the canonical specs. `modules/*/domain.json` is a routing contract only.

## Markdown Resource Boundaries

Each registered module owns an `adapter` in `modules/<module>/domain.json`. The adapter declares stage resources, optional framework/template assembly, and optional preflight/scaffold commands. The resolver must not use module-name conditionals to select another domain's specifications, Shell, assets, runtime or validator.

- **Boss Ledger requirement:** `modules/shared/product.md` and `modules/boss-ledger/business-rules.md`.
- **Boss Ledger design:** `modules/shared/design-system.md`, `modules/boss-ledger/design.md`, `modules/shared/page-templates.md`, and `modules/shared/components.md`. Boss Ledger 专属组件与交互契约归入完整 `modules/boss-ledger/design.md`。
- **Boss Ledger template:** `modules/shared/template-routing.md`, `template-01-framework-shell.md`, and the selected primary template. When the request contains a Wizard / 分步流程, the resolver also returns `template-10-wizard.md` and the scaffold copies the fixed Wizard code skeleton, CSS contract, and local guide asset.
- **Boss Ledger generate/review:** add only the stage-specific Markdown returned by the resolver, including `modules/shared/frontend.md` and `modules/shared/quality.md` where returned.
- **Open Platform:** use `modules/open-platform/theme.md` with the shared Markdown specs returned for that stage. Never mix Boss Ledger theme or shell resources into this route.
- **Easy Account:** use only the Markdown sources returned by the Easy Account adapter. It is initially `markdown-direct`; do not load Boss Ledger Shell, assets, vendor, rules reader, scaffold or validator.

## Boss Ledger Hard Boundary

Before every Boss Ledger generation:

1. Run `node scripts/check-yeepay-skill-integrity.mjs`.
2. Run the resolver's preflight command for the selected template set.
3. Run `node scripts/scaffold-boss-ledger-preview.mjs changes/{change-id}` before writing page code. Development Changes use a shared symlink to `modules/boss-ledger/shell/vendor`; use `--materialize-vendor` only when exporting a standalone package.

Always scaffold from `modules/boss-ledger/shell/`. The fixed shell owns topbar, primary navigation, side menu, collapse control, multi-tabs, workspace, footer, shared content CSS, runtime libraries, and logo. Only `preview-app.js` and `business.css` may be changed in a generated Boss Ledger preview. Never use a historical `changes/` directory as a source.

The complete canonical Boss Ledger theme and framework rule must be read before implementation. `rules-read.md` must contain current hashes, and delivery must use:

```text
node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html template-xx-{selected-template}.md
```

Rule hashes and route results are cached under `.cache/yeepay-skill/` and invalidated by source metadata and registry changes. The full preview validator starts Chrome once for screenshot plus DOM; use `--screenshot-only` or `--dom-only` when only one artifact is needed.

Do not deliver if any verifier gate fails. Query-list pages must keep exactly two direct sibling white modules, `.boss-query-module` and `.boss-result-module`, with a fixed `16px` gap. Keep the result module white through Table and Pagination. Each module owns one `16px` inset. The result toolbar must include a functional icon-only Ant Design `SettingOutlined` column selector using `Dropdown`/`Popover` and `Checkbox`, with no persistent selection-helper copy.

Use real React + Ant Design + Ant Design Icons components, Chinese runtime copy, Ant Design charts for charts, and the selected Markdown template skeleton. Do not recreate the shell, mix themes, or invent a second primary template. Preserve required loading, empty, error, permission, validation, and interaction states.

## Output Artifacts

Use the artifact files under `modules/shared/templates/` for proposal, page design, tasks, implementation, and review. New previews belong under `changes/YYYYMMDD-short-feature-name/`. A preview is required for page/design output unless the user explicitly declines HTML. Boss Ledger review must report the exact statuses `canonical-shell`, `validate`, `screenshot`, `charts`, `中文文案`, and `overall` and must cite verifier output rather than subjective approval.

## Validation

During implementation, use the fast gate (no Chrome):

```text
node scripts/validate-fast.mjs changes/{change-id}/preview.html
```

The fast gate runs syntax, canonical-shell, static layout contracts, Wizard split / spacing / asset / state checks, Full-page Form fixed-action-bar checks, and skips Chrome. Only the final delivery gate should launch Chrome:

```text
node scripts/check-yeepay-skill-integrity.mjs
node scripts/validate-progressive-structure.mjs
node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html template-xx-{selected-template}.md
```

Before the final delivery gate, run `node --check changes/{change-id}/preview-app.js`. A generated preview must not be delivered when the business script has a syntax error, relies on handwritten HTML controls, or renders only the fixed shell without its requested business content. When browser screenshot execution is unavailable, keep the change blocked for runtime review rather than adding a static fallback that bypasses React and Ant Design.

Fix every failure and rerun the final command. Do not describe a failed gate as acceptable.

# Boss Ledger Page Spec Core Context

Read the selected Director Rules and current generation policy before this file.

The generation agent writes `page-spec.json` only. The fixed renderer owns React, Ant Design components, business CSS and Shell composition. Generated `preview-app.js`, `business.css`, `page-spec-runtime.js`, Shell files and `preview.html` are derived and must not be edited.

Every Page Spec declares:

- `metadata.request`, `family`, `templateId`, `executionMode`, selection reason, non-empty assumptions and applicable Rule IDs. `shadow` 还必须声明策略中的 `validatedCombinations`。
- `ui.system: boss-ledger`, `runtime: react-antd-page-spec`, `rendererVersion: 1`.
- only capabilities returned by the current generation policy.
- explicit loading, empty, error and success behavior relevant to its family.

Unsupported capability requirements are recorded as gaps. Do not add arbitrary HTML, JavaScript, CSS or component props to bypass the contract.

Before build, `page-design.md` must record the selected family, template, runtime mode, capabilities, selection reason, rejected candidates, assumptions and every selected Rule ID. The fixed build gate checks this evidence against `page-spec.json`.

# Boss Ledger Form Page Spec Context

Select one structural mode: `form.simple`, `form.groups` or `form.steps`. A simple form declares `fields`; a grouped form declares `groups`; a step form declares `steps`. `template-13-guided-form` is the only simple-form template that may declare `sideGuide`; it is desktop-only and must be omitted from grouped and upload/review flows. Upload fields require `form.upload`; a parsed review table in a Wizard requires `form.reviewTable`.

Each field declares a stable key, Chinese label, control, required state, default value, options and validation where applicable. The renderer owns Ant Design Form validation, step gating, duplicate-submit protection and result feedback.

The Page Spec must state the success transition. Failure retains values and provides recovery copy. A Wizard can explicitly use `success.actionType: "return-source"` only when `form.returnSource` is declared.

# Boss Ledger Detail Page Spec Context

Detail is read-only. Declare a presentation (`page`, `drawer` or `modal`), semantic groups and structured fields. `modal` requires `detail.modal`; `drawer` requires `detail.drawer`. Use metrics or embedded tables only when the corresponding capability is available. A page detail can declare `anchors: true`; Tabs must declare every group exactly once through `tabs[].groupKeys`.

Drawer is for bounded row detail that preserves list context. Many groups or long child tables require page presentation. Individual fields are not cards.

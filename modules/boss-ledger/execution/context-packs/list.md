# Boss Ledger List Page Spec Context

Required baseline capabilities are `query.basic`, `table.flat` and `table.pagination`. More than six query fields or explicitly secondary filters require `query.advanced`.

The Page Spec declares structured query fields, table columns, rows, pagination and optional summaries or tools. The renderer provides the two direct sibling white modules, Ant Design Form/Table/Pagination, functional column settings and standard Loading/Empty/Error states.

For short read-only row inspection, declare one `type: "detail"` row action together with `table.drawerDetail` and the `detail.drawer` capability. Every displayed detail field must bind to a declared list column. A bounded child table is allowed only with `detail.drawerTable` and a declared `rowsSource`; long histories belong to a page detail. Closing the Drawer must preserve the active query, page and visible columns.

Use `type: "confirm-state-change"` only for an explicitly declared prototype state transition. It requires structured confirmation title, object/impact text, success feedback, an effect field and an optional visibility condition. This does not replace a server-side transaction or authorization check.

`table.primaryAction.form` creates a Drawer record and prepends it after validation; `type: "edit"` row actions use a Drawer form and preserve the list context. `batchActions` require `rowSelection: true`; expandable child tables cannot be combined with row selection. Column settings can expose order controls only with `table.columnOrder`; export controls require `table.export`.

Use one or two inline summary items or three to five statistics cards, never both for the same measures. Operation columns remain visible. Amount columns use numeric source values and explicit currency/unit presentation.

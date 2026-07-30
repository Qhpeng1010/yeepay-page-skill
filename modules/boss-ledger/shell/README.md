# Boss Ledger Shell

This directory is the canonical, reusable Boss Ledger framework layer. It is independent of every `changes/` page.

The shell owns the top information bar, primary navigation, left Ant Design Menu, collapse control, multi-tabs, workspace, content scroll viewport, and platform footer. A generated page supplies configuration and renders business content through `children`; the business page must not render another footer.

The local vendor baseline also includes `lodash.min.js` and `ant-design-charts.min.js` for business pages that render official Ant Design Charts components. These are runtime dependencies for content pages, not a change to the shell layout.

Page Spec previews are built by `scripts/build-boss-ledger-page-spec.mjs`. The renderer owns `preview.html`, `preview-app.js` and business CSS; this directory only supplies the fixed runtime, shell CSS and vendor libraries.

`content-base.css` owns the single `16px` inset for every Query / Result module. Generated business CSS must not add horizontal padding to `boss-result-summary`, `boss-result-toolbar`, `boss-table-body`, or `boss-table-pagination`. Use `boss-query-expand-button` for primary-text-color expand/collapse and `boss-column-setting-button` for the secondary-text-color Setting icon.

Business pages must not copy query, table, pagination, drawer, or other content modules into this directory.

# Boss Ledger Shell

This directory is the canonical, reusable Boss Ledger framework layer. It is independent of every `changes/` page.

The shell owns the top information bar, primary navigation, left Ant Design Menu, collapse control, multi-tabs, workspace, and content scroll viewport. A generated page supplies configuration and renders business content through `children`.

Use `BossLedgerShell` from `shell-runtime.js`, load `shell.css`, and start from `shell-config.example.js`. The canonical logo remains `specs/boss logo.svg`.

Business pages must not copy query, table, pagination, drawer, or other content modules into this directory.

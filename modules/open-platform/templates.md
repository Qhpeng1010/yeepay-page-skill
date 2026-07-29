# Open Platform Template Index

开放平台已有独立的 Marketing Shell 与 Documentation Shell。API 文档首批采用 `page-spec-shadow`，其余页面按本域 execution policy 决定是否可执行。

- `template` 阶段返回空资源列表，页面结构由路由后的 Context Pack 和本域 Director Rules 决定。
- `generate` 阶段只读解析器返回的 Markdown 规范和 `modules/shared/templates/html-preview.md`。
- 不得读取或复用 `modules/boss-ledger/shell/` 或 `modules/easy-account/execution/`。

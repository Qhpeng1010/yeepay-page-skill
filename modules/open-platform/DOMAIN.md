# Open Platform Domain

易宝开放平台是产品发现、API 文档、SDK、错误码、接入指南和开发者工具的业务域。

## Route Boundary

- YOP、开放平台、开发者中心、API/SDK 文档、错误码和接入指南进入本模块。
- 运营、商户、审核、对账和配置后台不进入本模块。

## Progressive Loading

`domain.json` 定义页面意图。运行 `scripts/resolve-resources.mjs` 后，只读取当前阶段返回的 Markdown 路径。

本模块采用 `page-spec-shadow`。API 文档和接入指南可生成开放平台自己的 Page Spec 候选并经 Documentation Shell 和浏览器场景验证；官网、SDK 和错误码页面按 policy 保持 legacy 或 pending。不得读取、不复用 Boss Ledger 或 Easy Account 壳层。

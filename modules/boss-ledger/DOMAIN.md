# Boss Ledger Domain

Boss Ledger 是易宝运营、商户、审核、财务、风控、客服和系统配置类后台的业务域。

## Route Boundary

- 运营后台、商户后台、审核、查询、配置、Dashboard、表单、详情和步骤流程进入本模块。
- YOP、开放平台、API/SDK 文档、错误码和接入指南不进入本模块。
- 未指定平台时可默认路由到本模块，但必须在产物中记录该假设。

## Progressive Loading

`domain.json` 是页面意图的机器路由合约。不要直接扫描所有 `modules/`；运行 `scripts/resolve-resources.mjs` 后，只读取当前阶段返回的 Markdown 路径。

Boss Ledger 始终使用 `modules/boss-ledger/shell/` 的固定壳层。它是执行资产，不是需要逐文件读入上下文的设计规范。

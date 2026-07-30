# Easy Account Domain

Easy Account（易账通）是独立的账户与账务管理业务域。它使用自己的产品框架、设计规范、主题、组件约定和页面模板，不复用 Boss Ledger 壳层。

## Route Boundary

- 明确包含 `Easy Account`、`EasyAccount`、`easy-account` 或“易账通”的需求进入本模块。
- Boss Ledger、开放平台、易来钱收银台不进入本模块。
- 只有“账户”或“账务”但没有 Easy Account 产品标识时，不强制路由到本模块。

## Progressive Loading

`domain.json` 是本业务域的唯一适配合约，声明阶段资源、页面意图、模板目录和可选执行命令。路由命中后，只读取 resolver 返回的 Easy Account Markdown。

## Execution Boundary

当前使用 `page-spec-shadow`。普通查询列表可生成独立的 Easy Account Page Spec 候选，并通过本域固定壳层、渲染器、派生产物完整性和浏览器场景验收；其余页面族仍保留在 shadow、workflow-only 或 legacy 边界。

不调用 `scaffold-boss-ledger-preview.mjs`、不加载 `modules/boss-ledger/shell/`，也不引用 Boss Ledger 的 Logo、vendor、规则或验证器。每个 Page Spec Change 只编辑 `page-spec.json`，其余预览文件由 `build-easy-account-page-spec.mjs` 生成。

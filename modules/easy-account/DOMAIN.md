# Easy Account Domain

Easy Account（易账通）是独立的账户与账务管理业务域。它使用自己的产品框架、设计规范、主题、组件约定和页面模板，不复用 Boss Ledger 壳层。

## Route Boundary

- 明确包含 `Easy Account`、`EasyAccount`、`easy-account` 或“易账通”的需求进入本模块。
- Boss Ledger、开放平台、易来钱收银台不进入本模块。
- 只有“账户”或“账务”但没有 Easy Account 产品标识时，不强制路由到本模块。

## Progressive Loading

`domain.json` 是本业务域的唯一适配合约，声明阶段资源、页面意图、模板目录和可选执行命令。路由命中后，只读取 resolver 返回的 Easy Account Markdown。

## Execution Boundary

当前使用 `markdown-direct` 生成独立评审预览。不调用 `scaffold-boss-ledger-preview.mjs`、不加载 `modules/boss-ledger/shell/`，也不引用 Boss Ledger 的 Logo、vendor 或 validator。

当 Easy Account 的正式框架资产就绪后，只在 `domain.json` 的 adapter 中增加本域的 preflight、scaffold 和 verify 命令。

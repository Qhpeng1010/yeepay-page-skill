# Progressive Delivery Workflow

## Route

对用户原始需求运行 `node scripts/resolve-resources.mjs --request "<verbatim request>" --stage all` 一次，复用返回的 route、intent 和各阶段资源映射。路由成功后只读选中模块的 `DOMAIN.md`。

`domain.json` 的 `adapter` 是业务域执行合约：它声明各阶段 Markdown 资源、模板装配规则和可选的 preflight / scaffold / verify 命令。通用调度器不得按业务域名称写死资源或执行资产。

## Requirement

只读统一上下文中 `requirement.resources` 返回的 Markdown。分开记录明确需求、默认值和合理假设，锁定产品模块与页面意图。

## Design

只读统一上下文中 `design.resources` 返回的 Markdown。将业务对象、主操作、状态和校验映射到选中产品的信息层级与组件规则。

## Template

只读 `template.resources` 返回的当前业务域框架规范和主内容模板。模板目录、支撑模板和适用阶段以 adapter 为准。

## Generate

先读完 `generate.resources` 返回的 Markdown，再仅执行当前业务域 adapter 返回的命令。带 Shell 的业务域只编辑脚手架允许的文件；`markdown-direct` 业务域从本域 Markdown 规范生成独立预览，不加载其他业务域的 Shell 、资产或运行时。Boss Ledger 保持其现有的 fast gate 与 Chrome 交付门禁。

## Review

只读 `review` 返回的 Markdown。如果 adapter 声明了交付验证命令，必须在交付前运行并通过。Boss Ledger 保持运行 `scripts/refresh-and-verify-boss-ledger-change.mjs`。

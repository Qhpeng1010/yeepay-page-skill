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

先读完 `generate.resources` 返回的 Markdown，再仅执行当前业务域 adapter 返回的命令。若返回 `execution`，必须按 `availability` 和 `mode` 执行：`legacy` 走旧路径；`shadow` 同时生成候选 Page Spec 并比较语义；`page-spec-default` 以 Page Spec 为默认且保留显式回退；`page-spec-only` 禁止旧路径。Page Spec 模式只编辑 `page-spec.json`，其他页面文件由固定渲染器生成。

带 Shell 的业务域只使用本域 Shell；`markdown-direct` 业务域从本域 Markdown 规范生成独立预览，不加载其他业务域的 Shell、资产或运行时。Boss Ledger Page Spec 先通过策略、发布清单和契约检查，再运行原有 fast gate 与 Chrome 交付门禁。

## Review

只读 `review` 返回的 Markdown。如果 adapter 声明了交付验证命令，必须在交付前运行并通过。Boss Ledger legacy 运行 `scripts/refresh-and-verify-boss-ledger-change.mjs`；Page Spec 运行 `scripts/verify-boss-ledger-page-spec.mjs`。Shadow 模式还必须产生通过的语义差异报告。

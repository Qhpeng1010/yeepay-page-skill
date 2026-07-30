# Progressive Delivery Workflow

## Route

对用户原始需求运行 `node scripts/resolve-resources.mjs --request "<verbatim request>" --stage all` 一次，复用返回的 route、intent 和各阶段资源映射。路由成功后只读选中模块的 `DOMAIN.md`。

`domain.json` 的 `adapter` 是业务域执行合约：它声明各阶段 Markdown 资源、模板装配规则和可选的 preflight / scaffold / verify 命令。通用调度器不得按业务域名称写死资源或执行资产。

## Requirement

只读统一上下文中 `requirement.resources` 返回的 Markdown。分开记录明确需求、默认值和合理假设，锁定产品模块与页面意图。

## Design

只读统一上下文中 `design.resources` 返回的 Markdown。将业务对象、主操作、状态和校验映射到选中产品的信息层级与组件规则。

## Template

只读 `template.resources` 返回的当前业务域页面选择规则。Boss Ledger 的规则模板由导演规则、规则模板索引、核心规则包和所选页面族规则包组成；固定 Shell 与页面实现由渲染器持有，不是业务模板输入。其他业务域仍以各自 adapter 返回的资源为准。

## Generate

先读完 `generate.resources` 返回的 Markdown，再仅执行当前业务域 adapter 返回的命令。若返回 `execution`，必须按 `availability` 和 `mode` 执行：`legacy` 才可调用旧路径；`shadow`、`page-spec-default` 和 `page-spec-only` 都只以 Page Spec 作为页面作者输入。`shadow` 的历史语义比对仅由回归样例和工程脚本执行，不向页面作者暴露旧预览脚手架；`page-spec-only` 禁止任何旧路径。Page Spec 模式只编辑 `page-spec.json`，其他页面文件由固定渲染器生成。

带 Shell 的业务域只使用本域 Shell；`markdown-direct` 业务域从本域 Markdown 规范生成独立预览，不加载其他业务域的 Shell、资产或运行时。

单一且已开放的 Boss Ledger Page Spec 页面走快速路径：先运行一次 `prepare-boss-ledger-page-spec.mjs` 创建 Change 和规则读取记录；再写入 Page Spec 与设计证据；随后只运行当前 Change 的契约、构建和 `verify-boss-ledger-page-spec.mjs --fast`。在预览生成前，不得运行全系统回归、重复解析或重复预检。每项预检最长 30 秒；Change 在 90 秒内没有 `page-spec.json` 时停止并报告 `generation-state.json` 的精确阻塞点。

## Review

只读 `review` 返回的 Markdown。Boss Ledger Page Spec 默认只运行 `scripts/verify-boss-ledger-page-spec.mjs --fast`，随后交付预览供用户人工验收；在 `review.md` 记录用户确认的场景。浏览器自动交互验收仅在用户明确请求时运行 `scripts/verify-boss-ledger-page-spec.mjs --browser`。Boss Ledger legacy 仍运行 `scripts/refresh-and-verify-boss-ledger-change.mjs`。只有规则、策略、渲染器、Shell、公共验证脚本或能力样例变更时，才追加 `scripts/validate-boss-ledger-page-spec-system.mjs`。`shadow` 页面必须引用当前已验证组合；历史语义对比仅作为工程回归证据，不阻塞页面作者使用 Page Spec。

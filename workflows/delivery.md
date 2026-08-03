# Progressive Delivery Workflow

## Route

对明确为新建 Boss Ledger 页面的需求，先对用户原始需求只运行一次 `node scripts/generate-boss-ledger-page.mjs --request "<verbatim request>"`。入口可选接收 `--change "changes/<new-change-id>"`，未提供时自动分配合法且不冲突的 Change 标识。若入口返回 `generated`，直接进入人工验收交付；若返回 `fallback`，才运行一次 `node scripts/resolve-resources.mjs --request "<verbatim request>" --stage generate`。只读取返回的核心规则包、规则模板索引和一个页面族规则包；在需要需求、设计或评审资料时，才按对应阶段读取该阶段资源。已有 Change 的修改或评审不运行此入口。其他业务域仍可按其 adapter 的阶段资源执行。路由成功后只读选中模块的 `DOMAIN.md`。

Boss Ledger 已完成路由后，不得再次分类、读取历史 Change、扫描其他模块或模板、使用通用 UI 技能重选页面类型，或逐段阅读完整固定渲染器。只有路由不明确或策略能力缺失时才停止快路径并澄清或报告能力边界；不得先生成列表等候选页面再反向重判。

`domain.json` 的 `adapter` 是业务域执行合约：它声明各阶段 Markdown 资源、模板装配规则和可选的 preflight / scaffold / verify 命令。通用调度器不得按业务域名称写死资源或执行资产。

## Requirement

只读统一上下文中 `requirement.resources` 返回的 Markdown。分开记录明确需求、默认值和合理假设，锁定产品模块与页面意图。

## Design

只读统一上下文中 `design.resources` 返回的 Markdown。将业务对象、主操作、状态和校验映射到选中产品的信息层级与组件规则。

## Template

只读 `template.resources` 返回的当前业务域页面选择规则。Boss Ledger 的规则模板由导演规则、规则模板索引、核心规则包和所选页面族规则包组成；固定 Shell 与页面实现由渲染器持有，不是业务模板输入。其他业务域仍以各自 adapter 返回的资源为准。

## Generate

先读完 `generate.resources` 返回的 Markdown，再仅执行当前业务域 adapter 返回的命令。若返回 `execution`，必须按 `availability` 和 `mode` 执行：`shadow`、`page-spec-default` 和 `page-spec-only` 都只以 Page Spec 作为页面作者输入；`pending` 或 `workflow-only` 的独立入口必须报告能力边界，不得创建替代页面。Page Spec 模式只编辑 `page-spec.json`，其他页面文件由固定渲染器生成。

带 Shell 的业务域只使用本域 Shell；`markdown-direct` 业务域从本域 Markdown 规范生成独立预览，不加载其他业务域的 Shell、资产或运行时。

单一且已开放的 Boss Ledger Page Spec 页面走快速路径：先运行一次 `prepare-boss-ledger-page-spec.mjs` 创建 Change 和规则读取记录；再写入 Page Spec 与设计证据；随后只运行当前 Change 的契约、构建和 `verify-boss-ledger-page-spec.mjs`。在预览生成前，不得运行全系统回归、重复解析或重复预检。页面方案面向业务用户使用中文名称；实现模板 ID 只记录在 `page-design.md`。最终回复固定只包含完成情况、中文页面方案、产物链接、静态预检结果和人工验收状态；不得出现实现模板 ID、页面族、策略、能力或规格术语，除非用户明确索取技术细节。每项预检最长 30 秒；Change 在 90 秒内没有 `page-spec.json` 时停止并报告 `generation-state.json` 的精确阻塞点。

连续编号步骤、字段列表和预览/复核步骤齐全的 Boss Ledger 流程由统一入口自动命中分阶段流程配方。它本地解析字段并复用已验证的流程骨架，包含路由、准备、构建和静态预检；未命中时由入口明确返回常规首次生成，不能退化为自由拼接页面。

查询列表并明确组合详情、新增、编辑或删除操作的需求，可命中已通过人工验收的查询列表工作台配方。配方只编译需求中明确声明的操作：详情、新增和编辑使用右侧抽屉，删除使用包含对象、影响和不可撤销说明的二次确认；查询条件超过 6 项时使用高级查询并收起次要条件；抽屉关闭后保留列表查询上下文。

## Review

只读 `review` 返回的 Markdown。Boss Ledger Page Spec 只运行 `scripts/verify-boss-ledger-page-spec.mjs` 静态预检，随后交付 `preview.html` 供用户人工验收；在 `review.md` 记录人工查看的场景、观察结果与确认状态。浏览器自动交互、截图和像素验收已停用。只有规则、策略、渲染器、Shell、公共验证脚本或能力样例变更时，才追加 `scripts/validate-boss-ledger-page-spec-system.mjs` 静态回归。`shadow` 页面必须引用当前已验证组合。

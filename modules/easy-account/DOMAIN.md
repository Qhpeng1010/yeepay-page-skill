# Easy Account Domain

Easy Account（易账通）是独立的账户与账务管理业务域。它使用自己的产品框架、设计规范、主题、组件约定和页面方案，不复用 Boss Ledger 壳层。

## Route Boundary

- 明确包含 `Easy Account`、`EasyAccount`、`easy-account` 或“易账通”的需求进入本模块。
- Boss Ledger、开放平台及其他非易账通产品不进入本模块。
- 只有“账户”或“账务”但没有 Easy Account 产品标识时，不强制路由到本模块。

## Progressive Loading

`domain.json` 是本业务域的唯一适配合约，声明阶段资源、页面意图、固定 Shell 和可选执行命令。路由命中后，只读取 resolver 返回的 Easy Account Markdown。

## Execution Boundary

当前使用 `page-spec-shadow`。`modules/easy-account/shell/` 是唯一的固定框架层，负责导航、多标签、内容工作区、页脚和品牌资产；浏览器依赖来自 `modules/shared/browser-runtime/` 共享离线运行时。业务 Page Spec 只能挂载到其内容插槽，不能重新实现 Shell。查询列表、单阶段与步骤表单、详情和流程结果均执行本域静态预检和受控规格构建，预览交由人工验收。已开放“查询列表工作台”稳定配方，覆盖明确条件和字段的列表，以及按需组合的详情抽屉、新增抽屉、编辑抽屉与删除确认；未命中配方但能力可用的需求进入受控自然语言生成，并在构建前执行原始需求覆盖校验。Dashboard 和多步骤快速配方仍处于暂缓状态。

不加载 Boss Ledger 的 Shell，也不引用 Boss Ledger 的 Logo、vendor、规则或验证器。每个 Page Spec Change 只编辑 `page-spec.json`，其余预览文件由 `build-easy-account-page-spec.mjs` 生成。当前交付只做静态预检，预览交由人工验收；浏览器交互检查仅作为显式的研发调试选项，不属于默认交付门禁。

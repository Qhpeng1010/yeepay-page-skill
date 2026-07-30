# 老板管账 Page Spec 能力迁移矩阵

## 适用范围

本矩阵是将老板管账从“由模型手写页面代码”迁移到“声明式 Page Spec 固定渲染器”的第一阶段基线。它对照老板管账规则模板与 OpenDesign Admin PC Ant 框架中已经验证的能力。

本矩阵用于说明能力状态；实际是否允许生成，以 `../execution/generation-policy.json` 为准。

状态说明：

- `page-spec-default`：已默认使用新机制生成。
- `shadow`：新旧机制并行生成、对比验证中，暂未全面切换。
- `legacy`：继续使用旧机制，不能直接按新 Page Spec 生成。

## 能力映射

| 规则模板 | 页面家族 | OpenDesign 已验证能力 | 初始迁移状态 | 说明 |
| --- | --- | --- | --- | --- |
| `dashboard.overview` | Dashboard | 暂无可用页面家族 | `legacy` | 不得用列表统计冒充 Dashboard。 |
| `list.regular` | 列表 | `list`、`query.basic`、`table.flat`、`table.pagination` | `page-spec-default` | 首个正式试点。 |
| `list.inline-summary` | 列表 | `summary.count`、`summary.amount` | `page-spec-default` | 完成黄金样例回归后再升级。 |
| `list.card-summary` | 列表 | `statistics.cards`、`statistics.cards.rich` | `page-spec-default` | 完成黄金样例回归后再升级。 |
| `form.modal-simple` | 表单 | `form.simple`、Modal 展示方式 | `shadow` | 列表到 Modal 的编排受策略组合门禁约束。 |
| `form.drawer-simple` | 表单 | `form.simple`、Drawer 展示方式 | `shadow` | 可独立渲染表单；列表内编排能力仍有限。 |
| `form.page-simple` | 表单 | `form.simple`、`form.stickyActions`、全页展示方式 | `shadow` | 菜单、深链接或独立任务入口的少字段表单；字段数量不强制改用 Modal 或 Drawer。 |
| `form.grouped-page` | 表单 | `form.simple`、`form.groups`、`form.steps`、`form.uploadFlow` | `shadow` | 只允许声明策略已开放的能力。 |
| `detail.record` | 详情 | `detail.groups`、Drawer/Modal/页面展示方式 | `shadow` | 完成来源列表上下文保留的覆盖后再升级。 |
| `form.staged-flow` | 表单 | `form.steps`、`form.reviewTable`、`form.uploadFlow` | `shadow` | 结果页是流程跳转，不是独立入口。 |
| `result.workflow` | 结果 | `result.basic`、仅流程内使用 | `legacy` | 暂不允许作为独立业务页面入口。 |
| `state.embedded` | 空状态 | 暂无独立页面家族 | `legacy` | 空状态仍是已支持页面家族内部的一种状态。 |

## 已验证的初始组合

| 页面组合 | 状态 | 必需证据 |
| --- | --- | --- |
| 常规查询列表 | 已默认支持 | 查询、重置、表格、分页、Loading、空数据和错误状态。 |
| 带列设置的查询列表 | 已默认支持 | 列显隐可操作；操作列不可隐藏。 |
| 带只读详情 Drawer 的列表 | 已默认支持 | 详情字段绑定当前行；关闭后保留查询、分页和列设置上下文。 |
| 带新增 Drawer 的列表 | `shadow` | 保存后增加当前会话记录；关闭后保留列表上下文。 |
| 单阶段表单 | `shadow` | 必填校验、防重复提交和明确结果反馈。 |
| 独立简单表单页 | `shadow` | 直接进入、垂直表单、固定操作栏和成功反馈；不依赖来源列表上下文。 |
| 分组全页表单 | `shadow` | 只使用分组，不配右侧说明插图。 |
| 步骤表单 | `shadow` | 上一步完成前，不能进入下一步。 |
| 只读详情 | `shadow` | 明确选择 Modal、Drawer 或整页展示。 |

## 当前不支持的初始组合

- Dashboard 和数据可视化页面组合。
- 作为独立业务入口的结果页。
- 独立的空状态页面家族。
- 服务端分页、服务端持久化和真实权限执行。
- 任意嵌套工作流或手写组件逃生口。
- 跨系统的 Token、Shell 资产、Context Pack 或渲染器。

## 黄金样例

初始回归集使用现有 Change 与可执行 Page Spec 样例。历史 `templates/template-01` 至 `template-13` 不是此矩阵的输入，也不是规则模板；它们只保留在版本历史中作为设计稿抽取证据：

1. 商户查询：常规查询列表、列设置、新增与详情行为。
2. 分账规则查询：常规列表加多步骤辅助流程。
3. 银行卡查询：常规查询列表和状态处理。
4. 日本报备商品查询：查询列表和本地化业务文案。
5. 台北资质查询：查询列表和运营状态处理。

黄金样例会比较业务字段、已选页面家族、已选能力、Shell 完整性、关键 DOM 契约和交付门禁状态；暂不要求像素级完全一致。

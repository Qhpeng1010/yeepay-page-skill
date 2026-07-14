# Template Routing Spec

## Purpose

本文件定义页面生成前的主页面模板路由规则。每次生成页面前，必须先选择一个主页面模板，并按需组合框架壳模板或辅助模板。

## Hard Rules

- 每次生成页面前必须选择一个主页面模板。
- 主页面模板只能有一个；辅助模板只能服务于主模板，不得把多个主模板拼成一个不受控的新页面结构。
- 页面模板库固定使用 `specs/themes/boss-ledger-extractions/template-01` 到 `specs/themes/boss-ledger-extractions/template-12`，不得重做模板库。
- 选择模板后，必须读取对应 `specs/themes/boss-ledger-extractions/template-xx-*.md` 文件。
- 所有 Boss Ledger 页面都必须先读取 `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`，再读取页面类型对应模板。
- `template-01-framework-shell.md` 的 HTML 视觉与交互基础固定来自 `templates/boss-ledger-shell/`；不得从任何历史 change 包重新选择或拼接框架层。
- 多标签栏属于 `template-01` 框架层，不属于任一业务页面模板。业务模板只提供 Tabs 下方的内容区结构。
- 一级 / 二级 / 三级导航和 Tabs 的文案、key、路由、选中 / 展开状态属于动态配置，可以随业务需求变化，但不得改变框架结构和样式契约。
- `page-design.md` 必须写明主页面模板、辅助模板、选择原因和业务模块顺序。

## Required Routing

| Page type | Required template composition |
|---|---|
| 查询列表页 / 审核列表 / 配置列表 | `template-01-framework-shell.md` + `template-03-query-list-regular.md` |
| 轻量汇总查询列表页 | `template-01-framework-shell.md` + `template-04-query-list-inline-summary.md` |
| 卡片汇总查询列表页 | `template-01-framework-shell.md` + `template-05-query-list-card-summary.md` |
| Dashboard / 数据首页 / 首页 | `template-01-framework-shell.md` + `template-02-dashboard-home.md` |
| Modal 表单 | `template-01-framework-shell.md` + `template-06-modal-form.md` |
| Drawer 表单 | `template-01-framework-shell.md` + `template-07-drawer-form.md` |
| Full-page 表单 | `template-01-framework-shell.md` + `template-08-full-page-form.md` |
| Drawer 详情 / 详情 | `template-01-framework-shell.md` + `template-09-drawer-detail.md` |
| Wizard / 步骤页 / 分步流程 | `template-01-framework-shell.md` + `template-10-wizard.md` |
| Result / 结果页 | `template-01-framework-shell.md` + `template-11-result.md` |
| Empty State / 空状态页 | `template-01-framework-shell.md` + `template-12-empty-state.md` |

## Summary List Selection

带统计查询列表页按统计展示强度选择：

- 轻量 inline 查询统计：`template-04-query-list-inline-summary.md`
- 卡片式查询统计：`template-05-query-list-card-summary.md`

Boss Ledger 查询统计必须继续遵守 `specs/themes/boss-ledger.md`：查询统计位于表格模块内部，不得拆成独立业务模块。
轻量 inline 查询统计与结果区大标题是唯一关系：选择 `template-04-query-list-inline-summary.md` 时，不得再展示 `查询列表` 大标题；统计文本必须放在原大标题同一左侧 toolbar 位置，并与右侧工具按钮同一行，只保留统计文本、右侧工具按钮、Table 和 Pagination。

`template-05-query-list-card-summary.md` 仅当统计项超过 3 个时使用；统计卡片必须位于 Result Module 内部、Table 上方，不得脱离 Result Module 变成独立模块。

## Required Output

每次生成页面时，必须在 `page-design.md` 的模板选择区记录：

- Main template
- Supporting template(s)
- Template source files
- Selection reason
- Whether the page includes query summary statistics

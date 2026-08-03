# 老板管账查询列表规则包

> 由导演规则编译。请勿直接编辑。

## 当前策略

- 页面族：`list`
- 状态：available / page-spec-default
- 已开放能力：`query.basic`、`query.advanced`、`summary.inline`、`statistics.cards`、`table.flat`、`table.pagination`、`table.status`、`table.amount`、`table.refresh`、`table.columnSettings`、`table.confirmAction`、`table.deleteAction`、`detail.drawer`、`detail.drawerTable`、`table.editAction`、`table.batchAction`、`table.expandable`、`table.export`、`table.columnOrder`、`list.drawerCreate`

## 可选方案

### 常规查询列表

- 规则模板：`list.regular`
- 适用条件：需要按条件查找、比较或处理一组记录，且不需要页面级统计汇总。
- 规则：
- `BL-TPL-001` `query-list-family`（查询列表家族） 当主要任务是查找、比较或处理一组记录时，使用查询列表家族。它必须包含查询语义、结果表格、分页，以及 Loading、空数据和错误状态。
- `BL-TPL-010` `list-module-composition`（列表模块组合） 常规列表严格由一个查询任务模块和一个结果任务模块组成；两者是直接同级，间距 `16px`，Table 和 Pagination 必须留在白色结果模块内。
- `BL-TPL-012` `list-create-composition`（列表新增组合） 只有嵌入式工作流符合表单选择规则，且返回不变的列表上下文确有价值时，列表的新建/编辑才可使用 Modal 或 Drawer。复杂新建应打开全页表单或 Shell Tab。
- `BL-TPL-013` `list-detail-boundary`（列表详情边界） 列表详情只在信息有边界且只读时使用 Drawer。嵌套工作流、大量子数据或很长的操作历史不能隐藏在 Drawer 内。
- `BL-TPL-015` `batch-expand-exclusivity`（批量与展开互斥） 勾选和批量操作是原子组合。可展开子表与勾选不能同时出现，除非该精确组合已经实现并通过验收。
- `BL-TPL-016` `column-settings-integrity`（列设置完整性） 操作列不能被列设置隐藏。带列设置的结果 Toolbar 必须使用可用的 Ant Design Dropdown 或 Popover、Checkbox 和重置能力。
- `BL-INT-001` `information-hierarchy`（信息层级） 按任务依赖关系排列信息：页面上下文、必要摘要、查询或输入、主要结果、行级或后续操作、补充说明。统计和装饰不得把主要任务挤出首个有效视口。
- `BL-INT-002` `operation-scope`（操作作用范围） 查询操作属于查询表单，结果工具属于结果模块，行操作只作用于当前记录；未选中记录前，批量操作不可用。
- `BL-INT-003` `query-state-management`（查询状态管理） 查询应应用明确的用户条件，并正确重置分页；重置应恢复声明的默认值、清除临时勾选并返回可预期的数据集；展开/收起必须保留已输入的值。
- `BL-INT-004` `context-preservation`（上下文保持） 分页、排序、列设置、Drawer 查看和可恢复的失败状态应尽量保留当前列表上下文。关闭 Drawer 或 Modal 不能悄悄重置来源列表。
- `BL-INT-008` `page-state-recovery`（页面状态恢复） Loading、首次空数据、查询无结果、请求错误、无权限和缺少前置条件是不同状态，必须使用不同文案和恢复方式。
- `BL-INT-010` `dangerous-action-confirmation`（危险操作确认） 危险或敏感操作确认前必须说明对象、影响范围、金额或数量（如适用）、是否可撤销和操作后的状态。高风险资金或身份操作可能需要强于确认弹窗的验证方式。

### 行内汇总查询列表

- 规则模板：`list.inline-summary`
- 适用条件：查询结果只需 1 至 2 个轻量指标，并且这些指标应服务于结果工具栏扫描。
- 规则：
- `BL-TPL-001` `query-list-family`（查询列表家族） 当主要任务是查找、比较或处理一组记录时，使用查询列表家族。它必须包含查询语义、结果表格、分页，以及 Loading、空数据和错误状态。
- `BL-TPL-010` `list-module-composition`（列表模块组合） 常规列表严格由一个查询任务模块和一个结果任务模块组成；两者是直接同级，间距 `16px`，Table 和 Pagination 必须留在白色结果模块内。
- `BL-TPL-011` `list-summary-selection`（列表汇总选择） 1 至 2 个轻量指标使用 Toolbar 内联汇总；3 至 5 个重要指标使用结果模块内的一行统计卡片。同一组指标不能同时使用内联汇总和统计卡片。
- `BL-INT-001` `information-hierarchy`（信息层级） 按任务依赖关系排列信息：页面上下文、必要摘要、查询或输入、主要结果、行级或后续操作、补充说明。统计和装饰不得把主要任务挤出首个有效视口。
- `BL-INT-003` `query-state-management`（查询状态管理） 查询应应用明确的用户条件，并正确重置分页；重置应恢复声明的默认值、清除临时勾选并返回可预期的数据集；展开/收起必须保留已输入的值。
- `BL-INT-008` `page-state-recovery`（页面状态恢复） Loading、首次空数据、查询无结果、请求错误、无权限和缺少前置条件是不同状态，必须使用不同文案和恢复方式。

### 统计卡片查询列表

- 规则模板：`list.card-summary`
- 适用条件：查询结果需要 3 至 5 个重要指标，且统计不承担独立业务操作。
- 规则：
- `BL-TPL-001` `query-list-family`（查询列表家族） 当主要任务是查找、比较或处理一组记录时，使用查询列表家族。它必须包含查询语义、结果表格、分页，以及 Loading、空数据和错误状态。
- `BL-TPL-010` `list-module-composition`（列表模块组合） 常规列表严格由一个查询任务模块和一个结果任务模块组成；两者是直接同级，间距 `16px`，Table 和 Pagination 必须留在白色结果模块内。
- `BL-TPL-011` `list-summary-selection`（列表汇总选择） 1 至 2 个轻量指标使用 Toolbar 内联汇总；3 至 5 个重要指标使用结果模块内的一行统计卡片。同一组指标不能同时使用内联汇总和统计卡片。
- `BL-VIS-009` `card-boundary`（卡片边界） Card 只用于指标、重复对象和真正需要框定的任务单元。页面分区不应自动套 Card，Card 内不得再放装饰性子 Card。
- `BL-INT-001` `information-hierarchy`（信息层级） 按任务依赖关系排列信息：页面上下文、必要摘要、查询或输入、主要结果、行级或后续操作、补充说明。统计和装饰不得把主要任务挤出首个有效视口。
- `BL-INT-003` `query-state-management`（查询状态管理） 查询应应用明确的用户条件，并正确重置分页；重置应恢复声明的默认值、清除临时勾选并返回可预期的数据集；展开/收起必须保留已输入的值。
- `BL-INT-008` `page-state-recovery`（页面状态恢复） Loading、首次空数据、查询无结果、请求错误、无权限和缺少前置条件是不同状态，必须使用不同文案和恢复方式。

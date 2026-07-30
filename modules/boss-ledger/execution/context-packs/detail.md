# 老板管账详情规则包

> 由导演规则编译。请勿直接编辑。

## 当前策略

- 页面族：`detail`
- 状态：available / shadow
- 已开放能力：`detail.groups`、`detail.metrics`、`detail.embeddedTable`、`detail.modal`、`detail.drawer`、`detail.anchors`、`detail.tabs`

## 可选方案

### 受控记录详情

- 规则模板：`detail.record`
- 适用条件：只读查看一个业务对象；根据上下文连续性和信息规模选择 Modal、Drawer 或独立详情页。
- 规则：
- `BL-TPL-003` `page-family-routing`（页面家族路由） 创建、编辑、配置或提交一个业务对象时使用表单家族；只读查看时使用详情家族；结果页只用于已知来源操作的反馈，除非策略明确允许其作为独立入口。
- `BL-TPL-009` `detail-container-selection`（详情承载选择） 需要保留列表上下文的简短行详情使用 Drawer；极短、单目的的快速查看可使用 Modal；分组很多、包含长表格、锚点或需要独立后续操作时，使用完整详情页或 Shell Tab。
- `BL-TPL-013` `list-detail-boundary`（列表详情边界） 列表详情只在信息有边界且只读时使用 Drawer。嵌套工作流、大量子数据或很长的操作历史不能隐藏在 Drawer 内。
- `BL-VIS-014` `detail-structure`（详情结构） 详情信息使用分组 `Descriptions` 或结构化分区展示，不能把单个字段做成 Card。详情过长时，只有在分组数量已经影响直接扫描效率的情况下才增加锚点或分区导航。
- `BL-VIS-019` `standalone-page-context`（独立页上下文） 独立表单页和独立详情页的业务上下文由固定 Shell 的当前 Tab 承担；任务模块内不得重复渲染页面名称或“独立表单页面”“独立详情页面”之类的泛化标题。需要分段时，只显示业务信息组标题。
- `BL-INT-004` `context-preservation`（上下文保持） 分页、排序、列设置、Drawer 查看和可恢复的失败状态应尽量保留当前列表上下文。关闭 Drawer 或 Modal 不能悄悄重置来源列表。

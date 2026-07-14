# Page Design: 新增商户白名单配置查询页

## 1. Selected Page Template

- Main Template: 查询列表页 / `template-03-query-list-regular.md`
- Supporting Template(s): `template-01-framework-shell.md`、`template-06-modal-form.md`、`template-09-drawer-detail.md`
- Template Source Files: `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`、`specs/themes/boss-ledger-extractions/template-03-query-list-regular.md`、`specs/themes/boss-ledger-extractions/template-06-modal-form.md`、`specs/themes/boss-ledger-extractions/template-09-drawer-detail.md`
- Reason: 主流程是查询列表；新增能力是 6 字段以内的小型表单，使用 Modal；详情是列表行辅助查看，使用 Drawer。
- Includes Query Summary: No

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`
- Routing Reason: 查询、配置、新增弹窗和详情属于运营后台管理场景；用户未指定平台时默认 Boss Ledger。
- Mixed Theme Sources: No

## 3. Page Structure

1. Boss Ledger 固定框架层：顶部信息栏、一级导航、左侧二级/三级导航、Tabs。
2. 查询条件模块：三列查询表单，6 个查询字段全部展示，不提供展开/收起。
3. 查询结果模块：工具栏、表格、列设置、分页。
4. 新增白名单 Modal：官方 Ant Design Modal 表单。
5. 详情 Drawer：官方 Ant Design Drawer + Descriptions。
6. Footer：位于内容滚动流末尾。

## 4. Module Design

### 查询条件模块

- Purpose: 帮助运营人员按关键条件快速定位白名单配置。
- Content: 商户编号、商户名称、白名单类型、状态、创建时间、生效范围、操作人。
- Actions: 重 置、查 询。
- States: 默认、查询中、查询失败。
- Notes: 查询字段为 7 个，按 Boss Ledger 规则默认收起展示前 5 个字段，并展示“展 开 / 重 置 / 查 询”；展开后展示全部 7 个字段，查询动作区固定在三列网格最右列。

### 查询结果模块

- Purpose: 承载白名单配置记录和行级操作。
- Content: Ant Design Table、Pagination、下载Excel、新 增、列设置。
- Actions: 新 增、下载Excel、列显隐、查看详情、编辑、更多。
- States: loading、empty、error、分页、列隐藏。
- Notes: 操作列最多直接展示两个文字操作，其余收纳进“更多”Dropdown；列设置为 icon-only `SettingOutlined`。

### 新增白名单 Modal

- Purpose: 在不离开列表上下文的情况下新增商户白名单配置。
- Content: 商户编号、白名单类型、生效范围、有效期、申请原因、备注。
- Actions: 取 消、确 认。
- States: 表单校验、提交确认、提交中、提交成功、提交失败。
- Notes: 表单 Modal 宽度 500px；标题区和底部按钮区使用通栏灰色分割线；提交确认使用 Ant Design `Modal.confirm`。

### 详情 Drawer

- Purpose: 展示单条白名单配置的完整业务信息。
- Content: 基础信息、配置信息、审批信息、操作信息。
- Actions: 关 闭。
- States: 默认、加载中、无权限。
- Notes: 详情字段使用 Ant Design `Descriptions` 默认非边框样式，不使用表格化详情布局。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 商户编号 | Input | 精确查询商户编号 | 空 |
| 商户名称 | Input | 模糊查询商户名称 | 空 |
| 白名单类型 | Select | 按业务白名单类型筛选 | 全部 |
| 状态 | Select | 按配置状态筛选 | 全部 |
| 创建时间 | RangePicker | 按创建时间范围筛选 | 空 |
| 生效范围 | Select | 按单商户、商户集团、门店组筛选 | 全部 |
| 操作人 | Input | 按创建人或更新人筛选 | 空 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 商户编号 | merchantNo | 商户唯一编号 | 普通文本 |
| 商户名称 | merchantName | 商户展示名称 | 普通文本 |
| 白名单类型 | whitelistType | 权限或策略类型 | 普通文本 |
| 生效范围 | scope | 白名单覆盖范围 | 普通文本 |
| 有效期 | validPeriod | 配置有效期 | 普通文本 |
| 状态 | statusText | 当前生效状态 | 状态点 + 文本 |
| 创建人 | creator | 配置创建人 | 普通文本 |
| 更新时间 | updatedAt | 最近更新时间 | 时间文本 |
| 操作 | action | 行级操作 | 查看详情、编辑、更多 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 商户编号 | Input | Yes | 必填，支持 8-32 位字母数字 |
| 白名单类型 | Select | Yes | 必填 |
| 生效范围 | Select | Yes | 必填 |
| 有效期 | RangePicker | Yes | 必填，结束时间不能早于开始时间 |
| 申请原因 | Input.TextArea | Yes | 必填，最多 100 字 |
| 备注 | Input.TextArea | No | 最多 100 字 |

## 8. Actions

### Page Actions

- 查 询：按当前条件刷新列表。
- 重 置：清空条件并恢复第一页。
- 新 增：打开新增白名单 Modal。
- 下载Excel：导出当前筛选结果。
- 列设置：通过 Checkbox 显隐非操作列。

### Row Actions

- 查看详情：打开 Drawer 查看完整信息。
- 编辑：预留编辑入口，当前预览用提示反馈。
- 更多：收纳停用、查看日志等低频操作。

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 生效中 | 绿色状态点 + 生效中 | 查看详情、编辑、停用、查看日志 |
| 待生效 | 蓝色状态点 + 待生效 | 查看详情、编辑、查看日志 |
| 已过期 | 灰色状态点 + 已过期 | 查看详情、查看日志 |
| 已停用 | 红色状态点 + 已停用 | 查看详情、查看日志 |

## 10. Interaction Rules

- Tabs 可切换；无数据 Tab 激活后展示 Ant Design Empty。
- 左侧导航使用 Ant Design Menu，二级菜单支持官方展开/收起。
- 左下角收起/展开图标左对齐，使用 `MenuFoldOutlined` / `MenuUnfoldOutlined`。
- 查询字段为 7 个，默认收起展示前 5 个字段，第二行第三列展示“展 开 / 重 置 / 查 询”；展开后展示全部字段并展示“收 起 / 重 置 / 查 询”。
- 新增提交先执行表单校验，再用 `Modal.confirm` 二次确认。
- 新增成功后关闭 Modal、提示成功并刷新列表。
- 详情 Drawer 关闭后保留列表上下文。
- 列设置使用 Dropdown + Checkbox，操作列不建议隐藏。

## 11. Empty / Loading / Error

### Loading

查询时表格使用 Ant Design Table loading；新增提交按钮展示 loading。

### Empty

无查询结果时表格展示 Ant Design Empty，文案为“暂无白名单配置”。

### Error

查询失败时使用 message 或 notification 告知“查询失败，请稍后重试”，保留当前查询条件。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、内容背景 `#F4F4F4`、固定框架层、左侧导航、Tabs、查询区和表格区规则。
- 不混用其他平台 theme。
- Modal、Drawer、Table、Form、Menu、Tabs、Pagination、Descriptions 均使用 Ant Design 真实组件。
- 详情不使用 bordered Descriptions，不使用表格化详情。
- 页面模块间距保持 `16px`，业务模块通过白色背景和页面灰底区分层级。

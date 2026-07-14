# Page Design: 新增商户资料审核页面

## 1. Selected Page Template

- Template: 审核处理页
- Reason: 需求核心是商户资料审核，符合资料审核、审核列表、审核详情和审核操作场景。

## 2. Target Theme

- Theme: boss-ledger
- Theme Source: `specs/themes/boss-ledger.md`

## 3. Page Structure

1. Boss Ledger 固定框架层：顶部信息栏、一级导航、左侧导航、Tabs 页面标题区
2. 查询条件区
3. 审核列表工具栏
4. 审核任务表格
5. 分页
6. 商户资料详情抽屉
7. 审核操作弹窗

## 4. Module Design

### 查询条件区

- Purpose: 帮助审核人员快速定位审核任务。
- Content: 审核单号、商户编号、商户名称、资料类型、审核状态、提交时间。
- Actions: 展开 / 收起、重 置、查 询。
- States: 默认、查询中、查询失败。
- Notes: 按 Boss Ledger 主题使用三列查询布局，按钮右对齐。

### 审核列表区

- Purpose: 展示当前查询条件下的商户资料审核任务。
- Content: 审核单号、商户信息、资料类型、提交时间、审核状态、当前节点、审核人、操作。
- Actions: 查看、审核。
- States: loading、empty、error、normal。
- Notes: 待审核任务显示“审核”操作，已审核任务只保留“查看”。

### 详情抽屉

- Purpose: 展示商户主体资料、联系人资料、结算资料和审核记录。
- Content: 基础信息、证照信息、结算信息、操作记录。
- Actions: 关闭、审核。
- States: 默认、加载中、加载失败。
- Notes: 从列表打开详情不新增 Tab，保留主列表状态。

### 审核弹窗

- Purpose: 承载审核通过和审核驳回操作。
- Content: 审核结果、驳回原因、确认提示。
- Actions: 取 消、确 认。
- States: 默认、提交中、校验失败、提交失败。
- Notes: 驳回必须填写原因；通过和驳回都需要二次确认。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 审核单号 | Input | 按审核任务编号精确查询 | 空 |
| 商户编号 | Input | 按商户编号查询 | 空 |
| 商户名称 | Input | 按商户名称模糊查询 | 空 |
| 资料类型 | Select | 主体资料、证照资料、结算资料、联系人资料 | 全部 |
| 审核状态 | Select | 待审核、审核通过、审核驳回、处理中、已失效 | 待审核 |
| 提交时间 | RangePicker | 按资料提交时间范围查询 | 最近 7 天 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 审核单号 | auditNo | 审核任务唯一编号 | 文本 |
| 商户编号 | merchantNo | 商户唯一编号 | 文本 |
| 商户名称 | merchantName | 商户主体名称 | 超长省略 |
| 资料类型 | materialType | 本次审核资料类型 | 文本 |
| 提交时间 | submitTime | 商户提交资料时间 | 日期时间 |
| 审核状态 | status | 当前审核状态 | 状态点 + 文本 |
| 当前节点 | node | 初审、复审等节点 | 文本 |
| 审核人 | auditor | 当前或最终审核人 | 空值展示 - |
| 操作 | actions | 行内操作 | 查看、审核 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 审核结果 | Radio | 是 | 必须选择通过或驳回 |
| 驳回原因 | TextArea | 条件必填 | 选择驳回时必填，最多 200 字 |
| 审核备注 | TextArea | 否 | 最多 200 字 |

## 8. Actions

### Page Actions

- 查 询
- 重 置
- 导 出
- 列设置

### Row Actions

- 查看
- 审核

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 待审核 | warning 状态点 + 文本 | 查看、审核 |
| 审核通过 | success 状态点 + 文本 | 查看 |
| 审核驳回 | error 状态点 + 文本 | 查看 |
| 处理中 | processing 状态点 + 文本 | 查看 |
| 已失效 | default 状态点 + 文本 | 查看 |

## 10. Interaction Rules

- 点击“查 询”后列表进入 loading，完成后刷新表格和分页。
- 点击“重 置”后清空条件并恢复默认待审核列表。
- 点击“查看”打开详情抽屉，关闭后保留列表筛选和分页状态。
- 点击“审核”打开审核弹窗。
- 选择“驳回”时展示驳回原因必填校验。
- 点击“确 认”前展示二次确认。
- 提交中禁用弹窗操作，避免重复提交。
- 操作成功后关闭弹窗、刷新列表，并展示成功反馈。

## 11. Empty / Loading / Error

### Loading

表格查询、详情加载和审核提交均展示 loading 状态。

### Empty

当前查询条件无数据时，在表格区域展示空状态，提示“暂无符合条件的审核任务”。

### Error

查询、详情或审核失败时展示错误反馈，保留当前上下文并允许用户重试。

## 12. Theme Application

说明本页面如何应用当前主题规范。

- 使用当前 theme 的视觉规则
- 不混用其他平台 theme
- 具体颜色、间距、导航、Tabs、查询区、表格区表现以当前 theme 为准

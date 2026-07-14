# Components Spec

## Purpose

本文件定义 Yeepay Page Skill 的通用组件使用规则。

组件规则用于解决：

> 当前功能应该使用什么组件？

本文件只负责组件选择、组件使用边界、交互反馈和状态展示规则。

本文件不负责具体颜色、间距、圆角、阴影等视觉表现。具体视觉表现以 `specs/design-system.md` 和当前选中的 `specs/themes/{theme}.md` 为准。

---

## When to Use

当生成以下内容时，必须读取本文件：

- 页面设计方案
- 前端实现
- 表单设计
- 表格设计
- 弹窗设计
- 抽屉设计
- 状态展示
- 操作反馈
- API 文档类页面

---

## Component Library

默认组件库：

- Ant Design
- Ant Design Icons

规则：

- 优先使用 Ant Design 官方组件。
- 图标必须来自 Ant Design Icons。
- 不允许混用多套视觉风格不同的组件库。
- 不允许随意自造基础组件。
- 业务组件可以基于 Ant Design 进行轻量封装。

---

# Button Rules

## Component

使用：

- `Button`

## Usage

主操作：

- 使用 primary 类型。

次操作：

- 使用 default 类型。

表格行内操作：

- 使用 link 类型。

危险操作：

- 使用 danger 或二次确认。

## Text Rules

两个汉字按钮需要中间加空格。

示例：

- 查 询
- 重 置
- 确 认
- 取 消
- 保 存
- 提 交
- 新 增
- 删 除
- 导 出

## Risk Operation Rules

以下操作必须二次确认：

- 删除
- 驳回
- 停用
- 撤销
- 作废
- 批量处理
- 高风险配置修改

---

# Steps Rules

## Component

使用：

- `Steps`

## Usage

步骤页、分步配置、入驻流程、规则设置流程使用 Steps。

规则：

- 每个步骤项必须配置 `title`。
- Boss Ledger Wizard / Steps 页面中，每个步骤项还必须配置简短 `description`。
- 副描述用于说明该步骤的产出、录入范围或校验重点，不重复标题。
- 不允许在 Boss Ledger Wizard 页面输出只有标题、没有副描述的 Steps。

---

# Form Rules

## Components

使用：

- `Form`
- `Input`
- `InputNumber`
- `Select`
- `DatePicker`
- `RangePicker`
- `Radio`
- `Checkbox`
- `Switch`
- `Upload`

## Query Form Rules

查询表单用于列表筛选。

规则：

- 查询表单位于列表上方。
- 查询表单用于缩小数据范围。
- 查询按钮使用主操作。
- 重置按钮使用次操作。
- 查询项过多时可支持展开 / 收起。
- 查询后需要更新列表数据。
- 重置后需要清空筛选条件并刷新列表。

## Edit Form Rules

编辑表单用于新增、编辑、提交。

规则：

- 必填项必须配置校验。
- 字段校验规则必须清晰。
- 提交前必须校验。
- 提交成功必须反馈。
- 提交失败必须反馈。
- 表单重置需谨慎，避免误清空重要数据。

---

# Table Rules

## Component

使用：

- `Table`

## Required Capabilities

表格必须支持：

- loading 状态
- empty 状态
- pagination 分页
- rowKey
- columns 定义
- 操作列

## Column Rules

表格列需要包含：

- title
- dataIndex
- key
- render，如有必要
- width，如列较多时需要指定

## Operation Column Rules

操作列规则：

- 固定放在最后一列。
- 标题为“操作”。
- 行内操作使用 Button link。
- 操作超过 3 个时使用 Dropdown 收纳。
- 高风险操作使用 `Modal.confirm` 二次确认。

---

# Tag and Status Rules

## Component

使用：

- `Tag`

## Usage

状态字段必须优先使用 Tag 展示。

常见状态映射：

- 成功 / 通过 / 已启用：success
- 失败 / 驳回 / 已停用：error
- 待处理 / 待审核：warning
- 处理中：processing
- 默认 / 未开始：default

## Rules

- 状态颜色优先使用 Ant Design 默认语义色。
- 不随意自定义状态颜色。
- 状态文案必须清晰。
- 状态展示与可用操作必须一致。
- 平台专属状态视觉以当前 theme 为准。

---

# Modal Rules

## Component

使用：

- `Modal`

## Usage

适用于：

- 审核
- 确认
- 删除确认
- 驳回原因填写
- 表单弹窗
- 详情弹窗
- 复杂操作确认

## Rules

- 提交确认、确认 / 二次确认类操作必须使用 Ant Design `Modal.confirm`。
- 高风险操作必须使用 `Modal.confirm` 确认，不使用 `Popconfirm` 或普通受控 `Modal` 承载二次确认。
- `Modal.confirm` 必须保留官方 confirm 结构，`.ant-modal-body` 必须写死为 `padding: 24px !important`，上下左右均为 `24px`。
- 弹窗标题必须明确。
- 弹窗底部按钮顺序为：取消、确认。
- 确认按钮根据操作风险设置类型。
- 弹窗内表单必须有校验。
- 提交时需要 loading。
- 提交成功后关闭弹窗并刷新数据。

---

# Drawer Rules

## Component

使用：

- `Drawer`

## Usage

适用于：

- 详情查看
- 审核详情
- 操作记录
- 不打断主流程的辅助信息

## Rules

- Drawer 适合承载辅助信息。
- 不适合承载复杂多步骤流程。
- 详情类内容应分组展示。
- 关闭后不应丢失主列表状态。

---

# Popconfirm Rules

## Component

使用：

- `Popconfirm`

## Usage

适用于轻量确认提示，但 Boss Ledger 提交确认和二次确认不得使用 Popconfirm。

常见操作：

- 删除
- 停用
- 启用
- 撤销
- 作废

## Rules

- 文案必须明确风险。
- 确认按钮必须有反馈。
- 操作完成后更新页面状态。

---

# Dropdown Rules

## Component

使用：

- `Dropdown`

## Usage

适用于收纳多个低频操作。

规则：

- 行内操作超过 3 个时可使用 Dropdown。
- 高频操作不应被隐藏。
- 风险操作在 Dropdown 中仍需通过 `Modal.confirm` 二次确认。

---

# Message and Notification Rules

## Components

使用：

- `message`
- `notification`

## Usage

轻量反馈使用 `message`。

复杂反馈或需要较长说明时使用 `notification`。

## Rules

需要反馈的场景：

- 查询失败
- 保存成功
- 保存失败
- 审核完成
- 审核失败
- 删除成功
- 删除失败
- 导出成功
- 导出失败

---

# Empty, Loading, Error Rules

## Empty

使用：

- `Empty`

用于无数据状态。

## Loading

使用：

- Table loading
- Button loading
- Spin，如有必要

## Error

错误状态必须提供明确说明。

错误信息应包含：

- 发生了什么
- 用户可以怎么处理
- 是否可以重试

---

# Icons Rules

## Component

使用：

- Ant Design Icons

## Rules

- 图标必须来自 Ant Design Icons。
- 操作类图标必须语义明确。
- 不使用非 Ant Design 图标库。
- 不混用多套图标风格。
- 平台专属图标使用规则以当前 theme 为准。

---

# Documentation Components Rules

适用于文档中心、API 文档、开放平台、开发者中心等场景。

## Recommended Components

- Search
- Tabs
- Table
- Collapse
- Anchor
- Breadcrumb
- Alert
- Tag
- Steps
- Code Block
- Copy Button

## Code Block Rules

代码块用于展示：

- 请求示例
- 响应示例
- SDK 示例
- 签名示例
- 回调示例

规则：

- 代码内容应结构清晰。
- 示例内容需要与参数说明一致。
- 应支持复制。
- 不生成无意义 placeholder。

## Anchor Rules

锚点用于文档详情页快速定位。

规则：

- 锚点应对应当前页面主要标题。
- 不应展示过深层级。
- 点击后应滚动到对应内容区。

---

## Component Checklist

生成组件方案和代码前必须检查：

- [ ] 是否优先使用 Ant Design 组件
- [ ] 是否使用 Ant Design Icons
- [ ] 是否避免自造基础组件
- [ ] 查询表单是否符合规则
- [ ] 表格是否包含 loading / empty / pagination
- [ ] 状态是否使用 Tag
- [ ] 风险操作是否使用 `Modal.confirm` 二次确认
- [ ] 弹窗按钮顺序是否正确
- [ ] 操作反馈是否完整
- [ ] 文档类页面是否使用合适的文档组件
- [ ] 组件视觉表现是否交由当前 theme 控制

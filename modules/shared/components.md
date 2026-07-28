# Components Spec

## Purpose

本文件定义 Yeepay Page Skill 的通用组件使用规则。

组件规则用于解决：

> 当前功能应该使用什么组件？

本文件只负责组件选择、组件使用边界、交互反馈和状态展示规则。

本文件不负责具体颜色、间距、圆角、阴影等视觉表现。具体视觉表现以 `modules/shared/design-system.md` 和当前模块中的 `design.md` 为准。

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

## Drawer Rules

- 详情辅助信息使用 Ant Design `Drawer`。
- Drawer 头部保留 Ant Design 默认高度、内边距、字体和关闭按钮规格，只将标题与关闭 icon 做左 / 右分布；标题区域不得放置状态、Badge、辅助信息或业务操作。
- Drawer 存在业务操作时，操作统一放入官方 `footer` 操作区，正文内不重复放置操作按钮。
- Drawer footer 操作始终右对齐，不得左对齐或居中。
- Drawer 内的业务表单必须使用 `layout="vertical"`：label 位于控件上方并左 / 上对齐，控件默认撑满表单宽度。

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
- 查询列表表单必须使用 `layout="horizontal"`，label 文本右对齐并保持稳定 label 列宽；三列查询网格内所有控件左边缘对齐。

## Edit Form Rules

编辑表单用于新增、编辑、提交。

规则：

- 必填项必须配置校验。
- 字段校验规则必须清晰。
- 提交前必须校验。
- 提交成功必须反馈。
- 提交失败必须反馈。
- 表单重置需谨慎，避免误清空重要数据。
- Modal 编辑 / 新增表单使用横向布局，label 文本右对齐，并按当前表单最长 label 设置统一固定 label 宽度。
- 新增 / 编辑页面（包括新增标签页面）使用纵向布局，label 位于控件上方并左 / 上对齐；不得在一个新增页面中混用横向 label 列和纵向 label。
- Boss Ledger Full-page Form 的取消 / 提交操作必须放入 `.boss-full-page-action-bar`：workspace 级固定栏、高 `48px`、右对齐、位于 Footer 上方；不得作为最后一个表单模块中的普通按钮组。

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

- Boss Ledger 操作列容器必须添加 `data-boss-operation-column`，用于主题样式作用域和自动校验。
- 操作列可点击文字必须显式使用主题主色 `#F36046`；Ant Design `ConfigProvider` 同时配置 `colorPrimary`、`colorLink`、`colorLinkHover`，不能只配置 `colorPrimary`。
- 必须提供 `[data-boss-operation-column]` 作用域样式兜底，覆盖 link 按钮、普通可点击文字和“更多”触发器的 normal / focus / active 文字色。禁止依赖 Ant Design 默认 `#1677FF`，禁止用全局 `.ant-btn-link` 覆盖影响其他业务区域。

按钮与状态列规则：

- 查询、重置、新增、编辑、查看、导出、提交、取消等业务动作按钮默认不配置 `icon`；图标只用于列设置、关闭、侧栏收起 / 展开、全屏等工具类 icon-only 控件。
- 查询列表列设置为 icon-only 工具控件时，使用 `#FAFAFA` 背景；Button、`.anticon` 与内部 SVG 均使用二级文字色 `rgba(0, 0, 0, .45)`，hover / focus / active 不切换为主色，不显示边框或阴影。
- 任何查询列表 Table 都必须默认提供列设置，不得省略；使用 `SettingOutlined` + `Dropdown` / `Popover` + `Checkbox` 实现真实列显隐。
- 查询字段超过 6 个时，展开 / 收起 Button 统一使用 `boss-query-expand-button`，文字与 `DownOutlined` / `UpOutlined` 都使用一级文字色 `rgba(0, 0, 0, .85)`，不得使用二级文字色或品牌色。
- Query / Result 白色模块自身提供唯一的 `16px` 内容内边距；直属统计、Toolbar、Table、Pagination 外层不得再次增加左右 padding。统计卡片内部的 `16px` padding 不属于重复外层 padding，可保留。
- **硬性规则：当直属统计使用灰色 `#F6F6F6` 卡片时，统计区域必须额外声明 `padding-top: 16px` 作为结果内容区上内边距；不得用增加左右 padding 或独立灰色外壳替代。**
- Table Toolbar 不展示 `请选择订单`、`请选择数据`、`请选择记录` 等常驻提示；批量操作缺少勾选项时，仅在触发操作后使用 message/notification 反馈。
- 表格状态列使用 Ant Design `Badge` 的状态点加中文文本，不使用 `Tag` 表示状态。

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

- **硬性规则：整页或空业务 Tab 的 `Empty` 必须置于整体白色业务模块（Boss Ledger Shell 使用 `.boss-shell-empty`）中，并在扣除 Tabs、Footer 后的可用内容区内垂直、水平居中；禁止将裸 `Empty` 直接放在灰色内容背景上。**

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

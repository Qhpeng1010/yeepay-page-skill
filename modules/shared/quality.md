# Quality Spec

## Purpose

本文件定义 Yeepay Page Skill 的质量检查规则。

质量检查用于解决：

> 每次 change 生成后，如何判断产品、页面结构、主题、组件、前端、交互和文案是否合格？

本文件主要约束 `changes/{change-id}/review.md` 的生成。

---

## When to Use

以下阶段必须执行质量检查：

1. 生成 proposal.md 后
2. 生成 page-design.md 后
3. 生成 tasks.md 后
4. 生成 implementation.md 后
5. 最终输出前
6. 准备归档前

---

## Review Output Requirements

在 `changes/{change-id}/review.md` 中必须输出：

1. Validation Summary
2. Product Review
3. Page Template Review
4. Theme Review
5. Component Review
6. Frontend Review
7. HTML Preview Review
8. Interaction Review
9. Copywriting Review
10. Spec Update Review
11. Final Decision

Boss Ledger `review.md` 必须引用 `scripts/verify-boss-ledger-change.mjs` 的完整输出，不允许模型主观写 Pass。

必填状态行：

```text
validate: pass / failed
screenshot: pass / failed
charts: pass / failed
中文文案: pass / failed
```

只要任一状态为 `failed`，Final Decision 必须为 `failed`。不允许使用 `Pass with Notes`。

---

# 1. Product Review

检查产品方案是否完整。

## Checklist

- [ ] 是否明确需求名称
- [ ] 是否保留用户原始需求
- [ ] 是否明确业务对象
- [ ] 是否明确用户角色
- [ ] 是否明确业务目标
- [ ] 是否明确功能范围
- [ ] 是否明确不包含范围
- [ ] 是否明确核心流程
- [ ] 是否明确页面类型
- [ ] 是否明确字段说明
- [ ] 是否明确状态设计
- [ ] 是否明确权限规则
- [ ] 是否考虑异常场景
- [ ] 是否给出验收标准
- [ ] 是否标注合理假设

---

# 2. Page Template Review

检查页面结构是否符合 `modules/shared/page-templates.md`。

## Checklist

- [ ] 是否选择了明确页面模板
- [ ] 是否读取了 `modules/shared/template-routing.md`
- [ ] 是否选择了一个主页面模板
- [ ] 是否读取了对应 `modules/boss-ledger/templates/template-xx-*.md`
- [ ] 是否说明选择原因
- [ ] 是否使用了标准页面结构
- [ ] 是否明确核心模块顺序
- [ ] 是否明确查询条件
- [ ] 是否明确表格字段
- [ ] 是否明确页面操作
- [ ] 是否明确行内操作
- [ ] 是否明确状态设计
- [ ] 是否考虑 loading / empty / error 状态
- [ ] 是否避免创造不受控的新页面结构
- [ ] 是否读取并应用 `modules/boss-ledger/business-rules.md`
- [ ] 查询列表的 `.boss-query-module` 与 `.boss-result-module` 是否为直接同级、始终白底、固定 `16px` 间距，并且结果模块白底完整覆盖 Table 与 Pagination
- [ ] Query / Result 模块是否各自只提供一层 `16px` 内容内边距，直属统计、Toolbar、Table、Pagination 是否未再次叠加左右 padding
- [ ] 卡片汇总统计外层是否使用 `.boss-result-summary` 且无左右 padding，统计卡片自身内边距是否保持独立
- [ ] 灰色 `#F6F6F6` 统计卡片的结果内容区是否硬性保留 `padding-top: 16px`，且未增加左右 padding
- [ ] 每个查询列表 Table 是否默认提供可用的 `SettingOutlined` 列设置，并通过 Dropdown/Popover + Checkbox 支持真实列显隐
- [ ] Table Toolbar 是否移除了 `请选择订单` 等持续占位、教学或选择提示文案

---

# 3. Theme Review

检查是否正确使用平台主题。

## Checklist

- [ ] 是否识别了目标平台
- [ ] 是否读取了 `modules/shared/theme-routing.md`
- [ ] 是否只选择了一个 theme
- [ ] 是否读取了 `modules/shared/design-system.md`
- [ ] 是否读取了对应模块的 `design.md`
- [ ] 是否在 proposal.md 中说明了平台假设
- [ ] 是否避免混用其他平台的主色
- [ ] 是否避免混用其他平台的导航规则
- [ ] 是否避免混用其他平台的页面风格
- [ ] 是否将具体视觉表现交由当前 theme 控制
- [ ] Boss Ledger 页面是否只读取 `modules/boss-ledger/design.md`，且没有混用 `modules/open-platform/theme.md`
- [ ] `rules-read.md` 是否以当前哈希证明已完整读取共享 DESIGN 源、Boss Ledger DESIGN 主题源与固定框架规则

## Theme Selection Rules

- 如果需求属于 Boss Ledger、运营后台、商户后台、审核后台、查询列表、商户资料、结算记录、配置管理等场景，应使用 `modules/boss-ledger/design.md`。
- 如果需求属于 YOP、开放平台、开发者中心、API 文档、产品文档中心、接口详情、错误码、接入流程等场景，应使用 `modules/open-platform/theme.md`。
- 如果用户未说明平台，默认使用 Boss Ledger，并在合理假设中说明。

---

# 4. Component Review

检查组件使用是否符合 `modules/shared/components.md`。

## Checklist

- [ ] 是否优先使用 Ant Design 组件
- [ ] 是否使用 Ant Design Icons
- [ ] 是否避免自造基础组件
- [ ] 查询表单是否使用 Form
- [ ] 查询列表 Form 是否使用横向布局，label 文字右对齐、label 列宽稳定，三列内控件左边缘对齐
- [ ] 输入控件是否使用 Input / Select / DatePicker 等标准组件
- [ ] 表格是否使用 Table
- [ ] 状态是否使用 Tag
- [ ] 表单弹窗是否使用 Ant Design Modal
- [ ] Modal 表单是否使用横向布局，label 文字右对齐，并按当前表单最长 label 设置统一固定宽度
- [ ] 提交确认和二次确认是否使用 Ant Design `Modal.confirm`
- [ ] Wizard / Steps 页面中，Ant Design `Steps` 的每个步骤项是否都包含副描述 `description`
- [ ] Modal 标题区下方是否有 `1px solid #F0F0F0` 灰色分割线
- [ ] Modal 底部按钮区上方是否有 `1px solid #F0F0F0` 灰色分割线
- [ ] 普通非确认 Modal 内容区 `.ant-modal-body` 是否使用 `padding: 24px 24px 0`
- [ ] `Modal.confirm` 的 `.ant-modal-body` 是否写死为 `padding: 24px !important`，上下左右均为 `24px`
- [ ] 详情辅助信息是否合理使用 Drawer
- [ ] Drawer 头部是否保留 Ant Design 默认高度、间距、字体和按钮规格，仅做标题左 / 关闭 icon 右分布，且未加入状态或辅助信息
- [ ] Drawer 有业务操作时，操作是否统一位于官方 footer 操作区，正文内未重复放置
- [ ] Drawer footer 内操作按钮是否始终右对齐
- [ ] Drawer 表单是否使用纵向布局，label 位于控件上方左 / 上对齐，控件占满可用宽度
- [ ] 风险操作是否使用 `Modal.confirm` 二次确认，且未使用 Popconfirm 或普通受控 Modal
- [ ] 操作反馈是否使用 message 或 notification
- [ ] 文档类页面是否使用合适的文档组件

---

# 5. Frontend Review

检查前端实现是否符合 `modules/shared/frontend.md`。

## Checklist

- [ ] 是否使用 React
- [ ] 是否使用 TypeScript
- [ ] 是否使用 Ant Design
- [ ] 是否使用 Ant Design Icons
- [ ] 是否避免 any
- [ ] 是否定义业务数据类型
- [ ] 是否定义查询参数类型
- [ ] 是否定义状态枚举
- [ ] 是否拆分 types.ts
- [ ] 是否拆分 mock.ts
- [ ] 是否拆分 columns.tsx
- [ ] 是否拆分 index.module.less
- [ ] 是否包含 loading 状态
- [ ] 是否包含 empty 状态
- [ ] 是否包含 error 状态
- [ ] 是否包含分页
- [ ] 是否包含操作反馈
- [ ] 是否可以接入真实接口

---

# 6. HTML Preview Review

检查 HTML 预览文件是否符合要求。

HTML Preview Review 用于确认 `changes/{change-id}/preview.html` 是否可以作为页面设计和主题风格的快速评审文件。

## Checklist

- [ ] 是否在本次 change 输出中生成了 `preview.html`
- [ ] 用户要求“不用写代码”时，是否仍然生成了 `preview.html`
- [ ] 是否明确 `preview.html` 是评审预览产物，不属于正式生产前端代码
- [ ] 是否输出到 `changes/{change-id}/preview.html`
- [ ] 是否是完整 HTML 文件
- [ ] 是否包含 `<!DOCTYPE html>`
- [ ] 是否包含 `<html>`、`<head>`、`<body>`，并正确加载当前主题所需样式
- [ ] 是否可以独立打开
- [ ] Boss Ledger 是否使用脚手架生成的 `shell.css`、`content-base.css` 和 `business.css`，且未内联或重写框架样式
- [ ] 是否不依赖构建工具或项目工程环境
- [ ] Boss Ledger 是否按主题硬约束引用 React / Ant Design / Ant Design Icons
- [ ] 是否不依赖外部远程图片资源；Boss Ledger Logo 是否引用或原样复制 `modules/boss-ledger/assets/boss-logo.svg`，未使用临时 SVG 占位或自由设计 logo
- [ ] 是否正确识别当前 theme
- [ ] 是否读取并应用了 `modules/shared/design-system.md`
- [ ] 是否读取并应用了对应模块的 `design.md`
- [ ] 是否遵守 `modules/shared/page-templates.md`
- [ ] 是否遵守 `modules/shared/components.md`
- [ ] Boss Ledger 页面是否遵守 `modules/boss-ledger/design.md` 中的平台专属组件与交互契约
- [ ] 是否没有混用其他平台视觉规则
- [ ] 是否与 `page-design.md` 的页面结构一致
- [ ] 是否与 `proposal.md` 的字段、状态、操作一致
- [ ] 是否包含当前页面类型的核心模块
- [ ] 是否使用真实业务文案，而不是 `test`、`aaa`、`xxx` 等无意义占位内容
- [ ] 是否没有使用不符合当前业务平台的装饰样式
- [ ] 是否明确 preview.html 不是最终生产代码

## Theme-specific Checks

### Boss Ledger

当 theme 为 `boss-ledger` 时，需要检查：

- [ ] 是否使用 Boss Ledger 主题规范
- [ ] 是否先运行 `node scripts/scaffold-boss-ledger-preview.mjs changes/{change-id}`，且只修改 `preview-app.js` 和 `business.css`
- [ ] 是否运行 `node scripts/verify-boss-ledger-change.mjs changes/{change-id}/preview.html`
- [ ] `review.md` 是否引用校验脚本输出
- [ ] 是否引用 React / Ant Design / Ant Design Icons
- [ ] 是否没有手写原生 `input`、`select`、`table`、`button`
- [ ] 左侧二级 / 三级导航是否在任何情况下都使用 Ant Design Menu 或项目内基于 Ant Design Menu 的封装
- [ ] 二级菜单是否保持可折叠，未降级为静态分组或手写列表
- [ ] 二级菜单的 Ant Design 官方 submenu arrow 是否真实可展开 / 收起；受控 `openKeys` 是否接入 `onOpenChange`，未被写死
- [ ] 左下角收起 / 展开 icon 是否始终左对齐
- [ ] 是否只有当前激活 Tab 左侧使用静态 `ReloadOutlined`，非激活 Tab 不显示左侧 icon
- [ ] 是否没有英文默认文案：`Start date`、`End date`、`OK`、`Cancel`、`No data`、`items/page`
- [ ] 是否没有把 `chart-fallback` 当作正式图表
- [ ] 是否使用 `img` / 项目图片组件承载 Logo
- [ ] Dashboard/分析页条件是否左置、日期时间范围是否右置，且未出现查询列表动作区
- [ ] Dashboard 统计是否遵守总数据在上、子数据在下和白色模块分隔规则
- [ ] 查询统计标题是否包含单位，数值是否不重复追加单位
- [ ] 金额列标题是否包含 `(元)`，表头、单元格、汇总和固定列副本是否统一右对齐
- [ ] 是否加载本地 Ant Design Charts 运行时并使用 `Line` / `Column` / `Pie` 等官方组件
- [ ] 详情、审核信息、配置摘要是否使用 Ant Design `Descriptions` 默认非边框样式，未使用 `Descriptions bordered` 或表格形态详情展示
- [ ] Wizard / Steps 页面中每个 Ant Design Steps 项是否都有简短副描述，且不是只有标题
- [ ] Wizard 是否仅使用当前 Tab 作为页面标题，未渲染重复业务标题、eyebrow、H1/H2 标题块或标题占位空间
- [ ] Wizard 是否从 Steps 开始内容区，未在顶部 header 放置“返回列表 / 返回查询 / 退出新增”
- [ ] Wizard 预览业务内容是否保持白底、无灰色汇总块、无表单 / 插图区分割线
- [ ] 成功页是否使用官方 Ant Design `Result status="success"` 默认 icon，未自定义 icon 或覆盖其样式
- [ ] Wizard 底部操作栏是否为 workspace 级 `position: fixed`、48px 高、吸附在 Footer 上方
- [ ] Full-page Form 底部操作栏是否为 workspace 级 `.boss-full-page-action-bar`、`position: fixed`、48px 高、吸附在 Footer 上方，并为内容预留安全底部空间
- [ ] Steps、表单 / 确认区与插图是否作为整体在可用内容区垂直居中
- [ ] 内容区业务模块是否没有 `border: 1px`
- [ ] 查询动作区是否在三列网格最右侧
- [ ] 查询统计是否位于表格模块内部
- [ ] 轻量 inline 查询统计存在时，是否未再展示 `查询列表`、`查询结果` 等结果区大标题
- [ ] 轻量 inline 查询统计存在时，是否占用原结果区大标题的左侧 toolbar 位置，并与右侧工具按钮同一行
- [ ] 操作列所有可点击文字按钮是否统一使用 Boss Ledger 主色 `#F36046`，且未把次操作渲染成灰色
- [ ] 操作列容器是否包含 `data-boss-operation-column`，`ConfigProvider` 是否同时设置 `colorPrimary`、`colorLink`、`colorLinkHover`
- [ ] 操作列是否存在 scoped CSS 主题色兜底，且最终未呈现 Ant Design 默认蓝色 `#1677FF`
- [ ] 操作列可点击文字按钮 hover / focus 是否只改变文字色，未出现灰色底、描边底或块状背景
- [ ] 业务动作按钮是否默认无 icon，只有工具类 icon-only 控件使用图标且具备 Tooltip / aria-label
- [ ] 表格状态列是否使用 Badge 状态点 + 中文文本，且未用 Tag 作为状态列
- [ ] 查询列表分页是否默认展示 pageSize 切换器，且已中文化为 `条/页`
- [ ] 查询列表分页是否使用 Ant Design 默认分页规格，未被 Table compact / mini 配置缩小
- [ ] 列设置是否使用 `#FAFAFA` 背景，Button、`.anticon` 和 SVG 是否始终为二级文字色 `rgba(0, 0, 0, .45)`，且 hover / focus / active 未切换为主色
- [ ] 查询展开 / 收起文字与 icon 是否使用一级文字色 `rgba(0, 0, 0, .85)`，未使用二级文字色或品牌主色
- [ ] 结果模块是否由自身提供唯一 `16px` 内容内边距，统计、Toolbar、Table、Pagination 直属区域是否没有额外左右 padding
- [ ] Form label 到 control 是否为最终视觉间距 `8px`，且未被业务 CSS 再次叠加间距
- [ ] 新增 / 编辑页面（包括新增标签页面）是否使用纵向布局，label 位于控件上方左 / 上对齐
- [ ] 查询条件正好等于 6 个时，`重 置` / `查 询` 是否作为第 7 个独立展示位另起一行放在三列网格最右侧，且未与第 6 个条件合并在同一格
- [ ] pageSize 下拉浮层是否未被表格、内容滚动区或 footer 遮挡
- [ ] Chrome 截图是否非空白
- [ ] 是否生成 `changes/{change-id}/preview.screenshot.png`
- [ ] 首屏是否包含 Boss Ledger 顶栏、一级导航、左侧菜单、Tabs、业务内容
- [ ] 截图区域是否无大块灰色空白或错误提示
- [ ] 平台 footer 是否由固定 Shell 自动渲染在内容滚动流末尾，业务页面未重复创建 footer
- [ ] `.boss-shell-content` 是否使用 `padding: 0 16px`，Footer 是否使用 `margin: 12px 0 0`
- [ ] Footer 是否固定为 `32px` 且不可收缩，并保持普通内容流；内容超过屏幕时是否自然将 Footer 向下推，而非 fixed / sticky 覆盖内容
- [ ] 是否符合运营后台 / 商户后台 / 审核后台页面风格
- [ ] 是否避免 YOP 开放平台或开发者文档风格
- [ ] 是否保持清晰、稳定、克制、高效的后台页面表现

### YOP

当 theme 为 `yop` 时，需要检查：

- [ ] 是否使用 YOP 主题规范
- [ ] 是否符合开放平台 / 开发者中心 / API 文档中心页面风格
- [ ] 是否避免 Boss Ledger 运营后台风格
- [ ] 是否突出文档阅读、API 参数、代码示例、错误码和接入流程

## Decision

结论：pass / failed

---

# 7. Interaction Review

检查交互是否完整。

## Checklist

- [ ] 查询操作是否有 loading
- [ ] 重置操作是否清空查询条件并刷新列表
- [ ] 新增 / 编辑 / 审核 / 删除是否有反馈
- [ ] 高风险操作是否通过 `Modal.confirm` 二次确认
- [ ] 表单提交前是否校验
- [ ] 表单提交失败是否提示
- [ ] 表单提交成功是否关闭弹窗并刷新数据
- [ ] 页面无数据时是否展示空状态
- [ ] 整页或空业务 Tab 的 Empty 是否位于整体白色业务模块中，并在可用内容区垂直、水平居中，未直接落在灰色背景上
- [ ] 页面异常时是否展示错误反馈
- [ ] 权限不足时是否隐藏或禁用相关操作
- [ ] 抽屉或弹窗关闭后是否保留主页面状态

---

# 8. Copywriting Review

检查文案是否符合后台产品和文档产品规范。

## Checklist

- [ ] 按钮文案是否清晰
- [ ] 两个汉字按钮是否加空格
- [ ] 状态文案是否明确
- [ ] 错误提示是否可理解
- [ ] 确认提示是否说明风险
- [ ] 空状态文案是否合理
- [ ] 不使用口语化、营销化文案
- [ ] 不使用模糊描述，如“操作一下”“处理一下”
- [ ] API 文档类页面是否使用准确技术文案

---

# 9. Spec Update Review

每次 change 完成后，需要判断是否需要更新 specs。

## Should Update Specs

如果本次需求产生以下内容，需要建议更新 specs：

- 新增可复用页面模板
- 新增可复用业务 Pattern
- 修改全局设计规则
- 修改组件使用规则
- 修改前端实现规则
- 修改质量检查规则
- 沉淀出多个页面都适用的业务规则
- 新增业务平台主题规则

## Should Not Update Specs

如果本次需求只是普通页面实现，不产生通用规则，则不需要更新 specs。

---

# Final Decision

最终结论只能使用以下两种之一：

## Pass

表示产物符合要求，可以进入实现或归档。

## Failed

表示产物不符合要求，需要返回修改。

禁止输出 `Pass with Notes`。如果存在备注但所有硬校验均通过，Final Decision 仍写 `pass`，备注放入检查说明。

---

# Review Template

```md
# Review

## Validation Summary

整体结果：pass / failed

canonical-shell: pass / failed

validate: pass / failed

screenshot: pass / failed

charts: pass / failed

中文文案: pass / failed

校验脚本：

```text
node scripts/verify-boss-ledger-change.mjs changes/{change-id}/preview.html
```

校验脚本输出摘录：

```text
{{validation_output}}
```

## 1. Product Review

结论：pass / failed

检查说明：

-

## 2. Page Template Review

结论：pass / failed

检查说明：

-

## 3. Theme Review

结论：pass / failed

检查说明：

-

## 4. Component Review

结论：pass / failed

检查说明：

-

## 5. Frontend Review

结论：pass / failed

检查说明：

-

## 6. HTML Preview Review

结论：pass / failed

检查说明：

-

## 7. Interaction Review

结论：pass / failed

检查说明：

-

## 8. Copywriting Review

结论：pass / failed

检查说明：

-

## 9. Spec Update Suggestion

是否需要更新 specs：

- Yes / No

原因：

-

建议更新文件：

-

## 10. Final Decision

pass / failed
```

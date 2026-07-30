# 抽屉细节

> **历史归档，已废弃。** 自 2026-07-29 起，本文件不再属于资源解析、页面生成、评审、验收或发布的输入。页面方案请使用 `execution/rule-template-registry.json` 和生成的 `execution/context-packs/`。以下内容仅保留作历史追溯。

【详情】：已提取为抽屉细节模板

## 抽屉结构

- Drawer: `x=632`, `y=0`, `w=808`, `h=778`
- Header: `h=56`
- Header title x: `24`
- 关闭图标 x: [C1]]
- 身体：`x=0`，`y=56`，`w=808`，`h=666`
- 底部：`x=0`，`y=722`，`w=808`，`h=56`]
- 底部包含一个右对齐的按钮。
- Drawer header keeps Ant Design's default height, padding, typography, and close-button sizing; only the title-left / close-icon-right distribution is customized. No status, Badge, auxiliary copy, or business action may appear in the header.
- 任何商业操作都应放在Ant Design Drawer `footer`动作区域，且不能放置在详细体中。
- 底部操作始终右对齐。
- 详细内容体内的内容必须不能添加第二个商业级别的内部填充层；使用抽屉内容区域的默认内边距，并设置任何细节包装为`padding: 0`]除非有特定的商业需求说否则。

## 详细内容

- 详细内容框架：`x=24`，`y=24`，`w=760`，`h=540`
- 样本中有三个细节部分。
- 宽度：`760`]
- 高度：`158`]
- y位置：`0`，`191`，`382`]
- 分隔符和位置：`174`，`365`
- 详细网格列的详细信息：
  - 列x位置：`0`，`280`，`560`]
  - 列宽：`200`]
- 状态使用点加文本。

## 模板意图

使用以下模板用于仅读取详情视图，这些视图是从表格行打开的。


## 强制性生成合同

- 这个模板不是一个参考例子；它是一个强制生成骨架的页面类型，其对应的Boss Ledger页面类型。
- When generating this class of Boss Ledger page, the AI must reuse this template structure.
- 商务需求可能仅替换业务内容；它们必须不重新设计模板骨架。
- 如果企业需求与本模板冲突，目前选择的模板和`modules/boss-ledger/design.md`优先级更高。

## 抱歉，我无法完成这个任务。

您可以在“[C0]”和“[C1]”等 placeholder 和 proper names 中进行替换。

- 页面/标签复制
- 主导航 / 左侧菜单复制
- 查询字段
- 表格列
- 状态枚举
- 执行按钮
- 表单字段
- 详细字段
- 统计指标
- 图表数据
- 模拟数据

禁止替换：

- 壳结构
- 顶部信息栏高度
- 主导航高度
- 左侧导航栏宽度
- 选项卡形状
- 内容区域起始点
- 模块间距
- 查询区域布局
- 表格布局
- 分页位置
- 模态/抽屉/步骤/结果/空基结构

## Ant Design Runtime Rules"

- 必须使用真实Ant Design组件或基于Ant Design的项目包装。
- 必须不使用原生的`input`，`select`，`table`或`button`作为替代品。
- 禁止手写菜单、标签、分页、模态、抽屉、或表格。
- 图标必须使用Ant Design Icons。
- 图表必须使用Ant Design Charts或一个项目图表封装。
- 所有默认复制必须被本地化为中文。预览中不应包含`Start date`，`End date`，`OK`，`Cancel`，`No data`或`items/page`。

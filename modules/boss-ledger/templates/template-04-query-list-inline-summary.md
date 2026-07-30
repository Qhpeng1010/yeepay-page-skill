# 提取模板04查询列表总结。

> **历史归档，已废弃。** 自 2026-07-29 起，本文件不再属于资源解析、页面生成、评审、验收或发布的输入。页面方案请使用 `execution/rule-template-registry.json` 和生成的 `execution/context-packs/`。以下内容仅保留作历史追溯。

状态：提取为查询-列表摘要模板

## 内容结构

- 继承模板03查询模块和表模块几何。
- 内容框：`x=224`，`y=140`，`w=1200`，`h=619`]
- 查询模块：`w=1200`，`h=160`
- 结果模块：`y=176`，`w=1200`，`h=443`]

## 摘要工具变体

结果工具栏左侧是一个轻量级的内联统计区域，而不是卡片行。

这个轻量级的内联统计区域取代了常规的结果标题位置。它必须在同一个工具栏行中与右侧的操作按钮相对应。

I'm sorry, but I cannot provide a translation without knowing the English text. Please provide me with the English text so that I can assist you with your request.

- 查询统计：
- 总金额，value example `920.00`], unit 元
- 垂直分割线
- 总字数：`240`]
- 右侧工具栏的操作仍然可用。
- 结果标题`查询列表`必须不在此模板中渲染。轻量级的内联摘要和结果部分标题是相互排斥的；如果摘要存在，则在结果工具栏左侧唯一剩余的文本就是摘要，它使用与移除标题相同的偏置位置。

## 模板意图

这个模板用于列表需要一个小的聚合性摘要，属于表格查询结果。

请不要在需要大量统计卡片的摘要中使用它。请使用模板05。


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

## 查询列表必须规则

- 查询条件使用`Form layout="horizontal"`；标签文本是右对齐的，有一个稳定的标签列和控制共享相同的左边缘。
- 查询模块和结果模块必须是两个白模块的兄弟模块。
- 两模块必须保持明确计算的 `#FFFFFF` 背景，以他们的完整渲染高度。查询模块和结果模块必须是直接子节点的 `boss-content-stack` ，使用 `boss-query-module` 和 `boss-result-module` ，并且被准确分离为 `16px` 个灰色工作区背景中的确切位置。
- 查询模块和结果模块不能被封装在一个共享的白色壳子里。
- 透明查询/结果模块，白色背景仅应用于内部控制/表，以及结果背景在分页之前停止。禁止使用分页之前的分页停止的背景。
- 查询模块和结果模块各自提供唯一的`16px`内容内嵌。直接结果区域(`boss-result-summary`, `boss-result-toolbar`}, {C3}, {C4}))必须不添加水平间距；堆叠模块和子间距，创建一个`32px`内嵌是禁止的。
- 查询字段必须使用三列网格。
- 查询操作区域必须始终位于三个列网格的最右边一列，并对齐右。
- 查询操作顺序固定：展开/收起，重置，查询。
- When expand/collapse is present, its Button must use `boss-query-expand-button`; both text and `DownOutlined` / `UpOutlined` use primary text color `rgba(0, 0, 0, .85)`, not secondary or brand color.
- 结果模块必须包含工具栏、Ant Design表格、分页、列设置等。
- 结果模块中，当轻量级的内联统计被渲染时，不应包含[ C0 ]标题。
- 轻量级的行内统计和右侧工具栏的操作必须在同一工具栏行中渲染；不要将统计作为单独的一行，位于工具栏操作之上。
- 结果模块中的分页必须留在Result Module中，不能离开表格空白模块。
- 列设置必须使用`SettingOutlined`。
- 表格设置默认为必填，适用于所有渲染的表格，并必须实现真正的可见切换功能，使用Ant Design`Dropdown`/`Popover`+`Checkbox`。
- 列设置按钮，`.anticon`和SVG必须都保持正常、悬停、焦点、激活状态的次要文本颜色`rgba(0, 0, 0, .45)`。
- 不要渲染持久的工具栏辅助复制，如`请选择订单`，`请选择数据`，`请选择记录`，或`请先选择`。
- 操作列必须固定在最右侧。
- 操作列文本按钮的粗细必须不为粗体。

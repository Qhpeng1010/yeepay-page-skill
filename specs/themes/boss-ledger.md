# Boss Ledger Theme Spec

## Purpose

本文件定义 Boss Ledger 平台专属页面主题规范。

页面生成时必须同时读取：

- `specs/design-system.md`
- `specs/themes/boss-ledger.md`

本文件只描述 Boss Ledger 平台规则。跨平台通用交互、可访问性、React + TypeScript、Ant Design 基础规则以通用 specs 为准。

## Platform Positioning

Boss Ledger 是易宝面向运营、商户、审核、财务、风控、客服和系统管理场景的后台业务平台。

页面目标是帮助后台用户高频、稳定、低干扰地完成查询、审核、配置、维护、导出、查看详情等任务。

## Design Keywords

- 专业
- 企业级
- 克制
- 中高密度
- 强一致
- 易扫描
- 可操作
- 少装饰
- 低视觉噪音
- 模板化组装

生成原则：AI 不自由设计页面，而是按“页面模板 + 业务模式 + 组件规则 + 主题 token + 自检项”组装页面。若没有完全匹配的模板，选择最接近的 Boss Ledger 页面模板和模式，不发明新框架。

## Mandatory Latest-Rule Execution Contract

本节为 Boss Ledger 最新规则的硬约束，优先级高于通用 `design-system.md`、`page-templates.md`、`components.md`、`frontend.md` 和所有 change 内的临时实现说明。

生成、修改或重做任何 Boss Ledger 页面时必须遵守：

- 必须先读取本文件的完整内容，再读取通用 specs；若发生冲突，以本文件为准。
- 必须复用最新 Boss Ledger 标准壳层与组件实现方式，不允许重新发明页面框架。
- 已沉淀到本文件的规则视为硬约束，不是建议项；不得因业务主题变化而改变 Logo、顶部信息栏、一级导航、左侧导航、Tabs、查询区、表格区、分页、列设置、Modal、Drawer 的基础形态。
- 新业务页面只能替换一级导航文案、左侧菜单文案、Tab 文案、查询字段、表格字段、指标、图表和 mock 数据；不得重新设计平台壳层、导航密度、Tabs 形态、查询区布局、表格密度和操作列规则。
- 生成多页面后台时，所有页面必须共享同一套 Boss Ledger shell、CSS token、Ant Design 主题、菜单 / Tabs / 查询 / 表格组件样式；不得每个页面单独写一套视觉系统。
- 无论业务类型、菜单层级、菜单项数量、左侧栏展开或收起状态如何，左侧二级 / 三级导航都必须使用 Ant Design 官方 `Menu` 或项目内基于 Ant Design Menu 的封装；二级菜单必须保持可折叠，不允许降级为手写 `div` 列表、自绘树、静态导航块或不可收起菜单。
- 二级菜单展开 / 收起必须使用 Ant Design Menu 官方 submenu 交互；如果使用受控 `openKeys`，必须同时接入 `onOpenChange` 并更新状态，不得把 `openKeys` 固定成当前菜单 key 导致官方箭头点击无效。
- 左侧导航底部的收起 / 展开 icon 必须始终在左侧对齐展示，展开态和收起态都不允许居中、右对齐、跟随菜单项居中或移动到内容区；该控制只显示 Ant Design Icons 的 `MenuFoldOutlined` / `MenuUnfoldOutlined`，不显示辅助文字。
- 多标签页只有当前选中的 Tab 标题左侧展示静态刷新 icon，固定使用 Ant Design Icons 的 `ReloadOutlined`；未选中 Tab 不展示左侧 icon。该 icon 不得根据 loading 状态切换，不得使用 `LoadingOutlined`、页面类型 icon 或业务 icon 替代。所有 Tab 必须可点击切换；点击暂无业务数据的 Tab 后，需要激活该 Tab 并在内容区展示 Ant Design `Empty` 空状态，空状态在画面内垂直居中。
- Boss Ledger Logo 必须使用规范内置资产 `specs/boss logo.svg`。生成新 change 包、HTML 预览或正式项目页面时，必须引用该 specs logo，或从该文件原样复制到页面 assets 目录；不得自由发挥、手写、AI 生成、重新绘制或使用旧 change 包内的自定义 Logo。
- 详情、审核信息、配置摘要等 label-value 展示必须使用 Ant Design `Descriptions` 默认非边框样式；禁止使用 `Descriptions bordered`、表格形态描述列表、手写表格式详情网格或任何看起来像表格的详情展示。
- Wizard / Steps 页面中，Ant Design `Steps` 的每个步骤项必须配置简短副描述 `description`；副描述说明该步骤产出或校验重点，不得只重复标题；禁止输出只有标题的 Steps。
- Modal 必须使用 Ant Design 官方 `Modal` / `Modal.confirm` 组件结构，同时 Boss Ledger 业务规则必须显式保证标题区下方灰色分割线和底部按钮区上方灰色分割线均为通栏展示。所有提交确认、二次确认类交互必须使用 Ant Design `Modal.confirm`，不得使用普通受控 `Modal`、`Popconfirm`、手写确认壳层或自定义 Dialog 替代。`Modal.confirm` 必须保留官方 confirm DOM 和交互模型，并且 `.ant-modal-body` 必须写死上下左右 `24px` padding：生成的预览和实现说明必须包含 `.ant-modal-confirm .ant-modal-body { padding: 24px !important; }`，不得被普通 Modal 的 `.ant-modal-body { padding: 24px 24px 0; }` 或 Ant Design 注入样式覆盖。普通非确认 Modal 的 `.ant-modal-content` 不得保留会缩短分割线的左右 padding。普通非确认 Modal 内容区 `.ant-modal-body` 必须使用 `padding: 24px 24px 0`：上 / 左 / 右为 `24px`，底部为 `0`，下方间距由 footer 分割线和 footer 操作区承担。普通表单 Modal 宽度一般控制在 `480-520px`，确认弹窗宽度保持 `416px`。Modal / Drawer 表单 label 在同一个表单内必须对齐：当表单内 label 视觉宽度不一致时，必须按最长 label 设置统一固定宽度；当同一表单内所有 label 等宽时，允许使用内容自适应宽度。label 到 control 间距仍为 `8px`。允许通过 Ant Design Modal 官方插槽 / class、tokens 或项目封装补齐这些业务规则；不得手写弹窗壳层，不得破坏 Ant Design 的标题区、内容区、底部按钮、遮罩、关闭、焦点与键盘交互。
- 可交互 HTML 预览必须使用 React + Ant Design + Ant Design Icons 的真实运行组件，优先复用 `changes/add-merchant-audit-page/index.html` 已验证的壳层结构和样式模式。
- 禁止在 Boss Ledger HTML 预览中使用原生 `input`、`select`、`table`、`button`、手写菜单、手写 Tabs、手写分页、手写弹窗、手写抽屉、手写状态组件来冒充 Ant Design。
- 禁止使用纯 CSS、SVG、Canvas 或静态块手写图表冒充平台图表；正式实现必须接入 Ant Design Charts 或项目内基于 Ant Design Charts 的封装。单文件预览如缺少 Ant Design Charts 本地运行包，必须在实现说明和 review 中标注为“预览图表运行降级”，且仍需使用统一的图表封装组件，不得散落手写图表。
- 如果无法满足以上任一硬约束，应停止生成页面并先补齐规范、模板或运行依赖，不得输出不符合最新规则的页面。
- 内容区内所有同级业务模块之间的外部间距必须统一为 `16px`，包括筛选区到统计区、统计区到图表区、图表区到表格区、工作台输入区到流水区；不得出现 `12px`、`20px` 或由组件默认 margin 造成的不一致间距。
- 内容区业务模块不得添加可见 `1px` 边框色，不得用 `border: 1px solid ...`、描边或边框色来区分查询区、表格区、图表区、统计区等模块；模块层级只通过白色背景、页面灰底和 `16px` 间距表达。
- 全局所有 Ant Design Form 信息项的 label 到 control 右侧间距必须为 `8px`，不只查询列表页生效；分析筛选条、工作台表单、弹窗表单、抽屉表单、配置表单都必须遵守。
- 查询条件模块中的展开 / 收起、重 置、查 询必须始终位于查询条件模块的最右侧；无论查询字段数量、展开状态和最后一行字段数量如何变化，动作区都必须落在三列查询网格的最右列并右对齐。
- 查询条件模块中的展开 / 收起、重 置、查 询不得居中、不得左对齐、不得跟随字段自然流排到中间列；展开 / 收起必须使用二级文字色，不得使用主色或强调色。
- 查询条件数量 6 个及以下时必须默认展示全部查询字段，且不得渲染、显示或预留展开 / 收起入口；包括但不限于 `icon + 展 开`、`icon + 收 起`、纯文字 `展 开` / `收 起`、折叠箭头、空占位按钮。只有查询条件超过 6 个时才允许且必须提供展开 / 收起。查询动作区是独立的查询网格展示位，不属于任何查询字段；当查询条件正好等于 6 个时，6 个条件必须排成完整两行，每行 3 个条件，`重 置` / `查 询` 必须作为第 7 个展示位另起一行，放在三列网格最右侧，不得和第 6 个条件合并在同一个单元格内。
- Table 操作列每一行都必须有且只有一个主操作按钮，默认使用该行最高频动作作为主操作，例如 `查看详情`、`审核`、`办理入住`、`修改房价`、`对账结算`；其他操作为普通文字按钮或“更多”收纳。
- Table 操作列每行最多直接展示两个文字操作。超过两个可用操作时，只展示前两个高频操作，其余操作必须收纳到 Ant Design `Dropdown` 的 `更多` 入口中。
- Table 操作列的所有可点击文字按钮必须统一使用 Boss Ledger 主色 `#F36046`，不得使用二级文字色、灰色或 Ant Design 默认蓝色；禁用 / 无权限操作才允许使用禁用色。
- Table 操作列的所有文字按钮必须使用常规体 `font-weight: 400`，包括主操作按钮；主操作通过排在第一位和业务优先级表达，不通过加粗、灰色差异或其他颜色表达。
- Table 操作列内可点击文字按钮必须沿用 Ant Design Table 的 link 文字交互规则：hover / focus 只改变文字颜色，不出现灰色底、描边底、块状背景或按钮底色。
- 带统计的查询列表页中，统计组件必须位于查询结果模块的最上方，且仍在表格模块内部；统计组件不得放到查询条件区上方、独立白色模块中、工具栏下方或 Table 分页下方。
- 查询统计与结果区大标题是唯一关系：当展示查询统计，尤其是 2 到 3 个指标的轻量 inline 查询统计时，不得再展示 `查询列表`、`列表数据`、`查询结果` 等结果区大标题；轻量统计必须占用原结果区大标题的左侧 toolbar 位置，并与右侧工具按钮处在同一行；结果模块只能保留同一行的统计组件 / 右侧工具按钮、Table、Pagination。
- 查询列表统计数量小于等于 3 个时，使用 14px inline 文本展示，格式为 `标题：xx 元｜标题：xx 元｜标题：xx 元`；inline 标题和值均为 14px，值可使用主色或一级文字色，不使用统计卡片。
- 查询列表统计数量超过 3 个时，使用 Ant Design `Statistic` 卡片统计展示，外层为 `#F6F6F6` 灰色统计容器并均分展示。
- 查询列表统计数量超过 3 个时，每个统计项必须是独立灰色统计卡片，卡片之间必须以 `16px` 间距分块；不得做成一整条灰色统计块后只用竖线、内部分割线或透明 gap 分隔。
- 查询列表统计组件位于 Table 上方时，统计组件下方不得额外增加 `16px` 外边距；统计区与列表标题 / 操作区之间的距离由表格模块内部结构控制，不再叠加模块间距。
- 只有查询列表页 / 带统计查询列表页允许使用 `#F6F6F6` 灰色统计卡片样式。经营数据概览、经营大盘首页、数据分析页、工作台首页等非查询列表页面不得使用灰色统计卡片；这些页面的统计数据必须使用独立白色统计模块展示。
- 经营数据概览、经营大盘首页、数据分析页、工作台首页等 Dashboard / 首页统计汇总模块必须使用“总数据在上，子数据在下”的标准汇总能力：上方只放 1 个主总量指标或主金额指标；下方放子指标网格，最多 4 列、最多 2 行、最多 8 个子数据。不得使用“左侧主指标 + 右侧子指标”的左右分栏结构，不得让子指标超过 2 行；超过 8 个子指标时必须拆分为新的统计模块、排行模块或列表模块。
- 经营数据概览、经营大盘首页、数据分析页、工作台首页等大图表 / 数据统计页的统计项超过 1 个时，必须像同页面图表模块一样，用多个同级白色统计模块均分展示，模块之间通过页面灰色背景和 `16px` 间距分割。
- 大图表 / 数据统计页的统计区不得有统一外层色块或外层统计容器；不得把多个统计项连成一整块只靠竖线、透明背景或内部 gap 分割；不得复用查询列表页的灰色统计容器。
- Boss Ledger 页面必须全局中文展示。Ant Design `DatePicker` / `RangePicker` placeholder、空状态、分页、每页条数、弹窗按钮、表单校验、导出反馈、loading / error / success 反馈均必须使用中文；不得出现 `Start date`、`End date`、`items/page`、`No data`、`OK`、`Cancel` 等英文默认文案。
- 所有表单控件必须显式配置中文默认提示：输入类统一使用 `请输入` 或 `请输入xxx`，选择类统一使用 `请选择` 或 `请选择xxx`，日期范围类使用 `请选择开始日期` / `请选择结束日期`；不得依赖 Ant Design 英文默认 placeholder，也不得留空。

## Brand Tokens

- 平台名称：Boss Ledger
- 主色：`#F36046`
- 主色 hover：`#FF7A66`
- 主色 active：`#D94B35`
- 选中背景：`#FEF2F0`
- 全局内容背景：`#F4F4F4`
- 容器背景：`#FFFFFF`
- 顶部信息栏背景：`#3A3A3A`
- 查询统计块背景：`#FAFAFA`
- 默认边框：`#E5E6EB`
- 浅分割线：`#F0F0F0`
- Tab 分割线：`#E6E6E6`
- 侧边栏收起控制分割线：`#EBEBEB`

语义状态色使用 Ant Design 语义色，不用品牌主色替代状态语义：

- 成功：`#52C41A`
- 警告：`#FAAD14`
- 错误：`#FF4D4F`
- 处理中：`#1677FF`
- 默认：`#86909C`

## Typography

- 普通文字：常规体，`font-weight: 400`
- 普通按钮文字：常规体，`font-weight: 400`
- 二级菜单文字：常规体，不加粗
- 表格普通内容文字：常规体，`font-weight: 400`
- 表格表头文字：可以加粗，推荐 `font-weight: 500`
- 表格操作列文字按钮：常规体，`font-weight: 400`
- `查询列表` 标题可以加粗，推荐 `font-weight: 500`
- 查询统计类型字号：`14px`
- 查询列表类型字号：`16px`
- 数字类字段使用等宽数字能力，如 `tabular-nums`
- 文字颜色层级遵循 Ant Design 标题层级：
  - H1 / 强强调：`rgba(0, 0, 0, .85)`
  - H2 / 常规业务文字：`rgba(0, 0, 0, .65)`
  - H3 / 次要说明文字：`rgba(0, 0, 0, .45)`
  - H4 / 禁用或占位文字：`rgba(0, 0, 0, .25)`

## Radius Rules

- Button：`4px`
- Input：`4px`
- Select：`4px`
- Card：`8px`
- Content Container：`8px`
- Modal：`6px`
- Drawer：无圆角
- 因为页面使用一体化 Tabs，当前 Tab 下方连接的内容容器左上角无圆角。

## Spacing System

- 全局间距基准：`4px`
- 常用间距：`4px`、`8px`、`16px`
- 常用最大间距：`16px`
- 默认模块内边距：`16px`
- 普通模块最大内边距：`20px`
- 查询条件模块上下内边距：`16px`
- 查询区与表格区间距：`16px`
- 表格模块上间距：`12px`
- 表格模块左右下内边距：`16px`
- 表单 label 到 control 间距：`8px`
- 查询字段间距：`16px`
- 按钮间距：`8px`

## Page Background And Shell

Boss Ledger 框架层的唯一 HTML 视觉与交互基准为：

`changes/20260710-boss-ledger-settlement-record-query-list/preview.html`

该基准中的顶部信息栏、一级导航、左侧二级 / 三级导航、侧栏收起控制、多标签栏、内容滚动容器属于固定框架层；查询区、查询统计、表格、分页、抽屉以及结算业务文案属于内容区示例，不得固化为所有页面内容。完整冻结边界和动态配置契约以 `specs/themes/boss-ledger-extractions/template-01-framework-shell.md` 为准。

后续页面不得重新设计或自由改写框架层。生成独立 `preview.html` 时允许复制基准框架实现以保证文件可直接打开，但复制后的框架 DOM、CSS 职责、Ant Design 组件和交互规则必须保持一致，只能注入导航、路由、Tabs 和内容区配置。

一级导航与二级 / 三级导航的名称、数量、顺序、key、路由、当前选中项和展开项均可随业务变化；多标签的名称、数量、顺序、路由、可关闭状态和当前激活项也可变化。这些变化不得改变导航层级上限、框架尺寸、布局、样式或交互机制。

Boss Ledger 页面必须继承固定平台框架层，顺序为：

1. 顶部信息栏
2. 一级导航
3. 左侧二级 / 三级导航
4. Tabs 页面标题区
5. 内容区
6. 平台 footer

框架层不可被页面模板删除、替换、重排或重设计。顶部信息栏、一级导航、左侧导航、Tabs 页面标题区不随业务内容滚动；只有 Tabs 下方内容区可以滚动，平台 footer 应位于该内容滚动区末尾。

内容区规则：

- 内容区背景：`#F4F4F4`
- 内容区左右内边距：`16px`
- 内容区宽度随视口自适应
- 内容区只作为灰色托底，不允许再整体套一层白色大容器
- 内容区内的查询、表格、统计、图表、工作台等业务内容必须始终以独立白色模块展示
- 白色模块之间通过灰色背景和 `16px` 间距区分层级
- 白色模块可以使用 `8px` 圆角和 `#E5E6EB` / `#F0F0F0` 边框，但不得嵌套白色卡片来模拟页面外壳
- Tabs 与内容容器直接连接，中间不留空隙
- 内容尽可能填满可用屏幕高度，尤其是查询类页面
- 左侧二级 / 三级导航和右侧内容区必须共同撑满 Tabs 下方的可用高度
- 页面根容器必须基于 viewport 高度计算，例如 `height: 100vh` 和 `calc(100vh - 顶部信息栏 - 一级导航)`，不只依赖父级 `height: 100%`
- 页面内容不足一屏时，左侧导航和内容区也必须撑满屏幕，不允许页面底部出现大块空白断层
- 查询列表页的内容区应使用纵向 flex 布局，查询条件区和表格模块按内容自适应高度，内容区自身负责纵向滚动
- 表格模块不得因为撑满剩余高度而裁剪分页；低高度视口下，分页必须能随内容区纵向滚动完整可见
- 页面必须始终展示平台 footer，footer 必须放在 Tabs 下方内容滚动容器内部，位于查询区、表格模块之后，和查询区、表格模块属于同一个纵向滚动流
- footer 不独立固定在 shell 底部，不使用 `position: fixed`、`position: sticky`，也不额外占用内容区可用高度；小屏时应优先保证表格分页可滚动展示
- footer 不得作为 `.content` / 内容滚动容器的外部兄弟节点渲染；不得由 shell 单独承载。内容区滚动时，footer 应随查询区和表格模块一起滚动出现。
- footer 文案默认居中展示，颜色使用弱文本色，示例：`© 2026 易宝支付有限公司 版权所有`
- footer 上方必须保留 `12px` 外部间距，生成预览和正式实现必须通过 `.footer { margin-top: 12px; }` 或等价外边距实现；该 12px 不计入 footer 自身高度，不得用表格模块底部 padding、footer 内部 padding、固定定位或 sticky 定位替代
- footer 高度：`32px`
- footer 字号：`12px`
- footer 文案水平居中，但不做垂直居中；文案应贴近 footer 上方展示
- 不固定为 Figma 基准宽度
- 不在页面级制造横向滚动
- 高密表格的横向滚动只允许发生在 Ant Design Table 内部

## Top Info Bar

- 高度：`28px`
- 背景：`#3A3A3A`
- 顶部信息栏文字颜色使用三级导航同级弱文字色，不使用纯白高亮文字
- 用于平台元信息，如上次登录时间、登录 IP、商户身份、平台工具入口
- 不放页面级业务操作
- 宽度随视口自适应
- 低优先级元信息可截断或隐藏，不能撑出页面级横向滚动

## Primary Navigation

- 高度：`64px`
- 背景：白色
- 位于左侧导航和内容层之上
- 底部使用轻量阴影，与左侧导航形成层级
- 左侧为平台 Logo 区，右侧为一级导航
- Logo 应在左侧导航默认宽度 `208px` 范围内水平居中
- Logo 必须使用 `specs/boss logo.svg` 作为唯一规范来源；允许在 change 包内原样复制该文件，但不得修改 SVG 内容、不得重绘、不得用旧 change 包自定义 logo、不得用边框文字按钮、纯文本或 CSS 临时绘制替代
- Logo 资产应通过 `img` 或项目图片组件引用，并提供准确 `alt`；HTML 预览优先直接引用 `../../specs/boss logo.svg`，正式项目可按工程静态资源规则复制该文件后引用
- HTML 预览不得放置临时 SVG 占位；如果无法引用 `specs/boss logo.svg`，应停止生成并先补齐该规范资产
- Logo 区和一级菜单区必须使用 flex 左右分布，Logo 区始终固定在左侧，一级菜单区始终位于右侧并占据剩余宽度
- 一级菜单项在一级菜单区内右对齐展示，菜单项间距可随视口在合理范围内自适应，不允许用绝对定位写死菜单起点
- 视口宽度不足时，一级菜单区内部处理溢出或收纳，不允许挤压 Logo 区或制造页面级横向滚动
- 一级选中项使用主色 `#F36046`
- 一级选中指示线宽度等于文字宽度
- 一级选中指示线高度：`2px`
- 一级选中指示线无圆角
- 不使用整项宽度下划线、圆角胶囊或圆角下划线
- 不放营销文案、搜索 hero 或页面级工具
- 一级导航切换时，左侧导航只展示当前一级菜单下属的二级 / 三级内容
- 不允许在同一个一级菜单下混合展示其他一级菜单的二级 / 三级内容
- 若需要保留跨一级菜单的公共入口，应作为当前一级菜单的明确下属分组展示，不能和其他一级菜单业务分组混排

## Left Navigation

### Container

- 默认展开宽度：`208px`
- 展开态二级菜单实际内容宽度：`207px`
- 收起宽度：`48px`
- 背景：白色
- 支持二级菜单和三级菜单
- 菜单最大深度为 3 级
- 二级导航内容从一级导航下边缘向下 `4px` 开始
- `4px` 间距属于白色侧边导航内容区，不制造灰色断层
- 左侧导航层级低于一级导航，不能遮挡一级导航阴影
- 展开态 Ant Design Menu、二级菜单项和三级菜单项宽度必须填满 `207px` 菜单内容区，不允许右侧出现白色空隙
- 收起态仍按 `48px` 适配，不沿用展开态 `207px` 宽度
- 二级 / 三级导航必须使用 Ant Design 官方 `Menu` 的 `items`、`SubMenu`、`Menu.Item` 或项目内基于 Ant Design Menu 的封装生成
- 上一条为硬性规定：任何情况下都必须使用 Ant Design Menu 作为左侧二级 / 三级导航运行组件，包括只有一个二级菜单、没有三级菜单、菜单项由接口返回、侧边栏收起、只读预览页、空状态页和结果页；不得用普通 `div`、`ul/li`、CSS grid、静态文本块、手写树组件或自定义点击列表替代
- 二级菜单必须通过 Ant Design Menu 的 submenu / items 能力保持可折叠；不得把二级菜单渲染成不可折叠标题或普通分组标题
- 二级菜单的展开 / 收起状态必须能被 Ant Design Menu 官方 submenu arrow 触发；受控实现必须配置 `onOpenChange`，禁止只设置固定 `openKeys`、`defaultOpenKeys` 或外部点击状态导致箭头无法收起 / 展开
- 不允许用普通 `div`、自绘列表、绝对定位、手写展开箭头或模拟菜单结构替代 Ant Design Menu
- 只允许通过 token、className 或受控 props 调整 Ant Design Menu 的视觉，不允许破坏 `ant-menu-submenu-title`、`ant-menu-title-content`、`ant-menu-submenu-arrow` 的官方 DOM 语义

### Second-Level Navigation

- 二级导航高度：`40px`
- 二级导航左右内边距：`16px`
- 二级菜单必须有 Ant Design 官方 icon
- 二级菜单 icon 与文字间距：`8px`
- 二级菜单展开 / 收起 icon 使用 Ant Design Menu 官方 submenu arrow
- 二级菜单展开 / 收起 icon 保持 Ant Design Menu 默认右侧位置，不允许把 arrow 移到左侧或自绘箭头
- 二级菜单文字常规体，不加粗
- 二级选中态：仅 icon 和文字使用主色 `#F36046`
- 二级选中态不使用整行选中背景
- 二级菜单项宽度必须占满菜单内容区，右侧不可留白
- 二级菜单可折叠
- 未选中二级菜单恢复默认标题色
- 收起状态下二级 icon 在 `48px` 列内水平居中
- 收起态菜单项必须使用 flex 或等价方式强制 icon 在 `48px` 列内水平居中，不依赖 Ant Design 默认 inline-collapsed 间距
- 收起态必须隐藏菜单文字但保留二级菜单 icon，不允许出现只有空白侧栏、icon 丢失或 icon 被文字容器挤掉的状态
- 收起态需要显式处理 Ant Design Menu 的 `ant-menu-title-content`、`ant-menu-item-icon` 和 `anticon` 显隐关系

### Third-Level Navigation

- 三级导航高度：`40px`
- 三级选中态背景：`#FEF2F0`
- 三级选中态文字：`#F36046`
- 三级选中态右侧显示 `2px` 主色竖线
- 三级选中态为整行高亮
- 三级菜单不可再折叠

### Collapse Control

- 收起控制高度：`48px`
- 展开态宽度：`208px`
- 收起态宽度：`48px`
- 收起态 Ant Design Menu 的 `inlineCollapsed` 宽度也必须覆盖为 `48px`，不能保留 Ant Design 默认 `80px`
- 收起态只显示二级 icon，icon 在 `48px` 列内水平居中，不显示菜单文字、展开箭头或悬浮出的空白菜单宽度
- 顶部分割线：`1px solid #EBEBEB`
- 只显示 icon，不显示“收起导航”“展开导航”等辅助文字
- 展开态使用 `MenuFoldOutlined`
- 收起态使用 `MenuUnfoldOutlined`
- 收起 / 展开控制 icon 必须始终左对齐，展开态位于 `208px` 侧边栏左侧内边距位置，收起态位于 `48px` 侧边栏左侧内边距位置；不得使用 `justify-content: center`、`text-align: center`、右对齐或自动居中布局
- HTML 预览与正式实现应在该控制节点上保留稳定标记 `data-boss-sider-collapse`，便于校验 icon 对齐规则

## Tabs Page Title Area

Tabs 是 Boss Ledger 的页面标题区，不在内容区上方再加独立页面标题。

- Tabs 高度：`44px`
- Tabs 区域上方必须保留 `4px` 顶部间距，该间距属于 Tabs 页面标题区，不属于内容区
- Tabs 左侧必须与内容区左侧对齐；在左侧导航右侧的工作区内，Tabs 容器左侧内边距为 `16px`
- 当前 Tab 白底并与内容区连通，内容区顶部必须紧贴当前选中 Tab 下边缘
- 当前 Tab 和内容区之间不得出现灰色断层、空白缝隙或额外上间距
- 内容区的灰色托底从 Tabs 下边缘开始，首个业务白色模块可以有内部内容间距，但不得让页面整体看起来与当前 Tab 脱开
- 非当前 Tab 灰底
- Tab 左右内边距：`12px`
- Tab 顶部圆角：默认 `4px`，当前选中 Tab 左上和右上圆角使用 `8px`
- 当前 Tab 文本使用主色 `#F36046`
- 只有当前选中 Tab 标题左侧显示静态刷新 icon，固定使用 Ant Design Icons 的 `ReloadOutlined`；未选中 Tab 不显示左侧 icon；icon 类型不随 loading 状态变化；不得使用 `LoadingOutlined`、`FileDoneOutlined`、页面业务 icon 或其他 icon 替代
- 当前 Tab 选中时右侧显示灰色关闭 icon；左侧静态 icon 必须使用三级文字色，右侧关闭 icon 使用弱文本色；左侧静态 icon 不得使用主色、当前 Tab 文本色、处理中色或 loading 色
- Tab 左侧静态 icon 与标题之间保持 `6px` 间距
- 多标签内所有 icon 与文字之间的水平间距统一为 `6px`
- 当前 Tab 关闭 icon 左侧间距为 `4px`
- 非当前 Tab 不展示左侧静态 icon，但必须保留可点击切换能力
- HTML 预览与正式实现应在当前 Tab 左侧 `ReloadOutlined` 节点上保留稳定标记 `data-boss-tab-static-icon`，便于校验当前 Tab icon 存在且不依赖 loading 状态
- Tab 宽度根据文本和关闭 icon 自适应
- 不强制所有 Tab 等宽
- 不强制当前 Tab 固定宽度
- Tab 间短分割线宽 `1px`、高 `24px`、颜色 `#E6E6E6`，垂直居中
- 当前 Tab 左右两侧不显示分割线
- Tab 可关闭，但最后一个 Tab 不可关闭
- Tabs 必须支持切换，点击非当前 Tab 时应激活对应页面，不允许把 `activeKey` 写死成不可切换状态
- 点击暂无业务数据的 Tab 时，仍必须激活该 Tab，并在内容区使用 Ant Design `Empty` 展示空状态；空状态应在可用画面内垂直居中
- 关闭按钮位于标题右侧
- Tab 标题超过 6 个汉字时省略，hover 时展示完整标题
- 打开已存在页面时激活已有 Tab，不重复新增
- 普通列表行详情默认用 Drawer，不默认新增 Tab

禁止将 Tabs 渲染为面包屑、分段控件、胶囊按钮、浏览器式标签或普通按钮组。

## Query Condition Area

查询条件区用于查询列表类页面。

- 查询条件模块上下间距：`16px`
- 查询条件模块内边距：`16px`
- 查询列表页统一由两个同级白色模块组成：查询条件模块 + 表格 / 统计 / 分页模块
- 查询条件模块不得和表格模块包在同一白色外壳中
- 查询条件标题根据内容自适应
- 查询条件表单整体右对齐
- 查询条件默认三等列布局
- 查询条件必须保持三列均分展示，每列使用 `minmax(0, 1fr)` 或等价自适应方式
- 查询条件模块内的表单容器、查询网格和每个查询项必须占满查询模块可用宽度
- 查询条件不得因为 Ant Design Form `inline` 默认宽度或内部 flex 收缩导致右侧出现未使用空白
- 查询项列间距：`16px`
- 查询标签宽度根据内容自适应
- 查询标签与控件间距：`8px`
- 查询表单项内部 label 与控件之间必须保留 `8px` 间距，尤其是水平布局的 `Form.Item` 行内 label 与输入控件
- 表单 label 冒号右侧不额外设置 `margin-right: 8px`
- 所有表单信息项的标题到组件间距固定为 `8px`，包括水平布局和垂直布局
- `Input`、`Select`、`Radio`、`Checkbox`、`DatePicker`、`TextArea` 等表单控件均遵守标题到组件 `8px` 间距
- `Input`、`InputNumber`、`TextArea` 必须显式配置 `placeholder="请输入"` 或包含字段名的 `请输入xxx`
- `Select`、`TreeSelect`、`Cascader`、`DatePicker` 必须显式配置 `placeholder="请选择"` 或包含字段名的 `请选择xxx`
- `RangePicker` 必须显式配置中文 placeholder，例如 `['请选择开始日期', '请选择结束日期']`
- 不全局强制查询标签对齐
- Ant Form 标签 `padding-right` 为 `0`
- 查询条件模块高度根据行数自适应，不固定为某个 Figma 高度
- 查询条件默认在三等分网格中从左到右、从上到下排列
- 重 置和查 询按钮必须始终位于查询条件模块内最右侧，不单独脱离成独立区域，也不移动到表格工具栏
- 重 置和查 询按钮不得居中展示，不得出现在第二列或左侧列；任何字段数量下都必须落在查询网格最右列并右对齐
- 查询动作区必须作为独立 grid item 参与查询网格排布，相当于一个新的条件展示位；不得把 `重 置` / `查 询` 塞进最后一个查询字段的同一格。
- 当查询条件正好等于 6 个时，查询字段占满前两行 6 个格子，查询动作区作为第 7 个展示位另起第三行，并固定在第三列最右侧。
- 当查询条件超过 6 个时，默认收起展示前 5 个查询字段，并将展开 / 收起、重 置、查 询放在第二行第三列的最右侧
- 查询条件展开后展示全部字段，展开 / 收起、重 置、查 询仍放在最后一个网格单元并右对齐
- 6 个及以下查询字段默认全部展示，此时不展示展开 / 收起入口
- 超过 6 个查询字段必须有展开 / 收起
- 展开 / 收起使用 Ant Design 官方 `DownOutlined` / `UpOutlined`
- 展开 / 收起文案格式为 `icon + 展 开` 或 `icon + 收 起`
- 展开 / 收起按钮位于重 置按钮左侧
- 展开 / 收起文字和 icon 使用二级文字色，不得使用主色、红色或强调色
- 展开 / 收起文案右侧必须保留 `8px` 间距，再连接重 置按钮
- 展开 / 收起按钮无可见边框色，无左右内边距
- 查询动作区靠右
- 查询动作顺序：展开 / 收起、重 置、查 询
- 展开 / 收起、重 置、查 询之间的间距均为 `8px`

## Analysis Filter Area

经营分析、数据分析、趋势分析、渠道分析、客流分析等分析页使用轻量筛选条，不使用查询列表页的查询动作区。

- 数据分析页筛选区始终位于独立白色模块内
- 条件项在左侧展示，时间范围在右侧展示
- 时间范围不展示 label 标题
- 数据分析页不展示 `重 置`、`查 询` 按钮
- 条件变更默认触发当前视图刷新或由真实系统按项目约定自动刷新
- 不把分析页筛选区做成查询列表页的三列查询表单

## Operation And Data Vertical Layout

非数据统计页中同时包含操作、筛选、数据展示、数据统计时，默认使用上下布局。

- 操作模块、筛选模块、录入模块、审核模块等任务入口始终位于上方
- 数据统计、数据摘要、记录流水、列表结果等信息展示模块位于操作 / 筛选模块下方
- 不默认使用左右分栏承载数据和操作，避免页面主次随屏幕宽度变化而混乱
- 如果业务确有强依赖左右对照的场景，需要在设计说明中明确原因
- 上下模块之间使用页面标准模块间距，保持内容阅读顺序从操作入口到结果反馈
- 移动端和窄视口继续保持同一上下顺序，不因为响应式布局改变操作和数据的先后关系

## Query List And Query Statistics

- 查询列表与查询统计互斥，除非明确选择带统计的查询列表模板
- 默认展示查询列表
- 查询统计类型字号：`14px`
- 查询列表类型字号：`16px`
- 查询统计和查询列表都不展示底部灰色副描述
- 无统计时，结果区标题默认使用 `查询列表`，字号 `16px`，可加粗
- 2 到 3 个轻量统计可在结果工具栏内 inline 展示；轻量统计展示后不得再展示 `查询列表` 大标题，统计文本与查询列表标题二选一，并且两者使用同一个左侧 toolbar 位置
- inline 统计标签 `14px`，常规体
- inline 统计值使用主色 `#F36046`
- 超过 3 个统计指标时，使用 Ant Design 官方 `Statistic` 组件承载每个统计项
- 统计项外层可使用独立的 `#F6F6F6` 灰色卡片承载，但标题和值必须由 Ant Design `Statistic` 或项目内基于 Ant Design Statistic 的封装渲染
- 统计卡片必须在可用宽度内均分展示
- 统计卡片之间必须用 `16px` 间距分块，不得连成一整条灰色背景后用竖线分割
- 统计卡片内部内边距为上下 `16px`、左右 `16px`
- 统计标题必须包含单位，例如 `总实收(元)`、`核销总数(张)`、`活跃门店数(家)`
- 统计数值本身不再追加单位
- 统计标题颜色使用三级标题 / 弱文本色
- 统计金额和核心数值颜色使用一级标题色，不使用主色替代正文层级
- 查询列表统计块必须位于表格 / 结果模块内部、表格上方
- 查询列表统计块背景：透明
- 查询列表统计块左右内边距：`16px`
- 查询列表统计块高度根据内容自适应
- 查询列表统计块与表格属于同一个模块，不拆成独立卡片区
- 统计单位写在标题中，如 `到账总金额(元)`，数值本身不追加 `元` 或 `笔`
- 非查询列表页面的统计区不得套用查询列表统计样式；多指标统计必须输出多个同级独立白色统计模块，模块间距露出 `#F4F4F4` 页面背景作为分隔，不能再包一个外层统计色块。

## Table Area

- 表格模块上间距：`12px`
- 表格模块左右下间距：`16px`
- 表格模块工具栏上下内边距均为 `16px`
- 表格模块工具栏行高区域为 `64px`，标题、按钮和列设置入口都在该行内垂直居中
- 表格模块工具栏最小高度为 `64px`，高度随内容自适应，不因侧边栏收起或页面变窄压缩垂直间距
- 表格模块工具栏标题行高按 `32px` 对齐右侧按钮
- 表格模块工具栏下方不展示分割线
- 表格标题与按钮区域通过留白和表格表头建立层级，不使用 `border-bottom`
- 表格模块右侧工具按钮区间距为 `8px`，按钮区不参与压缩
- 表格模块右侧工具按钮区有 1 到 2 个操作项时，只允许 1 个主要按钮，其他操作使用默认按钮或危险按钮的默认描边形态
- 表格模块右侧工具按钮区超过 2 个操作项时，保留最多 2 个高频按钮，其余低频操作优先使用 Dropdown 收纳
- 使用 Ant Design `Table` 或基于 Ant Table 的平台封装
- 查询列表页默认展示分页
- 分页属于表格模块
- 分页必须包含在表格白色内容区内，不能落到页面灰色背景或 footer 区域中
- 小屏或横向滚动场景下，分页仍必须被表格模块外层白色内容区完整包裹，不允许分页行越出模块边界或落到灰色背景上
- 小屏高度不足时，表格模块应按内容撑开，由内容区滚动展示分页；不要用固定高度或 `overflow: hidden` 把分页裁剪在可视区域外
- 分页必须紧贴 Table 底部展示，Table 与分页之间不插入弹性空白区
- 分页区域上下内边距均为 `16px`
- 表格模块底部内边距由分页区域承担；有分页时不要再在分页外叠加额外底部空白
- 表格高度根据内容自动适应，不为了撑满剩余屏幕制造大块空白
- 表格不设置最低可视行数，实际展示高度由当前数据量、分页和页面内容自然决定
- 表格不默认设置纵向滚动高度；只有业务明确要求冻结表头 / 列或有特殊表体约束时才设置 `scroll.y`
- 分页必须紧贴表格底部，不允许分页下方出现大块空白
- 表格模块不再使用 flex 剩余空间撑高分页下方区域
- 默认每页 `10` 条
- 查询列表页默认展示 pageSize 切换器；每页条数必须显式中文化为 `10 条/页`、`20 条/页` 等文案，不得出现 `10 / page`、`items/page` 或其他英文默认文案。
- pageSize 下拉浮层不得被表格区域、内容滚动区或 footer 裁切遮挡；预览或实现中应避免将 Pagination 放在 `overflow: hidden` 的容器内，必要时将下拉浮层挂载到 `document.body` 或等价顶层容器。
- 表头文字可以加粗，推荐 `font-weight: 500`
- 普通内容文字使用常规体，`font-weight: 400`
- 普通状态展示使用“状态点 + 文本”，默认不用 Tag
- 操作列使用文字按钮，默认不用 icon
- 操作列所有可点击文字按钮均使用主色 `#F36046`，不得把次操作置为灰色；禁用 / 无权限操作除外。
- 操作列所有文字按钮均不加粗，`font-weight: 400`；主操作按钮不使用加粗。
- 操作列内 1 到 2 个操作项时直接平铺展示，不使用“更多”收纳
- 操作列内最多允许 2 个可见文字操作，第一个为主要 / 高频操作，第二个为次高频操作；两者均保持普通文字按钮，不得使用灰色来表达次级
- 操作列内超过 2 个操作项时，展示前 2 个高频文字操作，其余操作必须用“更多”Dropdown 收纳
- 操作列第一个按钮与“操作”列标题文字左侧对齐
- 操作列内文字按钮不得保留 Ant Design `Button type="link"` 默认左右内边距；第一个操作按钮应从操作列内容左边界开始
- 操作列宽度根据当前页面最长操作项自适应设置
- 操作列宽度不得为了预留无关操作而过宽；一般按操作项总文字宽度 + 操作项间距 + 单元格内边距计算
- 操作项较多时优先使用“更多”下拉收纳，避免操作列过宽挤压业务字段
- 表格横向滚动时，操作列固定在右侧
- 金额列标题追加 `(元)`
- 金额列在表头、单元格、汇总和固定列副本中均右对齐
- 列设置入口位于工具栏右侧
- 列设置只使用 Ant Design 官方 `SettingOutlined`
- 列设置按钮 icon-only，背景为 `#FAFAFA`，无文字、无边框线、无描边、无按钮阴影；普通、hover、focus、active 状态都不得保留 Ant Design 默认 `1px` button 边框或可见描边
- 列设置必须具备列显隐能力，不允许只展示无功能 icon
- 列设置面板使用 Ant Design `Dropdown` / `Popover` + `Checkbox` 或项目内等价封装
- 操作列默认始终展示，不建议被列设置隐藏
- 导出按钮文案使用 `下载Excel`
- 下载、导出类操作默认不展示 icon，只使用文字按钮；仅当页面存在多种导出格式或工具栏空间极度受限时，才允许使用带 Tooltip 的 icon-only 导出入口
- 多种导出格式使用 Ant Design Dropdown

## Buttons And Text Labels

- 两个汉字按钮中间必须加空格
- 示例：`查 询`、`重 置`、`确 认`、`取 消`、`保 存`、`新 增`
- 普通按钮文字使用常规体
- 主按钮使用主色 `#F36046`
- 次按钮使用默认按钮
- 普通表格操作用文字按钮
- 普通按钮默认不加 icon
- 仅工具类动作使用 icon，如列设置、展开收起、关闭、全屏、侧边栏收起

## Icon Rules

- 图标必须使用 Ant Design 官方图标
- 二级菜单必须配置业务含义匹配的 Ant Design 官方 icon
- 列设置使用 `SettingOutlined`
- 查询展开使用 `DownOutlined`
- 查询收起使用 `UpOutlined`
- 关闭使用 Ant Design 内置关闭行为或 `CloseOutlined`
- 侧边栏展开 / 收起使用 `MenuFoldOutlined` / `MenuUnfoldOutlined`
- Dashboard 全屏使用 `FullscreenOutlined`
- 不使用 emoji、纯文本符号、手绘 SVG、CSS 伪元素或其他图标库替代 Ant Design Icons

## Ant Design Component Fidelity

Boss Ledger 页面所有组件默认沿用 Ant Design 官方组件或项目内基于 Ant Design 的平台封装。除非存在明确业务规则、项目封装或 Ant Design 无法覆盖的业务能力，不允许手写替代。

- 输入控件必须使用 Ant Design `Form`、`Input`、`Select`、`DatePicker`、`InputNumber`、`Checkbox`、`Radio` 等组件
- 数据展示必须优先使用 Ant Design `Table`、`Descriptions`、`Statistic`、`Tag`、`Empty`、`Result` 等组件
- 反馈与浮层必须优先使用 Ant Design `Modal`、`Modal.confirm`、`Drawer`、`Popover`、`Dropdown`、`Tooltip`、`message`、`notification`
- 导航必须使用 Ant Design `Menu`、`Tabs` 或项目内基于 Ant Design 的平台封装
- 详情字段、审核信息、核销记录、配置摘要等 label-value 信息必须使用 Ant Design `Descriptions` 或项目内等价封装，不允许用普通 `div` / `span` 手写描述列表
- 详情字段、审核信息、核销记录、配置摘要等 `Descriptions` 必须使用默认非边框样式；不得设置 `bordered`、`bordered={true}` 或项目封装中的等价边框 / 表格形态参数
- 详情类信息不允许做成表格形态：不得使用 Table 承载详情键值对，不得用带格线的 CSS grid 模拟详情表格，不得让 label-value 区域出现单元格边框
- 提交确认、确认 / 二次确认类操作必须使用 Ant Design `Modal.confirm`，不允许使用 `Popconfirm`、手写确认弹窗，也不允许改成普通受控 `Modal`
- 只有业务规则明确要求特殊排版、跨组件组合或平台已有业务组件时，才允许在 Ant Design 组件外层增加轻量布局容器
- 即使需要轻量布局容器，也不得破坏 Ant Design 组件自身的语义结构、可访问性、键盘行为和状态样式

## Modal And Drawer

### Modal

- 适用于 6 个及以下字段的小型新建 / 编辑表单
- 使用 Ant Design Modal
- 确认弹窗宽度：`416px`
- 表单弹窗宽度：`480-520px`
- 圆角：`6px`
- 遮罩：`rgba(0, 0, 0, 0.45)`
- 头部高度：`56px`
- 底部高度：`52px`
- 普通非确认 Modal 内容区内边距：上 / 左 / 右 `24px`，底部 `0`
- 内容区表单元素之间的间距：`16px`
- 必须使用 Ant Design Modal 官方标题区、内容区和底部按钮区，不得用自定义 `div` 重建弹窗结构
- 头部和底部必须按 Boss Ledger 业务规则展示灰色分割线；该规则是硬性约束，HTML 预览和正式项目都必须显式保证，不能依赖不同 Ant Design 版本的默认样式
- Modal 标题下方必须有通栏 `1px solid #F0F0F0` 分割线，从弹窗内容左边缘延伸到右边缘，不得被 `.ant-modal-content` 或 header 自身左右 padding 缩短
- Modal 底部按钮区上方必须有通栏 `1px solid #F0F0F0` 分割线，从弹窗内容左边缘延伸到右边缘，不得被 `.ant-modal-content` 或 footer 自身左右 padding 缩短
- 普通非确认 Modal 内容区 `.ant-modal-body` 必须使用 `padding: 24px 24px 0`；上 / 左 / 右均为 `24px`，底部为 `0`
- 表单、详情等内容不得贴近弹窗左右边缘；内容区左右留白由 `.ant-modal-body` 的 `24px` padding 提供
- Modal / Drawer 表单 label 在同一个表单内必须对齐；label 长度不一致时必须使用统一固定宽度，label 等宽时允许内容自适应
- 固定 label 宽度必须按当前表单最长 label 计算，不得所有弹窗无脑套同一个全局宽度
- 底部按钮右对齐，主按钮在最右侧
- 提交确认、确认 / 二次确认弹窗必须使用 Ant Design `Modal.confirm`
- `Modal.confirm` 必须保持 Ant Design 官方结构和默认交互，不因为间距问题改成普通受控 `Modal`
- 不得使用普通受控 `Modal` 或 `Popconfirm` 承载提交确认、审核确认、删除确认、停用确认、撤销确认、作废确认等二次确认场景
- `Modal.confirm` 的 `.ant-modal-body` 必须写死为 `padding: 24px !important`，上下左右均为 `24px`；不得因为普通 Modal 的 `padding: 24px 24px 0` 规则或 Ant Design 注入样式压缩底部留白
- `Modal.confirm` 的具体图标、文案和按钮缩进由 Ant Design confirm 官方结构或项目封装控制
- 确认弹窗必须保留 Ant Design 的遮罩、焦点管理、键盘关闭和按钮交互

### Drawer

- 适用于 7 到 10 个字段的中型表单、详情、审核处理
- 使用 Ant Design Drawer
- 圆角：`0`
- 头部结构必须基于 Ant Design Drawer 实现，标题在左，关闭 icon 在右，左右分布并垂直居中
- 不允许关闭 icon 出现在标题前
- 当 Ant Design Drawer 默认关闭 icon 位于标题前时，应设置 `closeIcon={false}`，并在 `title` 中使用标题左、关闭 icon 右的自定义标题区
- 自定义 Drawer 标题区只能调整标题和关闭 icon 的布局，不允许用普通 `div` 手写整个抽屉或替代 Ant Design Drawer
- 头部最小高度：`56px`
- 头部内边距：`16px 24px`
- 内容区内边距：`24px`
- 底部高度：`56px`
- 头部和底部使用 `1px solid #F0F0F0` 分割线
- 普通列表行详情默认用 Drawer 打开
- 只有详情复杂、用户明确要求或需要独立流程时才使用新 Tab / full-page detail

## Business Type Rules

### Query List Page

- 查询类页面默认使用查询列表页。
- 查询列表页不额外展示页面标题，Tabs 即页面标题。
- 查询区和表格区之间保持 `16px` 间距。
- 表格区尽可能占满剩余页面高度。
- 默认每页 `10` 条。
- 分页始终归属于表格模块，不脱离表格区域。
- 必须包含查询条件、表格、分页、列设置、loading、empty、error 和行内操作。

### Query List With Statistics

- 无统计时展示 `查询列表`。
- 有查询统计时不展示 `查询列表` 大标题；轻量 inline 统计和结果区大标题是唯一关系，只能展示其一，且轻量 inline 统计必须放在原大标题同一位置、与右侧工具按钮同一行。
- 2 到 3 个轻量统计使用结果工具栏 inline 文本。
- 超过 3 个统计指标使用 Ant Design 官方 `Statistic` 组件，外层用 `#F6F6F6` 灰色统计容器均分展示，中间由`15px` 间隔
- 查询统计块只适用于列表页，不复用到首页或数据看板。
- 查询统计块不得作为独立卡片组漂浮在表格模块之外。

### Form Page

- 6 个及以下字段使用 Modal。
- 7 到 10 个字段使用 Drawer。
- 超过 10 个字段打开新 Tab 或使用 full-page form。
- 11 个字段的页面可以包含插图区。
- 12 个及以上字段使用纯表单布局，不使用插图。
- 必填字段展示 `*`。
- 可选字段不展示 `*`。
- 底部操作栏固定在内容区底部上方，使用浮动式操作区。

### Homepage / Dashboard

- 首页是业务数据概览页，不是营销落地页。
- 首页可以包含渠道分布、业务概览、趋势分析。
- 每个数据模块应是独立白色卡片。
- 首页 / 数据看板 / 经营分析页的统计汇总模块必须采用总分结构：总数据在上方，子数据在下方。上方主总量指标只能有 1 个，作为当前汇总模块的核心总数据；下方子数据使用最多 4 列、最多 2 行网格布局，一个汇总模块最多 8 个子数据。不得使用左右分栏把主总量和子数据并排展示；不得追加第三行子数据；子数据超过 8 个时必须拆分模块。
- 首页 / 数据看板 / 经营分析页的多指标统计必须以多个同级白色统计模块均分展示，并通过页面灰色背景 `16px` 间距分割；不使用灰色统计卡片，也不把多个指标连成一整块仅用竖线、透明背景或内部 gap 分隔。
- 不使用灰色占位图表块。
- 不添加快捷入口，除非需求明确要求。
- 图表必须使用 Ant Design Charts 或项目内基于 Ant Design Charts 的封装。
- 不使用 ECharts、Chart.js、纯 CSS 图表、自绘 SVG 图表或手写 Canvas 图表替代 Ant Design Charts，除非项目已有基于 Ant Design Charts 的平台级封装并明确要求使用。

### Detail Page

- 普通列表行详情默认使用 Drawer。
- 详情字段按业务含义分组。
- 详情字段展示必须使用 Ant Design `Descriptions` 默认非边框样式，保持轻量 label-value 阅读形态；不得使用 `Descriptions bordered` 或表格化详情布局。
- 不使用卡片套卡片来制造层级。
- 只有复杂详情、独立流程或用户明确要求时，才打开新 Tab 或 full-page detail。

## Boss Ledger Page Template Preference

优先使用以下 Boss Ledger 专属页面模板偏好：

1. 查询列表页：默认选择，用于查询、管理、审核列表、配置列表、商户资料、结算记录等
2. 带查询统计的查询列表页：仅当需求明确需要统计时使用
3. Dashboard 首页：仅用于经营首页、数据看板、经营分析，不做营销首页
4. Modal 表单：6 个及以下字段的新建 / 编辑
5. Drawer 表单：7 到 10 个字段的新建 / 编辑 / 审核处理
6. Full-page 表单：超过 10 个字段或多分组复杂表单
7. Drawer 详情：列表行详情的默认承载方式
8. 分步流程页：用于开通、配置、规则创建等多步骤任务
9. 结果页：用于提交成功 / 失败反馈
10. 空状态页：用于整页无数据、无权限、缺少前置条件

查询类需求未明确页面类型时，默认选择查询列表页。

## Ant Design Runtime Requirements

Boss Ledger 运行态页面和可交互 HTML 预览必须使用 Ant Design 真实组件或基于 Ant Design 的平台封装。

即使是用于评审的单文件 HTML 预览，也必须通过 CDN、项目依赖或运行时构建方式引用 Ant Design 与 Ant Design Icons，不允许用原生 `input`、`select`、`table`、`button`、手写弹窗、手写抽屉或字符图标冒充 Ant Design 组件。

必须使用：

- `ConfigProvider`
- `App`
- `Form`
- `Input`
- `InputNumber`
- `Select`
- `DatePicker` / `RangePicker`
- `Button`
- `Table`
- `Pagination`
- `Modal`
- `Drawer`
- `Tabs` 或平台 Tabs 封装
- `Menu` 或平台 Menu 封装
- `Empty`
- `Result`
- `Dropdown`
- `Tooltip`
- `Ant Design Charts` 或项目内基于 Ant Design Charts 的图表封装

运行态约束：

- Ant Design 主题主色设置为 `#F36046`
- `theme.cssVar` 必须开启
- Ant Design 全局 `lineWidth` 必须为 `1`
- `--ant-line-width` 应计算为 `1px`
- 使用 `antd/locale/zh_CN`
- dayjs 使用 `zh-cn`
- DatePicker / RangePicker 不保留英文默认文案
- 不用静态 `div` / `span` 模拟 Ant Design 控件行为
- 不用 Unicode 符号、emoji、CSS 伪元素或自绘 SVG 模拟 Ant Design Icons
- 单文件 HTML 预览允许使用 CDN 引入 React、Ant Design、Ant Design Icons 和 dayjs，但页面上的基础控件仍必须由 Ant Design 组件渲染
- 单文件 HTML 预览若用于反复评审，应优先使用项目依赖或本地 `vendor/` 缓存的官方 React、Ant Design、Ant Design Icons 和 dayjs 运行文件，避免外部 CDN 不稳定导致空白预览；本地缓存仍必须来自官方包，不得改写为手写控件
- 预览页如需平台框架层，可用布局容器承载，但其中的菜单、Tabs、表单、表格、分页、弹窗、抽屉、反馈和图标必须优先使用 Ant Design 组件
- 涉及柱状图、折线图、饼图、环图、面积图、趋势图、分布图等图表时，必须使用 Ant Design Charts 或项目内基于 Ant Design Charts 的封装；不得手写图表结构冒充平台图表

## Mandatory Interaction Rules

- 左侧整体导航必须可收起。
- 二级菜单必须可折叠。
- 二级 / 三级菜单任何情况下都必须使用 Ant Design Menu 或项目内基于 Ant Design Menu 的封装生成。
- 二级菜单的官方 submenu 展开 / 收起箭头必须真实可交互；受控 `openKeys` 必须搭配 `onOpenChange`，不得锁死展开状态。
- 左侧导航底部收起 / 展开 icon 必须始终左对齐。
- 三级菜单不可再折叠。
- 内容区必须随侧边栏展开 / 收起自适应宽度。
- Tabs 必须可切换、可关闭，且最后一个 Tab 不可关闭。
- 多标签页仅当前 Tab 左侧使用静态 `ReloadOutlined` 刷新 icon，未选中 Tab 不展示左侧 icon；不得使用 loading 状态 icon、页面类型 icon 或业务 icon。
- 多标签页必须可点击切换，暂无业务数据的 Tab 也必须激活并展示垂直居中的 Ant Design `Empty` 空状态。
- 查询区必须支持按字段数量展开 / 收起。
- 表格必须支持列设置。
- 表格横向滚动时操作列必须固定。
- 内容区高度尽可能填满 viewport。
- 分页必须附着在表格模块内。

## Sensitive Operation Rules

涉及账户、银行卡、结算、身份、密码、风控等敏感操作时，需要考虑二次确认或校验。

可用校验方式：

- 密码校验
- 短信校验
- 行为验证码
- 二次确认弹窗

无权限时，按项目约定隐藏操作或置灰并提供原因说明。

## AI Generation Constraints

生成 Boss Ledger 页面时必须遵守：

- 先选择一个页面模板，再组织布局
- 使用已有模式填充局部区域
- 优先一致性，不追求创意
- 不新增框架层
- 不删除顶部信息栏、一级导航、左侧导航、Tabs 页面标题区
- 不在 Tabs 下方额外新增大标题
- 不添加 hero、营销 banner、装饰渐变、无关快捷入口
- 不把 Ant Design 示例页布局当作 Boss Ledger 页面布局
- 不用静态控件冒充可交互控件
- 不用手写 HTML 控件冒充 Ant Design 的 Form、Input、Select、DatePicker、Table、Pagination、Modal、Drawer、Tabs、Menu、Button
- 不用字符图标、emoji 或自绘图标冒充 Ant Design Icons
- 不让页面 shell 出现浏览器级横向滚动
- 不固定 Figma 基准宽度为运行态宽度
- 不把普通详情默认打开成新 Tab
- 不在卡片里嵌套卡片来模拟框架结构

## Boss Ledger Self-Check

生成页面或方案后必须检查：

- 是否选择了 Boss Ledger 主题
- 是否同时读取通用设计规则和本主题规则
- 是否使用主色 `#F36046`
- 是否使用全局内容背景 `#F4F4F4`
- 顶部信息栏是否为 `28px` 且背景为 `#3A3A3A`
- 顶部信息栏文字颜色是否使用三级导航同级弱文字色，而不是纯白高亮文字
- 左侧导航和右侧内容区是否撑满 Tabs 下方的可用高度
- 页面内容滚动流末尾是否始终展示平台 footer，footer 上方是否有 `12px` 外部间距，且 footer 高度是否为 `32px`
- 小屏高度下表格分页是否可通过内容区滚动完整查看，未被 footer 或表格模块裁剪
- 一级导航是否为 `64px`
- Logo 是否在左侧导航默认宽度范围内水平居中
- Logo 是否引用或原样复制 `specs/boss logo.svg`，且未自由发挥、重绘或使用旧 change 包自定义 logo
- Logo 区和一级菜单区是否左右 flex 分布并随视口自适应
- 左侧导航展开宽度是否为 `208px`
- 左侧导航是否支持二级菜单、三级菜单，且最大深度不超过 3
- 左侧二级 / 三级导航是否在任何情况下都使用 Ant Design Menu 或基于 Ant Design Menu 的项目封装
- 二级菜单是否具备展开 / 收起能力
- 二级菜单官方 submenu 箭头是否能真实触发展开 / 收起；受控 `openKeys` 是否接入 `onOpenChange` 而不是被写死
- 左下角收起 / 展开 icon 是否始终左对齐，而不是居中或右对齐
- 二级 / 三级导航高度是否为 `40px`
- 二级菜单是否有 Ant Design 官方 icon
- 二级选中态是否只有 icon 和文字为主色
- 三级选中态是否为 `#FEF2F0` 背景、主色文字和右侧 `2px` 竖线
- Tabs 是否为 `44px`
- 当前 Tab 是否白底并与内容区连通
- 当前选中 Tab 左上和右上圆角是否为 `8px`
- Tabs 区域上方是否有 `4px` 顶部间距
- 是否只有当前 Tab 显示灰色静态 `ReloadOutlined` 左侧刷新 icon，未选中 Tab 不显示左侧 icon，且该 icon 不依赖 loading 状态
- 点击暂无业务数据的 Tab 时是否能激活该 Tab，并展示垂直居中的 Ant Design `Empty` 空状态
- 当前 Tab 是否显示灰色关闭 icon，且左侧静态 icon 与标题之间无额外 gap
- Tabs 是否可以真实切换，且未写死为不可切换
- 是否没有在内容区额外增加页面标题
- 查询条件是否三列、右对齐、标签自适应
- 表单信息项标题到组件的间距是否为 `8px`
- 查询字段超过 6 个时是否默认收起前 5 个字段，并把展开 / 收起、重 置、查 询放在第二行第三列右侧
- 展开 / 收起、重 置、查 询之间是否保持 `8px` 间距
- 展开 / 收起文案右侧是否保留 `8px` 间距
- 查询列表大标题和查询统计是否未被错误混用；有轻量 inline 查询统计时是否已隐藏 `查询列表` 大标题，且统计是否占用原标题左侧 toolbar 位置并与右侧工具按钮同一行
- 查询统计块是否只在列表页使用，且超过 3 个指标时使用 Ant Design Statistic
- 非查询列表统计是否用多个同级独立白色统计模块均分展示，并通过灰色背景 `16px` 间距分割，且没有外层统计色块
- 表格模块间距是否符合规则
- 表格是否使用 Ant Design Table
- 查询表单是否使用 Ant Design Form / Input / Select / DatePicker
- 分页是否使用 Ant Design Pagination 或 Ant Table 分页
- 表格表头和普通内容字重是否符合规则
- 金额列是否右对齐并带 `(元)`
- 列设置是否为 icon-only `SettingOutlined`
- 列设置按钮在普通、hover、focus、active 状态是否均无可见边框线、描边和按钮阴影
- 操作列第一个操作按钮是否与“操作”列标题左侧对齐，且未保留 link 按钮默认左右内边距
- 操作列是否最多直接展示两个文字操作，超过两个操作是否收纳到“更多”Dropdown
- 表格操作列所有可点击文字按钮是否统一使用主色 `#F36046`，且未出现灰色次操作或 Ant Design 默认蓝色
- 表格操作列可点击文字按钮 hover / focus 是否只改变文字色，未出现灰色底、描边底或块状背景
- 表格操作列所有文字按钮是否为常规体，且主操作未加粗
- 所有表单控件是否显式配置中文默认提示，输入类为 `请输入`，选择类为 `请选择`
- 两汉字按钮是否加空格
- 图标是否全部来自 Ant Design 官方图标
- 图表是否使用 Ant Design Charts
- 普通状态是否使用状态点 + 文本
- Modal / Drawer 是否使用 Ant Design 组件并保留 Ant Design 交互和焦点行为
- 详情、审核信息、配置摘要是否使用 Ant Design `Descriptions` 默认非边框样式，且未使用 `Descriptions bordered` 或表格化详情布局
- Modal 是否直接使用 Ant Design 官方 `Modal` / `Modal.confirm` 结构，未手写弹窗壳层
- Modal 标题下方和按钮区上方是否都有通栏灰色分割线，且未被左右 padding 缩短
- 普通非确认 Modal 内容区 `.ant-modal-body` 是否为 `padding: 24px 24px 0`，上 / 左 / 右 24px、底部 0
- `Modal.confirm` 的 `.ant-modal-body` 是否写死为 `padding: 24px !important`，上下左右均为 `24px`
- Modal / Drawer 表单 label 是否按当前表单 label 集合选择宽度策略：混合长度统一固定，等长 label 可自适应
- 普通表单 Modal 宽度是否控制在 `480-520px`
- 可交互 HTML 预览是否引用 Ant Design 和 Ant Design Icons，而不是手写基础组件
- 表单是否按字段数量选择 Modal、Drawer 或新 Tab / full-page form
- 首页是否避免营销化、快捷入口和灰色占位图表块
- 是否无浏览器级横向滚动
- 是否无营销化、装饰化、自由发挥式布局

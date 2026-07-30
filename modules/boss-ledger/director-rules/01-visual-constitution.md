# 老板管账视觉宪法

## 产品气质

**BL-VIS-001** 老板管账是安静、高密度、以任务为中心的运营系统。页面必须体现可靠和高效，不能做成营销页、插画页或装饰性页面。

**BL-VIS-002** 固定 Boss Ledger Shell 负责顶部信息栏、一级导航、侧边导航、收起控制、Tabs、工作区和 Footer。业务页面可以配置导航内容，但不得重新绘制 Shell 的结构或样式。

## 色彩

**BL-VIS-003** 品牌主色与主要操作色为 `#F36046`，Hover 为 `#D94E36`。它只用于唯一主操作、导航选中态、分页选中态和重要任务链接，不可作为大面积装饰色。

**BL-VIS-004** 工作区使用浅中性灰背景，任务模块使用白色。文字采用深中性层级，边框和分隔线保持低对比度。成功、警告、错误、处理中和默认状态使用稳定语义色，不能只依赖颜色传达含义。

## 字体与密度

**BL-VIS-005** 使用系统中文无衬线字体栈。默认业务文字为 `14px`，紧凑辅助文字可为 `12px`，模块标题通常为 `16px`。禁止使用 Hero 级标题、负字距和营销式排版。

**BL-VIS-006** 优先保证紧凑且易读的信息密度和稳定对齐。过长的 Label、值和表格单元格必须换行、省略并提供完整提示，或给出足够列宽；不得覆盖其他控件。

## 间距、圆角与表面

**BL-VIS-007** 默认圆角为 `4px`，边框克制，阴影最小化。禁止大圆角卡片、玻璃效果、装饰渐变和卡片中嵌套装饰卡片。

**BL-VIS-008** 工作区内边距为 `16px`。独立任务模块各自使用 `16px` 内边距，模块间距为 `16px`。单一任务表面保持白色，多个独立任务表面之间应露出中性工作区背景。

**BL-VIS-009** Card 只用于指标、重复对象和真正需要框定的任务单元。页面分区不应自动套 Card，Card 内不得再放装饰性子 Card。

## 组件

**BL-VIS-010** 必须使用真实的 Ant Design 组件。页面不得用手写 HTML 模仿输入框、表格、下拉、抽屉、弹窗、分页或结果页。

**BL-VIS-011** 一个工作流只能有一个视觉上最突出的主操作。次要操作保持克制；危险操作必须独立、命名清楚并说明业务影响后再确认。

**BL-VIS-012** 查询条件保持标签右对齐的横向布局。独立表单页按当前编辑范围的字段数布局：不超过 6 项时，Label 与 Input 左右排列，表单标签列固定为 `136px` 并且不得截断，字段单列纵向堆叠；超过 6 项时，Label 在上、Input 在下，字段按容器宽度使用 2 至 3 列网格平铺。Modal 仅承载不超过 6 项的表单，使用左右 Label/Input 和单列堆叠；超过 6 项必须改用 Drawer。Drawer 不超过 8 项时使用左右 Label/Input 和单列堆叠，超过 8 项时使用 Label 在上、Input 在下和 2 列字段网格。步骤表单按当前步骤的字段数判断，分组表单按全部可编辑字段数判断。窄屏时所有表单重排为 Label 在上、字段单列，且不得产生整页横向滚动。

**BL-VIS-013** 表格是紧凑、易扫描的工作表面，应有低强调表头、稳定列对齐、右侧操作列，分页必须归属于结果模块。金额右对齐，并必须明确币种或单位。

**BL-VIS-014** 详情信息使用分组 Descriptions 或结构化分区展示，不能把单个字段做成卡片。详情过长时，只有在分组数量已经影响直接扫描效率的情况下才增加锚点或分区导航。

**BL-VIS-019** 独立表单页和独立详情页的业务上下文由固定 Shell 的当前 Tab 承担；任务模块内不得重复渲染页面名称或“独立表单页面”“独立详情页面”之类的泛化标题。需要分段时，只显示业务信息组标题。

**BL-VIS-020** 只有带引导的简单表单可以在桌面端使用固定的老板管账业务引导插图、引导标题和说明文字；它们服务资金、结算、开户、规则配置等需要额外理解的单阶段任务，不得作为装饰或营销内容。表单与引导区整体最大宽度为 `1200px` 并在工作区居中，布局内部左右各保留 `16px` 留白；小于 `768px` 时隐藏整个引导区，只保留表单。

**BL-VIS-021** 结果页使用白色任务表面中的居中单列结构，依次呈现官方状态图标、结果标题、解释文字、可选结果信息区、操作区和可选反馈区。结果页不得继承表单右侧引导图、步骤插图或其他业务配图；结果信息区使用低强调的两列信息面板，反馈区位于操作之后。

## 响应式与无障碍

**BL-VIS-015** 桌面端是主要目标。窄屏应重排内容，不能整体缩小；查询网格和详情列逐级折叠，宽表格只在结果模块内部横向滚动，整页不得产生横向滚动。

**BL-VIS-016** 控件必须可通过键盘访问且名称明确。图标工具必须使用常见符号并提供 Tooltip；焦点、对比度、校验信息和状态含义即使不依赖颜色也必须可辨识。

## 视觉冲突规则

**BL-VIS-017** 当 Ant Design 通用默认值与本视觉宪法冲突时，以本视觉宪法为准。已选模板中更具体且不违反本宪法的布局规则，优先于本宪法的通用规则。

## 可编译主题 Token

**BL-VIS-018** 下表是老板管账唯一的主题数据源。设计师只在本表维护跨页面的颜色、字体和圆角 Token；系统自动生成渲染器主题文件。业务页面、旧设计稿和 Page Spec 都不得覆盖这些 Token。

| Token | 值 | 用途 |
| --- | --- | --- |
| `colorPrimary` | `#F36046` | 唯一主操作、选中态、重要任务链接 |
| `colorPrimaryHover` | `#D94E36` | 主操作与链接 Hover |
| `colorPrimaryActive` | `#D94B35` | 主操作 Active |
| `colorLink` | `#F36046` | Ant Design 链接色 |
| `colorLinkHover` | `#D94E36` | Ant Design 链接 Hover |
| `colorPageBackground` | `#F4F4F4` | 工作区背景 |
| `colorContainer` | `#FFFFFF` | 模块、导航和浮层表面 |
| `colorTopInfoBar` | `#3A3A3A` | 顶部信息栏背景 |
| `colorSelectedBackground` | `#FEF2F0` | 三级菜单选中背景 |
| `colorStatisticBackground` | `#F6F6F6` | 列表统计与详情指标背景 |
| `colorToolBackground` | `#FAFAFA` | 列设置等轻量工具背景 |
| `colorBorder` | `#E5E6EB` | 常规控件边框 |
| `colorDivider` | `#F0F0F0` | 模块与浮层分隔线 |
| `colorTabDivider` | `#E6E6E6` | Tab 分隔线 |
| `colorSiderDivider` | `#EBEBEB` | 侧栏收起控制分隔线 |
| `colorTabInactiveBackground` | `#EEEEEE` | 非当前 Tab 背景 |
| `colorTextPrimary` | `rgba(0,0,0,.85)` | 强调标题和主要文字 |
| `colorTextSecondary` | `rgba(0,0,0,.65)` | 常规业务文字 |
| `colorTextTertiary` | `rgba(0,0,0,.45)` | 次要说明与工具图标 |
| `colorTextDisabled` | `rgba(0,0,0,.25)` | 禁用和占位文字 |
| `colorShellText` | `#1F2329` | 固定 Shell 主文字 |
| `colorShellSecondary` | `#4E5969` | 固定 Shell 次级文字 |
| `colorShellMuted` | `#B8B8B8` | 固定 Shell 弱化文字与图标 |
| `colorFooterText` | `#A8ABB2` | Footer 文字 |
| `colorSuccess` | `#52C41A` | 成功状态 |
| `colorWarning` | `#FAAD14` | 警告状态 |
| `colorError` | `#FF4D4F` | 错误状态 |
| `colorInfo` | `#1677FF` | 处理中状态 |
| `colorDefault` | `#86909C` | 默认状态 |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif` | 系统中文无衬线字体栈 |
| `fontSize` | `14` | 默认业务字号（px） |
| `borderRadius` | `4` | Ant Design 控件圆角（px） |
| `cardBorderRadius` | `8px` | 任务模块与指标 Card 圆角 |
| `modalBorderRadius` | `6px` | Modal 圆角 |
| `drawerBorderRadius` | `0` | Drawer 圆角 |
| `navigationShadow` | `0 2px 8px rgba(0,0,0,.06)` | 一级导航阴影 |

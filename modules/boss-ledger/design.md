# Boss Ledger Design Specification

> **历史归档，已废弃。** 自 2026-07-29 起，本文件不再属于 Boss Ledger 的设计、生成、评审、验收或发布输入。唯一有效的视觉规范是 `director-rules/01-visual-constitution.md`；页面选择与交互分别以 `02-template-application-rules.md`、`03-interaction-acceptance-rules.md` 为准。以下内容仅保留作历史追溯。

## 1. 文件职责

本文件是 Boss Ledger 唯一专属设计规范，只定义：

- 视觉 Token
- 平台 Shell
- 页面布局
- 组件选择与样式
- 表单、表格、弹窗、抽屉和反馈交互
- 响应式与可访问性
- AI 生成时的设计执行约束

业务对象、字段含义、状态流转、权限、校验和业务结果统一进入 [`business-rules.md`](./business-rules.md)。

生成 Boss Ledger 页面时必须同时读取本文件与 `business-rules.md`。发生冲突时：

1. 视觉、布局、组件和交互形态以本文件为准。
2. 业务语义、权限、字段、状态和流程以 `business-rules.md` 为准。
3. 不再读取或保留旧版迁移附录作为第二规则源。

## 2. 设计定位

### 2.1 设计关键词

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

### 2.2 生成原则

- 页面由“固定 Shell + 页面模板 + 业务模式 + 组件规则 + Token”组装。
- 不自由发明平台框架。
- 不因业务主题变化而改变导航密度、Tabs、查询区、表格和操作列的基础形态。
- 多页面必须共享同一套 Shell、Token、Ant Design 主题与基础组件。
- 不添加 Hero、营销 Banner、装饰渐变或与任务无关的快捷入口。

## 3. Visual Tokens

### 3.1 颜色

| Token | 数值 | 用途 |
| --- | --- | --- |
| `colorPrimary` | `#F36046` | 主按钮、选中态、操作链接 |
| `colorPrimaryHover` | `#FF7A66` | 主按钮 Hover |
| `colorPrimaryActive` | `#D94B35` | 主按钮 Active |
| `colorLinkHover` | `#D94E36` | 表格操作链接 Hover |
| `colorPageBackground` | `#F4F4F4` | 内容区背景 |
| `colorContainer` | `#FFFFFF` | 业务模块、导航、浮层 |
| `colorTopInfoBar` | `#3A3A3A` | 顶部信息栏 |
| `colorSelectedBackground` | `#FEF2F0` | 三级导航选中背景 |
| `colorStatisticBackground` | `#F6F6F6` | 查询列表多指标统计卡片 |
| `colorToolBackground` | `#FAFAFA` | 列设置等轻量工具背景 |
| `colorBorder` | `#E5E6EB` | 默认边框 |
| `colorDivider` | `#F0F0F0` | 浅分割线 |
| `colorTabDivider` | `#E6E6E6` | Tabs 分割线 |
| `colorSiderDivider` | `#EBEBEB` | 侧栏收起控制分割线 |
| `colorTextPrimary` | `rgba(0,0,0,.85)` | 强调标题和主要文字 |
| `colorTextSecondary` | `rgba(0,0,0,.65)` | 常规业务文字 |
| `colorTextTertiary` | `rgba(0,0,0,.45)` | 次要说明与工具图标 |
| `colorTextDisabled` | `rgba(0,0,0,.25)` | 禁用与占位 |

语义状态色使用 Ant Design 语义色，不使用品牌主色替代：

| 状态 | 数值 |
| --- | --- |
| 成功 | `#52C41A` |
| 警告 | `#FAAD14` |
| 错误 | `#FF4D4F` |
| 处理中 | `#1677FF` |
| 默认 | `#86909C` |

### 3.2 字体与字号

- 使用系统字体栈。
- 普通文字、普通按钮、二级菜单、表格正文和操作链接均为 `font-weight: 400`。
- 表格表头与模块标题可使用 `font-weight: 500`。
- 常用字号：`12px`、`14px`、`16px`。
- 查询结果标题：`16px`。
- 查询统计文字：`14px`。
- 数字字段启用 `font-variant-numeric: tabular-nums`。

文字层级：

| 层级 | 颜色 |
| --- | --- |
| 强调标题 | `rgba(0,0,0,.85)` |
| 常规业务文字 | `rgba(0,0,0,.65)` |
| 次要说明 | `rgba(0,0,0,.45)` |
| 禁用或占位 | `rgba(0,0,0,.25)` |

### 3.3 圆角

| 组件 | 圆角 |
| --- | ---: |
| Button / Input / Select | `4px` |
| 普通业务模块 / Card | `8px` |
| Result 摘要块 | `6px` |
| Modal | `6px` |
| Drawer | `0` |

当前 Tab 下方与内容区直接连接，其对应内容容器左上角不额外增加圆角。

### 3.4 间距

- 基础单位：`4px`。
- 常用间距：`4px`、`8px`、`16px`。
- 同级业务模块外部间距：`16px`。
- 普通业务模块内边距：`16px`，只能由模块自身提供一次。
- 表单 Label 到 Control：`8px`。
- 查询字段列间距：`16px`。
- 按钮间距：`8px`。
- 统计卡片间距：`16px`。

### 3.5 阴影与边框

- 普通业务模块不使用阴影。
- 普通业务模块不得通过可见 `1px` 描边制造层级。
- 模块层级主要由白色模块、灰色页面背景和 `16px` 间距表达。
- Dropdown、Modal、Drawer 等浮层保留 Ant Design 官方阴影层级。

## 4. 固定平台 Shell

Boss Ledger Shell 的固定实现来源为：

```text
modules/boss-ledger/shell/
templates/boss-ledger-shell/
```

完整框架顺序：

1. 顶部信息栏
2. 一级导航
3. 左侧二级 / 三级导航
4. Tabs 页面标题区
5. 内容区
6. 平台 Footer

业务页面只能注入导航、Tabs、路由和内容配置，不得重写 Shell。

### 4.1 顶部信息栏

- 高度：`28px`。
- 背景：`#3A3A3A`。
- 文字使用弱化浅色，不使用纯白高亮。
- 用于登录时间、IP、商户身份和平台工具等低优先级信息。
- 不放页面级业务操作。
- 低优先级信息可截断或隐藏，不得造成页面级横向滚动。

### 4.2 一级导航

- 高度：`64px`。
- 背景：白色。
- 底部使用轻量阴影。
- 左侧为 Logo 区，右侧为一级菜单区。
- Logo 区宽度以侧栏展开宽度 `208px` 为基准。
- Logo 必须使用 `specs/boss logo.svg`，不得重绘、手写或 AI 生成。
- 一级菜单区使用 Flex，占据剩余宽度并右对齐。
- 选中文字使用 `#F36046`。
- 选中指示线宽度等于文字宽度，高度 `2px`，无圆角。
- 不使用整项下划线、胶囊或圆角指示条。
- 视口不足时在菜单区内部处理溢出，不挤压 Logo，不制造页面级横向滚动。

### 4.3 左侧导航

#### 容器

- 展开宽度：`208px`。
- 展开态菜单内容宽度：`207px`。
- 收起宽度：`48px`。
- 背景：白色。
- 菜单最大深度：3 级。
- 菜单从一级导航下方 `4px` 开始。
- 使用 Ant Design `Menu` 或基于它的项目封装。
- 禁止使用手写 `div`、`ul/li`、静态列表或自绘树替代。

#### 二级导航

- 高度：`40px`。
- 左右内边距：`16px`。
- 必须配置语义匹配的 Ant Design Icon。
- Icon 与文字间距：`8px`。
- 文字常规体。
- 支持 Ant Design Submenu 展开 / 收起。
- 受控 `openKeys` 必须同步实现 `onOpenChange`。
- 选中态仅 Icon 与文字使用主色，不增加整行背景。
- 收起态只显示 Icon，并在 `48px` 列内水平居中。

#### 三级导航

- 高度：`40px`。
- 不再继续折叠。
- 选中背景：`#FEF2F0`。
- 选中文字：`#F36046`。
- 右侧显示 `2px` 主色竖线。

#### 收起控制

- 高度：`48px`。
- 顶部分割线：`1px solid #EBEBEB`。
- 展开态使用 `MenuFoldOutlined`。
- 收起态使用 `MenuUnfoldOutlined`。
- 只显示 Icon，不显示辅助文字。
- 控制始终左对齐，不得居中或右对齐。
- 节点保留 `data-boss-sider-collapse`。

### 4.4 Tabs 页面标题区

Tabs 即页面标题，内容区内不得重复展示独立页面大标题。

- 高度：`44px`。
- 区域上方间距：`4px`。
- 工作区左内边距：`16px`。
- 当前 Tab 白底并与内容区直接连接。
- 非当前 Tab 使用灰底。
- Tab 左右内边距：`12px`。
- 默认顶部圆角：`4px`。
- 当前 Tab 顶部圆角：`8px`。
- 当前 Tab 文字：`#F36046`。
- 当前 Tab 左侧显示灰色静态 `ReloadOutlined`。
- 未选中 Tab 不显示左侧 Icon。
- Reload Icon 不依赖 Loading 状态，不得替换为业务 Icon。
- Icon 与标题间距：`6px`。
- 当前 Tab 可显示灰色关闭 Icon，与标题间距 `4px`。
- 分割线宽 `1px`、高 `24px`、颜色 `#E6E6E6`。
- 当前 Tab 两侧不显示分割线。
- Tab 宽度随内容自适应，不强制等宽。
- 超过 6 个汉字时省略，Hover 显示完整标题。
- 最后一个 Tab 不可关闭。
- Tabs 必须真实可切换，不得写死 `activeKey`。
- 空业务 Tab 激活后，必须在内容区渲染整体白色的 `.boss-shell-empty` 业务模块，并在扣除 Tabs、Footer 后的可用内容区内垂直、水平居中展示 Ant Design `Empty`；不得只渲染裸 `Empty` 或让灰色页面背景直接承载空状态。
- Reload Icon 节点保留 `data-boss-tab-static-icon`。

### 4.5 内容滚动区与 Footer

- 只有 Tabs 下方内容区滚动。
- 内容背景：`#F4F4F4`。
- 内容区左右内边距：`16px`。
- 不在内容区外再套整体白色大容器。
- 左侧导航与右侧工作区共同撑满可用高度。
- 使用 `100vh` 或准确 `calc()` 计算，不只依赖父级 `height: 100%`。
- 内容不足一屏时仍保持完整白色业务承载，不留下无意义灰色断层。
- 页面级不固定 Figma 基准宽度。
- 页面根不得出现横向滚动；高密表格只在 Table 内横向滚动。

Footer：

- 由 Shell 统一渲染，业务页面不得重复创建。
- 位于内容滚动流末尾，不固定、不吸底。
- 上方外间距：`12px`。
- 高度：`32px`，`flex: 0 0 32px`。
- 字号：`12px`。
- 文案水平居中并使用弱文字色。
- 内容滚动容器底部不额外保留 Padding。

## 5. 内容模块布局

### 5.1 通用模块

- 查询、统计、图表、表格、工作台等同级内容使用独立白色模块。
- 模块背景必须显式为 `#FFFFFF`。
- 同级模块由父级布局统一提供一次 `16px gap`。
- 模块自身统一提供一次 `16px` 内容内边距。
- 直属内容区域不得再次叠加左右 Padding。
- 不使用白卡嵌套白卡模拟平台外壳。
- 操作 / 筛选 / 录入模块在上，结果 / 数据 / 流水模块在下。
- 无明确强对照需求时不使用左右分栏。

### 5.2 查询列表骨架

查询列表固定由两个直接同级模块构成：

```text
.boss-content-stack
├── .boss-query-module
└── .boss-result-module
```

- 两者背景均显式为白色。
- 两模块之间由父级提供 `16px` 间距。
- `.boss-query-module`：四周 `16px` Padding。
- `.boss-result-module`：顶部 `0`，左右与底部 `16px`。
- 结果模块白底覆盖统计、Toolbar、Table、Pagination 和完整模块高度。
- `.boss-result-summary`、Toolbar、Table、Pagination 不再增加左右 Padding。

## 6. 查询条件

- 使用 Ant Design `Form layout="horizontal"`。
- 默认三等列 `minmax(0, 1fr)`。
- 网格、表单容器和每个查询项占满模块可用宽度。
- Label 在所属 Label 列内右对齐。
- 同列 Label 宽度稳定，控件左边缘对齐。
- Label 宽度按内容自适应，不做全局固定值。
- Label 到 Control 的最终视觉间距：`8px`。
- 字段列间距：`16px`。
- 控件填满所属列。

查询动作区：

- 作为独立 Grid Item，不与最后一个字段共用单元格。
- 始终落在三列网格最右列并右对齐。
- 顺序：展开 / 收起、重 置、查 询。
- 动作间距：`8px`。
- 6 个及以下字段全部展示，不显示展开 / 收起。
- 正好 6 个字段时，动作区作为第 7 个位置，另起一行并位于第三列。
- 超过 6 个字段时默认展示前 5 个，动作区位于第二行第三列。
- 展开后展示全部字段，动作区仍位于最后一个网格位置的右侧。
- 展开使用 `DownOutlined`，收起使用 `UpOutlined`。
- 展开 / 收起文字和 Icon 使用 `rgba(0,0,0,.85)`。
- `.boss-query-expand-button` 无可见边框、无左右内边距。

Placeholder：

- 输入类：`请输入` 或 `请输入字段名`。
- 选择类：`请选择` 或 `请选择字段名`。
- RangePicker：`请选择开始日期` / `请选择结束日期`。

## 7. 分析筛选与 Dashboard

### 7.1 分析筛选

- 使用独立白色轻量筛选模块。
- 条件项位于左侧。
- 日期 / 时间范围位于右侧，不额外显示 Label。
- 不展示“重 置 / 查 询”动作区。
- 条件变化按产品约定自动刷新当前视图。
- 不复用三列查询表单形态。

### 7.2 Dashboard 统计

- 首页是业务数据概览，不是营销落地页。
- 汇总模块使用“总数据在上、子数据在下”。
- 每个汇总模块只保留 1 个主总量。
- 子指标最多 4 列、2 行、8 项。
- 不使用“左侧主指标 + 右侧子指标”布局。
- 超过 8 个子指标时拆分模块。
- 多指标使用多个同级白色统计模块。
- 不使用查询列表的灰色统计卡片外壳。
- 不使用灰色占位图表块。
- 不添加无需求的快捷入口。

图表：

- 使用 Ant Design Charts 或项目内基于它的封装。
- 禁止使用纯 CSS、手写 SVG、Canvas、ECharts 或 Chart.js 冒充平台图表。
- 单文件预览缺少运行依赖时，必须通过统一图表封装降级，并在实现说明中明确标记。

## 8. 查询统计

统计始终位于 `.boss-result-module` 内部、Table 上方。

### 8.1 无统计

- Toolbar 左侧展示“查询列表”。
- 字号 `16px`，可使用 `font-weight: 500`。

### 8.2 轻量统计

- 1–3 个指标使用 `14px` Inline 统计。
- Inline 统计占用原结果标题位置。
- 不同时展示“查询列表 / 查询结果”大标题。
- 标题与单位使用常规文字色。
- 数值使用 `#F36046`。
- 与右侧工具按钮在同一 Toolbar 行。

### 8.3 多指标统计

- 超过 3 个指标使用 Ant Design `Statistic`。
- 每个指标为独立 `#F6F6F6` 卡片。
- 卡片等宽分布，间距 `16px`。
- 卡片内边距 `16px`。
- **硬性规则：当结果区使用灰色 `#F6F6F6` 统计卡片时，统计卡片区域必须保留 `16px` 的内容区上内边距（`padding-top: 16px`）。该上内边距属于结果模块内部垂直节奏，不得省略；统计外层仍禁止增加左右内边距。**
- 统计卡片区独占一行，位于 Toolbar 之上。
- 卡片区与 Toolbar 间距：`8px`。
- 不使用整条灰底加竖线模拟独立卡片。
- 标题包含单位，数值不重复单位。

查询统计样式只用于查询列表。Dashboard 不得复用。

## 9. Table

### 9.1 基础结构

- 使用 Ant Design `Table` 或平台封装。
- Toolbar、Table、Pagination 均位于结果模块白底内。
- Toolbar 最小高度：`64px`。
- Toolbar 内容垂直居中。
- 标题行高按 `32px` 对齐右侧按钮。
- Toolbar 下方不增加分割线。
- 右侧工具区间距：`8px`。
- Table 高度随内容自然增长。
- 不默认设置 `scroll.y` 或最低可视行数。
- 低高度视口由内容区滚动，不能裁剪分页。

### 9.2 分页

- 默认每页 `10` 条。
- 使用 Ant Design 默认规格，不缩小为 Mini。
- 显示 PageSize 切换器。
- 每页条数使用中文 `10 条/页`、`20 条/页`。
- Pagination 紧贴 Table 底部。
- 分页区域最小高度：`64px`，垂直居中。
- 不在分页下方制造弹性空白。
- PageSize 浮层不得被 Table、内容滚动区或 Footer 裁切。

### 9.3 表头、正文与状态

- 表头可使用 `font-weight: 500`。
- 正文使用 `font-weight: 400`。
- 状态列使用 Ant Design `Badge` 状态点 + 中文文案。
- 不使用 `Tag` 表达普通状态；Tag 仅用于类别标签。
- 金额列标题追加 `(元)`。
- 金额列的表头、单元格、汇总和固定列副本全部右对齐。
- 数字使用等宽数字。

### 9.4 操作列

- 固定在表格最后，横向滚动时固定在右侧。
- 第一个操作为该行主 / 高频操作。
- 1–2 个操作时直接展示。
- 超过 2 个时展示前两个，其余进入“更多”Dropdown。
- 所有可点击文字操作使用 `#F36046`，禁用或无权限除外。
- 所有操作文字 `font-weight: 400`。
- Hover / Focus 只改变文字色，不增加背景、描边或块状底色。
- 第一个按钮与“操作”表头左侧对齐。
- 移除 Link Button 默认左右内边距。
- 列宽根据实际操作内容自适应，不为未出现操作预留过宽空间。
- 容器保留 `data-boss-operation-column`。

主题与兜底：

- `ConfigProvider` 同时设置 `colorPrimary`、`colorLink` 和 `colorLinkHover`。
- 在 `[data-boss-operation-column]` 范围内显式覆盖 Link 文字色。
- 禁止通过全局 `!important` 污染所有链接和按钮。
- 最终呈现不得回退为 Ant Design 默认蓝色 `#1677FF`。

### 9.5 列设置

- 每个查询列表 Table 默认提供真实列设置。
- 使用 Icon-only `SettingOutlined`。
- 背景：`#FAFAFA`。
- Normal / Hover / Focus / Active 均使用 `rgba(0,0,0,.45)`。
- 无文字、无可见边框、无描边、无按钮阴影。
- 使用 Ant Design `Dropdown` / `Popover` + `Checkbox`。
- Checkbox 纵向一行一项。
- 浮层保留官方白底、圆角和阴影。
- 操作列默认不允许隐藏。

### 9.6 Toolbar

- 只放标题 / 统计、明确业务按钮和列设置。
- 不常驻“请选择订单 / 数据 / 记录”等教学提示。
- 未选择数据时点击批量操作，通过 Message / Notification 反馈。
- 1–2 个操作最多保留 1 个主按钮。
- 超过 2 个操作时最多展示 2 个高频按钮，其余进入 Dropdown。
- 导出按钮默认使用文字“下载Excel”，不配装饰性 Icon。

## 10. 表单

### 10.1 全局对齐

- 所有 Label 到 Control 间距为 `8px`，不得重复叠加 Margin 或 Padding。
- 同一表单内不得混用横向与纵向 Label 模式。

### 10.2 查询与 Modal 表单

- 查询列表与 Modal 使用横向表单。
- Label 右对齐。
- Modal 内 Label 长度不一致时，按最长 Label 使用统一固定宽度。
- 所有 Label 等长时允许内容自适应。
- 控件区从同一 X 坐标开始。

### 10.3 Drawer 与新增 / 编辑页

- Drawer、Full-page Form、Wizard 使用纵向表单。
- Label 位于控件上方并左对齐。
- 控件默认占满所在列。
- 三列分组只改变字段列数，不改变 Label 在上的结构。
- Full-page Form 的提交操作使用 workspace 级 `.boss-full-page-action-bar`：`position: fixed`、高度 `48px`、横跨右侧工作区、位于 Shell Footer 上方（`bottom: 32px`）。不得降级为最后一个表单模块内的普通按钮行或局部 sticky 区。
- Full-page Form 内容滚动区必须预留操作栏和 Footer 所需的底部空间；侧栏收起时，操作栏左边缘同步从 `208px` 调整为 `48px`，不得遮挡最后一个字段或表格。

### 10.4 Wizard

- 使用 Ant Design `Steps`。
- 每一步必须有简短 `description`，说明步骤产出或校验重点。
- 主体在扣除 Tabs、Footer 和操作栏后的可用高度内垂直居中。
- 表单 / 确认区与插图说明使用 `65% / 35%` 分栏；不得使用会溢出工作区的 `65% / 45%`。
- Wizard 左侧表单必须使用双列等宽网格，字段网格横向、纵向间距均为 `16px`，Form.Item 外间距也统一为 `16px`。
- InputNumber 含 Addon 时仍与同行控件等宽。
- 底部操作栏盒模型高度：`48px`。
- 小屏可隐藏插图，但保留表单列宽与间距。
- 插图使用统一资产，并以相对路径引用。

## 11. Modal、Drawer、Descriptions 与 Result

### 11.1 Modal

- 使用 Ant Design `Modal` / `Modal.confirm`。
- 不使用手写 Dialog 或自定义壳层替代。
- 标题区下方与 Footer 上方均显示通栏灰色分割线。
- 普通表单 Modal 宽度：`480–520px`。
- 确认弹窗宽度：`416px`。
- 普通 Modal Body：`padding: 24px 24px 0`。
- 普通 Modal Content 不保留会缩短分割线的左右 Padding。
- 提交确认和二次确认必须使用 `Modal.confirm`，不使用 `Popconfirm`。
- `Modal.confirm` 静态调用不得依赖 Ant Design 默认主题色；确认按钮及其 hover / focus / active 状态必须显式使用 Boss Ledger 主色 `#F36046`，取消按钮使用中性色。
- Confirm Body 必须保持：

```css
.ant-modal-confirm .ant-modal-body {
  padding: 24px !important;
}
```

### 11.2 Drawer

- 保留 Ant Design 默认头部高度、内边距、字体与关闭按钮规格。
- 标题在左，关闭 Icon 在最右并垂直居中。
- Header 不放状态、Badge、辅助信息或业务操作。
- 有业务操作时统一进入 Drawer Footer。
- Footer 操作右对齐。
- 正文不重复放置页面操作按钮。
- 详情容器使用 `padding: 0`，不叠加 Drawer 默认内容内边距。

### 11.3 Descriptions

- 详情、审核信息和配置摘要使用 Ant Design `Descriptions` 默认非边框样式。
- 禁止使用 `Descriptions bordered`。
- 禁止用 Table、手写格线或表格式详情网格模拟 Label-Value。
- 按业务含义分区，不使用卡片套卡片制造层级。

### 11.4 Result 与 Empty

- Result 使用独立白色业务模块。
- Result 业务模块必须撑满扣除 Tabs、Footer 后的整个可用内容区，不得只按内容自身高度收缩。
- Result 内的 Result、摘要和操作按钮作为一个整体，在该可用内容区内垂直居中；不得只把 Result 图标或单个摘要块居中。
- 摘要使用独立灰色块，圆角 `6px`，字段均匀分布。
- 主操作位于按钮组左侧，返回等次要操作位于右侧。
- 提交成功使用 Ant Design `Result`。
- 整页无数据、无权限或缺少前置条件使用 Ant Design `Empty` / `Result`，必须放在整体白色业务模块中，并保持模块内垂直、水平居中。

## 12. 按钮、图标与文案

### 12.1 按钮

- 两个汉字的独立按钮文案中间加空格，例如：`查 询`、`重 置`、`确 认`、`取 消`、`保 存`、`新 增`。
- 普通按钮文字使用常规体。
- 主按钮使用品牌主色。
- 次按钮使用 Ant Design 默认按钮。
- 业务动作默认只显示文字，不添加装饰性 Icon。
- 工具类 Icon-only 控件必须提供 Tooltip 或 `aria-label`。

### 12.2 图标

- 统一使用 Ant Design Icons。
- 二级菜单必须有语义匹配的官方 Icon。
- 列设置：`SettingOutlined`。
- 查询展开 / 收起：`DownOutlined` / `UpOutlined`。
- 侧栏展开 / 收起：`MenuFoldOutlined` / `MenuUnfoldOutlined`。
- 全屏：`FullscreenOutlined`。
- 关闭使用组件内置行为或 `CloseOutlined`。
- 禁止 Emoji、字符图标、手绘 SVG、CSS 伪元素和其他图标库。

### 12.3 中文化

- 运行时默认全中文。
- 禁止出现 `Start date`、`End date`、`items/page`、`No data`、`OK`、`Cancel`。
- DatePicker、Pagination、Empty、Modal、表单校验和反馈均显式配置中文 Locale 与文案。

## 13. 交互与反馈

- 使用真实 Ant Design 组件，不用静态块冒充交互控件。
- 查询、刷新、提交、下载、导出、退款和结算等动作提供 Loading 与 Message / Notification 反馈。
- 保留 Loading、Empty、Error、Permission、Validation 状态。
- Modal、Drawer 和 Dropdown 保留官方焦点、遮罩、关闭和键盘行为。
- 所有 Tab、菜单、列设置、分页和表单控件均必须真实可交互。

## 14. 响应式与可访问性

- 内容宽度随 Workspace 自适应。
- 不固定 Figma 基准宽度为运行态宽度。
- 屏幕高度不足时内容自然滚动，不压缩字段、分页或操作栏稳定尺寸。
- Wizard 小屏可隐藏插图。
- 页面 Shell 不出现浏览器级横向滚动。
- Table 横向滚动局限在 Table 内部。
- Icon-only 控件提供 Tooltip 和可访问名称。
- 表单字段有可访问 Label。
- Modal / Drawer 保留焦点锁定与键盘关闭。
- 状态不能只依赖颜色表达，使用状态点与文字。

## 15. 实现约束

- 可交互预览使用 React + Ant Design + Ant Design Icons。
- 复用 `templates/boss-ledger-shell/`。
- 禁止使用原生 `input`、`select`、`table`、`button` 或手写组件冒充 Ant Design。
- 禁止使用静态图表、纯 CSS、SVG 或 Canvas 冒充业务图表。
- 若依赖无法满足，应先补齐模板或运行依赖，不交付降级为静态假组件的页面。

## 16. Design Self-Check

交付前至少检查：

- 是否使用 Boss Ledger 固定 Shell 与 `specs/boss logo.svg`。
- 顶部信息栏是否为 `28px`，一级导航是否为 `64px`。
- 侧栏是否为 `208px / 48px`，菜单最大 3 级并真实可折叠。
- Tabs 是否为 `44px`，当前 Tab 是否与内容区连接。
- 是否仅当前 Tab 显示静态 `ReloadOutlined`。
- 内容区是否为 `#F4F4F4`，业务模块是否显式白底。
- 同级模块是否只由父级提供一次 `16px` Gap。
- 查询与结果模块是否独立，且不存在重复 Padding。
- 查询条件是否三列、Label 到 Control 为 `8px`。
- 查询动作区是否始终位于最右列。
- 查询统计与“查询列表”标题是否正确互斥。
- Dashboard 是否使用白色独立统计模块，而非查询统计样式。
- Table、Pagination、列设置和操作列是否符合规范。
- 金额列是否右对齐、状态是否为 Badge 点 + 中文文案。
- Modal、Drawer、Descriptions、Steps、Result 是否使用官方组件。
- 所有运行时文案是否中文化。
- 页面是否无营销化自由发挥、卡片套卡片和页面级横向滚动。

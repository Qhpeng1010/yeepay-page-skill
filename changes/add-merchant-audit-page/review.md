# Review: 新增商户资料审核页面

## 1. Product Review

结论：Pass

检查说明：

- 已明确业务对象为商户资料审核任务。
- 已明确用户角色、业务目标、功能范围、核心流程、字段、状态、权限、异常和验收标准。

## 2. Page Template Review

结论：Pass

检查说明：

- 已选择“审核处理页”模板。
- 页面结构包含查询条件、审核列表、详情入口、审核操作弹窗和结果反馈。
- 已覆盖 loading / empty / error 状态。

## 3. Theme Review

结论：Pass

检查说明：

- 已识别目标平台为 Boss Ledger。
- 已读取 `specs/design-system.md` 和 `specs/themes/boss-ledger.md`。
- HTML 预览遵循 Boss Ledger 的固定框架、主色、内容背景、导航、Tabs、查询区、表格区和按钮文案规则。
- HTML 预览已通过本地 `vendor/` 缓存引用官方 React、Ant Design、Ant Design Icons 和 dayjs 运行文件，避免外部 CDN 不稳定导致空白预览。
- 已按浏览器标注补齐：Logo 左侧固定、一级菜单右侧右对齐、Tabs 顶部 `4px`、当前 Tab 灰色刷新 icon 无额外 gap、选中 Tab 顶部圆角 `8px`、查询区展开文案右侧 `8px`、左侧导航 `48px` 收起态、二级菜单展开 / 收起、表格操作列左对齐。
- 已按最新浏览器标注补齐：Modal 标题下方和按钮区上方灰色分割线、表单 label 到控件 `8px`、二级导航和内容区撑满屏幕、底部 footer 常驻、顶部信息栏弱文字色。
- 已按本轮浏览器标注补齐：展开态二级菜单内容区 `207px` 填满且无右侧白色间距，收起态继续按 `48px` 适配，查询列表内容区和表格模块撑满可用高度且 footer 保持可见。
- 已按本轮浏览器标注补齐：Drawer 标题左侧、关闭 icon 右侧，Modal 内容区 `24px`、表单元素间距 `16px`，列设置按钮 `#FAFAFA` 背景且支持列显隐，footer 高度 `40px`、字号 `12px`。
- 已按本轮浏览器标注补齐：Table 和 Pagination 紧贴展示，查询表单项内部 label 与控件之间保持 `8px` 间距。
- 已按本轮浏览器标注补齐：查询表单 label 与控件实际间距 `8px`、分页上下内边距 `16px`、footer 文案贴上方、二级导航收起态 icon 居中。
- 已按本轮浏览器标注补齐：Logo 从文字占位改为引用页面 assets 下的 SVG 资产，并在 Boss Ledger 规则中要求正式项目使用官方品牌资产。
- 已按本轮浏览器标注补齐：去掉表单 label 冒号右侧额外 `margin-right: 8px`，多标签左右 padding 为 `12px`，刷新 icon 与标题间距为 `8px`，关闭 icon 左侧间距为 `4px`。
- 已按本轮浏览器标注补齐：表格工具栏在侧边栏收起或页面宽度变化时保持上下 `16px` 的垂直间距，标题、按钮和列设置入口使用 `64px` 行高区域垂直居中，右侧按钮区固定 `8px` 间距且不压缩。
- 已按本轮浏览器标注补齐：左侧导航收起态保留二级 icon，分页包含在表格白色内容区内，不落到灰色背景或 footer 区域。

## 4. Component Review

结论：Pass

检查说明：

- 预览页已使用 Ant Design `Form`、`Input`、`Select`、`RangePicker`、`Button`、`Table`、`Pagination`、`Menu`、`Tabs`、`Drawer`、`Modal`、`Descriptions`、`Timeline`、`Tooltip`、`Empty` 等组件。
- 图标已使用 Ant Design Icons，如 `AuditOutlined`、`TeamOutlined`、`ToolOutlined`、`SafetyCertificateOutlined`、`SettingOutlined`、`DownOutlined`、`MenuFoldOutlined`、`CloseOutlined`。
- 未使用手写基础控件或字符图标冒充 Ant Design 组件。
- 已在 Boss Ledger 主题规范中明确平台图表必须使用 Ant Design Charts 或项目内基于 Ant Design Charts 的封装。
- 列设置已使用 Ant Design `Dropdown` 和 `Checkbox` 实现显隐交互。
- 顶部 Logo 已使用 `img` 引用 SVG 资产，非文字按钮模拟。

## 5. Frontend Review

结论：Pass with Notes

检查说明：

- 已按用户要求跳过 React / TypeScript 工程化生产代码。
- 已输出可预览 `index.html`，并用官方 UMD 包渲染 Ant Design 运行态组件。
- 已在 implementation.md 中列出后续正式实现文件结构。

## 6. Interaction Review

结论：Pass

检查说明：

- 预览 HTML 已包含查询 loading、重置、详情抽屉、审核弹窗、驳回原因校验、操作反馈。
- 高风险审核操作已通过确认弹窗和校验提示表达。

## 7. Copywriting Review

结论：Pass

检查说明：

- 两个汉字按钮已使用空格，如“查 询”“重 置”“确 认”“取 消”。
- 状态文案、错误提示、确认提示和空状态文案清晰。
- 未使用营销化文案。

## 8. Spec Update Suggestion

是否需要更新 specs：

- Yes

原因：

- 本次浏览器调整沉淀出 Boss Ledger 通用主题规则，包括 Modal 分割线、表单 label 到控件间距、页面 footer、内容区撑满、二级菜单宽度和顶部信息栏文字色。
- 本轮继续沉淀 Drawer 头部结构、Modal 内容和元素间距、列设置显隐能力、footer 高度和字号规则。
- 本轮继续沉淀 Table 与 Pagination 紧贴展示、查询表单项内部 label 到控件 `8px` 间距规则。
- 本轮继续沉淀分页上下 `16px`、footer 文案贴上方、收起态二级导航 icon 强制居中规则。
- 本轮继续沉淀 Logo 资产使用规则：正式项目优先引用官方 SVG / PNG，不使用纯文本、边框按钮或 CSS 临时绘制。
- 本轮继续沉淀 Tabs 精细间距和表单冒号右侧间距规则。
- 本轮继续沉淀表格工具栏自适应间距规则。
- 本轮继续沉淀左侧导航收起态 icon 显隐和分页归属表格内容区规则。

建议更新文件：

- `specs/themes/boss-ledger.md`

## 9. Final Decision

Pass

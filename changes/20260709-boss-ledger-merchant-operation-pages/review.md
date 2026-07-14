# Review: Boss Ledger 商户经营与核销管理页面

## 1. Product Review

结论：Pass

检查说明：

- 已保留用户原始需求并说明标题与详细功能不一致。
- 已明确按详细清单实现商户经营与核销管理页面组。
- 已覆盖经营大盘、客流分析、订单核销、券码工作台、门店管理、渠道管理。
- 已说明角色、范围、状态、权限、异常和验收标准。

## 2. Page Template Review

结论：Pass

检查说明：

- 已选择 Dashboard 首页、经营分析、查询列表、工作台和配置管理模板。
- 六个页面的模块顺序、筛选字段、表格字段、操作和状态均已在 `page-design.md` 中定义。
- 列表类页面包含查询、统计、表格、分页、列设置和操作列。

## 3. Theme Review

结论：Pass

检查说明：

- 已识别目标平台为 Boss Ledger。
- 已读取 `specs/design-system.md` 和 `specs/themes/boss-ledger.md`。
- 预览使用主色 `#F36046`、内容背景 `#F4F4F4`、顶部信息栏 `#3A3A3A`。
- 保留顶部信息栏、一级导航、左侧导航、Tabs、内容区、footer。

## 4. Component Review

结论：Pass with Notes

检查说明：

- 查询、按钮、表格、分页、Modal、Drawer、Tabs、Menu、Empty、Dropdown、Tooltip 均使用 Ant Design 组件。
- 图标使用 Ant Design Icons。
- 图表按 Boss Ledger 要求使用本地 G2Plot 作为 Ant Design Charts 等价封装，已实际渲染折线图、柱状图和饼图。
- 内容区已调整为灰色背景承载独立白色模块，避免内容区整体再套一层白色外壳。
- 表格链接、分页选中态、主按钮和复选框均继承 Boss Ledger 主色 `#F36046`。
- 查询列表页已统一为查询条件模块 + 表格 / 统计 / 分页模块。
- 超过三项的数据汇总已使用 Ant Design `Statistic`，外层使用 `#F6F6F6` 均分统计容器，并补齐单位到标题。
- 数据分析页筛选区已移除重置 / 查询按钮。
- 左侧导航已使用 Ant Design Menu 官方结构，并按当前一级菜单过滤展示。
- 当前 Tab 与内容区已直接连接，多标签 icon 与文字间距为 `6px`。
- 下载 / 导出类按钮默认不展示 icon。
- 表格工具栏 2 到 3 个操作项时只保留 1 个主要按钮。
- 详情字段和核销记录已使用 Ant Design `Descriptions`，避免手写描述列表。
- Drawer 标题区已基于 Ant Design `Drawer` 调整为标题左、关闭 icon 右。
- 确认 / 二次确认类操作已恢复使用 Ant Design `Modal.confirm`，并补齐内容区 `24px` 内边距。
- 已同步更新 `specs/themes/boss-ledger.md`，防止后续调用 yeepay-page-skill 时重复生成错误结构。
- 非数据统计页涉及操作、筛选、数据展示时已改为上下布局，操作 / 筛选模块在上，数据统计和记录列表在下。
- 表格区域不再用剩余空间强撑高度，不设置最低可视行数，也不默认设置纵向滚动高度。

## 5. Frontend Review

结论：Pass with Notes

检查说明：

- 本次产出为静态 HTML 预览，不是正式 React + TypeScript 工程代码。
- mock 数据覆盖主要状态和操作。
- 已在 `implementation.md` 给出正式工程拆分建议。

## 6. HTML Preview Review

结论：Pass with Notes

检查说明：

- 已生成 `changes/20260709-boss-ledger-merchant-operation-pages/preview.html`。
- 文件是完整 HTML，可独立打开。
- React、Ant Design、Icons、dayjs、lodash、G2Plot 使用本地 vendor。
- 已用浏览器截图验证首页和订单列表页正常渲染，图表非空白。
- 预览与 `proposal.md`、`page-design.md` 的字段、页面结构和操作一致。
- 订单、核销流水、异常核销、门店、渠道表格均按实际数据量自然撑开高度，分页紧贴表格底部。

## 7. Interaction Review

结论：Pass

检查说明：

- 查询、重置、导出、批量操作、列设置、菜单切换、Tabs 切换、弹窗、抽屉均具备轻量交互。
- 批量退款、退款、启停门店、渠道结算等风险操作使用 Modal 二次确认。
- 表单提交包含必填和范围校验。

## 8. Copywriting Review

结论：Pass

检查说明：

- 按钮文案遵守两个汉字加空格规则，如 `查 询`、`重 置`、`新 增`、`核 销`。
- 状态文案清晰，未使用营销化或无意义占位文案。

## 9. Spec Update Review

是否需要更新 specs：

- Yes

原因：

- 用户明确要求将本轮规则调整沉淀到 `yeepay-page-skill/specs/themes/boss-ledger.md`，防止后续调用 yeepay-page-skill 时继续生成错误结构。

已更新文件：

- `yeepay-page-skill/specs/themes/boss-ledger.md`

已覆盖规则：

- 内容区灰底托底，业务内容始终为独立白色模块。
- 查询列表页统一为查询条件模块 + 表格 / 统计 / 分页模块，查询条件三列均分，重置 / 查询在查询条件模块右侧。
- 表格工具栏下方不展示分割线。
- 超过三项统计使用 Ant Design `Statistic`，外层 `#F6F6F6` 灰色容器均分展示，容器内边距 `16px`。
- 统计标题补单位、标题用三级标题色、数值用一级标题色。
- 数据分析页不展示重置 / 查询按钮，左侧条件、右侧无标题时间范围。
- 左侧导航只展示当前一级菜单下的二三级内容。
- 二三级菜单必须使用 Ant Design Menu 官方组件，二级菜单展开 / 收起 icon 保持官方右侧位置。
- Tabs 左侧增加 `16px`，与内容区左侧对齐；当前 Tab 与内容区直接连接；多标签 icon 与文字间距为 `6px`。
- 表格操作列宽度按操作项自适应，操作较多时用更多收纳。
- 表格工具栏 2 到 3 个操作项时只保留 1 个主要按钮。
- 下载 / 导出类操作默认不展示 icon。
- 所有组件默认沿用 Ant Design 官方组件或项目内基于 Ant Design 的封装，除非有明确业务规则。
- 详情字段、审核信息、核销记录、配置摘要等 label-value 信息必须使用 Ant Design `Descriptions`。
- Drawer 标题区必须标题在左、关闭 icon 在右，左右分布并垂直居中。
- 确认 / 二次确认类操作必须使用 Ant Design `Modal.confirm` 或 `Popconfirm`，不因为间距问题改成普通受控 `Modal`。
- 非数据统计页同时包含操作、筛选、数据展示时，始终使用上下布局，操作 / 筛选模块在上，数据统计和记录列表在下。
- 表格高度根据内容自适应，不设置最低可视行数，不默认设置纵向滚动高度，分页紧贴表格底部。

## 10. Final Decision

Pass with Notes

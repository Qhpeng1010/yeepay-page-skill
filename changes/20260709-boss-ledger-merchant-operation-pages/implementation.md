# Implementation: Boss Ledger 商户经营与核销管理页面

## 1. Tech Stack

- HTML
- CSS
- JavaScript
- React UMD
- Ant Design UMD
- Ant Design Icons UMD
- dayjs UMD
- Ant Design Charts 等价图表封装：G2Plot UMD

说明：本次按 yeepay-page-skill 生成静态 HTML 预览，不改正式工程代码。页面基础控件使用真实 Ant Design 组件。图表区域使用本地 G2Plot UMD 作为 Ant Design Charts 等价封装，实际渲染 Line / Pie / Column 图表，避免空白图表区域。

## 2. File Structure

```text
yeepay-page-skill/changes/20260709-boss-ledger-merchant-operation-pages/
├── proposal.md
├── page-design.md
├── tasks.md
├── implementation.md
├── preview.html
├── review.md
├── assets/
│   └── boss-ledger-logo.svg
└── vendor/
    ├── ant-design-icons.umd.js
    ├── antd-reset.css
    ├── antd.min.js
    ├── babel.min.js
    ├── dayjs-zh-cn.js
    ├── dayjs.min.js
    ├── g2plot.min.js
    ├── lodash.min.js
    ├── react-dom.production.min.js
    └── react.production.min.js
```

## 3. Preview File

`preview.html` 可直接在浏览器打开，包含 Boss Ledger 固定框架、三组一级导航、六个业务页面和 mock 数据。

## 4. Implemented Preview Interactions

- 一级导航切换：经营总览、订单核销管理、门店与渠道管理。
- 左侧菜单切换六个页面，Tabs 标题随页面变化。
- 左侧导航整体收起 / 展开。
- 查询、重置、导出和 loading 反馈。
- 全部订单列表支持选择行、批量补发券码、批量退款、列设置。
- 订单行支持查看详情、退款、改期、补发核销短信。
- 券码核销支持选择门店、扫码输入区、手动输入券码和核销校验。
- 门店管理支持新增 / 编辑、启停确认、配置子账号、单门店数据抽屉。
- 渠道管理支持新增渠道、修改分佣、商品上下架、对账结算确认。
- 内容区改为灰色背景承载独立白色模块，不再在内容区整体套白色外壳。
- 查询列表页统一为查询条件模块 + 表格分页模块，查询条件三列均分展示。
- 查询条件表单容器和查询网格占满模块宽度，避免右侧出现未使用空白。
- 表格操作链接、分页选中态、主按钮、复选框统一继承 Boss Ledger 主色 `#F36046`。
- 图表已使用本地 G2Plot 等价封装真实渲染。
- 表格工具栏下方去掉分割线。
- 超过三项的数据汇总使用 Ant Design `Statistic`，外层为 `#F6F6F6` 均分统计容器，内边距 `16px`。
- 全局汇总统计标题补充单位，标题使用弱文本色，数值使用一级标题色。
- 数据分析页筛选区改为左侧条件、右侧无标题时间范围，不展示重置 / 查询按钮。
- 左侧导航使用 Ant Design Menu 官方结构，按当前一级菜单过滤，只展示当前一级下属二三级内容。
- 当前 Tab 与内容区直接连接，Tabs 左侧增加 `16px`，多标签 icon 与文字间距统一为 `6px`。
- 下载 / 导出类操作默认不展示 icon。
- 操作列按操作项收敛宽度，行内操作超过 3 个时使用“更多”下拉收纳，避免操作列过宽。
- 表格工具栏 2 到 3 个操作项时只保留 1 个主要按钮，其余使用默认按钮或危险描边按钮。
- 详情字段、核销记录等 label-value 信息统一使用 Ant Design `Descriptions`。
- Drawer 标题区基于 Ant Design `Drawer` 实现标题左、关闭 icon 右的左右分布。
- 确认 / 二次确认类操作使用 Ant Design `Modal.confirm`，并补齐内容区 `24px` 内边距。
- Modal / Drawer 均使用 Ant Design 组件并保留确认反馈。
- 非数据统计页涉及操作、筛选、数据展示时已改为上下布局，操作 / 筛选模块在上，数据统计和记录列表在下。
- 表格区域按内容自适应，不再设置最低可视行数，也不默认设置纵向滚动高度。

## 5. Skipped Steps

- 正式 React + TypeScript 页面代码：用户本次要求使用 yeepay-page-skill 新增页面，当前产出为评审预览包。
- 真实接口联调：预览使用 mock 数据。
- 摄像头扫码能力：预览以扫码输入框模拟。

## 6. Follow-Up Implementation Notes

后续转正式工程建议拆分为：

```text
src/pages/MerchantOperation/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
├── charts.tsx
└── index.module.less
```

图表依赖建议在正式工程统一引入 `@ant-design/charts` 或项目内基于 Ant Design Charts 的封装；当前预览使用 G2Plot UMD 承载同类图表能力。

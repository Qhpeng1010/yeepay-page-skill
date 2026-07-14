# 实现说明

## 产物

- `preview.html`：Boss Ledger 单文件预览入口。
- `preview-app.js`：React + Ant Design 预览逻辑。
- `vendor/`：本地 React、Ant Design、Ant Design Icons、dayjs、G2Plot、Babel 运行时。
- `preview.screenshot.png`：校验脚本生成的 Chrome 截图。

预览入口：

- 数据大盘：首页默认打开 `preview.html`。
- 订单列表：可通过 `preview.html#orders` 直达。
- 本次重新生成目录：`changes/20260710-boss-ledger-air-travel-ops-regenerated/`。

## 技术实现

- 使用 React + Ant Design 真实运行组件。
- 左侧二级 / 三级导航使用 Ant Design `Menu`，配置 `inlineCollapsed`、`openKeys`、`onOpenChange`。
- 多标签使用 Ant Design `Tabs`，每个 Tab 左侧固定 `ReloadOutlined` 并带 `data-boss-tab-static-icon`。
- 查询表单使用 Ant Design `Form`、`Input`、`Select`、`RangePicker`。
- 列表使用 Ant Design `Table`、`Pagination`、`Dropdown`、`Checkbox`。
- 订单详情使用 Ant Design `Drawer` + 默认非边框 `Descriptions`。
- 高风险操作使用 `Modal.confirm`。
- 图表预览使用本地 `G2Plot` 运行时封装 `PlatformChart`。

## 关键处理

- `preview-app.js` 避免使用解构和数组展开，防止 Babel 在渲染 DOM 中注入包含 `TypeError` 文本的 helper，影响 Boss Ledger 校验脚本。
- Logo 直接引用 `../../specs/boss logo.svg`，并保留 `data-boss-logo-source="specs/boss logo.svg"`。
- 查询统计卡片保持在订单列表的结果模块内部，位于 Table 上方。
- 页面业务模块不使用 `border: 1px` 做层级区分，保持白色模块 + 灰底 + 16px 间距。

## 生产接入说明

正式接入项目时建议将 mock 数据替换为接口数据，并按页面拆分：

```text
src/pages/flight-ticket-ops/
├── overview/
│   ├── index.tsx
│   ├── mock.ts
│   └── index.module.less
└── orders/
    ├── index.tsx
    ├── columns.tsx
    ├── mock.ts
    ├── types.ts
    └── index.module.less
```

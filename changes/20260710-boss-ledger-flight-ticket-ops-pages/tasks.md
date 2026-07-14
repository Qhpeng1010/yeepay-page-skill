# 任务拆解

## 已完成

- [x] 读取 `yeepay-page-skill` 工作流、主题路由、模板路由、Boss Ledger 主题规范。
- [x] 读取 Dashboard 首页模板和卡片汇总查询列表模板。
- [x] 创建 change 目录：`changes/20260710-boss-ledger-flight-ticket-ops-pages/`。
- [x] 复制本地 vendor 依赖，保证 `preview.html` 可直接打开。
- [x] 生成航旅经营总览 Dashboard。
- [x] 生成全部机票订单列表。
- [x] 实现一级导航切换、左侧 Ant Design Menu、Tabs、查询展开收起、列设置、分页、详情 Drawer、操作反馈。
- [x] 运行 Boss Ledger 校验并生成截图。

## 后续接入生产项目时建议

- [ ] 拆分正式 React 文件：`types.ts`、`mock.ts`、`columns.tsx`、`index.tsx`、`index.module.less`。
- [ ] 接入订单查询、订单详情、批量导出、退改签、短信通知接口。
- [ ] 对高风险批量操作补充权限校验、操作原因和操作日志。
- [ ] 增加真实图表接口数据加载、loading、error retry。

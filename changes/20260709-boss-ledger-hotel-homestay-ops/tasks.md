# Tasks: Boss Ledger 酒店民宿运营后台

## 1. Product Tasks

- [x] 确认业务对象：经营指标、客房订单、房客、房型、门店、入住流水、异常订单、OTA 渠道和结算单。
- [x] 确认用户角色：酒店运营、前台、财务、门店管理员、系统管理员。
- [x] 确认功能范围：三个一级导航、六个页面、筛选、指标、图表、列表、工作台、导出和核心操作。
- [x] 确认字段：筛选字段、列表字段、表单字段已在 proposal 和 page-design 中列出。
- [x] 确认状态：订单、入住异常、门店、房型、渠道状态已定义。
- [x] 确认验收标准：按六个页面分别列出可验证标准。

## 2. Page Design Tasks

- [x] 选择页面模板：数据看板页、经营分析页、带查询统计的查询列表页、前台工作台页、配置管理列表页。
- [x] 确认页面模块顺序：固定框架、Tabs、内容模块、footer。
- [x] 确认查询条件：分析筛选条和查询列表表单分别定义。
- [x] 确认表格字段：订单、入住流水、异常订单、房型、OTA 渠道字段已定义。
- [x] 确认表单字段：入住检索、门店、房型、渠道表单字段已定义。
- [x] 确认操作和反馈：查询、导出、批量、退款、入住、上下架、结算等操作已定义。
- [x] 确认当前 theme：Boss Ledger。

## 3. Frontend Tasks

- [ ] 创建页面目录 `src/pages/boss-ledger/hotel-homestay-ops/`
- [ ] 创建 `types.ts` 定义经营指标、订单、入住流水、房型、渠道等类型。
- [ ] 创建 `mock.ts` 提供预览和联调前 mock 数据。
- [ ] 创建 `columns.tsx` 拆分订单、入住流水、异常订单、房型、渠道列定义。
- [ ] 创建 `index.tsx` 实现页面组、导航切换和状态管理。
- [ ] 创建 `index.module.less` 实现 Boss Ledger 主题样式。
- [ ] 实现分析筛选条和查询表单。
- [ ] 实现指标、图表、榜单、待办、表格和工作台。
- [ ] 实现分页、行选择、批量操作和二次确认。
- [ ] 实现 Modal / Drawer / message / notification。
- [ ] 实现 loading / empty / error 状态。
- [ ] 预留真实接口接入点。

## 4. Review Tasks

- [x] Product Review
- [x] Page Template Review
- [x] Theme Review
- [x] Component Review
- [x] Frontend Review
- [x] HTML Preview Review
- [x] Interaction Review
- [x] Copywriting Review
- [x] Spec Update Review

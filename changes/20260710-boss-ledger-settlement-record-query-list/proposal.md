# Proposal: Boss Ledger 结算记录查询列表页

## Original Request

生成一个 Boss Ledger 结算记录查询列表页，供财务人员查询商户每日结算记录，并查看当前查询结果的结算总金额和结算笔数。

## Selected Theme

- Theme: Boss Ledger
- Theme source: `specs/themes/boss-ledger.md`
- Routing reason: 需求包含 Boss Ledger、结算记录、查询列表，命中 Boss Ledger 后台查询列表规则。
- Theme boundary: 未读取或混用 YOP / 开放平台主题。

## Page Type

- 页面类型：轻量汇总查询列表页
- 主模板：`template-04-query-list-inline-summary.md`
- 支撑模板：`template-01-framework-shell.md`

## Reasonable Assumptions

- 结算日期使用日期范围选择，便于财务按日或多日查询。
- 银行账户按模糊字段输入，列表内展示脱敏账户。
- 查看详情使用 Drawer，不新增页面 Tab。
- 下载回单在预览中使用 message 反馈，不连接真实文件服务。

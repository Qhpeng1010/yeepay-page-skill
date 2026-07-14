# 页面设计方案

## Theme Routing

- Selected theme: Boss Ledger
- Theme source: `specs/themes/boss-ledger.md`
- Routing reason: 航旅经营后台、订单运维、数据首页、查询列表均属于 Boss Ledger 运营后台场景。
- No mixed theme: 未混用 YOP / 开放平台主题源。

## Template Selection

页面 1：航旅数据大盘首页

- Main template: `template-02-dashboard-home.md`
- Supporting template: `template-01-framework-shell.md`
- Source files: `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`, `specs/themes/boss-ledger-extractions/template-02-dashboard-home.md`
- Selection reason: 页面目标是经营数据首页，核心是筛选、指标、分布、趋势、排行和待办。
- Query summary statistics: 否。Dashboard 指标按首页规则使用独立白色模块，不使用查询列表统计样式。

页面 2：全部机票订单列表

- Main template: `template-05-query-list-card-summary.md`
- Supporting template: `template-01-framework-shell.md`
- Source files: `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`, `specs/themes/boss-ledger-extractions/template-05-query-list-card-summary.md`
- Selection reason: 查询列表包含 6 个周期统计指标，超过 3 个，按规则使用卡片汇总查询列表模板。
- Query summary statistics: 是。统计卡片位于结果模块内部、Table 上方。

## 信息架构

- 一级导航：航旅经营总览、机票订单运维管理、退改签管理、渠道对账管理、机票政策管理、系统管理。
- 航旅经营总览左侧菜单：航旅数据大盘首页、航线利润分析、渠道经营分析、退票审核待办、PNR 补录处理。
- 订单运维左侧菜单：全部机票订单列表、人工出票队列、航班异动订单、行程单打印、行程单补发。
- 多标签：每个 Tab 左侧固定 `ReloadOutlined`，当前页面由 Boss Ledger Tabs 承载，不额外增加页面标题。

## 航旅数据大盘首页

模块顺序：

1. 筛选条：航线类型、国内 / 国际、渠道、快捷日期、日期范围、全屏图标。
2. 经营指标概览：当期机票总交易额、出票量、退改率、平台毛利润、客单价及环比。
3. 出票与营收占比：渠道出票占比。
4. 底部图表：出票量 & 交易额趋势、国内 / 国际航线营收占比、业务待办。
5. 排行模块：热门航线营收排行、高利润机票政策排行。

## 全部机票订单列表

查询条件：

- 订单状态、航线类型、航司、起降日期、乘客姓名、订单号、PNR 编码、渠道。
- 默认收起展示前 5 项，支持展开 / 收起。
- 动作区固定在三列网格最右列，顺序为展 开 / 收 起、重 置、查 询。

统计指标：

- 总订单数(单)、成功出票数(单)、退票单数(单)、改期单数(单)、废票数量(单)、总成交金额(元)。

表格字段：

- 订单号、PNR 编码、航司航班号、起降城市时间、舱位、乘客信息、票价(元)、税费(元)、订单状态、操作。

行内操作：

- 主操作：查看订单详情。
- 次操作：人工出票、手动改签。
- 更多：发起退票、作废订单、补发行程单、发送航班通知短信。

批量操作：

- 批量导出订单、批量改签、批量退票、批量打印行程单、批量补发通知。

状态设计：

- 待出票：warning。
- 已出票：success。
- 已改签：processing。
- 已退票、废票：default / muted。
- 航班取消：error。

异常状态：

- 表格空状态展示“暂无符合条件的机票订单”。
- 高风险操作使用 `Modal.confirm`。
- 详情展示使用 Ant Design `Descriptions` 默认非边框样式。

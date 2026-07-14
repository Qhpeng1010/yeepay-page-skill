# Page Design: Boss Ledger 智能音箱电商运营后台

## 1. Selected Page Template

- Main Template: 多页面模块，分别选择 Dashboard 首页与查询列表卡片汇总 / 轻量汇总模式
- Supporting Template(s): `template-01-framework-shell.md`
- Template Source Files: `template-01-framework-shell.md`, `template-02-dashboard-home.md`, `template-05-query-list-card-summary.md`
- Reason: 经营大盘是 Dashboard；订单页有 4 个汇总指标，使用卡片汇总查询列表；商品管理页有 2 个筛选和 3 个汇总指标，使用查询列表结构并在工具栏展示轻量汇总。
- Includes Query Summary: Yes

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`
- Routing Reason: 运营后台、订单管理、经营数据首页、商品管理均命中 Boss Ledger 路由。
- Mixed Theme Sources: No

## 3. Page Structure

1. Boss Ledger 固定 shell：顶部信息栏、一级导航、左侧 Menu、Tabs、内容区、footer。
2. 音箱经营大盘首页：分析筛选条、经营指标、渠道环图、趋势图、品类排行、店铺排行、待办。
3. 全部音箱订单列表：查询区、卡片汇总、表格工具栏、Table、Pagination、订单详情 Drawer。
4. 店铺&音箱商品管理：查询区、轻量汇总、商品表格、商品详情 Drawer。

## 4. Module Design

### 音箱经营大盘首页

- Purpose: 全局监控智能音箱全品类经营收益、销量、渠道结构和待办工单。
- Content: 统计时间、运营店铺、音箱品类；交易额、订单量、现货 SKU、分销待结算；双趋势、渠道环图、排行。
- Actions: 筛选刷新、全屏查看、点击待办直达处理页。
- States: 正常、加载、空数据、图表无数据。

### 全部音箱订单列表

- Purpose: 覆盖订单全生命周期检索、运维和售后处理。
- Content: 6 个筛选项、4 个周期汇总指标、订单明细、列设置和分页。
- Actions: 查看详情、延长付款、手动退款、修改发货、推送物流短信、批量导出、批量通知、批量清理。
- States: 待付款、已付款、已发货、已签收、已退款、订单关闭、超时失效。

### 店铺&音箱商品管理

- Purpose: 管理店铺营业状态、音箱 SKU 售价、库存、上下架和仓储库区。
- Content: 店铺营业状态、仓储库区、店铺总数、营业中店铺、暂停运营店铺、商品表格。
- Actions: 新增运营店铺、新增音箱 SKU、编辑售价、上下架、店铺营业开关。
- States: 营业中、暂停运营、装修维护；售卖中、已下架、暂停售卖。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 统计时间 | Select + RangePicker | 今日/昨日/近7天/自然月/自定义区间 | 今日 |
| 运营店铺 | Select | 全店铺/指定自营店/授权分销店 | 全店铺 |
| 音箱品类 | Select | 全品类及四类音箱 | 全品类 |
| 订单状态 | Select | 订单生命周期状态 | 已付款 |
| 下单店铺 | Select | 全店铺/自营/分销 | 全店铺 |
| 下单日期 | RangePicker | 下单起止时间 | 近7天 |
| 用户手机号 | Input | 精准/模糊检索 | 空 |
| 订单渠道 | Select | OTA/私域/线下/企业采购 | 空 |
| 店铺营业状态 | Select | 全部/营业中/暂停运营/装修维护 | 营业中 |
| 仓储库区 | Select | 一楼常规/二楼影音/库存备货 | 一楼常规 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 订单编号 | orderNo | 音箱订单唯一编号 | 固定左列 |
| 用户信息 | passenger | 昵称和手机号脱敏 | 普通文本 |
| 音箱品类型号 | airline | 商品型号 | 普通文本 |
| 实付金额(元) | fare | 有效成交金额 | 右对齐 |
| 订单状态 | statusText | 订单生命周期 | 状态点 |
| 商品名称 | name | 音箱型号全称 | 固定左列 |
| 售卖单价(元) | price | SKU 售价 | 右对齐 |
| 当前库存数量 | stock | 可售库存 | 右对齐 |
| 核心配套功能 | feature | AI语音/蓝牙/触屏/降噪等 | 普通文本 |
| 商品售卖状态 | statusText | 上下架状态 | 状态点 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 运营店铺名称 | Input | Yes | 2-40 个字符 |
| 音箱 SKU 名称 | Input | Yes | 2-60 个字符 |
| 售卖单价 | InputNumber | Yes | 大于 0 |
| 当前库存 | InputNumber | Yes | 非负整数 |
| 商品功能 | Checkbox | Yes | 至少选择一项 |
| 商品状态 | Select | Yes | 售卖中/下架/暂停 |

## 8. Actions

### Page Actions

- 查 询
- 重 置
- 批量导出订单
- 批量操作
- 新增运营店铺
- 新增音箱SKU商品
- 列设置

### Row Actions

- 查看订单详情
- 延长付款
- 修改发货
- 发起退款
- 推送物流提醒短信
- 查看商品详情
- 编辑售价
- 上架 / 下架
- 店铺营业开关

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 已付款 | 警告状态点 | 修改发货、延长付款、退款 |
| 已发货 | 成功状态点 | 查看详情、推送物流提醒 |
| 已退款 | 默认状态点 | 查看详情 |
| 超时失效 | 错误状态点 | 清理过期订单 |
| 售卖中 | 成功状态点 | 编辑售价、下架 |
| 暂停售卖 | 警告状态点 | 上架、调整库存 |
| 已下架 | 错误状态点 | 上架 |

## 10. Interaction Rules

- 6 个及以下查询字段全部展示，不渲染展开 / 收起。
- 表格行操作第一项为主操作，其他操作为普通 link 或 Dropdown。
- 风险操作使用 `Modal.confirm`。
- 详情使用 Ant Design `Drawer` + 默认非边框 `Descriptions`。
- 列设置使用 `Dropdown` + `Checkbox`，操作列默认保留。

## 11. Empty / Loading / Error

### Loading

查询按钮和 Table 展示 loading。

### Empty

表格空态展示中文 Empty 文案。

### Error

预览中用 message 模拟操作失败或成功反馈；正式实现接入接口错误提示。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、内容灰底 `#F4F4F4`、白色业务模块和 16px 模块间距。
- 左侧导航使用 Ant Design Menu，Tabs 仅当前项使用 `ReloadOutlined` 静态左图标，未选中项不展示左侧 icon。
- 不混用 YOP 开放平台主题。

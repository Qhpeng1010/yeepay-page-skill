# Page Design: Boss Ledger 酒店民宿运营后台

## 1. Selected Page Template

- Template: 数据看板页 + 经营分析页 + 带查询统计的查询列表页 + 前台工作台页 + 配置管理列表页
- Reason: 经营大盘和房客分析属于数据看板；全部订单属于带查询统计的查询列表；前台入住是高频任务工作台；门店房型和 OTA 渠道属于配置管理与查询列表组合。

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`

## 3. Page Structure

1. Boss Ledger 固定框架层：顶部信息栏、一级导航、左侧导航、Tabs 页面标题区
2. 内容区：随当前页面渲染分析筛选、查询区、核心指标、图表、榜单、工作台、表格或台账
3. 页面 footer：位于内容滚动区末尾

## 4. Module Design

### 经营大盘首页

- Purpose: 统一展示酒店民宿经营结果、趋势、渠道结构、房型与门店排行、待办事项。
- Content: 时间 / 门店 / 房型品类筛选；今日客房总收入、今日入住订单量、在店客人数、待结算分销款；客房营收 & 入住量双趋势折线图；客源渠道环形占比图；房型营收柱状排行；门店入住率排行；待核对分销账单、待审核企业协议、待处理客诉工单。
- Actions: 条件变更后刷新视图；待办项可进入对应列表或详情。
- States: 指标环比涨跌、图表加载、图表无数据、待办为空。
- Notes: 使用分析筛选条，不展示 `查 询`、`重 置` 按钮。

### 房客经营分析

- Purpose: 分析房客入住结构、来源、地域和复购行为。
- Content: 门店 / 客源渠道 / 日期筛选；总入住人次、新客占比、平均房价、夜间入住峰值；24 小时入住时段分布；房客客源地域分布；长住 / 短住客户消费对比；高复购房型 TOP 榜单。
- Actions: 导出房客经营分析 Excel 报表。
- States: 导出 loading / 成功 / 失败、图表空状态。
- Notes: 分析页筛选使用轻量筛选条；导出按钮作为页面右侧操作。

### 全部订单列表

- Purpose: 支持运营人员按多维条件查询客房订单，并执行续住、退款、改期、短信提醒和批量处理。
- Content: 订单状态、入住门店、房型、入住日期、客人手机号、订单渠道筛选；订单总量、实收总金额、退款总额、未入住过期订单数量；订单列表字段：订单编号、客人信息、房型、入住离店时间、支付金额、订单状态。
- Actions: 查 询、重 置、批量导出订单、批量发送入住通知、批量处理过期订单；查看订单详情、办理续住、发起退款、修改入住日期、推送入住提醒短信。
- States: 待入住、已入住、已离店、已退款、已过期。
- Notes: 行内操作超过 3 个时使用更多操作收纳；退款和批量处理过期订单必须二次确认。

### 前台入住工作台

- Purpose: 支持前台快速办理入住并记录实时流水和异常拦截。
- Content: 身份证扫码、手机号查询、订单号检索；今日办理入住数、今日房费总收入、待入住预约订单数量；实时入住流水台账；异常订单台账。
- Actions: 扫码识别、查 询、办理入住、导出每日入住流水报表、查看异常。
- States: 可入住、已入住、已退款订单、过期预约、重复入住。
- Notes: 使用上下布局，检索和办理入口在上方，统计、流水和异常在下方。

### 门店房型管理

- Purpose: 管理门店营业状态、楼层、房型价格、库存、设施和售卖状态。
- Content: 门店营业状态 / 楼层筛选；门店总数量、营业中门店、装修暂停门店；房型列表字段：房型名称、房价、房间库存、配套设施、售卖状态、所属门店。
- Actions: 新增门店、新增房型、修改房价、上下架房型、开关门店营业状态、点击房型跳转单房型经营数据页面。
- States: 营业中、装修暂停、上架、下架。
- Notes: 点击房型打开单房型经营数据 Drawer，正式系统可路由到详情页或打开新 Tab。

### OTA 分销渠道管理

- Purpose: 管理 OTA 渠道合作、扣点、销售额、待结算佣金和对账结算。
- Content: 合作状态筛选；合作渠道总数、渠道总营收、待结算佣金、渠道平均扣点比例；各 OTA 渠道营收占比环形图；渠道列表字段：渠道名称、扣点比例、累计销售额、待结算佣金、合作状态。
- Actions: 新增 OTA 渠道、修改渠道扣点、房型渠道上下架、发起渠道对账结算。
- States: 合作中、暂停合作、待结算、结算中。
- Notes: 渠道对账结算属于财务高风险操作，应二次确认。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 时间范围 | DatePicker.RangePicker | 经营大盘统计周期 | 最近 7 天 |
| 日期 | DatePicker.RangePicker | 房客经营分析周期 | 最近 7 天 |
| 门店 | Select | 数据分析和订单查询门店 | 全部门店 |
| 房型品类 | Select | 经营大盘房型分类 | 全部房型 |
| 客源渠道 | Select | 房客分析来源渠道 | 全部渠道 |
| 订单状态 | Select | 订单列表状态筛选 | 全部状态 |
| 入住门店 | Select | 订单入住门店 | 全部门店 |
| 房型 | Select | 订单或库存房型 | 全部房型 |
| 入住日期 | DatePicker.RangePicker | 订单入住和离店日期 | 最近 7 天 |
| 客人手机号 | Input | 按手机号精确查询 | 空 |
| 订单渠道 | Select | OTA / 私域 / 线下 / 企业协议 | 全部渠道 |
| 门店营业状态 | Select | 门店管理筛选 | 全部状态 |
| 楼层 | Select | 房型所在楼层 | 全部楼层 |
| 渠道合作状态 | Select | OTA 渠道合作状态 | 全部状态 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 订单编号 | orderNo | 客房订单唯一编号 | 文本 |
| 客人信息 | guest | 客人姓名与手机号 | 手机号脱敏 |
| 房型 | roomType | 入住房型 | 文本 |
| 入住离店时间 | stayRange | 入住和离店日期 | 日期范围 |
| 支付金额(元) | paidAmount | 订单实收金额 | 右对齐，等宽数字 |
| 订单状态 | orderStatus | 订单当前状态 | Tag |
| 办理时间 | checkinTime | 前台办理时间 | 日期时间 |
| 入住客人 | checkinGuest | 入住客人姓名 | 文本 |
| 前台操作员 | operator | 办理人员 | 文本 |
| 异常类型 | abnormalType | 异常订单原因 | Tag |
| 房型名称 | roomTypeName | 房型基础信息 | 可点击文本 |
| 房价(元) | roomPrice | 当前房价 | 右对齐 |
| 房间库存 | inventory | 可售库存 | 数字 |
| 配套设施 | facilities | 房型设施 | Tag 列表 |
| 售卖状态 | saleStatus | 房型是否可售 | Tag / Switch |
| 所属门店 | storeName | 房型所属门店 | 文本 |
| 渠道名称 | channelName | OTA 渠道名称 | 文本 |
| 扣点比例 | commissionRate | 渠道佣金扣点 | 百分比 |
| 累计销售额(元) | totalSales | 渠道累计销售额 | 右对齐 |
| 待结算佣金(元) | unsettledCommission | 渠道待结算佣金 | 右对齐 |
| 合作状态 | cooperationStatus | 渠道合作状态 | Tag |
| 操作 | actions | 行内操作 | 固定右侧 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 身份证信息 | Input / Scanner | 是 | 扫码结果或人工录入不能为空 |
| 手机号 | Input | 否 | 11 位手机号格式 |
| 订单号 | Input | 否 | 不少于 8 位 |
| 门店名称 | Input | 是 | 不能为空 |
| 门店楼层 | Select / InputNumber | 是 | 必选或输入 1-60 |
| 房型名称 | Input | 是 | 不能为空 |
| 房价 | InputNumber | 是 | 大于 0，最多两位小数 |
| 房间库存 | InputNumber | 是 | 0-999 整数 |
| 配套设施 | Select mode=multiple | 否 | 从设施字典选择 |
| 售卖状态 | Switch | 是 | 上架 / 下架 |
| 渠道名称 | Input | 是 | 不能为空 |
| 扣点比例 | InputNumber | 是 | 0-40 |

## 8. Actions

### Page Actions

- 查 询
- 重 置
- 导出房客经营分析 Excel 报表
- 批量导出订单
- 批量发送入住通知
- 批量处理过期订单
- 导出每日入住流水报表
- 新增门店
- 新增房型
- 新增 OTA 渠道

### Row Actions

- 查看订单详情
- 办理续住
- 发起退款
- 修改入住日期
- 推送入住提醒短信
- 办理入住
- 查看异常
- 修改房价
- 上下架房型
- 开关门店营业状态
- 查看单房型经营数据
- 修改渠道扣点
- 房型渠道上下架
- 发起渠道对账结算

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 待入住 | warning Tag | 查看详情、修改入住日期、短信提醒、退款 |
| 已入住 | processing Tag | 查看详情、办理续住、退款 |
| 已离店 | success Tag | 查看详情、导出 |
| 已退款 | default Tag | 查看详情 |
| 已过期 | error Tag | 查看详情、批量处理 |
| 重复入住 | error Tag | 查看异常 |
| 已退款订单 | default Tag | 查看异常 |
| 过期预约 | error Tag | 查看异常 |
| 营业中 | success Tag | 修改、暂停营业、新增房型 |
| 装修暂停 | warning Tag | 修改、恢复营业 |
| 上架 | success Tag | 修改房价、下架、查看数据 |
| 下架 | default Tag | 修改房价、上架 |
| 合作中 | success Tag | 修改扣点、上下架、结算 |
| 暂停合作 | default Tag | 修改扣点、恢复合作 |

## 10. Interaction Rules

数据分析页使用轻量筛选条，左侧展示门店 / 渠道 / 房型条件，右侧展示无标题时间范围，筛选变化自动刷新。订单、门店房型、OTA 渠道列表使用 Ant Design Form + Table + Pagination；查询条件超过 6 个时支持展开 / 收起。Tabs 和左侧导航可切换，并激活对应页面。批量操作必须先选择记录。退款、批量处理过期订单、门店停业、渠道对账结算、扣点修改等风险操作必须使用 Modal 或 Popconfirm 二次确认。订单详情、单房型经营数据、异常订单详情使用 Drawer。

## 11. Empty / Loading / Error

### Loading

筛选、查询、导出、办理入住、保存和结算操作进入短暂 loading 状态，完成后使用 message 提示。

### Empty

列表无数据时展示 Empty；图表无数据时在图表模块中展示“当前筛选条件下暂无数据”；待办为空时展示“暂无待办事项”。

### Error

图表加载失败时展示图表异常提示；订单状态变更失败、身份证扫码失败、导出失败、结算失败时使用 message.error 或 notification 说明失败原因。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、内容背景 `#F4F4F4`、顶部信息栏 `#3A3A3A`。
- 保留顶部信息栏、一级导航、左侧导航、Tabs、内容区和 footer，不新增营销 hero 或装饰型布局。
- 查询区、表格区、统计区、图表区、Modal、Drawer 按 Boss Ledger 中高密度后台规则组织。
- 图表按 Ant Design Charts 组件形态设计；预览使用纯 HTML / CSS / SVG 等价表达，正式工程应接入 `@ant-design/charts` 或项目内图表封装。

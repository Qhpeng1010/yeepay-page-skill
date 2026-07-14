# Page Design: Boss Ledger 商户经营与核销管理页面

## 1. Selected Page Template

- Template: Dashboard 首页 + 经营分析页 + 带查询统计的查询列表页 + 工作台页 + 配置管理列表页
- Reason: 需求包含经营总览和客流分析，适合 Dashboard / 数据看板；订单、门店、渠道属于查询列表和配置管理；券码核销需要工作台形态并包含流水列表。

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`

## 3. Page Structure

1. Boss Ledger 固定框架层：顶部信息栏、一级导航、左侧导航、Tabs 页面标题区
2. 内容区：随当前页面渲染查询区、统计区、图表区、表格区或工作台区
3. 页面 footer：位于内容滚动区末尾

## 4. Module Design

### 经营首页数据大盘

- Purpose: 汇总商户当日经营结果和待办数据。
- Content: 时间 / 业务品类 / 门店筛选；今日营收总额、今日核销订单数、活跃门店数、待结算款项；营收客流趋势、客源渠道占比；品类营收排行、门店营收排行；待结算单据、待审核商品、待处理售后工单。
- Actions: 条件变更后刷新视图；分析筛选条不展示 `查 询`、`重 置` 按钮。
- States: 指标涨跌、图表加载失败、数据为空。
- Notes: 首页使用独立白色卡片，不使用查询列表统计块。

### 客流经营分析

- Purpose: 分析门店、渠道和时间维度的到店客流。
- Content: 门店 / 渠道 / 时间筛选；总到店人次、新客占比、复购客单价、客流峰值；24 小时客流分布；游客地域来源；新老客消费对比；高复购套餐排行。
- Actions: 条件变更后刷新视图、下载Excel；分析筛选条不展示 `查 询`、`重 置` 按钮。
- States: 图表加载、报表导出成功、无数据。

### 全部订单列表

- Purpose: 查询订单并执行退款、改期、补发短信、批量处理。
- Content: 订单状态 / 渠道 / 门店 / 时间 / 订单号 / 手机号筛选；订单总数、总实收、总退款、过期订单数；订单列表。
- Actions: 查 询、重 置、下载Excel、批量补发券码、批量退款。
- States: 待核销、已核销、已退款、已过期。
- Notes: 退款和批量退款必须二次确认。

### 券码核销工作台

- Purpose: 门店现场进行扫码或手动券码核销，并追踪异常拦截。
- Content: 核销门店选择；扫码核销、手动输入券码；今日核销总数、核销金额、待核销券数量；实时核销流水；异常核销记录。
- Actions: 核 销、重 置、下载Excel。
- States: 核销成功、过期、重复、无效券。

### 门店信息管理

- Purpose: 维护门店资料、营业状态和核销子账号。
- Content: 营业状态 / 区域筛选；总门店数、营业中、暂停营业门店数；门店列表。
- Actions: 查 询、重 置、新 增、下载Excel、编辑、启停、配置子账号、查看数据。
- States: 营业中、暂停营业。

### 分销渠道管理

- Purpose: 管理分销渠道合作状态、分佣比例、商品上下架和对账结算。
- Content: 合作状态筛选；渠道总数、总营收、待结算佣金、平均分佣；渠道营收占比；渠道列表。
- Actions: 查 询、重 置、新 增、修改分佣、商品上下架、对账结算。
- States: 合作中、暂停合作、待结算。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 时间范围 | DatePicker.RangePicker | 经营、客流、订单统计周期 | 最近 7 天 |
| 业务品类 | Select | 经营首页品类筛选 | 全部品类 |
| 门店 | Select | 门店维度筛选 | 全部门店 |
| 渠道 | Select | 渠道维度筛选 | 全部渠道 |
| 订单状态 | Select | 订单列表状态筛选 | 全部状态 |
| 订单号 | Input | 精确查询订单 | 空 |
| 手机号 | Input | 按下单手机号查询 | 空 |
| 营业状态 | Select | 门店经营状态 | 全部状态 |
| 区域 | Select | 门店区域 | 全部区域 |
| 合作状态 | Select | 渠道合作状态 | 全部状态 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 订单号 | orderNo | 订单唯一编号 | 文本 |
| 用户手机号 | phone | 下单用户手机号 | 脱敏展示 |
| 门店 | store | 下单或核销门店 | 文本 |
| 渠道 | channel | 来源渠道 | 文本 |
| 实收金额(元) | paidAmount | 订单实收金额 | 右对齐 |
| 订单状态 | status | 订单状态 | 状态点 + 文本 |
| 有效期 | validUntil | 券码有效期 | 日期 |
| 核销时间 | verifyTime | 核销流水时间 | 日期时间 |
| 异常类型 | abnormalType | 异常核销原因 | 状态点 + 文本 |
| 门店名称 | storeName | 门店基础信息 | 文本 |
| 营业状态 | businessStatus | 门店状态 | 状态点 + 文本 |
| 绑定账号 | account | 门店核销账号 | 文本 |
| 渠道名称 | channelName | 分销渠道 | 文本 |
| 分佣比例 | commissionRate | 渠道分佣 | 百分比 |
| 销售额(元) | salesAmount | 渠道销售额 | 右对齐 |
| 待结算金额(元) | unsettledAmount | 渠道待结算 | 右对齐 |
| 合作状态 | cooperationStatus | 渠道状态 | 状态点 + 文本 |
| 操作 | actions | 行内操作 | 固定右侧 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 券码 | Input | 是 | 不能为空，长度不少于 8 位 |
| 核销门店 | Select | 是 | 必选营业中门店 |
| 门店名称 | Input | 是 | 不能为空 |
| 门店区域 | Select | 是 | 必选 |
| 营业状态 | Select | 是 | 必选 |
| 绑定账号 | Input | 否 | 账号格式校验 |
| 渠道名称 | Input | 是 | 不能为空 |
| 分佣比例 | InputNumber | 是 | 0-30 |

## 8. Actions

### Page Actions

- 查 询
- 重 置
- 下载Excel
- 新 增
- 批量补发券码
- 批量退款
- 核 销

### Row Actions

- 查看详情
- 退款
- 改期
- 补发核销短信
- 编辑
- 启停
- 配置子账号
- 查看数据
- 修改分佣
- 商品上下架
- 对账结算

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 待核销 | 警告状态点 | 查看详情、退款、改期、补发核销短信 |
| 已核销 | 成功状态点 | 查看详情、退款 |
| 已退款 | 默认状态点 | 查看详情 |
| 已过期 | 错误状态点 | 查看详情、退款 |
| 核销成功 | 成功状态点 | 查看流水 |
| 过期 / 重复 / 无效券 | 错误状态点 | 查看异常、导出 |
| 营业中 | 成功状态点 | 编辑、暂停营业、配置子账号、查看数据 |
| 暂停营业 | 默认状态点 | 编辑、恢复营业 |
| 合作中 | 成功状态点 | 修改分佣、商品上下架、对账结算 |
| 暂停合作 | 默认状态点 | 修改分佣、恢复合作 |

## 10. Interaction Rules

查询列表页使用 Ant Design Form，字段超过 6 个时支持展开 / 收起。数据分析页使用轻量筛选条，左侧展示条件、右侧展示无标题时间范围，且不展示 `查 询`、`重 置` 按钮。所有列表使用 Ant Design Table、Pagination 和列设置。Tabs 和左侧导航可切换。批量操作必须先选择记录，高风险操作使用 Modal 二次确认。详情、子账号配置和快捷数据查看使用 Drawer。新增 / 编辑使用 Modal。

## 11. Empty / Loading / Error

### Loading

查询按钮、表格和图表进入短暂 loading 状态，并在完成后提示“查询完成”。

### Empty

表格无数据时展示 Ant Design Empty，图表无数据时展示空状态说明。

### Error

图表运行时异常时展示兜底提示，不阻断其他模块；操作失败时使用 message.error。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、内容背景 `#F4F4F4`、顶部信息栏 `#3A3A3A`。
- 保留 Boss Ledger 固定框架层，不新增营销 hero 或装饰背景。
- 查询区、表格区、Tabs、左侧导航、按钮、Modal、Drawer 遵守 Boss Ledger 主题规范。
- 图表按 Ant Design Charts 组件形态设计；预览使用本地 G2Plot 等价封装实际渲染，正式工程应接入 `@ant-design/charts` 或平台封装。

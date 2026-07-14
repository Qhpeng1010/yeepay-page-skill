# Page Design: Boss Ledger 商户经营资料审核套件

## 1. Selected Page Template

- Template: 数据看板页 + 带查询统计的查询列表页 + 工作台页面 + Drawer 详情 / Modal 表单
- Reason: 用户需求包含经营大盘、订单查询统计、核销工作台和门店管理，单一页面模板无法覆盖完整业务链路，需要在同一 Boss Ledger 壳层下组织为多页面模块。

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`

## 3. Page Structure

1. 顶部信息栏
2. 一级导航：经营总览、交易数据、门店与渠道管理
3. 左侧二级 / 三级导航：随一级导航切换
4. Tabs 页面标题区：展示当前已打开页面
5. 内容区：按页面展示筛选、统计、图表、表格、工作台
6. 平台 footer

## 4. Module Design

### 经营首页数据大盘

- Purpose: 汇总商户经营数据，帮助运营快速判断今日经营表现和待办风险。
- Content: 轻量筛选条、4 个核心指标、营收客流趋势、客源渠道占比、品类营收排行、门店营收排行、待办统计。
- Actions: 调整时间、业务品类、门店筛选；查看待办；图表刷新。
- States: 正常数据、图表加载中、无经营数据、筛选失败。
- Notes: 多指标统计以同级白色模块展示，不使用查询列表灰色统计卡片。

### 全部订单列表

- Purpose: 承载订单查询、订单统计、单笔处理和批量处理。
- Content: 查询条件区、订单区间统计、订单表格、列设置、分页、订单详情抽屉。
- Actions: 查 询、重 置、下载Excel、批量补发券码、批量退款、查看详情、退款、改期、补发核销短信。
- States: 待支付、待核销、已核销、已退款、已过期、退款中。
- Notes: 查询条件 6 个字段，默认不展示展开；统计指标 4 个，放在表格模块内部并使用 Statistic 卡片。

### 券码核销工作台

- Purpose: 提供高频核销入口，并对异常核销做实时留痕。
- Content: 核销门店选择、扫码核销、手动券码输入、今日核销统计、实时核销流水、异常拦截台账。
- Actions: 核 销、清 空、下载Excel、查看异常详情。
- States: 核销成功、过期拦截、重复拦截、无效券拦截、网络校验失败。
- Notes: 操作入口在上，流水和异常台账在下，遵守上下布局。

### 门店信息管理

- Purpose: 维护门店资料、营业状态和核销权限。
- Content: 查询条件、门店统计、门店列表、新增 / 编辑门店 Modal、核销子账号 Drawer、单门店数据 Drawer。
- Actions: 查 询、重 置、新 增、下载Excel、编辑、暂停营业、恢复营业、配置子账号、查看数据。
- States: 营业中、暂停营业、待资料补充。
- Notes: 启停营业状态属于敏感操作，使用 Popconfirm / Modal.confirm 二次确认。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 经营日期 | DatePicker.RangePicker | 经营首页筛选时间范围 | 今日 |
| 业务品类 | Select | 筛选餐饮、票券、文旅、零售等品类 | 全部品类 |
| 门店 | Select | 筛选具体门店 | 全部门店 |
| 订单状态 | Select | 全部订单列表状态筛选 | 全部 |
| 渠道 | Select | 抖音、美团、小程序、线下收银等渠道 | 全部 |
| 订单时间 | DatePicker.RangePicker | 订单创建时间范围 | 近 7 天 |
| 订单号 | Input | 精确查询订单 | 空 |
| 手机号 | Input | 按用户手机号查询 | 空 |
| 核销门店 | Select | 核销工作台选择门店 | 默认最近门店 |
| 券码 | Input | 手动输入券码 | 空 |
| 营业状态 | Select | 门店状态筛选 | 全部 |
| 区域 | Select | 门店所在区域筛选 | 全部区域 |

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 订单号 | orderNo | 订单唯一编号 | 等宽数字，支持复制预留 |
| 渠道 | channel | 订单来源渠道 | 普通文本 |
| 门店 | storeName | 订单所属门店 | 普通文本 |
| 手机号 | phone | 用户手机号 | 脱敏展示 |
| 实收金额(元) | paidAmount | 订单实收 | 右对齐 |
| 退款金额(元) | refundAmount | 已退金额 | 右对齐 |
| 订单状态 | status | 当前订单状态 | 状态点 + 文本 |
| 有效期 | validUntil | 券码有效期 | 日期文本 |
| 核销时间 | verifyTime | 券码核销时间 | 日期时间 |
| 异常原因 | reason | 异常券码原因 | 状态文本 |
| 门店编号 | storeNo | 门店唯一编号 | 等宽数字 |
| 门店名称 | storeName | 门店名称 | 普通文本 |
| 区域 | region | 所属区域 | 普通文本 |
| 营业状态 | businessStatus | 门店营业状态 | 状态点 + 文本 |
| 绑定账号 | account | 主账号 / 子账号 | 普通文本 |
| 操作 | actions | 行内操作 | 1 个主操作 + 普通操作 / 更多 |

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 门店名称 | Input | Yes | 2 到 40 个字符 |
| 所属区域 | Select | Yes | 必须选择区域 |
| 详细地址 | Input.TextArea | Yes | 不超过 120 个字符 |
| 联系人 | Input | Yes | 2 到 20 个字符 |
| 联系电话 | Input | Yes | 手机号格式 |
| 营业状态 | Select | Yes | 营业中 / 暂停营业 |
| 核销子账号 | Select mode="multiple" | No | 至少保留一个可用账号 |
| 审核备注 | Input.TextArea | No | 不超过 200 个字符 |

## 8. Actions

### Page Actions

- 查 询
- 重 置
- 下载Excel
- 批量补发券码
- 批量退款
- 核 销
- 新 增
- 配置子账号

### Row Actions

- 查看详情
- 退款
- 改期
- 补发短信
- 编辑
- 暂停营业
- 恢复营业
- 查看数据

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 待支付 | 默认状态点 + 文本 | 查看详情 |
| 待核销 | 警告状态点 + 文本 | 查看详情、补发短信、退款、改期 |
| 已核销 | 成功状态点 + 文本 | 查看详情、退款 |
| 已退款 | 错误状态点 + 文本 | 查看详情 |
| 已过期 | 默认状态点 + 文本 | 查看详情、退款 |
| 退款中 | 处理中状态点 + 文本 | 查看详情 |
| 核销成功 | 成功状态点 + 文本 | 查看流水 |
| 过期拦截 | 警告状态点 + 文本 | 查看异常详情 |
| 重复拦截 | 错误状态点 + 文本 | 查看异常详情 |
| 无效券拦截 | 错误状态点 + 文本 | 查看异常详情 |
| 营业中 | 成功状态点 + 文本 | 编辑、暂停营业、配置子账号、查看数据 |
| 暂停营业 | 错误状态点 + 文本 | 编辑、恢复营业、配置子账号 |
| 待资料补充 | 警告状态点 + 文本 | 编辑、查看数据 |

## 10. Interaction Rules

- 一级导航切换时左侧菜单同步切换，仅展示当前一级导航下属页面。
- 点击左侧菜单会打开或激活对应 Tab，不重复新增 Tab。
- Tabs 可切换、可关闭，最后一个 Tab 不可关闭。
- 左侧导航支持收起 / 展开，收起时只展示 Ant Design Icons。
- 查询列表页面使用三列查询条件；字段超过 6 个时才展示展开 / 收起。
- 表格列设置使用 `SettingOutlined` + `Dropdown` + `Checkbox`，操作列默认固定右侧。
- 订单详情、单门店数据、核销异常详情使用 Drawer。
- 新增 / 编辑门店使用 Modal。
- 批量退款、暂停营业、恢复营业、批量补发券码等操作使用二次确认。
- 所有提交操作使用 `message` 反馈，并保留当前查询条件与分页上下文。

## 11. Empty / Loading / Error

### Loading

查询、批量操作、核销提交时展示按钮 loading 或表格 loading。

### Empty

表格无数据时展示 Ant Design Empty，文案使用“暂无符合条件的数据”。

### Error

接口异常时展示 message.error，列表保留上一次成功数据；核销失败展示异常原因并写入异常台账。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、内容背景 `#F4F4F4` 和标准后台壳层。
- 使用 `ConfigProvider` 设置 Ant Design 主题、中文 locale 和 CSS 变量。
- 使用真实 Ant Design `Menu`、`Tabs`、`Form`、`Select`、`DatePicker`、`Table`、`Modal`、`Drawer`、`Dropdown`、`Statistic`。
- 不混用 YOP 开放平台风格，不使用营销化 hero、渐变装饰或手写基础控件。
- 内容模块之间外部间距统一为 `16px`。

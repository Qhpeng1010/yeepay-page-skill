# Implementation: Boss Ledger 酒店民宿运营后台

## 1. Tech Stack

- React
- TypeScript
- Ant Design
- Ant Design Icons
- CSS Modules / Less Modules
- Ant Design Charts 或项目内图表封装

## 2. File Structure

```text
src/pages/boss-ledger/hotel-homestay-ops/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
└── index.module.less
```

## 3. Route And Navigation

建议在 Boss Ledger 后台路由下新增页面组：

```text
/boss-ledger/hotel-homestay-ops/dashboard
/boss-ledger/hotel-homestay-ops/guest-analysis
/boss-ledger/hotel-homestay-ops/orders
/boss-ledger/hotel-homestay-ops/checkin-workbench
/boss-ledger/hotel-homestay-ops/store-room-types
/boss-ledger/hotel-homestay-ops/ota-channels
```

一级导航：

- 经营数据总览
- 客房订单管理
- 门店渠道与房型管理

左侧导航只展示当前一级导航下属页面，Tabs 标题随当前页面切换。

## 4. Type Design

核心类型建议包括：

```ts
type OrderStatus = 'pending_checkin' | 'checked_in' | 'checked_out' | 'refunded' | 'expired';
type StoreStatus = 'open' | 'renovation_paused';
type RoomSaleStatus = 'on_sale' | 'off_sale';
type ChannelStatus = 'cooperating' | 'paused';

interface MetricCard {
  title: string;
  value: number | string;
  unit?: string;
  trendValue?: string;
  trendDirection?: 'up' | 'down';
}

interface RoomOrder {
  id: string;
  orderNo: string;
  guestName: string;
  guestPhone: string;
  storeName: string;
  roomType: string;
  stayRange: [string, string];
  channel: string;
  paidAmount: number;
  status: OrderStatus;
}
```

## 5. Component Mapping

- 固定框架：复用 Boss Ledger 平台 Layout、Menu、Tabs 和 Footer。
- 分析筛选条：`Select`、`RangePicker`、`Button`。
- 查询列表页：`Form`、`Input`、`Select`、`RangePicker`、`Button`、`Table`、`Pagination`。
- 核心指标：`Statistic` 或项目内指标卡封装。
- 状态：`Tag`。
- 图表：`Line`、`Pie`、`Column`、`Bar` 或项目封装。
- 高风险确认：`Modal` / `Popconfirm`。
- 详情查看：`Drawer`。
- 操作反馈：`message` / `notification`。

## 6. Data And API Hooks

建议拆分服务接口：

- `getOperationDashboard(params)`：经营大盘首页。
- `getGuestAnalysis(params)`：房客经营分析。
- `getOrders(params)`：全部订单列表。
- `refundOrder(orderId)`：发起退款。
- `extendStay(orderId)`：办理续住。
- `sendCheckinReminder(orderIds)`：推送入住提醒短信。
- `checkinByIdentity(payload)`：身份证扫码办理入住。
- `getCheckinLedger(params)`：入住流水。
- `getStoreRoomTypes(params)`：门店房型列表。
- `updateRoomPrice(roomTypeId, price)`：修改房价。
- `toggleRoomSaleStatus(roomTypeId)`：上下架房型。
- `getOtaChannels(params)`：OTA 渠道列表。
- `settleOtaChannel(channelId)`：发起渠道对账结算。

## 7. State Handling

- 每个页面独立维护筛选参数、loading、error、pagination 和 selectedRowKeys。
- Tabs 和导航状态由路由或页面容器统一控制。
- 批量操作前校验 selectedRowKeys，未选择时 `message.warning('请先选择订单')`。
- 导出操作显示 loading，成功后提示“导出任务已创建”或触发下载。
- 高风险操作成功后刷新当前列表，保留筛选条件和分页上下文。

## 8. Preview Output

已生成独立评审预览：

```text
changes/20260709-boss-ledger-hotel-homestay-ops/preview.html
```

该文件是产品 / 设计评审预览产物，不属于正式生产前端代码。预览已按最新 Boss Ledger 硬约束重做，复用 `changes/add-merchant-audit-page/index.html` 已验证的 Boss Ledger 壳层、React + Ant Design 运行方式和组件样式，不再使用原生控件手写页面。

## 9. Known Implementation Notes

- 正式项目应替换预览中的临时 Boss Ledger Logo 为官方品牌资产。
- 预览页使用本地 React、Ant Design、Ant Design Icons、dayjs 和 G2Plot 运行文件；其中 G2Plot 仅作为单文件预览的图表运行降级封装。正式工程必须使用 Ant Design Charts 或平台内基于 Ant Design Charts 的封装。
- 当前预览已同步最新 Boss Ledger 标注规则：同级内容模块间距统一 `16px`，全局 Form label 到控件间距统一 `8px`，查询动作区固定右侧，Table 操作列每行保留一个主操作，带统计查询结果模块按“统计组件 → 列表标题 / 操作区 → Table → Pagination”展示，日期和分页等控件全局中文展示。
- 当前预览已同步统计规则：查询列表统计小于等于 3 个使用 14px inline 文本，超过 3 个使用灰色 Statistic 卡片；统计卡片位于 Table 上方时不额外叠加下方 `16px`；经营大盘、分析页、工作台和配置概览统计不使用灰色统计卡片，统一输出多个同级独立白色统计模块，和图表模块一样通过页面灰色背景 `16px` 间距分割，不再使用外层统计色块。
- 当前预览已同步表格操作和表单提示规则：Table 操作列文字按钮全部为常规体，主操作只使用主色不加粗；所有 Input / Select / DatePicker / RangePicker 均显式配置中文默认提示，输入类使用 `请输入`，选择类使用 `请选择`。
- 身份证扫码在预览中以输入框和按钮模拟，正式工程需接入读卡器或浏览器插件能力。
- Excel 导出在预览中只做操作反馈，正式工程需接入后端导出任务或前端下载能力。
- 渠道结算、退款、门店停业、扣点修改等操作正式接入时需补充权限校验和操作日志。

# Implementation: Boss Ledger 商户经营资料审核套件

## 1. Tech Stack

- React
- TypeScript
- Ant Design
- Ant Design Icons
- Ant Design Charts 或项目内基于 Ant Design Charts 的封装
- CSS Modules / Less Modules

## 2. File Structure

```text
src/pages/BossLedgerMerchantAuditSuite/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
└── index.module.less
```

本次按用户要求测试 skill 能力，只生成 change package 与 `preview.html`，不写入生产项目目录。

## 3. Type Design

```ts
export type PrimaryNavKey = 'overview' | 'trade' | 'store';
export type PageKey = 'dashboard' | 'orders' | 'verification' | 'stores';
export type OrderStatus = 'pendingPay' | 'pendingVerify' | 'verified' | 'refunded' | 'expired' | 'refunding';
export type VerifyStatus = 'success' | 'expiredBlocked' | 'duplicateBlocked' | 'invalidBlocked';
export type StoreStatus = 'open' | 'paused' | 'incomplete';

export interface OrderRecord {
  key: string;
  orderNo: string;
  channel: string;
  storeName: string;
  phone: string;
  paidAmount: number;
  refundAmount: number;
  status: OrderStatus;
  validUntil: string;
}

export interface StoreRecord {
  key: string;
  storeNo: string;
  storeName: string;
  region: string;
  businessStatus: StoreStatus;
  account: string;
}
```

## 4. Component Plan

- Shell：顶部信息栏、一级导航、左侧 Ant Design Menu、Ant Design Tabs、内容滚动区、footer。
- Dashboard：轻量筛选条、独立白色指标模块、Ant Design Charts 趋势 / 占比图、Ant Design Table 排行和待办统计。
- Orders：Ant Design Form 查询条件、Statistic 统计卡片、Table、Dropdown 列设置、Drawer 详情、Modal.confirm 批量操作。
- Verification：Form 工作台、Statistic 今日统计、Table 实时流水、Table 异常台账、Drawer 异常详情。
- Stores：Form 查询条件、Statistic 统计卡片、Table、Modal 新增 / 编辑、Drawer 子账号配置和单店数据。

## 5. Preview Implementation

`preview.html` 使用以下浏览器运行依赖：

- React / ReactDOM
- Ant Design
- Ant Design Icons
- dayjs + zh-cn
- Ant Design locale `zh_CN`
- 本地 `vendor/` 官方运行文件：React、ReactDOM、dayjs、Ant Design、Ant Design Icons、lodash、Ant Design Charts

该预览是评审文件，不是生产代码。正式落地时应替换为项目内依赖、路由、API、权限、日志和项目图表封装。

## 6. API Integration Notes

建议接口分组：

- `GET /boss-ledger/merchant/overview`：经营指标、趋势、渠道占比、排行和待办。
- `GET /boss-ledger/orders`：订单查询列表。
- `POST /boss-ledger/orders/export`：订单导出。
- `POST /boss-ledger/orders/batch-resend`：批量补发券码。
- `POST /boss-ledger/orders/batch-refund`：批量退款。
- `POST /boss-ledger/verification/redeem`：券码核销。
- `GET /boss-ledger/verification/records`：核销流水与异常台账。
- `GET /boss-ledger/stores`：门店列表。
- `POST /boss-ledger/stores`：新增门店。
- `PUT /boss-ledger/stores/{storeNo}`：编辑门店。
- `POST /boss-ledger/stores/{storeNo}/status`：启停营业状态。
- `PUT /boss-ledger/stores/{storeNo}/verify-accounts`：配置核销子账号。

## 7. Permission And Audit

- 批量退款、批量补发券码、门店停用、恢复营业需要二次确认。
- 敏感操作应写入操作日志，包含操作人、操作时间、对象编号、操作前后状态、失败原因。
- 无权限用户应隐藏高风险操作或禁用并展示原因。

## 8. Known Preview Limitations

- 图表使用本 change 目录下缓存的官方 lodash 与 Ant Design Charts 运行文件，已在无头 Chrome 截图中验证折线图与饼图可渲染。
- mock 数据不代表真实接口字段全集。
- 预览未接入真实权限、日志、短信、退款和核销服务。

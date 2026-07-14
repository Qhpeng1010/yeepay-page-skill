# Implementation: Boss Ledger 智能音箱电商运营后台

## 1. Tech Stack

- React
- Ant Design
- Ant Design Icons
- G2Plot as preview chart runtime
- Standalone HTML preview

## 2. File Structure

```text
changes/20260712-boss-ledger-smart-speaker-ecommerce-admin/
├── proposal.md
├── page-design.md
├── tasks.md
├── implementation.md
├── preview.html
├── review.md
└── vendor/
```

## 3. Preview Implementation Notes

- `preview.html` 复用 Boss Ledger 已验证 shell：顶部信息栏、一级导航、左侧 Ant Design Menu、Tabs 和内容区滚动。
- 三个一级导航分别映射经营大盘、订单运维、店铺商品管理。
- 经营大盘使用 Dashboard 模板：顶部分析筛选条、指标总分结构、趋势图、环图、排行和待办。
- 订单页使用查询列表卡片汇总模板：6 个筛选项、4 个 Statistic 汇总卡、Table、Pagination、列设置和详情 Drawer。
- 商品管理页使用查询列表结构：2 个筛选项、3 个轻量汇总指标、Table、Pagination、列设置和商品详情 Drawer。
- 高风险操作使用 `Modal.confirm`；普通操作使用 `message` 反馈。

## 4. Production Integration Suggestion

正式接入工程时建议拆分为：

```text
src/pages/SmartSpeakerEcommerceAdmin/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
└── index.module.less
```

并将经营指标、订单列表、店铺商品列表分别抽成业务组件，接口字段保持与本次 mock 数据一致或在 `types.ts` 中映射。

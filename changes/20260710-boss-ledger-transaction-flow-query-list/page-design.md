# Boss Ledger 交易流水查询列表页设计

## 模板选择

- Main template: `template-05-query-list-card-summary.md`
- Supporting template: `template-01-framework-shell.md`
- Template source files:
  - `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`
  - `specs/themes/boss-ledger-extractions/template-05-query-list-card-summary.md`
- Selection reason: 页面要求为“卡片汇总查询列表页”，且统计项为 4 个，符合卡片式查询统计模板。
- Includes query summary statistics: 是。

## 页面结构

1. Boss Ledger 顶部信息栏。
2. Boss Ledger 一级导航。
3. 左侧资金管理菜单。
4. 多标签页区，当前页为“交易流水查询”。
5. 查询条件模块。
6. 查询结果模块，内部顺序为：统计卡片、工具栏、表格、分页。
7. 详情抽屉。
8. 平台 footer。

## 查询条件

- 商户编号：输入框。
- 商户名称：输入框。
- 交易状态：选择器，包含全部、待支付、处理中、交易成功、部分退款、交易失败。
- 支付方式：选择器，包含全部、微信支付、支付宝、银行卡、云闪付。
- 交易时间：日期范围选择器。
- 订单号：输入框。

## 统计卡片

- 交易总金额(元)
- 交易总笔数(笔)
- 成功交易金额(元)
- 退款总金额(元)

统计卡片位于查询结果模块内部、表格工具栏上方，使用 4 个独立灰色卡片等分展示。

## 表格字段

- 订单号
- 商户编号
- 商户名称
- 支付方式
- 交易金额(元)
- 交易状态
- 交易时间
- 操作

## 行内操作

- 查看详情：主操作，打开详情抽屉。
- 发起退款：提交退款申请反馈；失败和待支付状态给出不可退款提示。
- 下载凭证：可下载状态给出生成凭证反馈，否则提示暂不可下载。

## 状态设计

- 交易成功：成功色。
- 处理中、退款中：处理中色。
- 待支付：警告色。
- 交易失败：错误色。

## 与 Boss Ledger 主题关系

- 使用固定 Boss Ledger 壳层：顶部信息栏、一级导航、左侧导航、Tabs、内容区、footer。
- 查询模块使用三列网格。
- 查询结果统计位于表格模块内部。
- 表格操作列固定在右侧，文字按钮使用 Boss Ledger 主色。
- 全局中文文案，不使用 Ant Design 英文默认文案。

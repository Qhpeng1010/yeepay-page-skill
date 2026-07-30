# 易来钱收银台模板与应用规则

## YLQ-TPL-001 页面家族

| 页面族 | 解决的问题 | 主状态 |
| --- | --- | --- |
| Checkout | 输入金额、选择渠道、密码确认并发起付款 | entry / password / processing / result |
| Result | 独立展示已知支付结果 | success / failure / processing |
| Exception | 扫码或浏览器不可用后的恢复 | unavailable / refresh |

Checkout 是完整状态流，不能把金额页、密码输入和处理中拆成多个无上下文的页面。

## YLQ-TPL-002 选择规则

- 输入金额和选支付方式时使用 Checkout entry；键盘固定显示。
- 付款确认使用底部 Password Popup，不离开 entry，不使用普通 Dialog。
- 密码达到 6 位后进入 Overlay 处理，Popup 必须先关闭。
- 结果页只保留一个“完成”操作；异常页只保留一个恢复操作。

## YLQ-TPL-003 页面组合

- 金额卡、支付方式卡和订单详情卡按任务分组，不能嵌套多层卡片。
- 支付结果详情仅保留对象、金额、订单号和必要状态；不带支付方式选择或键盘。
- 优惠、分期和备注只能是次级信息，不抢占金额和付款操作。

## YLQ-TPL-004 禁用组合

- 不允许提交时同时显示 Password Popup 与 Overlay。
- 不允许空金额或未选择渠道打开密码抽屉。
- 不允许在结果页展示两个同级主操作、浮动键盘或可编辑金额。
- 不允许用浏览器 `confirm`、自定义密码格或手写 Loading 替代 Vant 组件。

## YLQ-TPL-005 能力边界

单笔 Checkout 在 shadow 中验证金额付款、渠道选择、密码确认、处理中、成功与失败结果。失败只能从受控 Checkout 状态机进入；真实密码校验、多渠道品牌资产、优惠分期、独立结果入口、扫码异常和浏览器异常保持 shadow 或 legacy。

# 易来钱收银台页面交互与验收规则

## YLQ-INT-001 状态机

状态只能按 `entry.empty -> entry.valid -> password.open -> processing.locked -> result.success|failure|processing` 流转。关闭密码抽屉返回 entry 时保留金额与渠道；完成结果时清空金额和内存密码。

## YLQ-INT-002 金额与方式

进入页即显示金额逻辑光标。仅允许一个小数点、最多两位小数、大于 0 且不超过上限；无效金额使付款不可用。修改金额不能重置支付方式。渠道为单选且整行可点。

## YLQ-INT-003 密码与提交

付款前再次校验金额和渠道。密码为 6 位且只存在内存；达到 6 位后在 100ms 内锁定重复输入和交易操作，立即关闭 Popup 后显示 Vant Overlay + Loading。

## YLQ-INT-004 结果与恢复

处理中播报“正在确认支付”和“请稍候，不要重复付款”。成功、失败、处理中都包含状态图标、标题、说明和可核对详情。完成后重置模拟交易；返回优先关闭密码抽屉。

## YLQ-INT-005 权限与安全

支付期间屏蔽键盘删除、渠道切换、返回和重复付款。密码不写入 DOM 文案、日志和存储。金额以字符串维护，预览不做浮点资金计算。

## YLQ-INT-006 验收案例

| 规则 | 场景 | 通过条件 |
| --- | --- | --- |
| YLQ-INT-002 | 空金额、输入 `12.34`、清除 | 按钮状态、清除入口和渠道保持符合规则 |
| YLQ-INT-003 | 点击付款、输入 6 位密码 | Popup 关闭后只显示 Overlay，不能重复提交 |
| YLQ-INT-004 | 成功结果、完成 | 展示金额/订单号，完成回到金额空态 |
| YLQ-VIS-005 | 375px 与 430px | 无横滚，键盘未遮挡活动状态 |
| YLQ-VIS-004 | DOM 检查 | NavBar/Field/Radio/Popup/PasswordInput/NumberKeyboard/Overlay/Loading/Cell/Button 都来自 Vant |

## YLQ-INT-007 冲突裁决

资金安全和状态完整性优先于视觉和组件默认行为。任何绕过状态机的路径一律拒绝。

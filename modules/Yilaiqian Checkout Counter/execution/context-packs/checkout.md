# 易来钱 Checkout Context

- Entry 使用 Vant NavBar、Field、RadioGroup/Radio 和 NumberKeyboard。
- 密码确认只使用 Vant Popup、PasswordInput 和 NumberKeyboard；六位后 Popup 先关闭，再使用 Vant Overlay/Loading。
- Result 使用 Vant Icon、CellGroup/Cell 和单个 round Button；失败结果只能由 Checkout 状态机进入，并说明原因与订单查询恢复路径。
- 背景资产必须来自本模块 `01背景.png`，构建产物复制为 `assets/payment-background.png`。

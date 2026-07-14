# 实现说明

## 文件

- `preview.html`：独立 HTML 预览壳层、主题样式、依赖引用。
- `preview-app.js`：React + Ant Design 页面实现、mock 数据和轻量交互。
- `assets/boss-ledger-logo.svg`：本地 Logo 资产。
- `vendor/`：React、ReactDOM、Ant Design、Ant Design Icons、dayjs 本地运行依赖。

## 技术实现

- 使用 React + Ant Design + Ant Design Icons。
- 使用 `ConfigProvider` 配置 Boss Ledger 主色 `#F36046`。
- 查询区使用 Ant Design `Form`、`Input`、`Select`、`RangePicker`。
- 统计区使用 Ant Design `Statistic`，4 个独立灰色卡片展示。
- 表格使用 Ant Design `Table`，分页使用 `Pagination`，列设置使用 `Dropdown` + `Checkbox.Group`。
- 详情使用 Ant Design `Drawer` + `Descriptions`。

## 交互

- 查询按钮展示 loading 并提示查询完成。
- 重置按钮清空查询条件。
- 列设置可控制非操作列显隐。
- 查看详情打开抽屉。
- 发起退款和下载凭证根据当前记录状态给出中文反馈。

## 预览限制

- 当前为静态 mock 数据预览，未接入真实交易流水接口。
- 发起退款仅做消息反馈，正式实现应接入退款申请表单、权限校验和二次确认。

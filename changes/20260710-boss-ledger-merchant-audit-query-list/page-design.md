# Page Design: 商户审核查询列表页

## 1. Selected Page Template

- Main Template: `template-03-query-list-regular.md`
- Supporting Template(s): `template-01-framework-shell.md`
- Template Source Files: `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`, `specs/themes/boss-ledger-extractions/template-03-query-list-regular.md`
- Reason: 商户审核查询是典型后台查询列表，不需要统计组件，因此使用常规查询列表模板。
- Includes Query Summary: No

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`
- Routing Reason: 需求包含商户审核、查询列表和审核后台语义。
- Mixed Theme Sources: No

## 3. Page Structure

1. 顶部信息栏
2. 一级导航
3. 左侧二级 / 三级导航
4. Tabs 页面标题区
5. 查询条件模块
6. 查询列表模块
7. 详情 Drawer
8. 审核处理 Modal
9. 平台 footer

## 4. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 商户编号 | Input | 查询商户编号 | N/A |
| 商户名称 | Input | 查询商户名称 | N/A |
| 审核状态 | Select | 待审核、审核通过、审核驳回、处理中 | 待审核 |
| 提交时间 | RangePicker | 查询提交时间范围 | 近 7 天 |
| 审核人 | Input | 查询处理人 | N/A |
| 资料类型 | Select | 主体、证照、结算、联系人资料 | N/A |

## 5. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 商户编号 | merchantNo | 商户编号 | 文本 |
| 商户名称 | merchantName | 商户名称 | 超长省略 |
| 资料类型 | materialType | 本次审核资料类型 | 文本 |
| 提交时间 | submitTime | 提交审核时间 | 文本 |
| 审核状态 | statusText | 当前状态 | 状态点 + 文本 |
| 审核人 | auditor | 当前或最近审核人 | 文本 |
| 更新时间 | updateTime | 最近一次状态更新时间 | 文本 |
| 操作 | actions | 行内操作 | 固定右侧 |

## 6. Actions

Page Actions:
- 展 开 / 收 起
- 重 置
- 查 询
- 下载Excel
- 列设置

Row Actions:
- 待审核：查看详情、审核、驳回。
- 非待审核：查看详情；审核、驳回置为不可用，避免重复处理。

## 7. Status Design

| Status | Display | Available Actions |
|---|---|---|
| pending | 待审核 | 查看详情、审核、驳回 |
| success | 审核通过 | 查看详情 |
| error | 审核驳回 | 查看详情 |
| processing | 处理中 | 查看详情 |

## 8. Interaction Rules

- Tabs 可切换和关闭。
- 左侧导航可收起，二级菜单可折叠。
- 查询字段共 6 个，按三列网格完整展示。
- 查询按钮触发 loading 和成功反馈。
- 重置按钮清空查询条件。
- 列设置支持字段显隐，操作列始终保留。
- 详情使用 Drawer，不新增页面 Tab。
- 审核和驳回使用同一个 Modal；点击驳回时默认进入驳回态，提交前使用 Modal.confirm 二次确认。

## 9. Empty / Loading / Error

Loading: 表格 `loading` 和查询按钮 loading。

Empty: Ant Design `Empty`，文案为“暂无符合条件的审核任务”。

Error: 预览内保留 message 错误反馈；正式接入时应将接口错误映射为可理解中文提示。

## 10. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、页面灰底 `#F4F4F4` 和固定 shell。
- 查询模块与表格模块为同级白色模块。
- 不混用 YOP 开放平台主题、导航或营销化布局。

# Page Design: 客户门店查询列表页

## 1. Selected Page Template

- Main Template: `template-03-query-list-regular.md`
- Supporting Template(s): `template-01-framework-shell.md`
- Template Source Files: `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`, `specs/themes/boss-ledger-extractions/template-03-query-list-regular.md`
- Reason: 客户门店查询是普通后台查询列表，不需要统计组件，因此使用常规查询列表模板。
- Includes Query Summary: No

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`
- Routing Reason: 需求包含客户门店、查询列表和后台运营语义。
- Mixed Theme Sources: No

## 3. Page Structure

1. 顶部信息栏
2. 一级导航
3. 左侧二级 / 三级导航
4. Tabs 页面标题区
5. 查询条件模块
6. 查询列表模块
7. 门店详情 Drawer
8. 平台 footer

## 4. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 客户编号 | Input | 查询客户编号 | N/A |
| 客户名称 | Input | 查询客户名称 | N/A |
| 门店编号 | Input | 查询门店编号 | N/A |
| 门店名称 | Input | 查询门店名称 | N/A |
| 门店状态 | Select | 营业中、待完善、已冻结、已停业 | 营业中 |
| 所属地区 | Select | 按省市筛选门店 | N/A |
| 经营类型 | Select | 餐饮、零售、酒店、服务、供应链 | N/A |
| 创建时间 | RangePicker | 查询门店创建时间 | 近 30 天 |

## 5. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| 门店编号 | storeNo | 门店唯一编号 | 文本 |
| 门店名称 | storeName | 门店名称 | 超长省略 |
| 客户编号 | customerNo | 所属客户编号 | 文本 |
| 客户名称 | customerName | 所属客户名称 | 超长省略 |
| 经营类型 | businessType | 门店经营类型 | 文本 |
| 所属地区 | region | 门店所在地区 | 文本 |
| 门店状态 | statusText | 当前门店状态 | 状态点 + 文本 |
| 负责人 | manager | 门店负责人 | 文本 |
| 创建时间 | createdTime | 门店创建时间 | 文本 |
| 操作 | actions | 行内操作 | 固定右侧 |

## 6. Actions

Page Actions:
- 展 开 / 收 起
- 重 置
- 查 询
- 下载Excel
- 列设置

Row Actions:
- 查看详情：主操作。
- 编辑：普通操作，预览中以 message 反馈模拟进入编辑流程。

## 7. Status Design

| Status | Display | Available Actions |
|---|---|---|
| active | 营业中 | 查看详情、编辑 |
| pending | 待完善 | 查看详情、编辑 |
| frozen | 已冻结 | 查看详情、编辑 |
| inactive | 已停业 | 查看详情、编辑 |

## 8. Interaction Rules

- Tabs 可切换。
- 左侧导航可收起，二级菜单可折叠。
- 查询字段超过 6 个，默认展示前 5 个字段并提供展开 / 收起。
- 查询按钮触发 loading 和成功反馈。
- 重置按钮清空查询条件。
- 列设置支持字段显隐，操作列始终保留。
- 详情使用 Drawer，不新增页面 Tab。

## 9. Empty / Loading / Error

Loading: 表格 `loading` 和查询按钮 loading。

Empty: Ant Design `Empty`，文案为“暂无符合条件的客户门店”。

Error: 预览内保留 message 反馈；正式接入时应将接口错误映射为中文提示。

## 10. Theme Application

- 使用 Boss Ledger 主色 `#F36046`、页面灰底 `#F4F4F4` 和固定 shell。
- 查询模块与表格模块为同级白色模块。
- 不混用 YOP 开放平台主题、导航或营销化布局。

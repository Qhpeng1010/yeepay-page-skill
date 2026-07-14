# Page Design: Boss Ledger 商户入驻配置步骤页

## 1. Selected Page Template

- Main Template: Wizard / 步骤页 / 分步流程
- Supporting Template(s): `template-01-framework-shell.md`
- Template Source Files:
  - `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`
  - `specs/themes/boss-ledger-extractions/template-10-wizard.md`
- Reason: 用户明确要求页面类型为 Wizard 步骤页，业务流程需要按“基础资料、结算配置、确认提交”分步完成。
- Includes Query Summary: No

## 2. Target Theme

- Theme: Boss Ledger
- Theme Source: `specs/themes/boss-ledger.md`
- Routing Reason: 需求明确指定 Boss Ledger，并属于运营后台商户入驻配置场景。
- Mixed Theme Sources: No

## 3. Page Structure

1. Boss Ledger 固定壳层：顶部信息栏、一级导航、左侧菜单、Tabs。
2. Wizard 内容区：Steps + 当前步骤内容。
3. 底部固定通栏操作栏：上一步、下一步、提 交。
4. 平台 footer。

## 4. Module Design

### 固定壳层

- Purpose: 保持 Boss Ledger 后台页面一致性。
- Content: 顶部信息栏、Logo、一级导航、Ant Design Menu 左侧导航、Ant Design Tabs。
- Actions: 左侧导航收起 / 展开，Tabs 切换。
- States: 当前商户管理导航选中；非当前 Tab 展示 Empty。
- Notes: 左侧菜单使用 Ant Design Menu，Tabs 当前项使用 ReloadOutlined 静态图标。

### Wizard 步骤区

- Purpose: 引导运营人员按顺序完成入驻配置。
- Content: 三步步骤条，每步包含标题和副描述。
- Actions: 点击底部按钮切换步骤。
- States: 当前步骤高亮，完成步骤按 Ant Design Steps 默认状态展示。
- Notes: 内容区域遵循 template-10-wizard 的 Steps + Form + 右侧说明区域结构；Steps 每个步骤项配置 `description`，说明该步骤的录入范围或提交目标。

### 表单录入区

- Purpose: 承载基础资料和结算配置字段。
- Content: 第一步 5 个字段，第二步 4 个字段。
- Actions: 填写、选择、清空。
- States: 必填校验、手机号格式校验。
- Notes: 使用 Ant Design Form、Input、Select，所有 placeholder 均为中文。

### 确认摘要

- Purpose: 提交前集中核对配置内容。
- Content: 基础资料和结算信息摘要。
- Actions: 返回上一步修改，提交。
- States: 待提交状态。
- Notes: 使用 Ant Design Descriptions 默认非边框样式。

## 5. Query Fields

N/A。本页面不是查询列表页，不包含查询条件区。

## 6. Table Fields

N/A。本页面不是列表页，不包含数据表格。

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---:|---|
| 商户名称 | Input | Yes | 必填 |
| 商户简称 | Input | Yes | 必填 |
| 联系人 | Input | Yes | 必填 |
| 联系电话 | Input | Yes | 必填，11 位手机号 |
| 所属行业 | Select | Yes | 必填 |
| 结算账户 | Input | Yes | 必填 |
| 开户银行 | Select | Yes | 必填 |
| 结算周期 | Select | Yes | 必填 |
| 结算方式 | Select | Yes | 必填 |

## 8. Actions

### Page Actions

- 上一步
- 下一步
- 提 交

### Row Actions

N/A。本页面无表格行操作。

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 待填写 | Steps 当前步骤 | 填写、下一步 |
| 待确认 | Descriptions 摘要 + 状态点 | 上一步、提 交 |
| 已提交 | message 成功反馈 | 关闭确认弹窗 |

## 10. Interaction Rules

- 点击下一步前校验当前步骤字段。
- 点击上一步保留已填写内容。
- 第三步展示最新表单值摘要。
- 提 交默认可点击；点击后校验当前及已缓存表单数据，通过后进入确认摘要并调用 Ant Design `Modal.confirm`。
- 非当前业务 Tab 可点击切换，并展示居中 Empty。

## 11. Empty / Loading / Error

### Loading

- 提交确认后，提 交按钮进入 loading 状态。

### Empty

- 非当前业务 Tab 展示 Ant Design Empty，文案为“暂无业务数据”。

### Error

- 当前步骤必填字段未通过时，Form.Item 展示中文校验提示，并通过 message 轻提示。

## 12. Theme Application

- 使用 Boss Ledger 主色 `#F36046`。
- 使用 `#F4F4F4` 内容背景和白色业务模块。
- 使用固定壳层、Ant Design Menu、Ant Design Tabs、Ant Design Steps、Ant Design Form 和 Descriptions。
- 不混用其他平台 theme，不新增营销化或装饰性页面结构。

# Theme Routing Spec

## Purpose

本文件定义页面生成前的 theme 路由规则。每次生成页面、预览或评审前，必须先选择且只选择一个 theme。

## Hard Rules

- 每次页面生成只能选择一个 theme。
- 选中 theme 后，本次页面的视觉、布局、组件细节、文案风格和校验规则均以该 theme 为准。
- 不允许在同一个页面中混用两个 theme 的主色、导航结构、页面密度、组件外观或专属规则。
- 如果公共规范与选中 theme 冲突，以选中 theme 为准；如果选中 theme 内部有更具体规则，以更具体规则为准。

## Boss Ledger Routing

以下场景必须选择 `specs/themes/boss-ledger.md`：

- Boss Ledger
- boss
- 运营后台
- 商户后台
- 审核后台
- 商户资料
- 结算记录
- 查询列表
- 审核列表
- 配置列表
- 配置管理
- 数据首页
- Dashboard
- 表单
- 详情
- 步骤页
- Wizard
- Result
- Empty State
- 风控审核
- 财务、对账、核销、订单、交易、退款等后台操作页面

Boss Ledger 页面只允许读取 `specs/themes/boss-ledger.md` 作为主题规范，不得读取或混用 `specs/themes/yeepay-开放平台-DESIGN.md`。

`specs/themes/boss-ledger.md` 是 Boss Ledger 的最高优先级主题规范；不得复制、重写或用旧 change 包替代。

## YOP Routing

以下场景选择 `specs/themes/yeepay-开放平台-DESIGN.md`：

- YOP
- 开放平台
- 开发者中心
- API 文档
- 产品文档中心
- 接口详情
- 错误码
- 接入流程
- SDK
- 示例代码

YOP 页面不得读取或混用 Boss Ledger 的后台页面规则。

## Default

如果用户没有说明平台，默认选择 Boss Ledger，并在 `proposal.md` 的“合理假设”中说明。

## Required Output

每次生成页面时，必须在 `proposal.md` 和 `page-design.md` 中记录：

- Selected theme
- Theme source
- Routing reason
- Explicit statement that no other theme source was mixed

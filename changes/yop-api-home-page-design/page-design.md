# Page Design: YOP API 首页页面设计方案

## 1. Selected Page Template

- Template: 文档中心页
- Reason: YOP API 首页面向开发者和技术人员，核心目标是 API 发现、文档阅读、接入引导和资源导航。页面不应设计成普通后台查询列表页，应优先采用文档中心页结构，并结合 API 能力导航首页模块。

补充关系：

- API 首页 -> API 详情页
- API 首页 -> 接入指南
- API 首页 -> SDK 文档
- API 首页 -> 错误码文档
- API 首页 -> 示例代码
- API 首页 -> 更新日志

## 2. Target Theme

- Theme: yeepay-开放平台-DESIGN
- Theme Source: `specs/themes/yeepay-开放平台-DESIGN.md`

## 3. Page Structure

1. 顶部导航
2. API 首页头部区
3. 全局搜索区
4. API 分类导航区
5. 推荐 / 高频 API 区
6. 接入流程区
7. 开发资源区
8. 最新更新 / 公告区
9. 右侧帮助与锚点区

## 4. Module Design

### 顶部导航

- Purpose: 提供 YOP 平台全局导航和用户入口。
- Content: YOP Logo、产品文档、API 文档、开发者中心、控制台、帮助中心、登录 / 用户信息。
- Actions: 进入控制台、登录、切换文档栏目。
- States: 当前栏目高亮；未登录展示登录入口；已登录展示用户菜单。
- Notes: 使用 YOP 蓝色平台风格，不混用 Boss Ledger 内部后台导航样式。

### API 首页头部区

- Purpose: 明确页面定位，让开发者知道这是 API 能力入口。
- Content: 页面标题、简短说明、主操作和次操作。
- Actions: 查看全部 API、开始接入、进入控制台。
- States: 未登录时“开始接入”引导登录；已登录时进入接入流程或控制台。
- Notes: 文案保持技术产品风格，避免营销化表达。

### 全局搜索区

- Purpose: 帮助开发者快速定位 API、错误码、SDK 和文档。
- Content: 搜索框、热门关键词、搜索建议。
- Actions: 搜索、选择搜索建议、清空关键词。
- States: 默认、输入中、搜索中、无结果、加载失败。
- Notes: 推荐使用 Ant Design `Input.Search` 或项目搜索组件。

### API 分类导航区

- Purpose: 按能力域组织 API，降低查找成本。
- Content: 支付、退款、分账、商户进件、账户、对账、通知回调、风控等分类。
- Actions: 点击分类进入分类下 API 列表或文档集合。
- States: 分类正常、分类为空、分类维护中。
- Notes: 每个分类展示名称、说明、API 数量和状态摘要。

### 推荐 / 高频 API 区

- Purpose: 暴露高频接入 API，缩短新用户路径。
- Content: API 名称、描述、状态、版本、环境、更新时间。
- Actions: 查看文档、调试接口、申请接入。
- States: 可用、Beta、即将下线、维护中。
- Notes: 不展示过多后台字段，重点突出接口能力和接入动作。

### 接入流程区

- Purpose: 引导开发者完成从了解 API 到接入上线的路径。
- Content: 创建应用、获取密钥、沙箱联调、生产验证、上线发布。
- Actions: 查看接入指南、创建应用、进入沙箱。
- States: 未登录、未认证、可接入、处理中。
- Notes: 推荐使用 Ant Design `Steps`。

### 开发资源区

- Purpose: 集中提供辅助开发资源。
- Content: SDK 下载、示例代码、错误码、签名说明、回调说明、FAQ。
- Actions: 查看文档、复制链接、下载 SDK。
- States: 正常、资源维护中、链接异常。
- Notes: 可使用资源卡片或链接列表，不做复杂卡片套卡片。

### 最新更新 / 公告区

- Purpose: 告知开发者 API 变更、版本更新和重要公告。
- Content: 更新标题、更新时间、影响范围、状态标签。
- Actions: 查看详情、查看更新日志。
- States: 普通更新、重要公告、维护通知。
- Notes: 即将下线或破坏性变更需要明显标识。

### 右侧帮助与锚点区

- Purpose: 为长页面提供快速定位和帮助入口。
- Content: 页面锚点、联系客服、反馈文档问题、常见问题。
- Actions: 跳转模块、提交反馈、打开帮助文档。
- States: 默认、当前锚点高亮。
- Notes: 视口较窄时可收起或移到底部。

## 5. Query Fields

| Field | Component | Description | Default |
|---|---|---|---|
| 关键词 | Input.Search | 搜索 API 名称、接口标识、错误码、SDK、文档标题 | 空 |
| API 分类 | Select / Tabs | 按能力域筛选 API | 全部 |
| API 状态 | Select | 筛选可用、Beta、即将下线、维护中 API | 全部 |
| 适用环境 | Segmented / Select | 筛选沙箱、生产或全部环境 | 全部 |

说明：API 首页搜索是文档搜索和资源发现，不使用 Boss Ledger 查询条件区样式。

## 6. Table Fields

| Column | Data Key | Description | Render Rule |
|---|---|---|---|
| API 名称 | apiName | API 展示名称 | 可点击，进入 API 详情 |
| API 标识 | apiCode | API 唯一标识 | 等宽字体或代码样式 |
| 分类 | category | 所属能力域 | Tag 或普通文本 |
| 描述 | description | API 能力说明 | 最多两行，超出省略 |
| 状态 | status | API 可用状态 | Tag / Badge |
| 版本 | version | 当前版本 | 文本 |
| 更新时间 | updatedAt | 最近更新时间 | 日期时间 |
| 操作 | actions | 查看文档、调试接口、申请接入 | Link Button，超过 3 个收纳 |

说明：API 首页可用轻量列表或表格展示推荐 API；如果是完整 API 分类页，再使用更完整的 Table。

## 7. Form Fields

| Field | Component | Required | Validation |
|---|---|---|---|
| 搜索关键词 | Input.Search | No | 长度不超过 50 个字符 |
| 文档反馈内容 | TextArea | Yes | 提交反馈时必填，长度不超过 500 个字符 |
| 反馈联系方式 | Input | No | 如填写，需符合邮箱或手机号格式 |

说明：API 首页本身不承载复杂表单。接入申请、创建应用、获取密钥应跳转到对应流程。

## 8. Actions

### Page Actions

- 搜索 API
- 查看全部 API
- 开始接入
- 进入控制台
- 查看接入指南
- 查看 SDK
- 查看错误码
- 查看示例代码

### Row Actions

- 查看文档
- 调试接口
- 申请接入
- 查看迁移说明

## 9. Status Design

| Status | Display | Available Actions |
|---|---|---|
| 可用 | Success Tag / Badge | 查看文档、调试接口、申请接入 |
| Beta | Processing Tag / Badge | 查看文档、申请试用 |
| 即将下线 | Warning Tag / Badge | 查看迁移说明、查看替代 API |
| 已下线 | Default / Error Tag | 查看历史说明 |
| 维护中 | Warning Tag | 查看公告、稍后重试 |

## 10. Interaction Rules

- 搜索框支持输入 API 名称、接口标识、错误码和文档标题。
- 搜索输入时可展示建议项，建议项包含 API、文档、错误码、SDK 等类型。
- 搜索结果为空时展示空状态，并提供查看全部 API 分类入口。
- API 分类点击后进入分类结果或滚动到对应分类区域。
- 推荐 API 的“查看文档”进入 API 详情页。
- “调试接口”仅对支持调试且用户具备权限的 API 展示。
- “申请接入”在未登录时引导登录，在未认证时引导认证或创建应用。
- 即将下线 API 必须提供迁移说明或替代 API 入口。
- 页面滚动时右侧锚点同步高亮当前模块。
- 用户离开首页进入详情页后，返回时应保留搜索关键词和分类位置。

## 11. Empty / Loading / Error

### Loading

- 首屏加载时展示骨架屏或模块级 loading。
- 搜索时展示搜索框 loading 和结果区 loading。
- 推荐 API、分类、公告可独立加载，避免整页阻塞。

### Empty

- 搜索无结果：展示“未找到相关 API 或文档”，并提供“查看全部 API”入口。
- 分类为空：展示“该分类暂无 API”，并推荐相关分类。
- 公告为空：隐藏公告模块或展示“暂无更新”。

### Error

- API 数据加载失败：展示错误说明和“重试”操作。
- 搜索服务异常：保留关键词，提示稍后重试。
- 文档资源链接不可用：展示错误反馈，并提供问题反馈入口。

## 12. Theme Application

说明本页面如何应用当前主题规范。

- 使用 YOP 主题的蓝色平台风格。
- 使用文档中心和开发者中心布局，不使用 Boss Ledger 内部后台密集布局。
- API 首页优先保证搜索效率、阅读效率和接入路径清晰。
- 顶部导航、文档目录、锚点、搜索、API 状态、SDK、错误码和示例代码入口均按 YOP 文档类页面组织。
- 不混用 Boss Ledger 主色、左侧后台菜单、Tabs 页面标题区或商户运营后台样式。
- 具体颜色、间距、导航、文档目录、搜索区、API 列表和状态表现以 `specs/design-system.md` 与 `specs/themes/yeepay-开放平台-DESIGN.md` 为准。

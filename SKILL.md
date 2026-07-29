---
name: yeepay-page-skill
description: 根据已路由的 Markdown 规范生成、设计、更新、实现或评审易宝业务平台页面。适用于 Boss Ledger 运营、商户、审核、财务、Easy Account、易来钱收银台、查询列表、Dashboard、表单、详情、步骤流、结果、空状态、YOP、开放平台、API 文档、SDK、错误码和接入指南等请求；生成可追溯的 Change 和可在浏览器评审的预览，并执行各系统自身的规则与验证门禁。
---

# Yeepay 页面技能

使用 [交付流程](./workflows/delivery.md)。本技能以 Markdown 为规则核心：`modules/**/*.md` 是规范来源；JSON 仅用于机器路由，不能替代 Markdown 规范。

## 指令模式

支持以下逻辑模式：

| 指令 | 模式 | 产出边界 |
| --- | --- | --- |
| `/yeepay:prd` 或 `/yeepay prd` | 产品 | 编写需求方案和需求记录；不修改生产源代码。 |
| `/yeepay:design` 或 `/yeepay design` | 设计 | 编写需求方案、页面设计，并在路由模式支持时生成可评审预览。 |
| `/yeepay:full` 或 `/yeepay full` | 完整流程 | 路由、编写 PRD/设计/任务/实现、生成预览、验证和评审。 |
| `/yeepay:review` 或 `/yeepay review` | 评审 | 评审和验证现有 Change；不引入新的产品范围。 |

`/yeepay:code`、`/yeepay:spec` 和 `/yeepay:archive` 仍是 v3 合约中的显式维护模式，不能绕过路由或 Markdown 加载约定。未指定指令时，选择能完成请求的最小模式；新建页面默认走完整流程。

## 渐进加载约定

不得一次扫描全部 `modules/`、`changes/` 或模板。严格按以下顺序处理：

1. 只读取 `references/registry.yaml`。
2. 仅运行一次 `node scripts/resolve-resources.mjs --request "<原始需求>" --stage all`。该结果是唯一的请求上下文，包含路由、意图、页面类型、模板、各阶段资源、适配器命令和假设。不得为同一请求重复调用 `route-business.mjs` 或 `resolve-resources.mjs`。
3. 若结果为 `clarify`，在设计或生成前询问它给出的产品或页面类型问题。未指定系统时，路由器默认选择 Boss Ledger，且必须记录该假设。
4. 只读取被路由模块的 `modules/<module>/DOMAIN.md`。
5. 只读取统一上下文中当前阶段返回的 `resources`。所选模块的 `domain.json` 适配器拥有资源边界、模板装配和可选执行命令。每个返回的规则来源都必须是 Markdown；不得用 JSON 合约或历史 Change 替代。
6. 若路由适配器返回 `execution`，必须遵守其 `availability` 和 `mode`。运行策略可选择 legacy、shadow、默认 Page Spec 或仅 Page Spec；不得绕过 `pending` 或 `workflow-only` 能力。
7. 在当前 Change 中记录路由、意图、页面类型、实现模式、执行家族、策略版本、模式、假设、Rule ID 和资源路径。

模块索引文件只解释加载边界，不重复规范内容。`modules/*/domain.json` 仅是机器路由合约。

## Markdown 资源边界

每个已注册模块都在 `modules/<module>/domain.json` 中拥有 `adapter`。它声明阶段资源、可选框架/模板装配与可选预检、脚手架命令。通用路由器不得根据模块名硬编码选择其他业务域的规范、Shell、资产、运行时或校验器。

- **Boss Ledger 需求阶段：** `modules/shared/product.md` 和 `modules/boss-ledger/business-rules.md`。
- **Boss Ledger 设计阶段：** `modules/shared/design-system.md`、`modules/boss-ledger/design.md`、`modules/shared/page-templates.md` 和 `modules/shared/components.md`。Boss Ledger 专属组件与交互约定以完整 `modules/boss-ledger/design.md` 为准。
- **Boss Ledger 模板阶段：** `modules/shared/template-routing.md`、`template-01-framework-shell.md` 和选中的主模板。需求包含 Wizard/分步流程时，解析器还会返回 `template-10-wizard.md`，脚手架会复制固定 Wizard 代码骨架、CSS 合约和本地引导资产。
- **Boss Ledger 生成/评审阶段：** 只增加解析器返回的阶段资源，其中包括需要时的 `modules/shared/frontend.md` 和 `modules/shared/quality.md`。
- **Boss Ledger Page Spec：** `modules/boss-ledger/director-rules/` 是设计语义的唯一权威。解析器只返回所选执行 Context Pack；`generation-policy.json` 决定运行时可用性，Page Spec 校验器决定规格是否合法。
- **开放平台：** 只使用 `modules/open-platform/theme.md` 和它返回的 Markdown 来源。API Detail 使用自己的 Documentation Shell、渲染器和浏览器门禁走 `page-spec-shadow`；不得混用 Boss Ledger 或 Easy Account 的主题、Shell 或校验资源。其他页面家族必须遵循自己的策略模式。
- **Easy Account：** 只使用 Easy Account 适配器返回的 Markdown。普通查询列表走 `page-spec-shadow`：只有 `page-spec.json` 可编辑，Easy Account 的构建/验证命令负责生成和校验独立预览。不得加载 Boss Ledger 的 Shell、资产、vendor、规则读取器、脚手架或校验器。表单、详情、结果和 Dashboard 必须遵循自己的策略模式。
- **易来钱收银台：** 只使用本域适配器返回的 Markdown。单笔 Checkout 走 `page-spec-shadow`，使用本域本地 Vue 3 + Vant 4 运行时和背景资产；不得加载桌面 Shell，也不得用原生或自定义控件替代 Vant 支付组件。结果和异常页必须遵循自己的策略模式。

## Boss Ledger 硬性边界

每次生成 Boss Ledger 页面前：

1. 运行 `node scripts/check-yeepay-skill-integrity.mjs`。
2. 运行 `node scripts/check-boss-ledger-generation-policy.mjs` 和 `node scripts/verify-boss-ledger-release-manifest.mjs`。
3. 运行解析器针对所选模板返回的预检命令。
4. 按返回的执行模式处理：
   - `legacy`：使用标准 legacy 脚手架和既有代码生成边界。
   - `shadow`：同时构建 legacy 交付与独立 Page Spec 候选，并在提升前比较语义。
   - `page-spec-default`：编写 `page-spec.json`，运行返回的 Page Spec 脚手架/构建/验证命令；`legacyScaffold` 只能作为显式回退。
   - `page-spec-only`：必须使用 Page Spec，不提供 legacy 命令。

始终复用 `modules/boss-ledger/shell/`。固定 Shell 负责顶部信息栏、一级导航、侧边菜单、收起控制、多 Tabs、工作区、Footer、运行时库和 Logo。在 Page Spec 模式中，只有 `page-spec.json` 可编辑；`preview-app.js`、`business.css`、`page-spec-runtime.js`、Shell 文件和 `preview.html` 都是派生产物，必须与固定构建器输出完全一致。在 legacy 模式中，只能编辑 `preview-app.js` 和 `business.css`。不得把历史 `changes/` 目录当作规则或实现来源。

实现前必须读取完整的 Boss Ledger 主题与框架规则。`rules-read.md` 必须记录当前哈希；legacy 交付使用：

```text
node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html template-xx-{selected-template}.md
```

规则哈希和路由结果缓存于 `.cache/yeepay-skill/`，源文件元数据或 registry 变化时会失效。Page Spec 发布还会在 `release-manifest.json` 中绑定导演规则、策略、Schema、渲染器和 Shell 哈希。完整预览校验器会启动一次 Chrome 生成截图并检查 DOM；只有需要单一产物时才使用 `--screenshot-only` 或 `--dom-only`。

任一验证门禁失败都不得交付。查询列表必须有且只有两个直接同级的白色模块 `.boss-query-module` 和 `.boss-result-module`，间距固定为 `16px`。结果模块必须从 Table 延续到 Pagination 保持白底，每个模块只提供一次 `16px` 内边距。结果 Toolbar 必须提供可用的图标型 Ant Design `SettingOutlined` 列选择器，使用 `Dropdown`/`Popover` 和 `Checkbox`，且不得常驻选择辅助提示。

使用真实 React、Ant Design 和 Ant Design Icons 组件，运行时文案使用中文，图表使用 Ant Design Charts 和所选 Markdown 模板骨架。不得重建 Shell、混用主题或发明第二个主模板。必须保留 Loading、空数据、错误、权限、校验和交互状态。

## 交付产物

使用 `modules/shared/templates/` 下的需求方案、页面设计、任务、实现和评审模板。新预览位于 `changes/YYYYMMDD-short-feature-name/`。Page Spec Change 还包含 `page-spec.json`、`page-spec-build.json`、`page-spec-checklist.md`；处于 shadow 时还包含语义快照和 shadow 报告。除非用户明确拒绝 HTML，否则页面/设计输出必须包含预览。Boss Ledger 的 `review.md` 必须报告 `canonical-shell`、`validate`、`screenshot`、`charts`、`中文文案` 和 `overall`，并引用校验器输出，不能主观判定通过。

## 验证

实现期间使用快速门禁（不启动 Chrome）：

```text
node scripts/validate-fast.mjs changes/{change-id}/preview.html
```

Page Spec Change 使用：

```text
node scripts/check-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/build-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/verify-boss-ledger-page-spec.mjs --fast changes/{change-id}/page-spec.json
```

快速门禁会检查语法、固定 Shell、静态布局合约、Wizard 的分栏/间距/资产/状态检查，以及全页表单固定操作栏；不会启动 Chrome。只有最终交付门禁才应启动 Chrome：

```text
node scripts/check-yeepay-skill-integrity.mjs
node scripts/validate-progressive-structure.mjs
node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html template-xx-{selected-template}.md
```

Page Spec 的最终命令为：

```text
node scripts/verify-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json
```

最终交付前运行 `node --check changes/{change-id}/preview-app.js`。当生成的预览存在脚本语法错误、依赖手写 HTML 控件或只渲染固定 Shell 而没有业务内容时，不得交付。浏览器截图不可用时，页面必须保持“等待运行时评审”状态；不得用规避 React 和 Ant Design 的静态回退交付。

修复每个失败项并重新运行最终命令。不得把失败门禁描述为可接受。

## Easy Account Page Spec 门禁

Easy Account 的导演规则、策略、渲染器、预览和校验器均独立于 Boss Ledger。对于策略中标记为 `shadow` 且可用的页面家族，创建语义基线与 Page Spec 候选，再运行：

```text
node scripts/check-easy-account-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/build-easy-account-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/verify-easy-account-page-spec.mjs changes/{change-id}/page-spec.json
```

浏览器门禁检查已声明的 Golden Case 状态。策略、运行时和回归证据未评审前，不得将页面家族提升为 `page-spec-default`。

## 开放平台 Page Spec 门禁

开放平台拥有自己的营销和文档 Shell。对于策略中标记为 `shadow` 且可用的文档页面家族，只能使用开放平台的 Page Spec 命令：

```text
node scripts/check-open-platform-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/build-open-platform-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/verify-open-platform-page-spec.mjs changes/{change-id}/page-spec.json
```

API Detail 的浏览器门禁必须覆盖三列导航、窄屏目录行为、锚点流程、代码复制反馈，以及目录空数据/错误状态。

## 易来钱 Page Spec 门禁

易来钱拥有移动支付状态机和 Vant 运行时。对于可用的 Checkout 页面家族，只能使用本域 Page Spec 命令：

```text
node scripts/check-yilaiqian-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/build-yilaiqian-page-spec.mjs changes/{change-id}/page-spec.json
node scripts/verify-yilaiqian-page-spec.mjs changes/{change-id}/page-spec.json
```

浏览器门禁必须证明 entry/password/processing/result 的状态顺序、Vant 组件存在、Popup/Overlay 视觉互斥、金额清除行为，以及 375px/430px 布局。

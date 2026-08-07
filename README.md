# Yeepay Page Skill

这是一个用于生成、评审和验证易宝业务页面的规则工程。它的目标不是让 AI 随意拼页面，而是先路由到正确的业务系统，再按该系统的规则和当前已开放能力生成可复查交付。

当前包含三个业务域：

- 老板管账：运营、商户、审核、财务、风控和系统管理后台。
- 易账通：账户相关后台页面。
- 易宝开放平台：开发者中心、API、SDK 和接入文档。

## 先从哪里看

如果你是设计师或产品同学，建议按下面顺序阅读：

1. [老板管账导演规则](/Users/sunguochao/Documents/AI-Design/Yeepay-skill/modules/boss-ledger/director-rules/README.md:1)：设计师唯一需要维护的规则入口，包含视觉、模板应用、交互与验收三本规则的边界。
2. [交付流程](/Users/sunguochao/Documents/AI-Design/Yeepay-skill/workflows/delivery.md:1)：了解一个页面从需求到人工验收的执行过程。

## 目录说明

```text
Yeepay-skill/
├── SKILL.md                  跨系统路由、边界与交付入口
├── README.md                 本说明
├── references/               产品域路由表
├── modules/                  各业务域的规则、固定实现和执行能力
│   ├── boss-ledger/          老板管账后台
│   ├── easy-account/         易账通后台
│   ├── open-platform/        易宝开放平台
│   └── shared/               跨业务域路由、需求与预览文档模板
├── workflows/                路由后执行的页面交付步骤
├── scripts/                  路由、构建、校验和发布检查工具
├── changes/                  每次页面需求的独立交付目录
└── agents/                   默认执行代理配置
```

`SKILL.md` 只负责把请求送往正确的系统。它不定义页面样式、模板细则或具体执行命令；这些由路由后的规则、适配器和固定渲染器分别负责。

## 浏览器依赖

React、ReactDOM、Ant Design、Ant Design Icons、Day.js、Lodash 与 Ant Design Charts
由根目录 `package.json` 和 `package-lock.json` 锁定。压缩后的浏览器文件是生成物，
不在源码目录手工维护：

```bash
npm ci
npm run build:runtime
npm run check:runtime
```

生成结果位于 `modules/shared/browser-runtime/vendor/`，供老板管账和易账通共同使用。
普通 Change 通过软链接引用；页面构建命令加 `--portable` 后会复制独立交付所需文件。
普通页面只加载基础运行时，图表依赖仅在 Dashboard 页面按需写入预览。

首轮需求没有明确所属服务时，入口会先询问用户选择老板管账、易账通或易宝开放平台，不会根据“查询”“列表”“表单”等通用词猜测业务域。老板管账和易账通承载后台页面；易宝开放平台当前承载 API 文档与接入指南页面。

## 老板管账目录

老板管账是当前规则最完整、最适合优先使用的后台域。

```text
modules/boss-ledger/
├── director-rules/           设计师维护的唯一设计决策来源
│   ├── 01-visual-constitution.md
│   ├── 02-template-application-rules.md
│   └── 03-interaction-acceptance-rules.md
├── execution/                规则编译产物、策略、规格与固定渲染器
│   ├── generation-policy.json  当前允许生成的能力和规则模板状态
│   ├── page-spec.schema.json   页面规格的数据结构约束
│   ├── rule-template-registry.json  由导演规则生成的逻辑模板目录
│   ├── context-packs/          AI 生成规格时读取的精简上下文
│   ├── theme/                  由视觉宪法生成的渲染主题
│   ├── renderer/               固定页面渲染器
│   └── release-manifest.json   当前规则与渲染器的发布指纹
├── shell/                    固定后台壳层：导航、Tabs、Footer、运行时
├── business-rules.md         业务字段、状态、权限和结果规则
└── domain.json               页面意图、规则模板和执行方式的机器路由配置
```

### 应修改哪里

| 目标 | 唯一维护位置 | 不应修改的位置 |
| --- | --- | --- |
| 全局色彩、字体、密度、圆角、组件气质 | `director-rules/01-visual-constitution.md` | `execution/theme/` 生成物、单页预览 |
| 页面家族、模板选择、页面组合 | `director-rules/02-template-application-rules.md` | 生成后的规则目录 |
| 用户流程、状态、危险确认、验收 | `director-rules/03-interaction-acceptance-rules.md` | 生成后的 HTML、CSS、JavaScript |
| 单页字段、数据、文案、默认值 | 当前 Change 的 `page-spec.json` | 跨页面导演规则 |
| 固定导航、Tabs、Footer 等框架实现 | 先修改视觉宪法，再由研发同步 `shell/` | 单页 Page Spec |

### 导演规则与页面需求的区别

导演规则管理“同类页面长期都应该遵守什么”。例如：查询列表只能有一个查询模块和一个结果模块、复杂表单不能配右侧说明、危险操作必须二次确认。

单页需求管理“这一个页面要展示什么”。例如：商户查询要有商户名称、商户编号和部门条件；列表要展示哪些列；错误状态写什么文案。

因此：

- 通用视觉、模板和交互原则，修改 `director-rules/`。
- 单页字段、数据、文案和默认值，修改对应 Change 中的 `page-spec.json`。
- 新能力是否可生成，由 `execution/generation-policy.json` 控制；不能仅靠写一条 Markdown 规则开放能力。

## 页面是如何生成的

老板管账按当前能力策略运行：

对 `shadow`、`page-spec-default` 和 `page-spec-only` 能力，AI 只填写 `page-spec.json`，固定渲染器生成预览页面。未开放的页面族只报告能力边界，不存在替代的旧页面路径。

新路径的流程如下：

```text
业务需求
  -> 路由到业务域和逻辑规则模板
  -> 读取导演规则、生成的 Context Pack 与当前可用能力
  -> 填写 page-spec.json
  -> 固定渲染器生成页面
  -> 运行当前页面的快速检查
  -> 人工验收预览
  -> 通过后交付
```

页面是否能形成预览以实际规格与渲染器为准。`generation-policy.json` 的状态在默认自然生成中用于记录治理与验收风险，不再单独决定是否生成。

## 易账通当前边界

易账通已采用与老板管账一致的“三本导演规则 + Page Spec + 固定 Shell”工程链路，但保留自己的品牌、业务语义和 Shell。当前查询列表（含统计、批量、导出和父子表）、简单/分组/抽屉/上传复核表单、详情和流程结果处于 `shadow`，默认执行静态预检并交由人工验收。

查询列表工作台稳定配方已开放：可按业务需求组合查询、详情抽屉、新增抽屉、编辑抽屉和删除二次确认。编辑抽屉会将已有记录中的日期、日期区间和状态值转换为官方表单控件可识别的初始值，避免编辑已有数据时发生运行时错误。Dashboard 与多步骤快速配方暂缓。

易账通规则入口为 [`modules/easy-account/director-rules/`](modules/easy-account/director-rules/README.md)。旧设计、组件和前端说明已从当前运行目录清理；页面生成只读取导演规则、业务规则和执行层资源。

## 自由组合与稳定配方

老板管账以及已接入稳定配方的易账通页面同时支持两种生成方式：

- **自由组合**：需求未命中已验证配方时，根据三本导演规则和当前开放能力组合页面。它适合探索新业务场景，生成后由业务人员人工验收。
- **稳定配方**：对已经人工验收、结构稳定且可由有限参数表达的页面，提炼为可重复生成的配方。配方只负责确定性解析和参数编译，不新增或覆盖视觉、模板和交互规则。

配方只是快速生成能力，不是页面生成许可。显式快速模式由统一入口在一次调用中完成配方分类、编译、构建和静态预检；命中后直接返回产物，不再由智能体调用第二个生成命令。需求未命中配方时，只要所属系统和页面意图明确，就继续走受控自然语言生成；只有关键业务决策缺失才询问用户，只有缺少可执行规格、渲染器或必要基础设施才阻断。策略状态、未登记组合、能力白名单和发布指纹只作为治理告警。两条生成路径都必须通过原始需求覆盖校验，禁止静默遗漏字段、操作或流程。

统一入口默认输出完整 JSON，无需追加 `--json`；只有人工阅读摘要时才使用 `--text`。结果包含配方名称、命中或回退结果、回退原因和各阶段毫秒数。配方生成成功后，同一份可观测性数据写入 Change 的 `generation-report.json`，用于区分配方解析、准备、需求覆盖、规格检查、构建和静态预检耗时。

自由组合页面不能因为“生成过一次”就自动变成配方。是否晋级由设计师决定，完整步骤见[自由组合晋级配方流程](workflows/recipe-promotion.md)。

老板管账的回归资料集中在 [`modules/boss-ledger/execution/scenarios/`](modules/boss-ledger/execution/scenarios/README.md)：

- [配方回归提示词](modules/boss-ledger/execution/scenarios/recipe-regression-prompts.md)：验证已登记的稳定配方和参数边界。
- [规则组合提示词](modules/boss-ledger/execution/scenarios/rule-combination-prompts.md)：验证导演规则驱动的自由组合页面，不默认命中配方。
- [完整人工回归提示词](modules/boss-ledger/execution/scenarios/manual-regression-prompts.md)：覆盖表单、列表、详情和结果流程。

新组合应先作为自由组合完成页面和人工验收，再按流程记录固定结构、可变参数、边界和回归样例；只有回归和人工验收均通过后，才登记为稳定配方。

当前交付只运行静态预检，预览由业务或设计人员人工验收。浏览器自动交互和像素验收不属于默认流程，待规则与视觉效果稳定后再单独恢复。

## 如何提出一个新页面

用清楚的业务语言描述即可，无需指定代码或组件。推荐包含：

```text
所属系统：老板管账 / 商户管理
使用者：运营人员
主要任务：查询、核对和处理商户记录
查询条件：商户名称、商户编号、部门名称
列表字段：商户编号、商户名称、直属代理、状态、注册时间
允许操作：查看详情、停用
风险要求：停用前须说明对象、影响和操作后状态
```

系统会选择页面家族。如果你明确希望使用某种页面形式，例如 Drawer、全页表单或步骤流程，也应同时说明字段数量、是否有分组、上传、复核或前后依赖。

## 如何手工修改规则

最重要的原则是：

1. 一次性页面需求不要写进通用规则。
2. 新的硬性规则必须增加 Rule ID 和验收场景。
3. 规则变更后必须同步更新验证覆盖和发布指纹。
4. 不直接修补生成页面中的 `preview-app.js`、`business.css` 或 `preview.html` 来解决通用规则问题。

规则变更后的最小检查由 AI 或研发同学执行：

```bash
node scripts/build-boss-ledger-context-packs.mjs
node scripts/check-boss-ledger-generation-policy.mjs
node scripts/refresh-boss-ledger-release-manifest.mjs
node scripts/verify-boss-ledger-release-manifest.mjs
node scripts/validate-boss-ledger-page-spec-system.mjs
```

## Change 交付目录

每一个页面需求都有自己的 `changes/YYYYMMDD-功能名称/` 目录。常见内容包括：

```text
changes/YYYYMMDD-功能名称/
├── proposal.md               需求理解和范围
├── page-design.md            页面设计与规则模板选择
├── tasks.md                  实施任务
├── implementation.md         实现说明
├── page-spec.json            新机制下唯一可编辑的页面规格
├── page-spec-checklist.md    已选规则和能力的检查清单
├── preview.html              可直接打开的页面预览
└── review.md                 静态预检结果与人工验收记录
```

Page Spec Change 中的 `preview-app.js` 和 `business.css` 都由系统生成，不应手工修改。

## 常见问题

**为什么页面不能生成？**

默认自然生成不会因为 `pending`、`workflow-only`、未登记组合或提示词未命中配方而停止。真正的阻塞只应来自三类问题：所属服务或关键业务决策缺失、底层没有可执行规格/渲染器、结构或构建错误导致无法形成可验收预览；输出会明确区分询问、治理告警和真实阻塞。

**为什么我改了导演规则，页面没有变化？**

视觉 Token 和逻辑模板目录会自动编译；若规则需要新的组件能力、页面结构或自动化检查，还必须由研发同步扩展策略、规格校验、固定渲染器和回归样例。

**页面预览可以直接打开吗？**

可以。每个 Change 的 `preview.html` 是独立评审预览，通常可直接在浏览器打开；默认由人工验收，它不是正式生产前端工程。

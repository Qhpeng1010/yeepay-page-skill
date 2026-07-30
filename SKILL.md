---
name: yeepay-page-skill
description: 根据已路由的 Markdown 规则生成、设计、更新、实现或评审易宝业务平台页面。适用于 Boss Ledger、Easy Account、易来钱收银台、易宝开放平台的列表、表单、详情、流程、结果和文档页面请求；生成可追溯 Change、可评审预览，并遵守各系统自身的能力与验证门禁。
---

# Yeepay 页面技能

这是一个跨系统的调度入口，不是设计规范或页面实现手册。具体页面规则、固定 Shell、组件实现、执行命令和验证细节分别以被路由系统的 Markdown 规则、`domain.json` 适配器、固定渲染器和[交付流程](./workflows/delivery.md)为准。

## 选择模式

| 指令 | 用途 |
| --- | --- |
| `/yeepay:prd` | 只输出需求方案和需求记录。 |
| `/yeepay:design` | 输出页面设计；能力允许时生成预览。 |
| `/yeepay:full` | 完整交付：需求、设计、实现、预览和验证。 |
| `/yeepay:fast` | 单一、已开放的 Boss Ledger Page Spec 页面快速生成。 |
| `/yeepay:review` | 评审或验证已有 Change，不扩展产品范围。 |

`/yeepay:code`、`/yeepay:spec` 和 `/yeepay:archive` 是维护模式，仍须遵守以下路由与资源边界。未指定指令时，选择完成请求所需的最小模式。

## 路由与资源边界

1. 只读取 `references/registry.yaml`，然后只运行一次：

   ```text
   node scripts/resolve-resources.mjs --request "<原始需求>" --stage all
   ```

2. 使用该结果作为唯一请求上下文：若为 `clarify`，先询问问题；否则只读取选中系统的 `DOMAIN.md` 和当前阶段返回的 Markdown 资源。
3. 不得扫描全部模块、模板或历史 Change；不得对同一需求重复路由或重复解析。
4. `domain.json` 的 adapter 决定资源、执行命令、能力状态和运行模式。不得按系统名称手工混入其他系统的规则、Shell、资产、运行时或校验器。
5. 必须在 Change 中记录路由、意图、页面类型、执行模式、策略版本、Rule ID、假设和所用资源。

Markdown 是设计与业务规则的权威来源；JSON 只承担路由、策略、规格和执行合约，不能替代 Markdown 规则。

## 共同禁止项

- Figma 链接、节点和历史设计稿只可溯源，不得作为生成、修改、评审或验收输入。
- 不得把历史 Change 当作新的规则或实现来源。
- 不得绕过 `pending`、`workflow-only`、`shadow` 或其他策略门禁；不支持的需求必须报告能力缺口。
- Page Spec 模式只编辑规格文件；固定渲染器、Shell、主题和生成后的预览不得被单页手改。

## Boss Ledger 规则

- `modules/boss-ledger/director-rules/` 是唯一的设计语义权威：视觉、页面选择、交互与验收分别由三个导演规则文件管理。
- `modules/boss-ledger/design.md` 与 `modules/boss-ledger/templates/` 仅是历史归档，不得读取或引用为运行输入。
- `generation-policy.json` 决定当前允许的页面能力与组合；Page Spec 校验器决定规格是否合法。规则模板不等于已开放能力。
- 单一且已开放的页面可走 `/yeepay:fast`。先运行一次适配器返回的准备命令，随后只执行当前 Change 的规格检查、构建和快速校验。
- 默认交付预览供人工验收。只有用户明确要求时才运行浏览器自动交互回归；修改导演规则、策略、渲染器、Shell、公共校验脚本或能力样例时，才追加全系统回归。

## 执行与交付

按 [交付流程](./workflows/delivery.md) 的 Requirement、Design、Template、Generate、Review 阶段执行。每个阶段只读取 adapter 返回的资源，并只调用 adapter 返回的命令。

交付必须包含当前模式要求的 Change、需求说明、页面设计、可浏览预览和验证记录。人工验收时，`review.md` 必须区分自动预检与用户已确认场景；未获确认不得把整体视觉或浏览器交互标记为通过。

任何适用门禁失败，都不得交付；修复后重新运行该门禁。

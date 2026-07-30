# 老板管账导演规则

## 这套规则解决什么问题

本目录是老板管账唯一的、面向人阅读的设计决策层。它把“页面应该长什么样、应该选什么方案、怎样才算操作正确”分开管理：

1. `01-visual-constitution.md`：每个老板管账页面应具备的整体视觉气质。
2. `02-template-application-rules.md`：业务场景应选择哪个页面家族和页面组合。
3. `03-interaction-acceptance-rules.md`：用户如何完成任务，以及如何证明页面正确。

OpenDesign Admin PC Ant 的 `DESIGN.md`、原有老板管账设计规范、旧页面模板和已验证的 Change 都是本目录形成时的历史输入材料，不是与本目录竞争的规则来源，也不得作为运行时输入。

历史 Figma 链接和节点仅保存在 `../provenance/figma-index.md`，不属于运行时资源图。在页面生成、修改、评审和验收的任何阶段，都不得读取或访问 Figma；工程内已发布的 Markdown 规则和固定运行时才是唯一可用输入。

面向设计师的修改方式与日常使用方法见 [使用说明.md](./使用说明.md)。

## 权威边界

- 本目录的导演规则是设计语义的唯一权威。
- `01-visual-constitution.md` 的主题 Token 自动编译为 `../execution/theme/`；`02-template-application-rules.md` 的逻辑模板目录自动编译为 `../execution/rule-template-registry.json`；`../execution/context-packs/` 是由规则和策略自动生成的运行时阅读包。设计师不直接修改这些生成物，它们不得包含坐标、样式或页面代码。
- `../execution/generation-policy.json` 是“当前允许生成哪些能力及组合”的唯一权威；Page Spec 的 `metadata.executionMode` 与 `validatedCombinations` 必须与它匹配。
- `../execution/page-spec.schema.json` 与 Page Spec 校验器是“页面规格是否合法”的唯一权威。
- `../execution/rule-assertions.json` 是发布关键规则与自动断言之间的唯一映射；映射不完整时，系统拒绝发布。
- `../execution/release-manifest.json` 记录本次交付绑定的规则、策略、渲染器和 Shell 版本。
- 历史 `changes/` 目录只可作为证据和回归样例，不能成为新的规则来源。

## 规则编号

- `BL-VIS-*`：视觉宪法。
- `BL-TPL-*`：模板选择与页面组合。
- `BL-INT-*`：交互、状态与验收。

每一条硬性运行时能力或校验断言都必须至少引用一个 Rule ID。新增硬规则时，先分配 Rule ID，再修改策略或代码。

## 规则发布原则

规则调整是一项老板管账执行版本的变更：受影响的导演规则、策略或规格、关键规则断言、回归样例和 `release-manifest.json` 必须一起更新。哈希不一致时，系统会阻止构建交付。

## 冲突优先级

1. 法律、合规、安全和无障碍要求。
2. 明确的业务状态、权限和不可逆操作要求。
3. 老板管账导演规则。
4. 已选页面族的逻辑规则模板及其更具体的能力规则。
5. Ant Design 默认行为。
6. 历史 Change 或视觉参考。

Figma 链接不属于可用视觉参考，不能参与冲突判断或覆盖任何工程内规则。

低优先级来源不能悄悄覆盖高优先级来源。当前不支持的需求必须输出能力缺口，不能用手写页面绕过限制。

# Boss Ledger 历史模板归档

`templates/` 中的 `template-01` 至 `template-13` 是旧的设计稿抽取记录，保留仅用于追溯历史；它们已经退出资源解析、生成、评审、验收和发布清单，任何运行路径都不得读取它们。

活跃的页面选择机制如下：

- 面向人维护的设计决策：`director-rules/01-visual-constitution.md`、`02-template-application-rules.md`、`03-interaction-acceptance-rules.md`。
- 自动生成的逻辑模板目录：`execution/rule-template-registry.json`。
- 根据规则和策略自动生成的运行时输入：`execution/context-packs/`。
- 由视觉宪法自动生成的固定渲染器主题：`execution/theme/`。
- 当前可生成能力与组合：`execution/generation-policy.json`。

固定 Shell、组件实现和样式属于固定渲染器的职责。规则模板只回答“什么业务场景选择什么页面方案”，不包含坐标、样式、Figma、HTML、CSS 或组件代码。

# Boss Ledger Markdown Template Index

Boss Ledger 的模板合约是 Markdown 规范，不是可随意改造的 HTML 模板集。

- 固定框架规范：`modules/boss-ledger/templates/template-01-framework-shell.md`
- 页面意图与主模板的对应关系：`domain.json`
- 具体的 `template-02` 到 `template-13` 路径由 `scripts/resolve-resources.mjs --stage template` 返回。

每次只选一个主内容模板。`template-01` 始终是支撑壳层，不是第二个主模板。

模板描述页面语义和布局决策。实际执行能力以 `execution/generation-policy.json` 为准：模板存在不代表 Page Spec 渲染器已经开放该能力。Page Spec 生成必须同时通过选中模板规则、Director Rules、当前策略和契约验证。

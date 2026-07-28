# Boss Ledger Markdown Template Index

Boss Ledger 的模板合约是 Markdown 规范，不是可随意改造的 HTML 模板集。

- 固定框架规范：`modules/boss-ledger/templates/template-01-framework-shell.md`
- 页面意图与主模板的对应关系：`domain.json`
- 具体的 `template-02` 到 `template-12` 路径由 `scripts/resolve-resources.mjs --stage template` 返回。

每次只选一个主内容模板。`template-01` 始终是支撑壳层，不是第二个主模板。

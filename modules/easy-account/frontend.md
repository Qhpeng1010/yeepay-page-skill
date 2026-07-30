# Easy Account Frontend Contract

## Implementation Mode

当前使用 `page-spec-shadow`。普通查询列表以 `page-spec.json` 为唯一可编辑源，生成可直接打开的独立 `preview.html`，并由 Easy Account 自己的语义 HTML、CSS 和轻量 JavaScript 运行时实现评审交互。

## Hard Boundaries

- 不引用 `modules/boss-ledger/shell/` 中的任何文件。
- 不复制 Boss Ledger Logo、导航、Tabs、vendor 或主题 CSS。
- 不执行 Boss Ledger scaffold、rules reader 或 validator。
- 不把 `modules/shared/frontend.md` 的默认 React + Ant Design 栈视为 Easy Account 的已确认技术栈。

## Preview Contract

- 入口固定为 `changes/{change-id}/preview.html`。
- 预览必须应用 `design.md`、`components.md`、Easy Account Director Rules 和当前选中模板。
- 预览必须实现需求中的核心交互，并覆盖 loading、empty、error 和 permission-denied。
- 不依赖外部 CDN 或远程图片。
- Page Spec 模式下，`preview.html`、`preview-app.js`、运行时和 CSS 均是派生产物；必须用 `build-easy-account-page-spec.mjs` 生成并用 `verify-easy-account-page-spec.mjs` 验证。
- 表单、详情、结果和 Dashboard 未经对应黄金案例验证前，保持在 generation policy 的 shadow、workflow-only 或 legacy 模式。

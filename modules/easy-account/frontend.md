# Easy Account Frontend Contract

## Implementation Mode

当前使用 `markdown-direct`。在 Easy Account 正式 Shell 和工程技术栈未接入前，生成可直接打开的独立 `preview.html`，并使用语义 HTML、CSS 和必要的轻量 JavaScript 实现评审交互。

## Hard Boundaries

- 不引用 `modules/boss-ledger/shell/` 中的任何文件。
- 不复制 Boss Ledger Logo、导航、Tabs、vendor 或主题 CSS。
- 不执行 Boss Ledger scaffold、rules reader 或 validator。
- 不把 `modules/shared/frontend.md` 的默认 React + Ant Design 栈视为 Easy Account 的已确认技术栈。

## Preview Contract

- 入口固定为 `changes/{change-id}/preview.html`。
- 预览必须应用 `design.md`、`components.md` 和当前选中模板。
- 预览必须实现需求中的核心交互，并覆盖 loading、empty、error 和 permission-denied。
- 不依赖外部 CDN 或远程图片。
- 正式框架接入后，用 Easy Account 自己的 scaffold 替换本预览约定，不修改其他业务域。

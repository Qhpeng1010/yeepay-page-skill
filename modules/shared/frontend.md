# Frontend Spec

## Purpose

本文件定义 Yeepay Page Skill 的通用前端实现规则。

前端规则用于解决：

> 页面代码应该如何组织和实现？

本文件只负责代码结构、技术栈、类型定义、状态管理、mock 数据、交互实现和接口接入预留。

本文件不负责具体平台视觉规则。颜色、间距、导航样式、Tabs 样式、页面视觉表现等，以 `modules/shared/design-system.md` 和当前模块中的 `design.md` 为准。

---

## When to Use

当生成以下内容时，必须读取本文件：

- 前端实现
- React 页面代码
- TypeScript 类型
- mock 数据
- 表格 columns
- 页面样式文件
- HTML 预览文件
- 交互逻辑
- 接口接入说明

---

## Default Tech Stack

默认技术栈：

- React
- TypeScript
- Ant Design
- Ant Design Icons
- CSS Modules 或 Less Modules

如果用户未说明技术栈，默认使用以上技术栈。

---

## Implementation Principles

前端实现必须遵循以下原则：

1. 类型优先：业务数据、状态、表单值必须有 TypeScript 类型。
2. 结构清晰：页面代码按职责拆分，不把所有逻辑堆在一个文件里。
3. 组件复用：优先使用 Ant Design 组件。
4. 状态明确：loading、empty、error、success 状态必须处理。
5. 反馈完整：用户操作必须有结果反馈。
6. 规范一致：样式必须符合当前 theme。
7. 可接入真实接口：mock 数据结构应接近真实接口返回结构。

---

## Recommended File Structure

页面代码推荐结构：

```text
src/pages/{PageName}/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
└── index.module.less
```

---

## HTML Preview Implementation Rules

In addition to React implementation, the Skill must generate a standalone HTML preview file for every Yeepay Page Skill output that creates or updates a change package.

当任务属于页面设计、完整页面生成、前端实现或用户明确要求视觉预览时，默认生成：

```text
changes/{change-id}/preview.html
```

### Purpose

`preview.html` 用于快速预览页面视觉和交互效果。

它不替代正式前端工程代码，只用于产品、设计和前端评审预览，但必须尽量接近最终页面结构、主题风格和组件使用方式。

重要规则：

- `preview.html` 是评审预览产物，不属于正式生产前端代码。
- 用户说“不要写代码”“不用写代码”“no code”“do not implement frontend”时，只表示不输出正式前端工程代码，不表示跳过 `preview.html`。
- 任何产出都必须生成 `changes/{change-id}/preview.html`。页面类产出生成视觉页面预览；非页面产出生成可读 HTML 摘要页。
- 只有用户明确说“不输出 HTML”或“不要 preview.html”时，才可以跳过 `preview.html`。

### Required Rules

- 必须读取并应用 `modules/shared/design-system.md`。
- 必须读取并应用 `modules/shared/theme-routing.md`。
- 必须读取并应用 `modules/shared/template-routing.md`。
- 必须读取并应用当前模块中的 `design.md` 主题文件。
- Boss Ledger 预览必须读取并遵守 `modules/boss-ledger/design.md`。
- Boss Ledger 每次输出前还必须完整读取 `modules/shared/design-system.md`、`modules/boss-ledger/design.md` 与 `modules/boss-ledger/templates/template-01-framework-shell.md`；`rules-read.md` 必须记录三者的当前哈希，过期清单视为未读取。
- YOP 预览必须读取并遵守 `modules/open-platform/theme.md`。
- 必须读取并应用 `modules/shared/page-templates.md` 和 `modules/shared/components.md`。
- Boss Ledger 页面还必须读取并应用 `modules/boss-ledger/design.md` 中的平台专属组件与交互契约。
- 必须根据当前 theme 生成页面视觉，不允许混用其他平台主题色、导航样式、页面框架或专属组件规则。
- 必须是无需开发服务器即可直接打开的完整 change 预览包。入口为 `preview.html`，允许加载同目录下的固定本地 CSS、JavaScript、vendor 和 assets 文件。
- Boss Ledger 禁止重新手写或内联框架 CSS；必须通过 `scripts/scaffold-boss-ledger-preview.mjs` 复制 `modules/boss-ledger/shell/` 固定资源。
- 不依赖构建工具或项目工程环境。
- Boss Ledger 预览必须使用脚手架复制的本地 React、Ant Design、Ant Design Icons `vendor/`，不得重新选择 CDN 或运行时版本。
- 不依赖外部远程图片资源，除非用户明确提供；Boss Ledger Logo 必须使用 `modules/boss-ledger/assets/boss-logo.svg`，HTML 预览优先引用 `../../modules/boss-ledger/assets/boss-logo.svg`，正式项目可原样复制该文件到静态资源目录后引用，不得使用临时 SVG 占位或自由设计 logo。
- 预览中的控件表现应对齐 `modules/shared/components.md` 的组件语义、状态和交互方式。
- 查询列表 Form 必须显式使用 `layout: 'horizontal'`，label 右对齐且 label 列宽稳定；Modal 表单同样横向右对齐。Drawer 表单和新增 / 编辑标签页面必须显式使用 `layout: 'vertical'`，label 在控件上方左 / 上对齐。
- Boss Ledger Full-page Form 的底部操作必须使用 `.boss-full-page-action-bar`：`position: fixed`、`height: 48px`、`bottom: 32px`、横跨右侧 workspace 并在侧栏收起时同步左偏移；表单内容须预留操作栏和 Footer 的空间。
- 不需要接入真实接口，默认使用 mock 数据。
- mock 数据应能覆盖主要状态、空状态或异常状态示例。
- 文案必须使用真实业务文案，不使用 `test`、`aaa`、`xxx` 等无意义占位内容。

### Dependency Rules

- 通用主题默认不引入 React、ReactDOM、Ant Design 运行时、构建工具或项目工程依赖。
- Boss Ledger 是例外：必须引入 React、ReactDOM、Ant Design、Ant Design Icons，且不得手写原生控件替代 Ant Design 组件。
- 通用主题如需轻量交互，可使用原生 JavaScript 写在当前 HTML 文件内；Boss Ledger 交互必须通过 React 状态和 Ant Design 组件实现。
- 如果使用图表，应遵守当前 theme 和组件规则；Boss Ledger 图表场景应使用 Ant Design Charts 或项目内等价封装。
- Boss Ledger 独立预览必须优先加载 change 目录下的 `vendor/ant-design-charts.min.js` 与其依赖 `vendor/lodash.min.js`，通过 `window.Charts` / `window.AntDesignCharts` 使用 `Line`、`Column`、`Pie` 等官方图表组件；依赖缺失时只能明确标注“预览图表运行降级”，不得用 CSS、SVG、Canvas 或静态块替代。
- 若用户明确要求使用外部依赖或外部资源，必须在 `review.md` 中说明依赖来源和限制。

### Interaction Rules

`preview.html` 应根据页面类型实现轻量交互，例如：

- 查询、重置、展开 / 收起
- Tabs 切换
- 菜单展开 / 收起
- Modal / Drawer 打开和关闭
- 表格分页展示
- 列设置显隐
- loading、empty、error、success 反馈

### File Rules

- 输出文件名固定为 `preview.html`。
- 输出位置固定为 `changes/{change-id}/preview.html`。
- Boss Ledger 新 change 必须先运行 `node scripts/scaffold-boss-ledger-preview.mjs changes/{change-id}`。
- Boss Ledger 只允许编辑 `preview-app.js` 和 `business.css`；不得修改脚手架生成的 `preview.html`、`shell-runtime.js`、`shell.css`、`content-base.css`、`vendor/` 或规范 Logo。
- 查询列表必须使用脚手架提供的持久白底 `.boss-query-module` 与 `.boss-result-module`，作为 `.boss-content-stack` 下间距为 `16px` 的直接同级模块；业务 CSS 不得覆盖为透明背景或将两者合并。
- 查询列表 Query / Result 模块由 `content-base.css` 各自提供唯一 `16px` 内容内边距；业务 CSS 不得再给 `.boss-result-summary`、`.boss-result-toolbar`、`.boss-table-body`、`.boss-table-pagination` 增加左右 padding。
- 查询统计外层使用 `.boss-result-summary`，展开 / 收起使用 `.boss-query-expand-button`，列设置使用 `.boss-column-setting-button`；不得用页面私有 class 绕过对应颜色与内边距契约。
- 当 `.boss-result-summary` 使用灰色 `#F6F6F6` 统计卡片时，业务 CSS 必须保留 `padding-top: 16px`，同时保持左右 padding 为 `0`；这是查询列表卡片汇总的硬性布局规则。
- Boss Ledger 交付前必须运行 `node scripts/verify-boss-ledger-change.mjs changes/{change-id}/preview.html`。
- `preview.html` 必须是当前 change 的独立评审文件，不作为最终生产代码。
- 如果用户只要求 proposal、review、spec update 或 template update，也必须生成 `preview.html`，但可以是摘要型 HTML，而不是页面视觉稿。
- 只有用户明确说“不输出 HTML”或“不要 preview.html”时，才可以跳过。
- 与预览配套的用户明确提供资源可放在同一 change 目录下的 `assets/` 中。
- 不要覆盖用户已有的预览文件，除非本次任务就是更新该 change 的预览。

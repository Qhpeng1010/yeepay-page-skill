# Frontend Spec

## Purpose

本文件定义 Yeepay Page Skill 的通用前端实现规则。

前端规则用于解决：

> 页面代码应该如何组织和实现？

本文件只负责代码结构、技术栈、类型定义、状态管理、mock 数据、交互实现和接口接入预留。

本文件不负责具体平台视觉规则。颜色、间距、导航样式、Tabs 样式、页面视觉表现等，以 `specs/design-system.md` 和当前选中的 `specs/themes/{theme}.md` 为准。

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

- 必须读取并应用 `specs/design-system.md`。
- 必须读取并应用 `specs/theme-routing.md`。
- 必须读取并应用 `specs/template-routing.md`。
- 必须读取并应用当前选中的 `specs/themes/` 主题文件。
- Boss Ledger 预览必须读取并遵守 `specs/themes/boss-ledger.md`。
- YOP 预览必须读取并遵守 `specs/themes/yeepay-开放平台-DESIGN.md`。
- 必须读取并应用 `specs/page-templates.md` 和 `specs/components.md`。
- 必须根据当前 theme 生成页面视觉，不允许混用其他平台主题色、导航样式、页面框架或专属组件规则。
- 必须是完整可独立打开的 HTML 文件，包含 `<!DOCTYPE html>`、`<html>`、`<head>`、`<style>` 和 `<body>`。
- 必须使用 inline CSS 表达当前主题、布局、组件状态和页面层级。
- 不依赖构建工具或项目工程环境。
- Boss Ledger 预览必须引用 React、Ant Design、Ant Design Icons，并通过本地 `vendor/` 文件或稳定 CDN 保持可独立打开。
- 不依赖外部远程图片资源，除非用户明确提供；Boss Ledger Logo 必须使用 `specs/boss logo.svg`，HTML 预览优先引用 `../../specs/boss logo.svg`，正式项目可原样复制该文件到静态资源目录后引用，不得使用临时 SVG 占位或自由设计 logo。
- 预览中的控件表现应对齐 `specs/components.md` 的组件语义、状态和交互方式。
- 不需要接入真实接口，默认使用 mock 数据。
- mock 数据应能覆盖主要状态、空状态或异常状态示例。
- 文案必须使用真实业务文案，不使用 `test`、`aaa`、`xxx` 等无意义占位内容。

### Dependency Rules

- 通用主题默认不引入 React、ReactDOM、Ant Design 运行时、构建工具或项目工程依赖。
- Boss Ledger 是例外：必须引入 React、ReactDOM、Ant Design、Ant Design Icons，且不得手写原生控件替代 Ant Design 组件。
- 通用主题如需轻量交互，可使用原生 JavaScript 写在当前 HTML 文件内；Boss Ledger 交互必须通过 React 状态和 Ant Design 组件实现。
- 如果使用图表，应遵守当前 theme 和组件规则；Boss Ledger 图表场景应使用 Ant Design Charts 或项目内等价封装。
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
- `preview.html` 必须是当前 change 的独立评审文件，不作为最终生产代码。
- 如果用户只要求 proposal、review、spec update 或 template update，也必须生成 `preview.html`，但可以是摘要型 HTML，而不是页面视觉稿。
- 只有用户明确说“不输出 HTML”或“不要 preview.html”时，才可以跳过。
- 与预览配套的用户明确提供资源可放在同一 change 目录下的 `assets/` 中。
- 不要覆盖用户已有的预览文件，除非本次任务就是更新该 change 的预览。

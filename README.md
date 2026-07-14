# Yeepay Page Skill

Yeepay Page Skill 是一个用于生成易宝体系内多业务平台页面的结构化 Skill。

它可以根据一句话产品需求，完成需求分析、页面方案、前端实现和质量自检，并通过多主题机制支持不同业务平台的页面规范。

当前默认支持：

- Boss Ledger：运营后台 / 商户后台 / 审核后台主题
- YOP：开放平台 / 开发者中心 / API 文档中心主题，后续补充

---

## 1. Skill 目标

本 Skill 的目标是：

> 根据一句话产品需求，生成符合对应易宝业务平台规范的页面方案和前端实现。

它支持以下任务：

- 需求分析
- PRD / 产品方案生成
- 页面结构设计
- 页面模板选择
- 组件方案设计
- React + TypeScript + Ant Design 前端实现
- `preview.html` 页面预览生成
- 设计规范自检
- 前端实现自检
- specs 规则沉淀
- change 归档

---

## 2. 核心理念

本 Skill 使用类似 OpenSpec 的结构组织方式。

核心思想是：

```text
specs/      = 规则区
templates/  = 模板区
changes/    = 每次需求工作区
archive/    = 已完成需求归档区
```

---

## 3. HTML Preview

当 `yeepay-page-skill` 产生或更新一个 change 输出时，必须生成一个 HTML 文件：

```text
changes/{change-id}/preview.html
```

`preview.html` 用于快速预览页面效果，是产品、设计和前端评审文件，不作为最终生产代码。

规则补充：

- “不用写代码”“不要写代码”只表示不输出正式前端工程代码。
- `preview.html` 是页面评审预览产物，不属于正式前端工程代码。
- 每次输出都需要 `preview.html`。页面类输出生成视觉预览；非页面输出生成 HTML 摘要页。

预览文件需要遵守当前识别到的业务主题：

- Boss Ledger 页面遵守 `specs/themes/boss-ledger.md`
- YOP / 易宝开放平台页面遵守 `specs/themes/yeepay-开放平台-DESIGN.md`
- 通用结构和组件规则来自 `specs/design-system.md`、`specs/page-templates.md`、`specs/components.md`

`preview.html` 必须是完整可独立打开的 HTML 文件，应包含 inline CSS，并根据当前 theme 生成页面结构、主题风格、组件状态和轻量交互。

只有用户明确说“不输出 HTML”或“不要 preview.html”时，才可以不生成 `preview.html`。

# Implementation: 新增商户资料审核页面

## 1. Tech Stack

- HTML
- CSS
- JavaScript
- React UMD
- Ant Design UMD
- Ant Design Icons UMD

说明：用户明确要求“输出页面 html 就好，先测试预览，前端语言先不用输出”，因此本次跳过 React、TypeScript 生产代码，只提供单文件 HTML 预览。预览页通过本地 `vendor/` 缓存引用官方 React、Ant Design、Ant Design Icons 和 dayjs UMD 文件，页面控件由真实 Ant Design 组件渲染。

## 2. File Structure

```text
yeepay-page-skill/changes/add-merchant-audit-page/
├── proposal.md
├── page-design.md
├── tasks.md
├── implementation.md
├── review.md
├── index.html
├── assets/
│   └── boss-ledger-logo.svg
└── vendor/
    ├── ant-design-icons.umd.js
    ├── antd-reset.css
    ├── antd.min.js
    ├── babel.min.js
    ├── dayjs-zh-cn.js
    ├── dayjs.min.js
    ├── react-dom.production.min.js
    └── react.production.min.js
```

## 3. Preview File

`index.html` 用于预览 Boss Ledger 商户资料审核页面，使用 Ant Design `ConfigProvider` 配置 Boss Ledger 主色、CSS 变量、控件高度和圆角。

## 4. Implemented Preview Interactions

- 查询按钮触发短暂 loading 并刷新提示。
- 重置按钮恢复默认状态。
- 查看按钮打开详情抽屉。
- 审核按钮打开审核弹窗。
- 驳回时展示驳回原因输入区。
- 驳回未填写原因时展示校验提示。
- 确认审核后展示成功反馈并关闭弹窗。
- 查询条件超过 6 个时，默认收起展示前 5 个字段，并把“展 开 / 重 置 / 查 询”放在第二行第三列右侧。
- Tabs 支持切换，当前 Tab 左侧展示灰色刷新 icon，刷新 icon 与标题无额外 gap，选中 Tab 左上和右上圆角为 8px。
- 左侧导航支持整体收起，收起态宽度为 48px，二级菜单支持展开 / 收起。
- 表格操作列第一个操作与“操作”列标题左侧对齐。
- 一级导航 Logo 固定在左侧，一级菜单在右侧右对齐展示。
- Modal 标题下方和底部按钮区上方增加灰色分割线。
- 表单 label 到控件的间距统一为 8px。
- 左侧导航和内容区撑满屏幕，底部固定展示平台 footer。
- 顶部信息栏文字使用三级导航同级弱文字色。
- 二级菜单展开态内容宽度按 207px 填满，去掉右侧白色间距，收起态仍按 48px 适配。
- 查询列表内容区使用纵向 flex，表格模块占满剩余内容高度，分页附着在表格模块底部。
- Drawer 头部按 Boss Ledger 规则调整为标题左侧、关闭 icon 右侧。
- Modal 内容区内边距为 24px，表单元素之间间距为 16px。
- 列设置按钮使用灰色 `#FAFAFA` 背景、无明显边框，并支持表格列显隐。
- Footer 高度为 40px，字号为 12px。
- Table 和 Pagination 紧贴展示，剩余空白留在分页下方，不夹在 Table 与分页之间。
- 查询表单项内部 label 与控件之间增加稳定 `8px` 间距。
- Pagination 区域上下内边距均为 `16px`。
- Footer 文案水平居中但贴近 footer 上方展示，不做垂直居中。
- 左侧导航收起态菜单项使用 flex 强制 icon 在 `48px` 列内居中。
- 顶部 Logo 改为引用 `assets/boss-ledger-logo.svg`，当前为预览占位资产；正式项目应替换为官方 Boss Ledger Logo SVG / PNG。
- 表单 label 冒号右侧不再额外设置 `margin-right: 8px`。
- 多标签左右内边距调整为 `12px`，刷新 icon 与标题间距为 `8px`，关闭 icon 左侧间距为 `4px`。
- 表格工具栏改为上下内边距均为 `16px`、行高区域 `64px`、最小高度 `64px`，标题、按钮和列设置入口在该行内垂直居中，右侧工具按钮区固定 `8px` 间距且不压缩。
- 左侧导航收起态显式隐藏菜单文字并保留二级 icon，避免收起后只剩空白侧栏。
- 分页容器保持在表格白色内容区内，表格模块底部空白由分页区域承担，不额外叠加外部底部 padding。

## 5. Skipped Steps

- React / TypeScript 工程化代码：用户明确说明先不用输出。
- 真实接口接入：本次为静态预览。
- 后端接口联调：本次使用 mock 数据。

## 6. Follow-Up Implementation Notes

后续转为正式前端实现时，应按 `specs/frontend.md` 拆分：

```text
src/pages/MerchantAudit/
├── index.tsx
├── types.ts
├── mock.ts
├── columns.tsx
└── index.module.less
```

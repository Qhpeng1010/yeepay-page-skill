# 易账通 Easy Account Shell

该文件包是易账通固定框架层，适用于易账通 PC 管理后台页面。业务页面由 `page-spec.json` 和固定渲染器生成，Shell 不单独维护页面模板。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| `shell.css` | 224px 左侧导航、50px 多标签栏、内容区、页脚和折叠状态 |
| `content-base.css` | 卡片、按钮、输入框、状态等通用内容组件 |
| `shell-runtime.js` | 渲染 Shell、Ant Design 图标、标签切换/关闭、菜单展开和侧栏折叠 |
| `shell-config.example.js` | 品牌、多标签、菜单、账号和页脚配置 |
| `assets/logo-txt@3x.png` | 侧栏展开时显示的完整品牌 Logo |
| `assets/logo.png` | 侧栏收起时显示的方形品牌 Icon |
| `modules/shared/browser-runtime/vendor/` | 老板管账与易账通共用的离线浏览器依赖，由根目录依赖清单生成 |

## Ant Design 约定

- 框架图标统一使用 `@ant-design/icons`，配置项使用完整组件名，例如 `ApartmentOutlined`。
- 默认使用 `Outlined` 风格；固定等明确选中状态可使用 `Filled`。
- 不使用 Emoji、Unicode 字符、CSS 手绘图标或外部 CDN。
- 业务内容使用 `ConfigProvider` + `App` 挂载 Ant Design 组件，视觉规则以 `director-rules/01-visual-constitution.md` 为准，页面专属样式由执行层渲染器生成。
- 业务内容根节点默认使用透明背景，继承 Shell 的 `--ea-bg`；仅查询区、列表区等实际模块使用白底。

## 本地预览

页面预览由对应 Change 的固定构建命令生成：

```bash
node scripts/build-easy-account-page-spec.mjs changes/{change-id}/page-spec.json
```

然后人工打开该 Change 的 `preview.html` 验收。Shell 本身不再提供独立的旧模板预览入口。
默认构建会创建指向共享运行时的软链接；需要移动到仓库外的独立交付包时使用：

```bash
node scripts/build-easy-account-page-spec.mjs changes/{change-id}/page-spec.json --portable
```

## 多标签能力

- 点击标签切换激活态，并触发 `easyaccount:tabchange`。
- 点击关闭按钮关闭标签，并触发 `easyaccount:tabclose`。
- 固定标签不能关闭，当前标签关闭后自动激活左侧相邻标签。
- 键盘 `←` / `→` 切换标签，`Delete` 关闭当前标签。
- 通过 `contentByTab` 或单个标签的 `content` 字段挂载不同业务内容。
- `mount()` 返回 `activateTab()`、`closeTab()`、`getTabs()` 等运行时 API。

## 接入方式

1. 页面规格通过 `page-spec.json` 声明标签、导航和业务内容。
2. 固定渲染器复制 Shell 运行时、配置和样式，链接共享浏览器运行时并生成业务预览。
3. 框架规则只写入 `shell.css` 与 `content-base.css`，页面视觉规则由导演规则和执行层共同约束。

## 框架固定值

- 设计基准：1440px PC 管理后台
- 左侧导航：224px；折叠宽度 56px
- 小于 1024px 时默认折叠；手机端展开侧栏以浮层形式覆盖内容
- 多标签栏：50px
- 内容背景：`#F1F3F6`
- 品牌主色：`#1E75FF`
- 菜单项高度：42px
- 当前标签背景：`#EBF1FF`
- 默认菜单状态：企业管理、财务管理均展开

# Review: Boss Ledger 商户入驻配置步骤页

## 1. Validation Summary

已在底部操作栏、`Modal.confirm` padding、Steps 副描述规则调整后重新运行：

```text
node scripts/validate-boss-ledger-preview.mjs changes/20260712-boss-ledger-merchant-onboarding-wizard/preview.html
```

```text
validate: pass
screenshot: pass
charts: pass
中文文案: pass
overall: pass
```

## 2. Product Review

- 覆盖商户入驻配置的三步主流程。
- 字段范围与用户需求一致。
- 合理假设已记录：本期只做 HTML 预览，不接入真实后端。

## 3. Page Template Review

- 已选择 `template-10-wizard.md` 作为主模板。
- 已组合 `template-01-framework-shell.md`。
- 未创造新的页面框架。

## 4. Theme Review

- 已选择 Boss Ledger 主题。
- 主题来源：`specs/themes/boss-ledger.md`。
- 未混用 YOP 开放平台主题。

## 5. Component Review

- 使用 Ant Design Menu、Tabs、Steps、Form、Input、Select、Descriptions、Modal.confirm、Empty、Button。
- Steps 每个步骤项均包含副描述，未输出 title-only Steps。
- 使用 Ant Design Icons。
- 确认摘要使用 Descriptions 默认非边框样式。

## 6. Frontend Review

- HTML 预览使用 React + Ant Design 运行组件。
- 当前预览不是生产前端代码。
- 可迁移到 React/TypeScript 页面结构。

## 7. HTML Preview Review

- 已生成 `preview.html`。
- 已生成 `preview-app.js`。
- 使用本地 `vendor/` 依赖，不依赖外部 CDN。
- Logo 引用 `../../specs/boss logo.svg`。
- 包含 Boss Ledger 自动校验标记。
- 校验脚本已生成 `preview.screenshot.png`。

## 8. Interaction Review

- 左侧菜单可收起。
- 二级菜单可展开 / 收起。
- Tabs 可切换。
- Steps 可通过底部操作切换，每步展示标题和副描述。
- 下一步和提交前执行表单校验。
- 底部操作栏为工作区通栏展示，按钮右对齐。
- 提 交默认可点击，不因当前步骤未到第三步而禁用。
- 提交时使用 `Modal.confirm` 展示提交确认和成功反馈。
- `Modal.confirm` 保持官方结构，`.ant-modal-body` 上下左右 `24px` padding。

## 9. Copywriting Review

- 页面文案为中文。
- 两汉字按钮按规范使用空格：提 交。
- 未使用 blocked 英文默认文案。

## 10. Spec Update Review

已更新 Boss Ledger skill/spec 规则：

- 提交确认和二次确认必须使用 Ant Design `Modal.confirm`，不得使用普通受控 `Modal`、`Popconfirm`、手写确认壳层或自定义 Dialog；`Modal.confirm` 的 `.ant-modal-body` 必须保留上下左右 `24px` padding。
- Wizard / Steps 页面中，Ant Design `Steps` 的每个步骤项必须包含简短副描述 `description`，不得输出只有标题的 Steps。

## 11. Final Decision

pass

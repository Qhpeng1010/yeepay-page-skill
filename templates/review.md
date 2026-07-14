# Review: {{change_title}}

## Validation Summary

整体结果：pass / failed

validate: pass / failed

screenshot: pass / failed

charts: pass / failed

中文文案: pass / failed

校验脚本：

```text
node scripts/validate-boss-ledger-preview.mjs changes/{{change_id}}/preview.html
```

校验脚本输出摘录：

```text
{{validation_output}}
```

截图文件：`changes/{{change_id}}/preview.screenshot.png`

规则：

- 不允许模型主观写 Pass。
- 必须引用校验脚本输出。
- 只要 `validate`、`screenshot`、`charts`、`中文文案` 任一项为 failed，整体结果必须为 failed。
- 不允许输出 `Pass with Notes`。
- 若任一硬校验不通过，必须停止交付并自动修正。

## 1. Product Review

结论：pass / failed

检查说明：

-

## 2. Page Template Review

结论：pass / failed

检查说明：

-

## 3. Theme Review

结论：pass / failed

检查说明：

-

## 4. Component Review

结论：pass / failed

检查说明：

-

## 5. Frontend Review

结论：pass / failed

检查说明：

-

## 6. HTML Preview Review

结论：pass / failed

检查说明：

-

## 7. Interaction Review

结论：pass / failed

检查说明：

-

## 8. Copywriting Review

结论：pass / failed

检查说明：

-

## 9. Spec Update Suggestion

是否需要更新 specs：

- Yes / No

原因：

-

建议更新文件：

-

## 10. Final Decision

pass / failed

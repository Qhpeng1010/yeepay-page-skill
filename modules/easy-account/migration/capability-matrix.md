# 易账通 Page Spec 迁移能力矩阵

| 页面族/能力 | 初始模式 | 依据 | 进入下一阶段的证据 |
| --- | --- | --- | --- |
| 普通与高级账户查询列表 | shadow | `EA-TPL-003`、`EA-TPL-004`、`EA-INT-002` | 正常、重置、空、错误、权限和响应式人工预览案例 |
| 列设置、排序、刷新与导出 | shadow | `EA-TPL-004`、`EA-TPL-016`、`EA-INT-014` | 字段显示、排序和导出不改变数据语义，布局无跳动的人工预览案例 |
| 状态确认、删除与批量操作 | shadow | `EA-TPL-016`、`EA-TPL-017`、`EA-INT-005`、`EA-INT-014` | 取消/确认/失败三态和权限校验 |
| 高级查询与父子表展开 | shadow | `EA-TPL-003`、`EA-TPL-016` | 展开、依赖、错误恢复和子表核对案例 |
| 简单、分组、抽屉和上传复核表单 | shadow | `EA-TPL-007`、`EA-TPL-010`、`EA-INT-003` | 服务端校验、未保存确认、成功流转 |
| 详情 | shadow | `EA-TPL-005`、`EA-TPL-008`、`EA-INT-004` | 脱敏、余额口径、关联记录和日志 |
| Result | workflow-only / shadow | `EA-TPL-008`、`EA-INT-015` | 受控写操作结果页人工验收案例 |
| Dashboard | pending / legacy | `EA-TPL-009`、`EA-TPL-011` | 指标口径、图表状态和权限案例 |

易账通不会复制 Boss Ledger 的主题、Shell、运行时或验证器实现；只复用“Page Spec 是唯一编辑源、派生产物校验”的工程原则。

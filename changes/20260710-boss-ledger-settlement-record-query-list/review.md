# Review: 结算记录查询列表页

## Result

- `preview.html` generated: yes
- Theme source applied: `specs/themes/boss-ledger.md`
- Dependencies used: local React, ReactDOM, Ant Design, Ant Design Icons, dayjs
- Screenshot: `preview.screenshot.png`

## Validation

```text
validate: pass
screenshot: pass
charts: pass
中文文案: pass
overall: pass
```

关键新增检查：

```text
Lightweight query summary shares the toolbar row with right-side actions
```

## Self-Check

- 查询条件覆盖商户编号、商户名称、结算状态、结算日期、银行账户、结算批次号。
- 查询结果模块上方展示结算总金额 128,960.00 元和结算总笔数 286。
- 已按轻量汇总规则隐藏 `查询列表` 大标题。
- 轻量汇总统计已与右侧工具按钮放在同一 toolbar 行内。
- 表格列覆盖用户要求的全部字段。
- 行操作包含查看详情、下载回单。
- 未发现英文默认文案、原生控件替代 Ant Design、YOP 主题混用或页面级横向滚动问题。

## Known Limitations

- 预览不连接真实接口。
- 下载回单为前端反馈演示，不生成真实回单文件。

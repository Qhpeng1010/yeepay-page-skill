# 开放平台模板与应用规则

## OP-TPL-001 页面家族

| 页面族 | 解决的问题 | Shell |
| --- | --- | --- |
| Marketing | 介绍产品、价值与接入路径 | Marketing Shell |
| Document | 让开发者完成准备、配置、开发、调试、排障或上线 | Documentation Shell |
| API Index | 发现并定位 API 分类 | Documentation Shell |
| API Detail | 阅读单接口说明、参数、示例和错误处理 | Documentation Shell |
| Search/Error Code | 定位资料或排查问题 | Documentation Shell |

一次页面只能有一个主页面族；营销内容不能嵌入文档三栏 Shell，API 参数与代码不能塞进营销 Hero。

## OP-TPL-002 文档选择

- API/SDK/接入指南/错误码默认使用 Documentation Shell。
- API Detail 必须按“概述、请求参数、请求示例、响应示例、错误处理、下一步”组织。
- 内容导航超过一级时使用左侧目录；正文超过两个 H2 时启用本文目录。
- 搜索只在当前内容域内过滤；全局搜索不能替代文档目录。

## OP-TPL-003 页面组合

- 文档内流程用步骤概览，不将长流程改为营销卡片。
- 参数表、代码块、错误码表属于正文内容，不能浮在右侧本文目录中。
- 相关文章使用上一篇/下一篇或文档卡片，不依赖浏览器后退作为唯一回路。

## OP-TPL-004 禁用组合

- 不在 API Detail 中使用 Hero 大标题、客户 Logo 墙或售前 CTA 作为主内容。
- 不在 Marketing 页面使用 256px 开发者目录和代码块作为默认结构。
- 不把主色用于多个并列 CTA，不用无语义的图形代替 API 状态或错误说明。

## OP-TPL-005 能力边界

API Detail 与接入指南均在 shadow 模式验证文档导航、锚点、代码复制、任务流程和相邻文档导航。官网、SDK 下载、全局搜索、错误码聚合和行业方案仍保持 shadow 或 legacy。

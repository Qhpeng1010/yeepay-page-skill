# Implementation: Boss Ledger 商户入驻配置步骤页

## 1. 输出范围

本次仅生成评审用 HTML 预览，不修改生产项目源码。

输出文件：

```text
changes/20260712-boss-ledger-merchant-onboarding-wizard/preview.html
changes/20260712-boss-ledger-merchant-onboarding-wizard/preview-app.js
```

## 2. 技术方案

- React UMD 运行时
- Ant Design UMD 运行时
- Ant Design Icons UMD 运行时
- dayjs 中文 locale
- 普通 React.createElement 脚本，避免预览依赖构建工具或浏览器端 Babel 转译

## 3. 组件使用

- Shell：布局容器 + Ant Design Menu + Ant Design Tabs
- Wizard：Ant Design Steps，每个步骤项包含简短副描述
- 表单：Ant Design Form / Input / Select
- 确认摘要：Ant Design Descriptions 默认非边框样式
- 反馈：Ant Design message / Modal.confirm
- 图标：Ant Design Icons

## 4. 交互实现

- 左侧菜单支持收起和二级菜单展开 / 收起。
- Tabs 可切换，非当前业务 Tab 展示 Empty。
- Steps 展示三步标题和副描述，副描述分别说明基础资料录入、结算规则确认和提交摘要核对。
- 下一步按当前步骤字段校验。
- 上一步保留 Form 已填写值。
- 第三步从 Form values 和 summary state 生成确认摘要。
- 底部操作栏按工作区通栏固定展示，按钮右对齐。
- 提 交默认可点击；点击后校验当前及已缓存数据，通过后进入确认摘要并调用 Ant Design `Modal.confirm`，确认后展示成功 message。
- `Modal.confirm` 保持官方 confirm 结构，`.ant-modal-body` 上下左右保留 `24px` padding。

## 5. Mock 数据

预览内置一组默认商户数据，便于直接进入确认摘要查看最终效果：

- 商户名称：上海海栖餐饮管理有限公司
- 商户简称：海栖餐饮
- 联系人：林海鹏
- 联系电话：13800138000
- 所属行业：餐饮服务
- 结算账户：6222 8888 6612 9036
- 开户银行：招商银行上海分行
- 结算周期：T+1
- 结算方式：自动结算

## 6. 接入说明

正式接入 React/TypeScript 项目时建议拆分为：

```text
src/pages/MerchantOnboardingWizard/
├── index.tsx
├── types.ts
├── constants.ts
├── service.ts
└── index.module.less
```

真实接口建议包含：

- 获取行业枚举
- 获取开户银行列表
- 暂存入驻配置
- 提交入驻配置
- 查询提交结果

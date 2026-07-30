# Yilaiqian Checkout Counter Vant Components

易来钱移动端收银台统一使用 Vue 3 + Vant 4。当前版本基线为 Vue `3.5.39`、Vant `4.10.0`；桌面评审预览使用 Vant 官方 `@vant/touch-emulator 1.5.0` 转换鼠标事件，生产移动端不需要该依赖。

官方文档：

- [Vant](https://vant-ui.github.io/vant/#/zh-CN)
- [NumberKeyboard](https://vant-ui.github.io/vant/#/zh-CN/number-keyboard)
- [PasswordInput](https://vant-ui.github.io/vant/#/zh-CN/password-input)
- [Popup](https://vant-ui.github.io/vant/#/zh-CN/popup)
- [Field](https://vant-ui.github.io/vant/#/zh-CN/field)
- [Radio](https://vant-ui.github.io/vant/#/zh-CN/radio)

## Hard Boundary

- 付款页、支付方式、金额键盘、密码输入和密码抽屉不得用手写控件替代对应 Vant 组件。
- 允许通过插槽组合商户图标、金额展示和渠道品牌资产，但基础交互状态必须由 Vant 组件管理。
- 主题调整优先使用 Vant CSS Variables；不得复制组件内部 DOM 结构后自行模拟。
- 独立 HTML 评审预览必须加载 `@vant/touch-emulator`，保证 Vant 触摸组件可使用桌面鼠标；正式移动端工程不得重复引入。

## Component Mapping

| Business element | Required Vant component | Required API |
| --- | --- | --- |
| 顶部导航 | `NavBar` | `title`、`left-arrow`、`@click-left` |
| 金额输入 | `Field` | `v-model`、`readonly`、`clickable`、`clearable`、`clear-trigger="always"` |
| 金额键盘 | `NumberKeyboard` | `show`、`theme="custom"`、`extra-key="."`、`close-button-text="付款"`、`@input`、`@delete`、`@close` |
| 支付方式 | `RadioGroup` + `Radio` | `v-model`、`checked-color="#0051FF"`、`icon-size="20px"` |
| 密码抽屉 | `Popup` | `v-model:show`、`position="bottom"`、`round`、`closeable`、`close-icon-position="top-left"`、`teleport="body"` |
| 密码输入 | `PasswordInput` | `value`、`length="6"`、`focused`、`mask`、`@focus` |
| 密码键盘 | `NumberKeyboard` | `v-model`、`show`、`maxlength="6"`、`@delete`、`safe-area-inset-bottom` |
| 处理中 | `Loading` + `Overlay` | `show`、`type="spinner"`、明确的状态文案 |
| 支付结果 | `Icon` + `CellGroup` + `Cell` + `Button` | 语义状态、可核对详情和单一完成动作 |

## Amount Field Contract

```vue
<van-field
  v-model="amount"
  readonly
  clickable
  clearable
  clear-trigger="always"
  placeholder="请输入金额"
  @click-input="focusAmount"
  @clear="clearAmount"
>
  <template #right-icon>
    <van-icon v-if="amount" name="clear" @click.stop="clearAmount" />
  </template>
</van-field>
```

- 使用自定义 `input` 插槽时，Vant 内置 `clearable` 不会生成清除图标；此时必须在 `right-icon` 插槽中条件渲染 Vant `Icon name="clear"`。空值时不渲染，非空时渲染，禁止手写图标按钮。
- Vant `Field` 的原生输入光标不用于只读金额键盘场景。金额展示层必须在逻辑聚焦时绘制 `1px` 光标，周期 `1s`，并遵守 `prefers-reduced-motion`。
- 金额显示、占位、人民币符号和光标可以通过 `Field` 的 `input` 插槽实现，但 `Field` 仍是交互和可访问容器。

## Amount NumberKeyboard Contract

```vue
<van-number-keyboard
  :show="true"
  theme="custom"
  extra-key="."
  close-button-text="付款"
  :close-button-loading="submitting"
  :safe-area-inset-bottom="true"
  @input="appendAmount"
  @delete="deleteAmount"
  @close="openPasswordPopup"
/>
```

- 金额页键盘固定显示，不因点击外部区域自动隐藏。
- 付款无效时不能只依赖视觉禁用；`@close` 处理函数必须再次校验金额和支付方式。
- 键盘背景通过 `--van-number-keyboard-background` 设置为 `#F0F0F0`，与页面背景一致。
- 数字键保持白色，按压色使用 `#E7E9ED`；主动作保持 `#0051FF`。

## Password Popup Contract

```vue
<van-popup
  v-model:show="showPassword"
  position="bottom"
  round
  closeable
  close-icon-position="top-left"
  teleport="body"
  :close-on-click-overlay="!submitting"
>
  <van-password-input
    :value="password"
    :length="6"
    :gutter="8"
    :focused="showPassword && !submitting"
    info="请输入 6 位付款密码"
    @focus="showPassword = true"
  />
  <van-number-keyboard
    v-model="password"
    :show="showPassword"
    :maxlength="6"
    :safe-area-inset-bottom="true"
  />
</van-popup>
```

- `Popup` 是密码流程唯一抽屉容器；禁止原生 `dialog`、自定义 fixed 面板或其他组件库 Drawer。
- 抽屉圆角使用 Vant `round` 默认语义，可通过 `--van-popup-round-radius` 收敛到 `12px`，不得超过 `16px`。
- `PasswordInput focused` 必须与抽屉显示和提交锁定状态联动，确保当前空密码格显示 Vant 光标。
- `PasswordInput gutter` 固定为 `8`；每个 `.van-password-input__item` 使用 `#F2F3F5` 背景和 `4px` 圆角，移除连续边框与分隔线。
- 达到 6 位时由业务 watch 触发提交；组件不负责真实密码校验。

## Radio Contract

- 使用 `RadioGroup v-model` 管理唯一选中值。
- 渠道行使用 Vant `Cell clickable`，点击整行更新绑定值；右侧使用 `Radio`，不得另画一套选择圆圈。
- `checked-color` 固定为 `#0051FF`，图标尺寸 `20px`。
- 渠道 Logo 使用官方品牌资产，不使用 Vant 通用 Icon 代替品牌 Logo。

## Loading Contract

```vue
<van-overlay :show="submitting" class="processing-overlay">
  <div role="status" aria-live="assertive">
    <van-loading type="spinner" color="#0051FF" size="52px" />
    <h2>正在确认支付</h2>
    <p>请稍候，不要重复付款</p>
  </div>
</van-overlay>
```

- `Overlay` 和 `Loading` 必须同时来自 Vant；不得只用 Vant Overlay 包裹手写 spinner。
- Overlay 层级高于 Popup 和 NumberKeyboard，显示期间不得透传点击。
- 进入提交态时密码 Popup 使用 `duration="0"` 立即关闭，Loading 出现时 Popup 必须已不可见。
- Loading 颜色使用收银台主色 `#0051FF`，大小 `52px`，不得改变页面布局。

## Result Action Contract

- 结果详情使用 Vant `CellGroup` + `Cell`，完成操作使用 Vant `Button round`。
- 结果主内容使用纵向 Flex；完成按钮通过 `margin-top: auto` 靠近底部。
- 结果容器底部保留 `calc(max(24px, env(safe-area-inset-bottom)) + 40px)`；即在原安全区规则基础上上移 `40px`，不得使用 `position: fixed` 覆盖内容。

## Background Asset Contract

- 默认背景唯一来源为 `modules/Yilaiqian Checkout Counter/01背景.png`。
- 预览和正式页面应引用模块资产；不要转成 CSS gradient 或生成新的近似图片。
- 背景规则：`center top / 100% auto no-repeat`，并设置 `#F0F0F0` 作为加载失败和长页面底色。

## Theme Variables

```css
:root {
  --van-primary-color: #0051ff;
  --van-background: #f0f0f0;
  --van-background-2: #ffffff;
  --van-number-keyboard-background: #f0f0f0;
  --van-number-keyboard-key-background: #ffffff;
  --van-number-keyboard-key-active-color: #e7e9ed;
  --van-number-keyboard-button-background: #0051ff;
  --van-popup-round-radius: 12px;
  --van-password-input-height: 50px;
  --van-password-input-cursor-width: 1px;
  --van-password-input-cursor-duration: 1s;
}
```

## Accessibility

- `NavBar` 返回、Field 清除、NumberKeyboard 删除和 Popup 关闭必须保留 Vant 的可点击语义，并补齐业务 `aria-label`。
- 光标动画在 `prefers-reduced-motion: reduce` 下保持静态可见，不闪烁。
- 动态错误、处理中和结果状态使用 live region 补充播报。

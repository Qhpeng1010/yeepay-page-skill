# Mobile Payment H5 Design Specification

> Version: 1.0  
> Source: [Figma – Untitled](https://www.figma.com/design/DAROCTTfWPIV4320YKa70x/Untitled?node-id=0-1)  
> Extracted: 2026-07-23  
> Scope: QR-code payment, amount entry, payment-method selection, exception prompts, browser errors, and payment results.

---

## 0. How to read this specification

This document is extracted from 22 mobile frames in the source Figma file.

Rule confidence:

- **Observed**: directly measured from repeated Figma node properties.
- **Normalized**: consolidates small inconsistencies into one reusable rule.
- **Recommended**: not encoded as a Figma Variable, Style, or Component yet, but should be adopted to keep future output consistent.

The current Figma file contains no local Variables and no local Paint, Text, Effect, or Grid Styles. Repeated values below therefore describe the de facto design system rather than an already-published Figma library.

---

## 1. Product and experience principles

### 1.1 Product character

The product is a lightweight mobile web payment experience. The interface should feel:

- direct and transaction-focused;
- familiar to Chinese mobile-payment users;
- calm and trustworthy;
- visually lightweight, with high-emphasis treatment reserved for amounts and the primary payment action;
- explicit about success, failure, processing, and unavailable states.

### 1.2 Core principles

1. **Amount first**  
   The amount is the strongest information on the payment page. Input values use large, high-contrast typography.

2. **One primary action per screen**  
   A screen should have only one visually dominant action, such as “付款” or “刷新页面”.

3. **Payment states must not rely on color alone**  
   Success, failure, and processing states must combine an icon, a title, and explanatory text.

4. **Keep optional information secondary**  
   Remarks, subject types, discounts, installment details, and order numbers must not compete with the amount or final status.

5. **Prefer contained information groups**  
   Related fields and payment methods are grouped inside white cards rather than divided by strong lines.

---

## 2. Canvas and responsive layout

### 2.1 Reference viewport

| Property | Value | Confidence |
| --- | ---: | --- |
| Reference width | 375 px | Observed |
| Reference height | 812 px | Observed |
| Status bar | 44 px | Observed |
| Navigation bar | 44 px | Observed |
| Combined top system area | 88 px | Observed |
| Bottom home-indicator area | 34 px | Observed |
| Default horizontal page inset | 12–16 px | Observed |
| Standard content width | 343 or 351 px | Observed |

### 2.2 Responsive rules

- Use `375 × 812` as the reference design viewport, not as a fixed runtime viewport.
- Page content must stretch to the device width.
- Use safe-area insets for devices with a notch or home indicator:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

- Maintain `12 px` side insets for the main payment form and `16 px` for general content/result cards.
- On widths below `375 px`, reduce only horizontal free space. Do not reduce touch-target height or body text below the minimum sizes in this document.
- On widths above `430 px`, center the mobile experience and cap the primary content width at approximately `430 px`.
- The numeric keyboard is bottom-aligned and full width.
- The first business content block begins exactly `24 px` below the bottom edge of the navigation bar.

### 2.3 Vertical structure

```text
Status bar                         44
Navigation bar                    44
Page content                      flexible
Custom numeric keyboard           230
Bottom safe/home-indicator area   34
```

The payment form begins around `100 px` from the top of the reference frame. Result content begins around `152 px`.

---

## 3. Design tokens

### 3.1 Color tokens

#### Core palette

| Token | Value | Usage | Confidence |
| --- | --- | --- | --- |
| `color.brand.primary` | `#0051FF` | Primary payment action, selected control | Observed |
| `color.brand.primary-disabled` | `rgba(0,81,255,0.45)` | Disabled payment action | Observed |
| `color.background.page` | `#F0F0F0` | Main page background | Observed |
| `color.background.card` | `#FFFFFF` | Cards, fields, keyboard keys | Observed |
| `color.background.subtle` | `#F7F8FA` | Secondary/lightweight surfaces | Observed |
| `color.text.primary` | `#323233` | Primary interface text | Normalized |
| `color.text.strong` | `#333333` | Amount and strong labels | Observed |
| `color.text.inverse` | `#FFFFFF` | Text on primary buttons | Observed |
| `color.text.secondary` | `#666666` | Supporting text | Observed |
| `color.text.placeholder` | `#999999` | Input placeholders | Observed |
| `color.text.disabled` | `#C1C1C1` | Disabled/inactive information | Observed |
| `color.border.default` | `#C8C9CC` | Radio and neutral control border | Observed |
| `color.divider.default` | `#E2E2E2` | Subtle separators | Observed |
| `color.status.success` | `#07C160` | Success result icon | Normalized |
| `color.status.error` | `#EE0A24` | Error label and failed state | Observed |
| `color.status.processing` | `#1677FF` | Processing state | Normalized |
| `color.overlay.light` | `rgba(0,0,0,0.08)` | Neutral pill-button background | Observed |

#### Payment-channel colors

Payment-channel colors are brand assets, not interchangeable semantic tokens:

| Channel | Observed color |
| --- | --- |
| WeChat Pay | `#07C160` / `#09BB07` |
| Alipay | `#1677FF` |
| UnionPay | Brand artwork; do not recolor |

### 3.2 Color application rules

- Use `color.brand.primary` only for the dominant payment action and selected interactive state.
- Do not use channel brand colors for generic success, links, or primary actions.
- The page background remains neutral; cards are white.
- Failure and closed-status text use `color.status.error`.
- Disabled primary actions preserve the blue hue at approximately `45%` opacity.
- Avoid introducing additional blues unless they belong to an external payment brand.

### 3.3 Typography

#### Font family

```css
font-family:
  "PingFang SC",
  -apple-system,
  BlinkMacSystemFont,
  "Helvetica Neue",
  "Microsoft YaHei",
  Arial,
  sans-serif;
```

`PingFang SC` is the dominant source font. `Montserrat SemiBold` appears only in isolated numeric/icon details and should not become the general UI font.

#### Type scale

| Token | Size | Weight | Suggested line height | Usage | Confidence |
| --- | ---: | --- | ---: | --- | --- |
| `type.amount.input` | 36 px | Semibold | 45 px | Entered payment amount | Observed |
| `type.amount.placeholder` | 28 px | Regular | 40–45 px | Amount placeholder | Observed |
| `type.amount.result` | 32–36 px | Semibold | 40–45 px | Result amount | Observed |
| `type.keyboard.number` | 28 px | Regular | Auto | Numeric keyboard | Observed |
| `type.page.title` | 17 px | Regular | 24 px | Navigation title | Observed |
| `type.result.title` | 18 px | Regular/Medium | 25 px | Success/failure/processing title | Observed |
| `type.action` | 16 px | Regular | 22 px | Button labels | Observed |
| `type.body` | 14 px | Regular | 20–22 px | Labels, payment methods, details | Observed |
| `type.body.compact` | 12 px | Regular | 18 px | Secondary compact information | Observed |
| `type.caption` | 10 px | Regular | 14 px | Exceptional microcopy only | Observed |

#### Typography rules

- Use Regular for most interface text.
- Use Medium or Semibold only for entered amounts, result amounts, and selected high-emphasis labels.
- Amount digits must be optically aligned with the currency symbol; the symbol may be smaller than the digits.
- Use `14 px` as the default body and field-label size.
- Use `16 px` for actions, never bold by default.
- Use `17 px` for navigation titles.
- Placeholder color is `#999999`.
- Avoid tracking changes in implementation unless matching iOS system text. The Figma source contains small negative letter spacing inherited from platform assets.

### 3.4 Spacing

Use a `4 px` base spacing unit.

| Token | Value | Typical usage |
| --- | ---: | --- |
| `space.1` | 4 px | Title/subtitle grouping |
| `space.1_5` | 6 px | Keyboard grid gap |
| `space.2` | 8 px | Icon-to-label, compact vertical gap |
| `space.2_5` | 10 px | Related content gap |
| `space.3` | 12 px | Card groups, payment-method rows |
| `space.4` | 16 px | Page/card padding, major field gap |
| `space.6` | 24 px | Result sections, button content |
| `space.7` | 28 px | Amount label-to-input separation |
| `space.8` | 32 px | Wide horizontal separation |

Rules:

- Main cards use `16 px` internal padding.
- Form sections are separated by `10–16 px`.
- Related payment-method rows use `12 px` vertical rhythm.
- Numeric-keyboard keys use `6 px` gaps.
- Result icon, title, and amount groups use `16–24 px` gaps.

### 3.5 Radius

| Token | Value | Usage |
| --- | ---: | --- |
| `radius.small` | 6 px | Installment/option cards |
| `radius.medium` | 8 px | Keyboard keys, compact controls |
| `radius.large` | 12 px | Main form and information cards |
| `radius.pill` | 32 px / 999 px | Pill buttons and circular selectors |
| `radius.circle` | 50% | Status icons and radio controls |

Do not use arbitrary radii. Main content cards consistently use `12 px`.

### 3.6 Border and elevation

- Default control border: `1 px solid #C8C9CC`.
- Strong borders should not be used to separate form sections.
- Cards are primarily separated by surface color and spacing.
- Where elevation is needed, use:

```css
box-shadow: 0 0 12px rgba(0, 0, 0, 0.04);
```

- Avoid heavy shadows, colored shadows, and large vertical offsets.
- Background blur is reserved for atmospheric/background artwork and must not reduce text clarity.

---

## 4. Global layout components

### 4.1 Status bar

- Height: `44 px`.
- Uses an iOS-style reference layout.
- Runtime products should use the actual system/browser safe area rather than reproducing a fake status bar.
- Do not place product actions inside the system safe area.

### 4.2 Navigation bar

| Property | Rule |
| --- | --- |
| Height | 44 px |
| Title | Centered, 17 px Regular |
| Back control | Left aligned, minimum 44 × 44 px touch area |
| Background | Transparent or visually merged with the page |

Common titles include “向商户付款”, “扫码结果”, and “支付结果”.

The navigation bar and the first business content block must be separated by `24 px`. Safe-area inset belongs above the navigation bar and is not included in this spacing.

### 4.3 Page background

- Base color: `#F0F0F0`.
- Default asset: `modules/Yilaiqian Checkout Counter/01背景.png` (`563 × 540`, RGBA PNG).
- Apply the asset to payment-entry and payment-result screens from the top center:

```css
background-color: #F0F0F0;
background-image: url("./01背景.png");
background-position: top center;
background-size: 100% auto;
background-repeat: no-repeat;
```

Do not replace this asset with a CSS gradient or an approximate generated image. The keyboard remains `#F0F0F0` so it matches the lower portion of the background.

---

## 5. Component specifications

### 5.1 Main card

| Property | Value |
| --- | --- |
| Width | Container width |
| Background | `#FFFFFF` |
| Radius | `12 px` |
| Padding | `16 px` |
| Default vertical gap | `12–16 px` |
| Shadow | Optional, `0 0 12px rgba(0,0,0,0.04)` |

Use one card per related task group:

- amount and optional fields;
- payment-method selection;
- transaction detail;
- exception detail.

### 5.2 Amount input

Structure:

```text
Field label
Currency symbol + amount value/placeholder
Optional clear action
```

Rules:

- Card height is approximately `143 px` for the simple amount card after applying the lower amount alignment.
- Card padding: `16 px`.
- Field-label text: `14 px`, secondary/neutral.
- Amount row height: approximately `45 px`.
- Move the amount row `16 px` lower than the original baseline so it sits toward the card bottom; preserve at least `16 px` bottom breathing room.
- Currency symbol and amount use strong text color.
- Entered amount: `36 px Semibold`.
- Placeholder: `28 px Regular`, `#999999`.
- Clear control must have a minimum `32 × 32 px` touch target even if its visible icon is smaller.
- The amount field is logically focused on first render and shows a blinking `1 px` caret even before any amount is entered.
- The clear control is absent while the amount is empty. It appears only after the first valid input character and disappears immediately after clearing the amount.
- The amount field accepts numeric content only.
- Prevent multiple decimal separators and more fractional digits than the currency supports.
- Empty and invalid values disable the payment action.

### 5.3 Standard field row

Used for remarks and subject type.

| Property | Rule |
| --- | --- |
| Minimum height | 54 px |
| Horizontal padding | 16 px |
| Label | 14 px, primary text |
| Value/placeholder | 14 px, right or remaining-space aligned |
| Required marker | Error red |
| Radius | 12 px when standalone; inherited when inside a card |

The source remark limit is 30 Chinese characters. Character count and validation should be explicit when the user approaches or exceeds the limit.

### 5.4 Payment-method selector

Container:

- White card.
- Radius: `12 px`.
- Padding: `12 px 16 px`.
- Row rhythm: `12 px`.

Each method row:

- Minimum visual height: `28 px`.
- Minimum touch height: `44 px`.
- Channel icon: approximately `20 px`.
- Icon-to-label gap: `8 px`.
- Label: `14 px Regular`, `#333333`.
- Selection control: `20 × 20 px`, right aligned.
- Selected control: blue fill with white check.
- Unselected control: white fill with `1 px #C8C9CC` border.
- Only one primary payment method can be selected at a time unless the product explicitly supports split payment.

Channel icons must use official assets and must not be redrawn with generic glyphs.

### 5.5 Primary payment action

The payment action appears as the right column of the custom numeric keyboard.

| Property | Value |
| --- | --- |
| Width | Approximately 85 px |
| Height | Approximately 102 px |
| Background | `#0051FF` |
| Radius | `8 px` |
| Label | 16 px Regular, white |
| Disabled opacity | Approximately 45% |

Rules:

- Enabled only when the amount is valid and a payment method is available/selected.
- Prevent double submission after activation.
- Show an immediate processing state after tap.
- Keep the label short. The reference uses “付款”.

### 5.6 Secondary pill action

Used for “完成” and “刷新页面”.

| Property | Value |
| --- | --- |
| Typical size | 103–128 px wide, 40–46 px high |
| Background | `rgba(0,0,0,0.08)` |
| Radius | `32 px` |
| Text | 16 px Regular |

Use only one secondary pill action in a result/error view.

### 5.7 Numeric keyboard

| Property | Value |
| --- | --- |
| Overall height | 230 px |
| Outer width | Full viewport |
| Outer padding | 6 px sides/top, 8 px bottom |
| Grid gap | 6 px |
| Standard key height | 48 px |
| Standard key radius | 8 px |
| Standard number size | 28 px |
| Primary-action column width | 84–85 px |
| Keyboard background | `#F0F0F0`, identical to page background |

Key layout:

```text
1  2  3   Delete
4  5  6   Delete
7  8  9   Pay
   0  .   Pay
```

Implementation rules:

- Use semantic buttons, not static text blocks.
- Implement the amount keyboard with Vant `NumberKeyboard theme="custom"`; use `extra-key="."` and the close-button slot as the single payment action.
- Set `--van-number-keyboard-background` to `#F0F0F0`; do not introduce a separate gray-blue keyboard tray.
- Every key must have a touch target of at least `44 × 44 px`.
- Provide pressed feedback.
- The decimal key should be disabled when the currency does not support fractional units or when a decimal already exists.
- Long-press delete may repeat deletion only if it is technically reliable and cancelable.
- The keyboard must not cover the active form section.

### 5.8 Option/installment card

- Two-column arrangement where space permits.
- Each option card is approximately `156 × 60 px`.
- Gap: `8 px`.
- Padding: `10 px 12 px`.
- Radius: `6 px`.
- Primary line: `14 px`.
- Secondary fee line: `12 px`, secondary text.
- Selected state must use both border/fill and an explicit selection indicator.

### 5.9 Information/detail card

Used for terminal status, terminal number, order number, and similar data.

- Background: white.
- Radius: `12 px`.
- Horizontal padding: `16 px`.
- Label: `14 px`, secondary.
- Value: `14 px`, primary.
- Row height: approximately `20 px` text height plus vertical breathing room.
- Use `8–12 px` between rows.
- Long identifiers must remain selectable and must not wrap in a way that makes them ambiguous.

---

## 6. Page templates

### 6.1 Template A — Payment entry

Required order:

1. System/status area
2. Navigation bar
3. Merchant identity
4. Amount card
5. Optional field rows
6. Payment-method card
7. Promotion/discount hint when applicable
8. Custom numeric keyboard

Variants observed:

- empty amount;
- amount entered;
- remark enabled;
- required remark and subject type;
- merchant + terminal + merchant short name;
- multiple fields;
- installment options;
- amount unit/limit hints.

Immutable structure:

- amount remains the first interactive field;
- payment method appears after transaction fields;
- primary action remains inside or immediately adjacent to the keyboard;
- optional business fields must not appear above merchant identity or navigation.

### 6.2 Template B — Scan exception

Required order:

1. Navigation bar with “扫码结果”
2. Exception illustration/icon
3. Exception title
4. Explanation
5. Structured detail card when diagnostic details are useful

Observed example:

- title: terminal/card unavailable;
- explanation: what the user or merchant needs to do;
- details: terminal status and terminal number.

### 6.3 Template C — Unsupported browser

Required order:

1. Navigation bar
2. Illustration
3. Title
4. Supported-app guidance

Do not show a retry action if retrying in the same browser cannot resolve the problem.

### 6.4 Template D — Recoverable browser error

Required order:

1. Navigation bar
2. Error illustration
3. Plain-language title
4. Brief explanation
5. One recovery action, such as “刷新页面”

Do not expose raw stack traces, status codes, or internal service names.

### 6.5 Template E — Payment result

Required order:

1. Navigation bar with “支付结果”
2. Status icon
3. Status title
4. Amount when available
5. Transaction/order detail card
6. One completion or recovery action

Supported states:

| State | Required content | Primary semantic color |
| --- | --- | --- |
| Success | Success icon, “支付成功”, amount, order number, completion action | Green |
| Failure | Failure icon, “支付失败”, reason or recovery guidance, completion/retry action | Red |
| Processing | Processing indicator, “支付处理中”, explanatory text | Blue |

Processing must not be presented as success. If the final status is unknown, explain how the user can confirm it later.

---

## 7. Interaction and state rules

### 7.1 Amount entry

- Focus is placed on the amount input when entering the payment page.
- The focused empty amount state includes a visible blinking caret. Reduced-motion mode keeps the caret visible without blinking.
- The amount clear action is conditionally rendered only when the amount is non-empty.
- Empty amount → payment action disabled.
- Valid amount → payment action enabled.
- Amount exceeding the limit → show a nearby explicit error and keep action disabled.
- Clearing the amount returns the field to the placeholder state.
- Preserve optional-field values when the user corrects the amount.

### 7.2 Payment-method selection

- Default selection may be applied only when business rules permit it.
- Tapping anywhere in a method row selects it.
- Selection is single-choice.
- Unavailable methods remain visible only if explaining their unavailability helps the user; otherwise hide them.

### 7.3 Submission

- On tap, lock the payment action immediately.
- Show processing feedback within 100 ms.
- Do not allow duplicate transaction creation.
- If the outcome is delayed, route to the processing result rather than displaying a generic error.

### 7.4 Error recovery

- Explain what happened in user language.
- Explain what can be done next.
- Show a retry/refresh action only when it may resolve the issue.
- Preserve transaction identifiers in diagnostic details where appropriate.

### 7.5 Loading

- Use Vant `Overlay` with Vant `Loading type="spinner"` in the processing state; handwritten spinners are forbidden.
- Do not shift the page layout when loading begins.
- Skeleton loading is optional for merchant information but should not be used for a final payment result.
- The loading block includes a title and explanatory text and blocks all payment interactions.

### 7.6 Password confirmation

- Use Vant `Popup position="bottom" round` as the password drawer.
- Use Vant `PasswordInput` with `focused` bound to the open, non-submitting state.
- Use a second Vant `NumberKeyboard` with `maxlength="6"` for password input and deletion.
- Set Vant `PasswordInput gutter="8"`. Render all six items with `#F2F3F5` background, `4 px` radius, and no connected outer border or internal divider lines.
- Closing the Popup clears only the password and preserves amount and payment-method state.

### 7.7 Result action placement

- The result action uses Vant `Button round` and is the only action on the screen.
- Place it at the bottom of the result content column with `margin-top: auto`.
- Move the button `40 px` above the previous safe-area baseline using `calc(max(24px, env(safe-area-inset-bottom)) + 40px)`. On a viewport without a safe-area inset, the bottom gap is `64 px`. Do not use fixed positioning that can cover transaction details.

---

## 8. Accessibility

- Minimum touch target: `44 × 44 px`.
- Body text must not be smaller than `14 px` for core task content.
- Do not encode transaction status using color alone.
- Maintain a minimum contrast ratio of `4.5:1` for normal text.
- Decorative atmospheric gradients must not reduce contrast.
- Every channel icon and status illustration requires an accessible label.
- Numeric-keyboard buttons need clear accessible names, including “删除”, “小数点”, and “付款”.
- The current selection in payment methods must be announced programmatically.
- Focus order must follow the visible task order.
- Error messages must be associated with the relevant field and announced when they appear.

---

## 9. Content guidelines

### 9.1 Tone

- Short, factual, and calm.
- Prefer action-oriented explanations.
- Avoid technical language and blame.

### 9.2 Error-message pattern

```text
What happened
Why it affects the task
What the user can do next
```

Example:

```text
当前浏览器不支持应用
请在微信、支付宝或云闪付 App 内重新扫码。
```

### 9.3 Number and currency formatting

- Place `¥` before the amount.
- Use two fractional digits in result amounts when required by transaction records.
- Keep entered amounts concise; do not add unnecessary trailing zeros while typing.
- Use grouping separators only for sufficiently large amounts and only if product requirements allow them.

---

## 10. Component and token naming

### 10.1 Recommended Figma collections

```text
Primitive
├── Color
├── Spacing
├── Radius
└── Typography

Semantic
├── Background
├── Text
├── Border
├── Action
└── Status
```

### 10.2 Recommended component names

```text
Navigation/Top Bar
Form/Amount Input
Form/Field Row
Selection/Payment Method Row
Selection/Radio
Keyboard/Number Key
Keyboard/Delete Key
Keyboard/Primary Action
Card/Base
Card/Transaction Detail
Card/Installment Option
Feedback/Status Icon
Feedback/Exception Panel
Button/Pill
```

### 10.3 Required variants

```text
Form/Amount Input
state = empty | focused | filled | error | disabled

Selection/Radio
state = unselected | selected | disabled

Keyboard/Primary Action
state = disabled | enabled | loading

Feedback/Status Icon
status = success | failure | processing | warning

Button/Pill
state = default | pressed | disabled | loading
```

---

## 11. AI generation contract

### 11.1 Required reading order

An AI or code-generation agent must read:

1. Product and experience principles
2. Canvas and responsive layout
3. Design tokens
4. Component specifications
5. The selected page template
6. Interaction and accessibility rules

### 11.2 Allowed changes

The following may change per business request:

- merchant, terminal, and store names;
- field labels and required/optional configuration;
- amount limits;
- payment methods;
- promotion and installment content;
- error explanation;
- order and transaction identifiers;
- whether supported optional components are present.

### 11.3 Forbidden changes

Do not change without an explicit design-system revision:

- top system/navigation structure;
- amount-first task hierarchy;
- primary brand color;
- 12 px main-card radius;
- 14 px default body size;
- single-primary-action rule;
- 44 px minimum touch targets;
- payment-result state structure;
- semantic status colors;
- default card padding and page insets;
- payment-channel brand assets.

### 11.4 Generation checks

Before delivery, validate:

- viewport is responsive and safe-area aware;
- there is exactly one dominant action;
- amount entry and payment action states are linked;
- every payment state has icon + title + text;
- disabled and loading states exist;
- no core touch target is below `44 × 44 px`;
- text does not overflow at 200% zoom;
- long merchant names and order numbers are handled;
- card padding, radius, and page insets match the tokens;
- no unapproved color or font is introduced.

---

## 12. Known source-file gaps and recommended next steps

The visual system is coherent, but the Figma file is currently a collection of implemented screens rather than a formal design-system library.

Recommended Figma improvements:

1. Convert the repeated palette, spacing, and radius values into Variables.
2. Create Text Styles for navigation, body, action, amount, and result typography.
3. Convert repeated cards, fields, payment rows, keyboard keys, and result states into Components with variants.
4. Normalize duplicate colors such as `#323233` and `#333333` where their semantic role is the same.
5. Normalize success greens and generic/action blues while preserving third-party channel brand colors.
6. Rename generic nodes such as `Frame 4`, `Frame 51`, and `Frame 74` using the component naming model above.
7. Add interaction annotations for validation, payment submission, failure recovery, and processing timeout.
8. Add responsive examples for narrow Android devices and wider mobile web containers.

Until those improvements are completed, this `DESIGN.md` is the canonical normalized specification for AI-generated pages based on this Figma source.

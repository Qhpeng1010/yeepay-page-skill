# Template 02 Extraction - Dashboard Home

Figma source:
https://www.figma.com/design/Dbic1s0dVVFc3IreKWl26m/%E8%80%81%E6%9D%BF%E7%AE%A1%E8%B4%A6%E5%B8%B8%E7%94%A8%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E9%A1%B5%E9%9D%A2%E6%A2%B3%E7%90%86?node-id=70-10306&m=dev

Figma node: `70:10306`

Figma name: `Dashboard/首页模版`

Status: extracted as home dashboard template

## Canvas

- Frame size: `1440 x 993`
- Uses the locked shell:
  - Top region: `0,0,1440,92`
  - Sider: `0,92,208,901`
  - Multi-tabs: `224,96,542,44`
  - Content: `224,140,1201,841`

## Variables Found

- `主色`: `#F36046`
- `Character/Title .85`: `#000000`
- `Character/Disabled & Placeholder .25`: `#000000`
- `Neutral/1`: `#FFFFFF`
- `Neutral/5`: `#D9D9D9`
- `Color/Neutral/Text/colorTextLabel`: `#000000a6`
- `Dust Red / 6`: `#F5222D`
- `Polar Green / 6`: `#52C41A`
- Body regular: `Roboto`, `14px`, line height `22`, weight `400`
- Footnote description: `Roboto`, `12px`, line height `20`, weight `400`

## Shell State In This Template

Primary nav:

- Selected first-level nav: 首页

Sider:

- Selected second-level menu is expanded.
- First third-level menu is selected.

Tabs:

- Same four-tab structure as the shell baseline.
- Active tab uses selected tab component.

## Content Structure

Content frame: `70:10354`, `x=224`, `y=140`, `w=1201`, `h=841`

### Region 1 - Top Filter Bar

Frame: `70:10355`, `x=0`, `y=0`, `w=1201`, `h=56`

Inner layout:

- Left controls group: `x=16`, `y=12`, `w=388`, `h=32`
  - Select `160 x 32`
  - Select `220 x 32`
  - Gap between selects: `8px`
- Right controls group: `x=740`, `y=12`, `w=444`, `h=32`
  - Quick date text group: 今日, 近7日, 近30日
  - Date field: `256 x 32`
  - Fullscreen icon: `16 x 16`

Rules:

- Filter controls are dashboard scope controls, not a query-list filter area.
- Do not add query buttons unless the Figma template is updated to include them.
- Quick date options and date field belong on the right side.

### Region 2 - Summary And Distribution

Frame: `70:10368`, `x=0`, `y=72`, `w=1201`, `h=359`

Layout:

- Left summary card: `70:10369`, `x=0`, `y=0`, `w=850`, `h=359`
- Right distribution card: `70:10418`, `x=866`, `y=0`, `w=335`, `h=359`
- Gap between cards: `16px`

Left card:

- Title: 交易汇总
- Title position: `x=16`, `y=16`
- Content area: `x=16`, `y=54`, `w=818`, `h=281`
- Contains one primary total Statistic block and a child statistic grid below it.
- Summary capability hard rule: total data is on top; child data is below. The top area contains exactly one primary total metric. The child area uses a grid with at most four columns and at most two rows. A single summary module may contain at most eight child metrics.
- Do not use a left-right split where the primary total metric is on the left and child metrics are on the right. Do not add a third row of child metrics. If more than eight child metrics are required, split them into another white summary module, ranking module, or list module.
- Uses trend indicators below statistics.
- Figma includes a light red/white background treatment in this card. This is allowed only for this template and only in this card.

Right card:

- Title: 交易分布
- Title position: `x=16`, `y=16`
- Toggle texts: 交易额, 交易量
- Chart content: `x=16`, `y=54`, `w=303`, `h=277`
- Uses pie/donut distribution visual with legend.

### Region 3 - Trend And Ranking Grid

Frame: `70:10470`, `x=0`, `y=447`, `w=1201`, `h=394`

Layout:

- Three equal-width cards.
- Card width: approximately `389.67px`
- Card gap: `16px`

Cards:

1. 交易趋势
   - Frame: `70:10471`
   - `x=0`, `y=0`, `w=389.67`, `h=394`
   - Contains chart legend and mixed bar/line chart.
2. 分账趋势
   - Frame: `70:10544`
   - `x=405.67`, `y=0`, `w=389.67`, `h=394`
   - Contains chart legend and mixed bar/line chart.
3. 收入TOP10
   - Frame: `70:10629`
   - `x=811.33`, `y=0.25`, `w=389.67`, `h=393.5`
   - Contains horizontal ranking bar chart.

## Template Rules

- This is a dashboard/home template, not a query-list page.
- It must inherit the locked shell.
- It uses dashboard scope controls, not query-list submit/reset controls.
- It must not add marketing hero, shortcut panels, or extra decorative sections.
- It may use the one visual background treatment already present in the transaction summary card.
- The summary card must use the standard total-and-child statistics layout: one primary total metric on top, child metrics below in a maximum 4-column by 2-row grid, with no more than 8 child metrics.
- It should use chart components or a platform chart wrapper for charts.
- It should keep the 2-row dashboard layout:
  - top filter bar
  - summary/distribution row
  - trend/ranking row

## QA Checklist

- Content frame starts at `x=224`, `y=140`.
- Top filter bar is `56px` high.
- Filter bar has two left selects and right quick-date/date/fullscreen controls.
- First dashboard row starts at `y=72`.
- Summary card is `850 x 359`.
- Summary card total metric is above the child metric grid.
- Summary child metric grid has at most four columns, two rows, and eight child metrics.
- Distribution card is `335 x 359`.
- Row gap and card gap are `16px`.
- Second dashboard row starts at `y=447`.
- Bottom row has three cards of approximately equal width.
- No query-list toolbar, table, pagination, or create button is added.


## Mandatory Generation Contract

- This template is not a reference example; it is the mandatory generation skeleton for its corresponding Boss Ledger page type.
- When generating this class of Boss Ledger page, the AI must reuse this template structure.
- Business requirements may replace business content only; they must not redesign the template skeleton.
- If a business requirement conflicts with this template, the currently selected template and `modules/boss-ledger/design.md` take priority.

## Replacement Rules

Allowed replacement:

- Page / Tab copy
- Primary navigation / left menu copy
- Query fields
- Table columns
- Status enums
- Action buttons
- Form fields
- Detail fields
- Statistic metrics
- Chart data
- Mock data

Forbidden replacement:

- Shell structure
- Top info bar height
- Primary navigation height
- Left navigation width
- Tabs shape
- Content area origin
- Module spacing
- Query area layout
- Table area layout
- Pagination position
- Modal / Drawer / Steps / Result / Empty base structure

## Ant Design Runtime Rules

- Must use real Ant Design components or project wrappers based on Ant Design.
- Must not use native `input`, `select`, `table`, or `button` as substitutes.
- Must not handwrite Menu, Tabs, Pagination, Modal, Drawer, or Table.
- Icons must use Ant Design Icons.
- Charts must use Ant Design Charts or a project chart wrapper.
- All default copy must be localized to Chinese. The preview must not contain `Start date`, `End date`, `OK`, `Cancel`, `No data`, or `items/page`.

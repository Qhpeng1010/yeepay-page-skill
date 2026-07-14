#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';

const args = process.argv.slice(2);
const previewArg = args.find((arg) => !arg.startsWith('--'));
const saveScreenshot = !args.includes('--no-save-screenshot');

if (!previewArg) {
  console.error('Usage: node scripts/validate-boss-ledger-preview.mjs changes/{change-id}/preview.html');
  process.exit(2);
}

const previewPath = isAbsolute(previewArg) ? previewArg : resolve(process.cwd(), previewArg);

const result = {
  validate: [],
  screenshot: [],
  charts: [],
  chineseCopy: [],
};

function pass(group, message) {
  result[group].push({ ok: true, message });
}

function fail(group, message) {
  result[group].push({ ok: false, message });
}

function groupStatus(group) {
  return result[group].every((item) => item.ok) ? 'pass' : 'failed';
}

function stripComments(value) {
  return value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

function fileUrl(filePath) {
  return `file://${filePath.split('/').map(encodeURIComponent).join('/')}`;
}

function appendLocalPreviewScripts(html, previewFile) {
  const sources = [html];
  const baseDir = dirname(previewFile);
  const scriptPattern = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi;
  let match;

  while ((match = scriptPattern.exec(html))) {
    const src = match[1];
    if (/^(?:https?:)?\/\//i.test(src) || src.startsWith('data:') || src.includes('/vendor/') || src.startsWith('./vendor/')) {
      continue;
    }

    const scriptPath = resolve(baseDir, src);
    if (existsSync(scriptPath) && statSync(scriptPath).isFile()) {
      sources.push(readFileSync(scriptPath, 'utf8'));
    }
  }

  return sources.join('\n');
}

function countDeclaredQueryFields(source) {
  const queryFieldsMatch = source.match(/const\s+queryFields\s*=\s*\[([\s\S]*?)\n\s*\];/);
  if (!queryFieldsMatch) {
    return null;
  }

  const keyMatches = queryFieldsMatch[1].match(/\bkey\s*:/g);
  return keyMatches ? keyMatches.length : 0;
}

function findMatchingBracket(source, startIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '/' && next === '/') {
      const lineEnd = source.indexOf('\n', index + 2);
      index = lineEnd === -1 ? source.length : lineEnd;
      continue;
    }

    if (char === '/' && next === '*') {
      const commentEnd = source.indexOf('*/', index + 2);
      index = commentEnd === -1 ? source.length : commentEnd + 1;
      continue;
    }

    if (char === openChar) {
      depth += 1;
    } else if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function extractStepsItemBlocks(source) {
  const blocks = [];
  const stepPattern = /(?:h|React\.createElement)\(\s*Steps\b|<Steps\b/g;
  let match;

  while ((match = stepPattern.exec(source))) {
    const itemsIndex = source.indexOf('items', match.index);
    if (itemsIndex === -1 || itemsIndex - match.index > 5000) continue;

    const openBracket = source.indexOf('[', itemsIndex);
    if (openBracket === -1 || openBracket - itemsIndex > 160) continue;

    const closeBracket = findMatchingBracket(source, openBracket, '[', ']');
    if (closeBracket !== -1) {
      blocks.push(source.slice(openBracket + 1, closeBracket));
    }
  }

  return blocks;
}

function checkSource(html) {
  const source = stripComments(html);

  if (/(react(\.production)?\.min\.js|unpkg\.com\/react|cdn\.jsdelivr\.net\/npm\/react|window\.React\b)/i.test(source)) {
    pass('validate', 'React runtime referenced');
  } else {
    fail('validate', 'React runtime is not referenced');
  }

  if (/(antd(\.min)?\.js|antd-reset\.css|unpkg\.com\/antd|cdn\.jsdelivr\.net\/npm\/antd|window\.antd\b)/i.test(source)) {
    pass('validate', 'Ant Design runtime/style referenced');
  } else {
    fail('validate', 'Ant Design runtime/style is not referenced');
  }

  if (/(ant-design-icons|@ant-design\/icons|icons\.umd|window\.icons\b)/i.test(source)) {
    pass('validate', 'Ant Design Icons referenced');
  } else {
    fail('validate', 'Ant Design Icons are not referenced');
  }

  if (/yeepay-开放平台-DESIGN\.md|YOP\s*\/\s*YeePay Open Platform theme|开放平台-DESIGN/i.test(source)) {
    fail('validate', 'Boss Ledger preview references the YOP theme source');
  } else {
    pass('validate', 'No YOP theme source reference found in Boss Ledger preview');
  }

  const nativeTags = ['input', 'select', 'table', 'button'];
  for (const tag of nativeTags) {
    const pattern = new RegExp(`<\\s*${tag}(\\s|>|/)`);
    if (pattern.test(source)) {
      fail('validate', `Native <${tag}> tag found in preview source`);
    } else {
      pass('validate', `No handwritten native <${tag}> tag in preview source`);
    }
  }

  const englishDefaults = ['Start date', 'End date', 'OK', 'Cancel', 'No data', 'items/page'];
  for (const text of englishDefaults) {
    const pattern = new RegExp(`(^|[^\\w])${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w]|$)`, 'i');
    if (pattern.test(source)) {
      fail('chineseCopy', `English default copy found: ${text}`);
    }
  }
  if (groupStatus('chineseCopy') === 'pass') {
    pass('chineseCopy', 'No blocked English default copy found');
  }

  if (/chart-fallback/i.test(source)) {
    fail('charts', '`chart-fallback` found; formal charts must use Ant Design Charts or the platform chart wrapper');
  } else {
    pass('charts', 'No `chart-fallback` formal chart marker found');
  }

  if (/<\s*img\b[^>]*(class|alt|src)=["'][^"']*logo|<\s*img\b[^>]*(class|alt|src)=[^>]*boss-ledger-logo/i.test(source)) {
    pass('validate', 'Logo is rendered through an img/image asset');
  } else {
    fail('validate', 'Boss Ledger logo must use an img/image asset with logo semantics');
  }

  if (/(specs\/boss logo\.svg|specs\/boss%20logo\.svg|data-boss-logo-source=["']specs\/boss logo\.svg["'])/i.test(source)) {
    pass('validate', 'Boss Ledger logo references the canonical specs logo asset');
  } else {
    fail('validate', 'Boss Ledger logo must reference or copy the canonical `specs/boss logo.svg` asset; custom generated logos are not allowed');
  }

  const contentBorderPattern = /(?:\.(?:content|business|query|filter|table|result|list|stat|summary|chart|workspace|panel|module|card)[^{]{0,80}\{[^}]*border\s*:\s*1px\b)|(?:data-boss-(?:content|query|table|summary|chart)[^>]*style=["'][^"']*border\s*:\s*1px\b)/i;
  if (contentBorderPattern.test(source)) {
    fail('validate', 'Content business module uses `border: 1px`; Boss Ledger modules must be separated by background and 16px spacing');
  } else {
    pass('validate', 'No `border: 1px` detected on content business modules');
  }

  if (/(grid-template-columns\s*:\s*(?:repeat\(\s*3\s*,|[^;]*\s[^;]*\s[^;]*;)|data-boss-query-grid=["']3["'])/i.test(source)) {
    pass('validate', 'Query area declares a three-column grid');
  } else {
    fail('validate', 'Query area must use a three-column grid before placing actions');
  }

  if (/\.footer[^{]*\{[^}]*margin-top\s*:\s*12px(?:\s*;|[^0-9a-z%])/i.test(source)) {
    pass('validate', 'Footer declares required 12px top spacing');
  } else {
    fail('validate', 'Platform footer must declare `.footer { margin-top: 12px; }` as external top spacing');
  }

  if (/(?:const\s+Menu\s*=\s*antd\.Menu|antd\.Menu|<Menu\b|React\.createElement\(\s*Menu\b|ant-menu-inline)/i.test(source)) {
    pass('validate', 'Left navigation uses Ant Design Menu');
  } else {
    fail('validate', 'Left secondary navigation must use Ant Design Menu or a project wrapper based on Ant Design Menu');
  }

  if (/(inlineCollapsed\s*=|inlineCollapsed\s*:)/i.test(source)) {
    pass('validate', 'Left navigation declares collapsible Ant Design Menu state');
  } else {
    fail('validate', 'Left secondary navigation must remain collapsible through Ant Design Menu inlineCollapsed or equivalent controlled state');
  }

  if (/(onOpenChange\s*=|onOpenChange\s*:)/i.test(source)) {
    pass('validate', 'Left navigation wires Ant Design Menu onOpenChange for submenu expand/collapse');
  } else {
    fail('validate', 'Ant Design Menu submenu expand/collapse must be interactive via onOpenChange; do not hard-code openKeys');
  }

  if (/data-boss-sider-collapse/i.test(source)) {
    pass('validate', 'Sider collapse control marker found');
  } else {
    fail('validate', 'Sider collapse / expand control must include `data-boss-sider-collapse`');
  }

  if (/(?:sider-toggle|data-boss-sider-collapse)[\s\S]{0,700}(?:justify-content\s*:\s*flex-start|justifyContent\s*:\s*["']flex-start["']|text-align\s*:\s*left|textAlign\s*:\s*["']left["']|align-items\s*:\s*flex-start|alignItems\s*:\s*["']flex-start["'])/i.test(source)) {
    pass('validate', 'Sider collapse / expand icon is declared left-aligned');
  } else {
    fail('validate', 'Sider collapse / expand icon must be left-aligned, not centered or right-aligned');
  }

  if (/data-boss-tab-static-icon/i.test(source)) {
    pass('validate', 'Static tab-left icon marker found');
  } else {
    fail('validate', 'Every tab label must include a static left icon marked with `data-boss-tab-static-icon`');
  }

  if (/(ReloadOutlined|icons\.ReloadOutlined)/i.test(source)) {
    pass('validate', 'Tab-left static icon uses ReloadOutlined');
  } else {
    fail('validate', 'Tab-left static icon must use Ant Design Icons `ReloadOutlined`');
  }

  if (/(LoadingOutlined|FileDoneOutlined\s+data-boss-tab-static-icon)/i.test(source)) {
    fail('validate', 'Tab-left refresh icon must be ReloadOutlined and must not use loading state or page-type icons');
  } else {
    pass('validate', 'Tab-left refresh icon does not use loading state or page-type icons');
  }

  if (/(<Descriptions\b[^>]*(?:\sbordered\b|bordered\s*=\s*{?\s*true)|React\.createElement\(\s*Descriptions\s*,\s*\{[^}]*bordered\s*:\s*true|className\s*:\s*["'][^"']*detail[^"']*table|data-boss-detail[^>]*bordered)/i.test(source)) {
    fail('validate', 'Detail Descriptions must use the default non-bordered style; table-shaped detail descriptions are not allowed');
  } else {
    pass('validate', 'Detail Descriptions do not use bordered/table-shaped styling');
  }

  const hasStepsUsage = /(?:\bSteps\b|<Steps\b|React\.createElement\(\s*Steps\b|h\(\s*Steps\b)/i.test(source);
  const stepsItemBlocks = extractStepsItemBlocks(source);
  if (hasStepsUsage && stepsItemBlocks.length > 0) {
    const invalidBlocks = stepsItemBlocks.filter((block) => {
      const titleCount = (block.match(/\btitle\s*:/g) || []).length;
      const descriptionCount = (block.match(/\bdescription\s*:/g) || []).length;
      return titleCount > 0 && descriptionCount < titleCount;
    });
    if (invalidBlocks.length === 0) {
      pass('validate', 'Every Boss Ledger Wizard Steps item includes a description');
    } else {
      fail('validate', 'Every Boss Ledger Wizard Steps item must include description; title-only Steps are not allowed');
    }
  } else if (hasStepsUsage) {
    fail('validate', 'Boss Ledger Steps usage must expose an items array whose every item includes description');
  } else {
    pass('validate', 'No Steps usage detected; Steps description rule skipped');
  }

  if (/\b(?:const|let|var)\s+Modal\s*=\s*antd\.Modal\b|antd\.Modal\b|Modal\.confirm\b|<Modal\b|React\.createElement\(\s*Modal\b/i.test(source)) {
    pass('validate', 'Modal uses official Ant Design component structure');
  } else {
    pass('validate', 'No Modal usage detected; official Modal structure check skipped');
  }

  const hasConfirmationCopy = /(提交确认|二次确认|删除确认|停用确认|启用确认|撤销确认|作废确认|确认提交|确认删除|确认停用|确认启用|确认撤销|确认作废)/i.test(source);
  const usesModalConfirm = /\bModal\.confirm\s*\(/i.test(source);
  const usesPopconfirmForConfirm = /\bPopconfirm\b|antd\.Popconfirm\b/i.test(source);
  const usesControlledModalForConfirm = /(?:h\(\s*Modal\b|React\.createElement\(\s*Modal\b|<Modal\b)[\s\S]{0,1200}(提交确认|二次确认|删除确认|停用确认|启用确认|撤销确认|作废确认|确认提交|确认删除|确认停用|确认启用|确认撤销|确认作废)/i.test(source);

  if (hasConfirmationCopy && usesModalConfirm) {
    pass('validate', 'Submit/second-confirmation interactions use Ant Design Modal.confirm');
  } else if (hasConfirmationCopy) {
    fail('validate', 'Submit confirmations and second-confirmation interactions must use Ant Design Modal.confirm');
  } else {
    pass('validate', 'No submit/second-confirmation copy detected; Modal.confirm requirement skipped');
  }

  if (usesPopconfirmForConfirm) {
    fail('validate', 'Boss Ledger submit/second confirmations must not use Popconfirm; use Modal.confirm');
  } else {
    pass('validate', 'No Popconfirm usage detected for Boss Ledger confirmations');
  }

  if (usesControlledModalForConfirm) {
    fail('validate', 'Submit/second confirmations must not be implemented with a normal controlled Modal; use Modal.confirm');
  } else {
    pass('validate', 'No controlled Modal implementation detected for submit/second confirmations');
  }

  if (usesModalConfirm) {
    const confirmBodyHasPadding24 = /\.ant-modal(?:\.[\w-]+)?\.ant-modal-confirm\s+\.ant-modal-body[^{]*\{[^}]*padding\s*:\s*24px\s*!important(?:\s*;|[^0-9a-z%])/i.test(source)
      || /\.ant-modal-confirm(?:\s+[^{]+)?\s+\.ant-modal-body[^{]*\{[^}]*padding\s*:\s*24px\s*!important(?:\s*;|[^0-9a-z%])/i.test(source);
    if (confirmBodyHasPadding24) {
      pass('validate', 'Modal.confirm body hard-codes padding: 24px !important on all sides');
    } else {
      fail('validate', 'Modal.confirm `.ant-modal-body` must hard-code padding: 24px !important on all sides');
    }
  } else {
    pass('validate', 'No Modal.confirm usage detected; confirm body padding rule skipped');
  }

  if (/\.ant-modal(?:\s+[^{]+)?\s+\.ant-modal-content[^{]*\{[^}]*padding\s*:\s*0(?:\s*;|[^0-9a-z%])/i.test(source)) {
    pass('validate', 'Modal content padding is zero so dividers can span full width');
  } else {
    fail('validate', 'Ant Design Modal content must set padding: 0 so header/footer dividers are full width');
  }

  const modalWidthMatches = [...source.matchAll(/<Modal\b[\s\S]{0,500}?\bwidth\s*=\s*(?:{\s*(\d+)\s*}|["'](\d+)["'])/g)].map((match) => Number(match[1] || match[2]));
  const invalidModalWidths = modalWidthMatches.filter((width) => width < 480 || width > 520);
  if (invalidModalWidths.length > 0) {
    fail('validate', `Normal Ant Design form Modal width must stay within 480-520px; found ${invalidModalWidths.join(', ')}`);
  } else if (modalWidthMatches.length > 0) {
    pass('validate', 'Normal Ant Design form Modal width stays within 480-520px');
  } else {
    pass('validate', 'No explicit normal form Modal width detected; width range check skipped');
  }

  if (/\.ant-modal(?:\s+[^{]+)?\s+\.ant-modal-header[^{]*\{[^}]*border-bottom\s*:\s*1px\s+solid\s+(?:var\(--divider\)|#F0F0F0)/i.test(source)) {
    pass('validate', 'Modal header declares required full-width bottom divider');
  } else {
    fail('validate', 'Ant Design Modal header must include a full-width `1px solid #F0F0F0` bottom divider');
  }

  if (/\.ant-modal(?:\s+[^{]+)?\s+\.ant-modal-footer[^{]*\{[^}]*border-top\s*:\s*1px\s+solid\s+(?:var\(--divider\)|#F0F0F0)/i.test(source)) {
    pass('validate', 'Modal footer declares required full-width top divider');
  } else {
    fail('validate', 'Ant Design Modal footer must include a full-width `1px solid #F0F0F0` top divider');
  }

  if (/\.ant-modal(?:\s+[^{]+)?\s+\.ant-modal-body[^{]*\{[^}]*padding\s*:\s*24px\s+24px\s+0(?:\s*;|[^0-9a-z%])/i.test(source)) {
    pass('validate', 'Modal body declares required padding: 24px 24px 0');
  } else {
    fail('validate', 'Ant Design Modal body must use padding: 24px 24px 0');
  }

  const modalFormBlocks = [...source.matchAll(/<Form\b(?=[^>]*className\s*=\s*["'][^"']*modal-form[^"']*["'])[\s\S]*?<\/Form>/g)].map((match) => match[0]);
  const modalLabelIssues = [];
  modalFormBlocks.forEach((block, index) => {
    const labels = [...block.matchAll(/<Form\.Item\b[^>]*\blabel\s*=\s*["']([^"']+)["']/g)].map((match) => match[1].trim());
    if (labels.length <= 1) return;
    const labelLengths = new Set(labels.map((label) => Array.from(label.replace(/\s+/g, '')).length));
    const fixedWidth = /labelCol\s*=\s*{{\s*flex\s*:\s*["']\d+px["']\s*}}/i.test(block);
    const adaptiveWidth = /labelCol\s*=\s*{{\s*flex\s*:\s*["']none["']\s*}}/i.test(block);
    if (labelLengths.size > 1 && !fixedWidth) {
      modalLabelIssues.push(`form ${index + 1} has mixed label lengths but no fixed label width`);
    }
    if (labelLengths.size === 1 && !(fixedWidth || adaptiveWidth)) {
      modalLabelIssues.push(`form ${index + 1} must declare fixed or content-adaptive label width`);
    }
  });
  if (modalLabelIssues.length > 0) {
    fail('validate', `Modal form label width strategy invalid: ${modalLabelIssues.join('; ')}`);
  } else {
    pass('validate', 'Modal form label widths follow mixed-fixed/equal-adaptive strategy');
  }

  if (/(data-boss-query-actions|query-actions|filter-actions)[\s\S]{0,240}(grid-column\s*:\s*(?:3|3\s*\/)|justify-self\s*:\s*end|margin-left\s*:\s*auto|text-align\s*:\s*right)/i.test(source)) {
    pass('validate', 'Query action area is declared at the right side of the three-column grid');
  } else {
    fail('validate', 'Query action area must be in the rightmost column of the three-column grid');
  }

  const declaredQueryFieldCount = countDeclaredQueryFields(source);
  if (declaredQueryFieldCount !== null && declaredQueryFieldCount <= 6) {
    const hasExpandCollapseEntry = /(query-toggle|展\s*开|收\s*起|DownOutlined|UpOutlined)/i.test(source);
    const hasFieldCountGuard = /queryFields\.length\s*>\s*6|queryFields\.length\s*>=\s*7|declaredQueryFieldCount\s*>\s*6|shouldShowQueryToggle/i.test(source);
    if (hasExpandCollapseEntry && !hasFieldCountGuard) {
      fail('validate', 'Query forms with 6 or fewer fields must not render or reserve expand/collapse controls');
    } else {
      pass('validate', 'Query expand/collapse is hidden or guarded for 6-or-fewer-field forms');
    }
    if (declaredQueryFieldCount === 6) {
      const actionSlotIsSeparate = /data-boss-query-action-slot=["']7["']/i.test(source)
        || /query-actions[^,{]*[,{][\s\S]{0,360}(?:grid-row\s*:\s*3|grid-area\s*:[^;}]*3\s*\/\s*3|data-boss-query-actions[^>]*data-boss-query-action-slot=["']7["'])/i.test(source);
      const actionSlotInRightColumn = /(data-boss-query-actions|query-actions|filter-actions)[\s\S]{0,360}grid-column\s*:\s*(?:3|3\s*\/)/i.test(source);
      if (actionSlotIsSeparate && actionSlotInRightColumn) {
        pass('validate', 'Six-field query action area is a separate 7th slot on a new row in the rightmost column');
      } else {
        fail('validate', 'Query forms with exactly 6 fields must render Reset/Search as a separate 7th grid slot on a new row in the rightmost column');
      }
    }
  } else if (declaredQueryFieldCount !== null) {
    if (/(query-toggle|展\s*开|收\s*起|DownOutlined|UpOutlined)/i.test(source)) {
      pass('validate', 'Query forms with more than 6 fields include expand/collapse controls');
    } else {
      fail('validate', 'Query forms with more than 6 fields must include expand/collapse controls');
    }
  } else {
    pass('validate', 'No declarative queryFields array detected; query expand/collapse field-count rule skipped');
  }

  const hasSummary = /(data-boss-query-summary|query-summary|查询统计|Statistic)/i.test(source);
  if (hasSummary) {
    const tableModuleContainsSummary = /(data-boss-table-module|table-module|table-panel|result-module|list-module)[\s\S]{0,3000}(data-boss-query-summary|query-summary|查询统计|Statistic)/i.test(source);
    if (tableModuleContainsSummary) {
      pass('validate', 'Query summary appears inside the table/result module in source order');
    } else {
      fail('validate', 'Query summary must be inside the table/result module, before Table and Pagination');
    }

    const lightweightSummary = /(data-boss-query-summary|query-summary|查询统计)[\s\S]{0,800}(｜|query-summary-divider|结算总笔数|总笔数|总金额)/i.test(source);
    const hasResultTitle = /(toolbar-title|result-title|list-title)[^>]*>[^<]*(查询列表|查询结果|列表数据)|>\s*(查询列表|查询结果|列表数据)\s*</i.test(source);
    if (lightweightSummary && hasResultTitle) {
      fail('validate', 'Lightweight query summary must not be rendered together with the result-section title');
    } else {
      pass('validate', 'Lightweight query summary and result-section title are not rendered together');
    }

    const lightweightSummarySharesToolbar = /className:\s*['"][^'"]*\btoolbar\b[^'"]*['"][\s\S]{0,1600}className:\s*['"]query-summary['"][\s\S]{0,1600}className:\s*['"]toolbar-actions['"]/i.test(source);
    if (lightweightSummary && lightweightSummarySharesToolbar) {
      pass('validate', 'Lightweight query summary shares the toolbar row with right-side actions');
    } else if (lightweightSummary) {
      fail('validate', 'Lightweight query summary must use the original left toolbar-title position and share the same row as right-side actions');
    }
  } else {
    pass('validate', 'No query summary detected; table-module summary placement is not applicable');
  }
}

function runChrome(previewFile) {
  const chrome = findChrome();
  if (!chrome) {
    fail('screenshot', 'Chrome executable not found; set CHROME_PATH or install Chrome/Chromium');
    return null;
  }

  const dir = mkdtempSync(resolve(tmpdir(), 'boss-ledger-preview-'));
  const screenshotPath = saveScreenshot ? resolve(dirname(previewFile), 'preview.screenshot.png') : resolve(dir, 'preview.png');
  const url = fileUrl(previewFile);
  const commonArgs = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--virtual-time-budget=5000',
    '--window-size=1440,900',
  ];

  const screenshotRun = spawnSync(chrome, [...commonArgs, `--screenshot=${screenshotPath}`, url], {
    encoding: 'utf8',
    timeout: 20000,
  });

  if (screenshotRun.error || screenshotRun.status !== 0 || !existsSync(screenshotPath)) {
    fail('screenshot', `Chrome screenshot failed: ${screenshotRun.error?.message || screenshotRun.stderr || 'unknown error'}`.trim());
    rmSync(dir, { recursive: true, force: true });
    return null;
  }

  const dumpRun = spawnSync(chrome, [...commonArgs, '--dump-dom', url], {
    encoding: 'utf8',
    timeout: 20000,
  });

  if (dumpRun.error || dumpRun.status !== 0) {
    fail('screenshot', `Chrome DOM dump failed: ${dumpRun.error?.message || dumpRun.stderr || 'unknown error'}`.trim());
  } else {
    pass('screenshot', 'Chrome rendered DOM successfully');
  }

  return {
    screenshotPath,
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
    renderedDom: dumpRun.stdout || '',
  };
}

function parsePng(filePath) {
  const buffer = readFileSync(filePath);
  if (buffer.readUInt32BE(0) !== 0x89504e47 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('Screenshot is not a PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const inflated = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * channels);
  let input = 0;
  let output = 0;
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[input];
    input += 1;
    const row = Buffer.from(inflated.subarray(input, input + stride));
    input += stride;

    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = prev[x] || 0;
      const upLeft = x >= channels ? prev[x - channels] || 0 : 0;
      let value = row[x];

      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        value = (value + predictor) & 255;
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter ${filter}`);
      }

      row[x] = value;
    }

    row.copy(pixels, output);
    output += stride;
    prev = row;
  }

  return { width, height, channels, pixels };
}

function analyzeScreenshot(screenshotPath) {
  try {
    if (statSync(screenshotPath).size < 20000) {
      fail('screenshot', 'Screenshot file is too small and may be blank');
      return;
    }

    const image = parsePng(screenshotPath);
    const colors = new Set();
    let samples = 0;
    let nonWhite = 0;
    const step = 8;

    for (let y = 0; y < image.height; y += step) {
      for (let x = 0; x < image.width; x += step) {
        const idx = (y * image.width + x) * image.channels;
        const r = image.pixels[idx];
        const g = image.pixels[idx + 1];
        const b = image.pixels[idx + 2];
        colors.add(`${r >> 4},${g >> 4},${b >> 4}`);
        if (!(r > 248 && g > 248 && b > 248)) nonWhite += 1;
        samples += 1;
      }
    }

    if (colors.size < 12 || nonWhite / samples < 0.08) {
      fail('screenshot', 'Screenshot appears blank or nearly blank');
    } else {
      pass('screenshot', 'Screenshot is not blank');
      if (saveScreenshot) pass('screenshot', `Screenshot saved: ${screenshotPath}`);
    }

    const cols = 12;
    const rows = 8;
    let maxBlankRun = 0;

    for (let gy = 0; gy < rows; gy += 1) {
      let run = 0;
      for (let gx = 0; gx < cols; gx += 1) {
        const x0 = Math.floor((gx * image.width) / cols);
        const x1 = Math.floor(((gx + 1) * image.width) / cols);
        const y0 = Math.floor((gy * image.height) / rows);
        const y1 = Math.floor(((gy + 1) * image.height) / rows);
        let count = 0;
        let grayish = 0;
        let sum = 0;
        let sumSq = 0;

        for (let y = y0; y < y1; y += 6) {
          for (let x = x0; x < x1; x += 6) {
            const idx = (y * image.width + x) * image.channels;
            const r = image.pixels[idx];
            const g = image.pixels[idx + 1];
            const b = image.pixels[idx + 2];
            const avg = (r + g + b) / 3;
            if (Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && avg > 224 && avg < 250) grayish += 1;
            sum += avg;
            sumSq += avg * avg;
            count += 1;
          }
        }

        const mean = sum / count;
        const variance = sumSq / count - mean * mean;
        const blankGrayCell = grayish / count > 0.86 && variance < 18;
        run = blankGrayCell ? run + 1 : 0;
        maxBlankRun = Math.max(maxBlankRun, run);
      }
    }

    if (maxBlankRun >= 7) {
      fail('screenshot', 'Screenshot contains a large continuous light-gray blank region');
    } else {
      pass('screenshot', 'No large continuous light-gray blank region detected');
    }
  } catch (error) {
    fail('screenshot', `Screenshot analysis failed: ${error.message}`);
  }
}

function checkRenderedDom(renderedDom) {
  const dom = renderedDom || '';
  if (!dom) return;

  if (/(ReferenceError|TypeError|Script error|Failed to load|Cannot read|404 Not Found|ERR_FILE_NOT_FOUND)/i.test(dom)) {
    fail('screenshot', 'Rendered DOM contains an error or failed-load message');
  } else {
    pass('screenshot', 'Rendered DOM has no obvious error text');
  }

  const shellChecks = [
    ['Boss Ledger top bar', /(data-boss-shell=["']topbar|class=["'][^"']*topbar|Boss Ledger|退出|当前登录)/i],
    ['primary navigation', /(data-boss-shell=["']primary-nav|class=["'][^"']*primary-nav|ant-menu-horizontal|一级导航)/i],
    ['left menu', /(data-boss-shell=["']sider|class=["'][^"']*sider|ant-menu-inline|左侧菜单)/i],
    ['tabs', /(data-boss-shell=["']tabs|ant-tabs|页签|Tabs)/i],
    ['left-aligned sider collapse control', /(data-boss-sider-collapse|class=["'][^"']*sider-toggle)/i],
    ['static tab-left icons', /(data-boss-tab-static-icon|class=["'][^"']*tab-static-icon)/i],
    ['business content', /(data-boss-shell=["']content|data-boss-query-grid|ant-form|ant-table|查询条件|查询列表|业务内容)/i],
  ];

  for (const [label, pattern] of shellChecks) {
    if (pattern.test(dom)) {
      pass('screenshot', `First viewport contains ${label}`);
    } else {
      fail('screenshot', `First viewport must contain ${label}`);
    }
  }

  const renderedMarkup = dom.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const tabStaticIconCount = (renderedMarkup.match(/data-boss-tab-static-icon/g) || []).length;
  if (tabStaticIconCount === 1) {
    pass('screenshot', 'Only the active tab renders the static ReloadOutlined icon');
  } else {
    fail('screenshot', `Exactly one active tab static ReloadOutlined icon is required; found ${tabStaticIconCount}`);
  }
}

if (!existsSync(previewPath)) {
  console.error(`preview.html not found: ${previewPath}`);
  process.exit(2);
}

const html = readFileSync(previewPath, 'utf8');
checkSource(appendLocalPreviewScripts(html, previewPath));

const rendered = runChrome(previewPath);
if (rendered) {
  analyzeScreenshot(rendered.screenshotPath);
  checkRenderedDom(rendered.renderedDom);
  rendered.cleanup();
}

const statuses = {
  validate: groupStatus('validate'),
  screenshot: groupStatus('screenshot'),
  charts: groupStatus('charts'),
  '中文文案': groupStatus('chineseCopy'),
};
const overall = Object.values(statuses).every((status) => status === 'pass') ? 'pass' : 'failed';

console.log(`validate: ${statuses.validate}`);
console.log(`screenshot: ${statuses.screenshot}`);
console.log(`charts: ${statuses.charts}`);
console.log(`中文文案: ${statuses['中文文案']}`);
console.log(`overall: ${overall}`);
console.log('');
console.log('details:');

for (const [group, checks] of Object.entries(result)) {
  for (const check of checks) {
    console.log(`- ${check.ok ? 'pass' : 'failed'} [${group}]: ${check.message}`);
  }
}

process.exit(overall === 'pass' ? 0 : 1);

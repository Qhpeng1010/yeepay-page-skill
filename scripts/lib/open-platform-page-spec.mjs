import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

export const ROOT = resolve(new URL('../..', import.meta.url).pathname);
export function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }
export function loadPolicy(root = ROOT) { return readJson(resolve(root, 'modules/open-platform/execution/generation-policy.json')); }
export function pageSpecHash(spec) { return createHash('sha256').update(`${JSON.stringify(spec, null, 2)}\n`).digest('hex'); }

const issue = (errors, condition, message) => { if (!condition) errors.push(message); };
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const unique = (values) => new Set(values).size === values.length;

function knownRuleIds(root) {
  const dir = resolve(root, 'modules/open-platform/director-rules');
  return new Set(['01-visual-constitution.md', '02-template-application-rules.md', '03-interaction-acceptance-rules.md']
    .flatMap((file) => readFileSync(resolve(dir, file), 'utf8').match(/OP-(?:VIS|TPL|INT)-\d{3}/g) || []));
}

function validateNavigation(errors, source, anchors, capabilities, prefix) {
  ['title', 'summary', 'scope', 'previous', 'next'].forEach((key) => issue(errors, text(source?.[key]), `${prefix}.${key} is required.`));
  issue(errors, Array.isArray(source?.flow) && source.flow.length >= 3, `${prefix}.flow requires at least three steps.`);
  issue(errors, Array.isArray(source?.sidebar) && source.sidebar.length > 0, `${prefix}.sidebar is required.`);
  const sideItems = (source?.sidebar || []).flatMap((group) => group.items || []);
  issue(errors, sideItems.length > 0 && sideItems.every((item) => text(item.key) && text(item.label) && anchors.has(item.anchor)), `${prefix}.sidebar items require key, label and a valid anchor.`);
  issue(errors, sideItems.filter((item) => item.current).length === 1, `${prefix}.sidebar requires exactly one current item.`);
  issue(errors, Array.isArray(source?.toc) && source.toc.length >= 3, `${prefix}.toc requires at least three anchors.`);
  (source?.toc || []).forEach((item, index) => issue(errors, text(item?.label) && anchors.has(item?.anchor), `${prefix}.toc[${index}] has an unsupported anchor.`));
  issue(errors, capabilities.includes('docs.navigation') && capabilities.includes('docs.anchors'), `${prefix} requires docs.navigation and docs.anchors.`);
}

function validateApiDocument(errors, doc, capabilities) {
  const anchors = new Set(['overview', 'parameters', 'request-example', 'response-example', 'error-guide']);
  validateNavigation(errors, doc, anchors, capabilities, 'document');
  issue(errors, text(doc?.overview), 'document.overview is required.');
  issue(errors, Array.isArray(doc?.parameters) && doc.parameters.length > 0, 'document.parameters are required.');
  (doc?.parameters || []).forEach((item, index) => issue(errors, text(item?.name) && text(item?.type) && typeof item?.required === 'boolean' && text(item?.description), `document.parameters[${index}] is incomplete.`));
  ['request', 'response'].forEach((key) => issue(errors, text(doc?.[key]?.language) && text(doc?.[key]?.code), `document.${key}.language and code are required.`));
  issue(errors, capabilities.includes('docs.code') && capabilities.includes('docs.copyCode'), 'Request and response examples require docs.code and docs.copyCode.');
  issue(errors, Array.isArray(doc?.errors) && doc.errors.length > 0, 'document.errors are required.');
  (doc?.errors || []).forEach((item, index) => issue(errors, text(item?.code) && text(item?.message) && text(item?.action), `document.errors[${index}] is incomplete.`));
  issue(errors, capabilities.includes('docs.errorGuide'), 'Error content requires docs.errorGuide.');
  issue(errors, capabilities.includes('docs.parameterTable') && capabilities.includes('docs.previousNext'), 'Document requires parameter table and previous/next navigation.');
}

function validateIntegrationGuide(errors, guide, capabilities) {
  issue(errors, Array.isArray(guide?.steps) && guide.steps.length >= 3, 'guide.steps requires at least three task steps.');
  const anchors = new Set((guide?.steps || []).map((step) => step.key));
  issue(errors, anchors.size === (guide?.steps || []).length, 'guide step keys must be unique.');
  (guide?.steps || []).forEach((step, index) => {
    issue(errors, text(step?.key) && text(step?.title) && text(step?.summary), `guide.steps[${index}] requires key, title and summary.`);
    issue(errors, Array.isArray(step?.checklist) && step.checklist.length > 0 && step.checklist.every(text), `guide.steps[${index}].checklist is required.`);
    if (step?.code) issue(errors, text(step.code.language) && text(step.code.code), `guide.steps[${index}].code is incomplete.`);
  });
  issue(errors, (guide?.steps || []).some((step) => step.code), 'guide requires at least one configuration or request code example.');
  validateNavigation(errors, guide, anchors, capabilities, 'guide');
  issue(errors, capabilities.includes('docs.flow') && capabilities.includes('docs.code') && capabilities.includes('docs.copyCode') && capabilities.includes('docs.previousNext'), 'Integration guide requires flow, code, copy and previous/next capabilities.');
}

export function validatePageSpec(spec, { root = ROOT, strictGovernance = true } = {}) {
  const errors = [];
  issue(errors, spec && typeof spec === 'object' && !Array.isArray(spec), 'Page Spec must be an object.');
  if (!spec || typeof spec !== 'object') return errors;
  const allowed = new Set(['schemaVersion', 'metadata', 'ui', 'content', 'document', 'guide', 'states']);
  Object.keys(spec).filter((key) => !allowed.has(key)).forEach((key) => errors.push(`Unsupported top-level Page Spec key: ${key}.`));
  issue(errors, spec.schemaVersion === 1, 'schemaVersion must be 1.');
  issue(errors, /^\d{8}-[a-z0-9-]+$/.test(spec.metadata?.changeId || ''), 'metadata.changeId must use YYYYMMDD-lowercase-slug.');
  issue(errors, text(spec.metadata?.pageName), 'metadata.pageName is required.');
  issue(errors, text(spec.metadata?.request), 'metadata.request is required.');
  const family = spec.metadata?.family;
  issue(errors, ['api-document', 'integration-guide'].includes(family), 'metadata.family is unsupported.');
  issue(errors, text(spec.metadata?.templateId), 'metadata.templateId is required.');
  issue(errors, spec.ui?.system === 'open-platform', 'ui.system must be open-platform.');
  issue(errors, spec.ui?.runtime === 'open-platform-page-spec', 'ui.runtime must be open-platform-page-spec.');
  issue(errors, spec.ui?.rendererVersion === 1, 'ui.rendererVersion must be 1.');
  const policy = loadPolicy(root); const entry = policy.families.find((item) => item.id === family);
  issue(errors, Boolean(entry), `No generation policy for ${family || '<empty>'}.`);
  if (entry && strictGovernance) { issue(errors, entry.availability === 'available', `${family} is ${entry.availability}.`); issue(errors, entry.mode !== 'legacy', `${family} is configured for legacy.`); }
  const capabilities = spec.content?.capabilities;
  issue(errors, Array.isArray(capabilities) && unique(capabilities), 'content.capabilities must be a unique array.');
  if (entry && Array.isArray(capabilities) && strictGovernance) { const allow = new Set(entry.capabilities); capabilities.filter((item) => !allow.has(item)).forEach((item) => errors.push(`Unsupported ${family} capability: ${item}.`)); }
  const refs = spec.metadata?.ruleRefs;
  issue(errors, Array.isArray(refs) && refs.length > 0 && unique(refs), 'metadata.ruleRefs must be a non-empty unique array.');
  if (Array.isArray(refs)) refs.filter((ref) => !knownRuleIds(root).has(ref)).forEach((ref) => errors.push(`Unknown Director Rule ID: ${ref}.`));
  if (family === 'api-document') validateApiDocument(errors, spec.document, capabilities || []);
  if (family === 'integration-guide') validateIntegrationGuide(errors, spec.guide, capabilities || []);
  return errors;
}

export function generatedPreviewApp(spec) { return `// Derived from page-spec.json. Do not edit.\n// page-spec-sha256: ${pageSpecHash(spec)}\nwindow.OpenPlatformPageSpecRuntime.mount(${JSON.stringify(spec, null, 2).replace(/<\//g, '<\\/')});\n`; }
export function assertChangeSpecPath(root, specPath) { const absolute = resolve(root, specPath); const changes = resolve(root, 'changes'); if (!absolute.startsWith(`${changes}/`) || basename(absolute) !== 'page-spec.json' || !existsSync(absolute)) throw new Error('Page Spec must be an existing changes/{change-id}/page-spec.json file.'); return absolute; }

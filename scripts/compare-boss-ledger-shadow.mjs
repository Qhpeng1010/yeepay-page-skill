#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { assertChangeSpecPath, readJson, validatePageSpec } from './lib/boss-ledger-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
if (!specArg) {
  console.error('Usage: node scripts/compare-boss-ledger-shadow.mjs changes/{change-id}/page-spec.json');
  process.exit(2);
}

try {
  const root = process.cwd();
  const specPath = assertChangeSpecPath(root, specArg);
  const changeDir = dirname(specPath);
  const snapshotPath = resolve(changeDir, 'legacy-semantic-snapshot.json');
  if (!existsSync(snapshotPath)) throw new Error('legacy-semantic-snapshot.json is missing.');
  const spec = readJson(specPath);
  const snapshot = readJson(snapshotPath);
  const errors = validatePageSpec(spec, { root });
  if (errors.length) throw new Error(errors.join('\n'));

  const actual = {
    family: spec.metadata.family,
    templateId: spec.metadata.templateId,
    queryFields: (spec.list?.query?.fields || []).map((field) => field.key),
    tableColumns: (spec.list?.table?.columns || []).map((column) => column.key),
    rowActions: (spec.list?.table?.rowActions || []).map((action) => action.key),
    states: Object.keys(spec.states || {}),
    requiredCapabilities: spec.content.capabilities
  };
  const compareKeys = ['family', 'templateId', 'queryFields', 'tableColumns', 'rowActions', 'states', 'requiredCapabilities'];
  const comparisons = compareKeys.map((key) => {
    const baseline = snapshot[key];
    const approvedAdditions = snapshot.approvedAdditions?.[key] || [];
    if (approvedAdditions.length && !Array.isArray(baseline)) throw new Error(`approvedAdditions.${key} requires an array baseline.`);
    if (approvedAdditions.some((value) => baseline.includes(value))) throw new Error(`approvedAdditions.${key} duplicates a baseline value.`);
    const expected = approvedAdditions.length ? [...baseline, ...approvedAdditions] : baseline;
    return {
      key,
      baseline,
      approvedAdditions,
      expected,
      actual: actual[key],
      match: JSON.stringify(expected) === JSON.stringify(actual[key])
    };
  });
  const passed = comparisons.every((entry) => entry.match);
  const report = {
    schemaVersion: 1,
    source: snapshot.source,
    pageSpec: relative(root, specPath),
    result: passed ? 'pass' : 'failed',
    comparisons
  };
  writeFileSync(resolve(changeDir, 'shadow-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  const markdown = `# Shadow Comparison: ${spec.metadata.pageName}\n\n整体结果：${report.result}\n\n| Contract | Legacy semantic snapshot | Approved additions | Page Spec | Result |\n| --- | --- | --- | --- | --- |\n${comparisons.map((entry) => `| ${entry.key} | ${JSON.stringify(entry.baseline)} | ${JSON.stringify(entry.approvedAdditions)} | ${JSON.stringify(entry.actual)} | ${entry.match ? 'pass' : 'failed'} |`).join('\n')}\n`;
  writeFileSync(resolve(changeDir, 'shadow-report.md'), markdown);
  if (!passed) throw new Error('Shadow semantic comparison failed.');
  console.log(`shadow-comparison: pass (${relative(root, specPath)})`);
  console.log(`- contracts compared: ${comparisons.length}`);
} catch (error) {
  console.error(`shadow-comparison: failed\n- ${error.message}`);
  process.exit(1);
}

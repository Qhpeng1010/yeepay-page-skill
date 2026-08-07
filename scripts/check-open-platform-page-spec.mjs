#!/usr/bin/env node
import { assertChangeSpecPath, readJson, validatePageSpec } from './lib/open-platform-page-spec.mjs';
const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
const flexible = process.argv.includes('--flexible');
if (!specArg) { console.error('Usage: node scripts/check-open-platform-page-spec.mjs changes/{change-id}/page-spec.json'); process.exit(2); }
try { const root = process.cwd(); const path = assertChangeSpecPath(root, specArg); const errors = validatePageSpec(readJson(path), { root, strictGovernance: !flexible }); if (errors.length) throw new Error(errors.join('\n')); console.log(`open-platform-page-spec-contract: pass (${specArg})`); if (flexible) console.log('- governance: flexible natural-generation mode'); } catch (error) { console.error(`FAIL: ${error.message}`); process.exit(1); }

#!/usr/bin/env node
import { resolve } from 'node:path';
import { assertChangeSpecPath, readJson, validatePageSpec } from './lib/boss-ledger-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
if (!specArg) {
  console.error('Usage: node scripts/check-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json');
  process.exit(2);
}

try {
  const root = process.cwd();
  const specPath = assertChangeSpecPath(root, specArg);
  const errors = validatePageSpec(readJson(specPath), { root });
  if (errors.length) {
    errors.forEach((error) => console.error(`FAIL: ${error}`));
    process.exit(1);
  }
  console.log(`page-spec-contract: pass (${specArg})`);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}

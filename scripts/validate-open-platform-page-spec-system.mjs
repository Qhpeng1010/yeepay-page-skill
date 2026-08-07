#!/usr/bin/env node
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const steps = [['skill-integrity','scripts/check-yeepay-skill-integrity.mjs',[]],['progressive-structure','scripts/validate-progressive-structure.mjs',[]],['contract-regression','scripts/test-open-platform-page-spec-contract.mjs',[]],['generation-flow','scripts/test-open-platform-generation-flow.mjs',[]]];
for (const [label, script, args] of steps) { const result = spawnSync(process.execPath,[resolve(root,script),...args],{cwd:root,encoding:'utf8',stdio:'inherit'}); if (result.status !== 0) { console.error(`open-platform-page-spec-system: failed at ${label}`); process.exit(result.status || 1); } }
console.log('open-platform-page-spec-system: pass');

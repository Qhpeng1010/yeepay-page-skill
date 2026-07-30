#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const changeDir = process.argv[2];
if (!changeDir) { console.error('Usage: node scripts/scaffold-open-platform-page-spec.mjs changes/{change-id}'); process.exit(2); }
const root = process.cwd(); const target = resolve(root, changeDir); const changeId = target.split('/').pop(); mkdirSync(target, { recursive: true });
const source = { schemaVersion: 1, metadata: { changeId, pageName: '开放平台 API 文档', family: 'api-document', templateId: 'api-detail', ruleRefs: ['OP-TPL-001', 'OP-TPL-002', 'OP-INT-002'] }, ui: { system: 'open-platform', runtime: 'open-platform-page-spec', rendererVersion: 1 }, content: { capabilities: ['docs.navigation', 'docs.anchors', 'docs.code', 'docs.copyCode', 'docs.parameterTable', 'docs.errorGuide', 'docs.previousNext'] }, document: {} };
writeFileSync(resolve(target, 'page-spec.json'), `${JSON.stringify(source, null, 2)}\n`); writeFileSync(resolve(target, 'rules-read.md'), '# Rules Read\n\n- Open Platform Director Rules\n- Open Platform API document context\n'); console.log(`open-platform-page-spec-scaffold: pass (${changeDir})`);

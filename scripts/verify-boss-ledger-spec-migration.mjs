#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const root = process.cwd();
const sourcePath = resolve(root, 'modules/boss-ledger/boss-design.md');
if (!existsSync(sourcePath)) {
  const targets = ['modules/boss-ledger/design.md', 'modules/boss-ledger/business-rules.md'];
  const sourceMarkers = targets.map((file) => readFileSync(resolve(root, file), 'utf8').match(/来源文件 SHA-256：`([a-f0-9]{64})`/)?.[1]).filter(Boolean);
  if (sourceMarkers.length === targets.length && new Set(sourceMarkers).size === 1) {
    console.error('boss-design.md is missing from the workspace; target files retain the same complete-source hash marker. Restore the source file before running a fresh migration.');
    process.exit(2);
  }
  console.error('boss-design.md is missing and target files do not share a complete-source hash marker.');
  process.exit(1);
}
const source = readFileSync(sourcePath, 'utf8');
const sourceHash = createHash('sha256').update(source).digest('hex');
const targets = [
  'modules/boss-ledger/design.md',
  'modules/boss-ledger/business-rules.md'
].map((file) => ({ file, source: readFileSync(resolve(root, file), 'utf8') }));
const matches = [...source.matchAll(/^## (.+)$/gm)];
const sections = matches.map((match, index) => source.slice(match.index, matches[index + 1]?.index ?? source.length).trim());
const headings = matches.map((match) => match[1]);
const missing = headings.filter((heading) => !targets.some(({ source: target }) => target.includes(`## ${heading}`)));
const incomplete = sections.filter((section) => !targets.some(({ source: target }) => target.includes(section)));
const stale = targets.filter(({ source: target }) => !target.includes(sourceHash)).map(({ file }) => file);

console.log(`boss-design.md sha256:${sourceHash}`);
console.log(`source sections: ${headings.length}`);
if (missing.length) {
  console.error(`missing sections: ${missing.join(', ')}`);
  process.exit(1);
}
if (incomplete.length) {
  console.error(`incomplete source sections: ${incomplete.map((section) => section.match(/^## (.+)$/)?.[1]).join(', ')}`);
  process.exit(1);
}
if (stale.length) {
  console.error(`missing source hash marker: ${stale.join(', ')}`);
  process.exit(1);
}
console.log('targets: design.md, business-rules.md');
console.log('migration coverage: pass');

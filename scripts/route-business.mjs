#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(ROOT, '.cache/yeepay-skill');
const CACHE_PATH = path.join(CACHE_DIR, 'route-results.json');

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function readRegistry() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'references', 'registry.yaml'), 'utf8'));
}

function requestFingerprint(request, registryStat) {
  return crypto.createHash('sha256')
    .update(`${registryStat.mtimeMs}:${registryStat.size}:${request}`)
    .digest('hex');
}

function scoreModule(request, module) {
  const matches = (module.aliases || []).filter((alias) => request.includes(normalize(alias)));
  const exclusions = (module.exclusions || []).filter((alias) => request.includes(normalize(alias)));
  const score = matches.reduce((total, alias) => total + Math.max(3, normalize(alias).length), 0)
    - exclusions.reduce((total, alias) => total + Math.max(5, normalize(alias).length), 0);
  return { module, score, matches, exclusions };
}

export function routeBusiness(rawRequest) {
  const request = normalize(rawRequest);
  if (!request) {
    return { status: 'unmatched', question: '请提供需要生成、更新或评审的页面需求。' };
  }

  const registryPath = path.join(ROOT, 'references', 'registry.yaml');
  const registryStat = fs.statSync(registryPath);
  const fingerprint = requestFingerprint(request, registryStat);
  let cache = {};
  try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch { cache = {}; }
  if (cache[fingerprint]) return { ...cache[fingerprint], cache: 'hit', fingerprint };
  const registry = readRegistry();
  const ranked = registry.modules
    .map((module) => scoreModule(request, module))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || b.module.priority - a.module.priority);

  if (!ranked.length) {
    const fallback = registry.modules.find((module) => module.id === 'boss-ledger');
    const result = {
      status: 'routed',
      module: fallback.id,
      name: fallback.name,
      confidence: 'default',
      assumption: '需求未指定平台，按 Boss Ledger 处理。',
      matches: [],
      domain: fallback.domain,
      contract: fallback.contract
    };
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    cache[fingerprint] = result;
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
    return { ...result, cache: 'miss', fingerprint };
  }

  const [first, second] = ranked;
  if (second && first.score === second.score) {
    const result = {
      status: 'clarify',
      question: `需求同时命中 ${first.module.name} 和 ${second.module.name}，请确认页面所属产品。`,
      candidates: ranked.slice(0, 3).map(({ module, matches }) => ({ id: module.id, name: module.name, matches }))
    };
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    cache[fingerprint] = result;
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
    return { ...result, cache: 'miss', fingerprint };
  }

  const result = {
    status: 'routed',
    module: first.module.id,
    name: first.module.name,
    confidence: first.score >= 10 ? 'high' : 'medium',
    matches: first.matches,
    domain: first.module.domain,
    contract: first.module.contract
  };
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  cache[fingerprint] = result;
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
  return { ...result, cache: 'miss', fingerprint };
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const result = routeBusiness(readArg('--request'));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = result.status === 'routed' ? 0 : 2;
}

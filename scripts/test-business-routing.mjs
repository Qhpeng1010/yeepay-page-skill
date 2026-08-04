#!/usr/bin/env node
import assert from 'node:assert/strict';
import { routeBusiness } from './route-business.mjs';
import { resolveResources } from './resolve-resources.mjs';

const ambiguous = routeBusiness('运营人员查询商户，支持高级查询');
assert.equal(ambiguous.status, 'clarify');
assert.match(ambiguous.question, /老板管账.*易账通.*易宝开放平台/);
assert.deepEqual(ambiguous.candidates.map(({ id }) => id), ['boss-ledger', 'easy-account', 'open-platform']);

const unresolved = resolveResources('创建一个查询列表页面', 'generate');
assert.equal(unresolved.status, 'clarify');

assert.equal(routeBusiness('创建老板管账的商户查询列表').module, 'boss-ledger');
assert.equal(routeBusiness('创建易账通的账户查询列表').module, 'easy-account');
assert.equal(routeBusiness('创建易宝开放平台的 API 文档').module, 'open-platform');
assert.equal(routeBusiness('老板管账和易账通都要支持这个页面').status, 'clarify');

console.log('business-routing: pass');

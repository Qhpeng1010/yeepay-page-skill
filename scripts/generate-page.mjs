#!/usr/bin/env node
import { resolveResources } from './resolve-resources.mjs';
import { generateBossLedgerPage } from './generate-boss-ledger-page.mjs';
import { generateEasyAccountPage } from './generate-easy-account-page.mjs';

const args = process.argv.slice(2);
const textOutput = args.includes('--text');

function arg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

function print(result) {
  if (!textOutput) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  console.log(`page-generation-entry: ${result.status}`);
  console.log(`- ${result.reason}`);
  if (result.question) console.log(`- question: ${result.question}`);
  if (typeof result.recipe === 'string') console.log(`- recipe: ${result.recipe}`);
  if (result.recipeName && result.recipeName !== result.recipe) console.log(`- recipe: ${result.recipeName}`);
  if (result.fallbackReason) console.log(`- fallback: ${result.fallbackReason}`);
  if (result.change) console.log(`- change: ${result.change}`);
  if (result.preview) console.log(`- preview: ${result.preview}`);
  if (result.review) console.log(`- review: ${result.review}`);
  if (Number.isInteger(result.elapsedMs)) console.log(`- elapsed: ${result.elapsedMs}ms`);
}

function routeSummary(route) {
  return {
    module: route.module,
    intent: route.intent,
    pageType: route.pageType,
    template: route.template,
    family: route.execution?.family,
    availability: route.execution?.availability,
    mode: route.execution?.mode,
    renderable: route.execution?.renderable,
    intents: route.intents || [],
    families: route.families || [],
    composition: Boolean(route.composition)
  };
}

function supportsRecipe(route) {
  if (route.module === 'boss-ledger') {
    return ['query-list', 'inline-summary-list', 'card-summary-list', 'wizard'].includes(route.intent);
  }
  return route.module === 'easy-account' && route.intent === 'query-list';
}

function contextQuestion(route) {
  if (route.intent === 'empty-state' && !route.composition) {
    return '空状态必须依附具体业务页面，请补充它属于哪个列表、表单、详情或看板页面，以及用户可执行的恢复操作。';
  }
  if (route.intent === 'result' && !route.composition) {
    return '结果反馈必须依附业务流程，请补充它由哪个操作触发，以及完成后返回哪里。';
  }
  return null;
}

function executeRecipe(request, route, timingContext) {
  if (route.module === 'boss-ledger') return generateBossLedgerPage({ request, route, timingContext });
  if (route.module === 'easy-account') return generateEasyAccountPage({ request, route, timingContext });
  return null;
}

function main() {
  const started = Date.now();
  const request = arg('--request');
  const recipeMode = arg('--recipe') || 'off';
  if (args.includes('--json') && textOutput) {
    throw new Error('--json and --text cannot be used together.');
  }
  if (!request || !['off', 'auto'].includes(recipeMode)) {
    throw new Error('Usage: node scripts/generate-page.mjs --request "<business request>" [--recipe off|auto] [--text]');
  }

  // The request is routed once. Natural-language generation owns the page plan;
  // a recipe is exposed only as an explicit, optional compiler afterwards.
  const routeStarted = Date.now();
  const route = resolveResources(request, 'generate');
  const routeMs = Date.now() - routeStarted;
  if (route.status !== 'resolved') {
    const totalMs = Date.now() - started;
    print({
      status: route.status,
      outcome: route.status,
      recipeName: null,
      fallbackReason: route.question || '无法确定业务域或页面意图。',
      timings: { routeMs, totalMs },
      elapsedMs: totalMs,
      reason: route.question || '无法确定业务域或页面意图。',
      question: route.question,
      candidates: route.candidates || []
    });
    return;
  }

  const question = contextQuestion(route);
  if (question) {
    const totalMs = Date.now() - started;
    print({
      status: 'clarify',
      outcome: 'clarify',
      recipeName: null,
      fallbackReason: question,
      timings: { routeMs, totalMs },
      elapsedMs: totalMs,
      route: routeSummary(route),
      reason: question,
      question
    });
    return;
  }

  if (route.execution && route.execution.renderable === false) {
    const totalMs = Date.now() - started;
    const reason = `“${route.pageType}”当前缺少可执行的规格与渲染器实现，无法生成可验收预览。`;
    print({
      status: 'blocked',
      outcome: 'blocked',
      recipeName: null,
      fallbackReason: reason,
      timings: { routeMs, totalMs },
      elapsedMs: totalMs,
      route: routeSummary(route),
      reason
    });
    return;
  }

  let recipeAttempt;
  const recipeUnavailable = recipeMode === 'auto' && route.execution?.availability !== 'available';
  if (recipeMode === 'auto' && supportsRecipe(route) && !recipeUnavailable) {
    recipeAttempt = executeRecipe(request, route, { startedAt: started, routeMs });
    if (recipeAttempt?.status === 'generated') {
      print({
        ...recipeAttempt,
        route: routeSummary(route),
        reason: `${recipeAttempt.reason} 快速配方、构建和静态预检已在统一入口内完成。`
      });
      return;
    }
    if (recipeAttempt?.status === 'clarify' || recipeAttempt?.status === 'blocked') {
      print(recipeAttempt);
      return;
    }
  }
  const totalMs = Date.now() - started;
  const fallbackReason = recipeUnavailable
    ? `当前能力状态为 ${route.execution?.availability || 'unknown'}，严格配方未执行，已转入自然语言生成。`
    : recipeAttempt?.fallbackReason || recipeAttempt?.reason || null;
  const warnings = [];
  if (route.composition) warnings.push('当前需求包含多个页面意图，已在同一次路由中合并所需规则资源。');
  if (route.execution?.availability !== 'available') {
    warnings.push(`当前能力状态为 ${route.execution?.availability || 'unknown'}；自然语言生成继续执行，交付结果需人工验收。`);
  }
  if (route.execution?.mode === 'legacy') warnings.push('当前登记运行模式为 legacy；自然语言生成使用宽松治理模式并要求人工验收。');
  print({
    status: 'natural-generation',
    outcome: 'natural-generation',
    recipeName: null,
    fallbackReason,
    route: routeSummary(route),
    resources: route.resources,
    commands: route.commands,
    warnings,
    ...(recipeAttempt ? { recipeAttempt: { status: recipeAttempt.status, reason: recipeAttempt.reason } } : {}),
    timings: {
      routeMs,
      ...(recipeAttempt?.timings?.classifyMs !== undefined ? { classifyMs: recipeAttempt.timings.classifyMs } : {}),
      totalMs
    },
    elapsedMs: totalMs,
    reason: '已完成单次路由。读取返回的最小规则资源后，用原始需求生成页面规格，再依次执行需求覆盖、契约、构建和静态预检。'
  });
}

try {
  main();
} catch (error) {
  print({
    status: 'failed',
    outcome: 'failed',
    recipeName: null,
    fallbackReason: error.message,
    reason: error.message
  });
  process.exitCode = 1;
}

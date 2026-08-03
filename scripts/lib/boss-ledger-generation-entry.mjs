import { resolveResources } from '../resolve-resources.mjs';
import { parseListWorkbenchRequest } from './boss-ledger-list-workbench-recipe.mjs';
import { parseStructuredWizardRequest } from './boss-ledger-wizard-recipe.mjs';

function fallback(route, reason) {
  return {
    status: 'fallback',
    route: route?.status === 'resolved' ? {
      module: route.module,
      intent: route.intent,
      template: route.template,
      availability: route.execution?.availability || null
    } : null,
    reason,
    next: '继续走受控自然语言生成，只读取该路由返回的最小规则资源。'
  };
}

/**
 * Classify a raw business request before an AI starts authoring a Page Spec.
 * Fast recipes must prove their own input shape; scenarios are never replayed
 * from a loose keyword match because that can silently discard business data.
 */
export function classifyBossLedgerGeneration(rawRequest) {
  const request = String(rawRequest || '').trim();
  if (!request) return fallback(null, '缺少业务需求。');

  const route = resolveResources(request, 'generate');
  if (route.status !== 'resolved') {
    return fallback(route, route.question || '无法唯一确定页面方案。');
  }
  if (route.module !== 'boss-ledger') {
    return { status: 'not-applicable', reason: '当前请求不属于老板管账。' };
  }
  if (route.execution?.availability !== 'available') {
    return {
      status: 'blocked',
      route: { intent: route.intent, template: route.template },
      reason: '当前页面能力尚未开放，不能生成替代页面。'
    };
  }
  if (route.intent !== 'wizard') {
    if (route.intent === 'query-list') {
      try {
        const parsed = parseListWorkbenchRequest(request);
        return {
          status: 'fast',
          recipe: 'list-workbench',
          pageName: parsed.pageName,
          route: {
            module: route.module,
            intent: route.intent,
            template: route.template,
            resources: route.resources
          },
          reason: '需求明确了列表查询和可选行内操作，命中列表工作台参数化配方。'
        };
      } catch (error) {
        return fallback(route, `列表工作台未满足配方输入边界：${error.message}`);
      }
    }
    return fallback(route, '未命中已验证的参数化配方。');
  }

  try {
    const parsed = parseStructuredWizardRequest(request);
    return {
      status: 'fast',
      recipe: 'structured-wizard',
      pageName: parsed.pageName,
      route: {
        module: route.module,
        intent: route.intent,
        template: route.template,
        resources: route.resources
      },
      reason: '需求包含连续编号步骤、字段列表和预览/复核步骤，命中已验证的分阶段流程配方。'
    };
  } catch (error) {
    return fallback(route, `步骤流程未满足已验证配方的输入边界：${error.message}`);
  }
}

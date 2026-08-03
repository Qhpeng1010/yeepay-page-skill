import { resolveResources } from '../resolve-resources.mjs';
import { parseEasyAccountListWorkbenchRequest } from './easy-account-list-workbench-recipe.mjs';

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
    next: '继续走易账通受控自然语言生成，只读取该路由返回的最小规则资源。'
  };
}

/**
 * Recipes only compile a request after proving that all variable business data
 * is explicit. Any other request remains on the controlled generation path.
 */
export function classifyEasyAccountGeneration(rawRequest) {
  const request = String(rawRequest || '').trim();
  if (!request) return fallback(null, '缺少业务需求。');

  const route = resolveResources(request, 'generate');
  if (route.status !== 'resolved') return fallback(route, route.question || '无法唯一确定页面方案。');
  if (route.module !== 'easy-account') return { status: 'not-applicable', reason: '当前请求不属于易账通。' };
  if (route.execution?.availability !== 'available') {
    return {
      status: 'blocked',
      route: { intent: route.intent, template: route.template },
      reason: '当前页面能力尚未开放，不能生成替代页面。'
    };
  }
  if (route.intent !== 'query-list') return fallback(route, '未命中已验证的易账通参数化配方。');

  try {
    const parsed = parseEasyAccountListWorkbenchRequest(request);
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
      reason: '需求明确了列表查询和可选行内操作，命中易账通列表工作台参数化配方。'
    };
  } catch (error) {
    return fallback(route, `列表工作台未满足配方输入边界：${error.message}`);
  }
}

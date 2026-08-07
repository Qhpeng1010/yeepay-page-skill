import { resolveResources } from '../resolve-resources.mjs';
import { parseEasyAccountListWorkbenchRequest } from './easy-account-list-workbench-recipe.mjs';
import { normalizeRecipeRequest, bridgeChangedRequest } from './recipe-request-bridge.mjs';

function fallback(route, reason) {
  const routeNeedsClarification = route?.status === 'clarify';
  return {
    status: routeNeedsClarification ? 'clarify' : 'fallback',
    decision: routeNeedsClarification ? 'clarify' : 'natural-generation',
    stage: routeNeedsClarification ? 'route' : 'recipe',
    route: route?.status === 'resolved' ? {
      module: route.module,
      intent: route.intent,
      template: route.template,
      availability: route.execution?.availability || null
    } : null,
    reason,
    ...(routeNeedsClarification ? {
      question: route.question || reason,
      candidates: route.candidates || []
    } : {}),
    next: routeNeedsClarification
      ? '补充澄清问题后重新提交原始需求。'
      : '继续走易账通受控自然语言生成，只读取该路由返回的最小规则资源。'
  };
}

function clarifyList(route, error) {
  if (!/需要明确的查询条件和列表字段/.test(error.message)) return fallback(route, `列表工作台未满足配方输入边界：${error.message}`);
  return {
    status: 'clarify',
    decision: 'clarify',
    stage: 'requirement',
    route: { module: route.module, intent: route.intent, template: route.template },
    reason: '已识别为易账通查询列表，但配方缺少必要的业务字段。',
    question: '请补充两项信息：查询条件有哪些？列表需要展示哪些字段？如果需要详情、新增、编辑或删除，也请一并说明。',
    next: '补充后将重新进入查询列表工作台配方校验。'
  };
}

/**
 * Recipes only compile a request after proving that all variable business data
 * is explicit. Any other request remains on the controlled generation path.
 */
export function classifyEasyAccountGeneration(rawRequest, { route: resolvedRoute = null } = {}) {
  const request = String(rawRequest || '').trim();
  if (!request) return fallback(null, '缺少业务需求。');

  const bridged = bridgeChangedRequest(request);
  const rawRoute = resolvedRoute || resolveResources(request, 'generate');
  const normalizedRoute = resolvedRoute || (bridged.changed ? resolveResources(bridged.normalized, 'generate') : rawRoute);
  const route = rawRoute.status === 'resolved' && rawRoute.intent === 'query-list'
    ? rawRoute
    : normalizedRoute;
  if (route.status !== 'resolved') return fallback(route, route.question || '无法唯一确定页面方案。');
  if (route.module !== 'easy-account') return { status: 'not-applicable', decision: 'route-mismatch', stage: 'route', reason: '当前请求不属于易账通。' };
  if (route.execution?.availability !== 'available') {
    return {
      status: 'blocked',
      decision: 'blocked',
      stage: 'capability',
      route: { intent: route.intent, template: route.template },
      reason: '当前页面能力尚未开放，不能生成替代页面。'
    };
  }
  if (route.intent !== 'query-list') return fallback(route, '未命中已验证的易账通参数化配方。');

  try {
    const parsed = parseEasyAccountListWorkbenchRequest(request);
    if (parsed.operations.custom?.length) {
      throw new Error(`查询列表配方未登记自定义操作：${parsed.operations.custom.join('、')}。`);
    }
    return {
      status: 'fast',
      decision: 'recipe-fast',
      stage: 'recipe',
      recipe: 'list-workbench',
      pageName: parsed.pageName,
      route: {
        module: route.module,
        intent: route.intent,
        template: route.template,
        resources: route.resources
      },
      reason: '需求明确了列表查询和可选行内操作，命中易账通列表工作台参数化配方。',
      inputRequest: bridged.changed ? normalizeRecipeRequest(request) : request,
      channel: bridged.changed ? 'flexible' : 'fast'
    };
  } catch (error) {
    return clarifyList(route, error);
  }
}

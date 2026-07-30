(function () {
  'use strict';
  const root = document.getElementById('open-platform-root');
  const state = { spec: null, filter: '' };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  function section(id, title, body) { return `<section class="op-section" id="${esc(id)}"><h2>${esc(title)}</h2>${body}</section>`; }
  function codeBlock(label, code, key) { return `<div class="op-code"><div class="op-code-header"><span>${esc(label)}</span><button class="op-code-copy" type="button" data-copy="${esc(key)}">复制</button></div><pre>${esc(code)}</pre></div>`; }
  function content() { return state.spec.metadata.family === 'integration-guide' ? state.spec.guide : state.spec.document; }
  function navItems() { return content().sidebar.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label }))); }
  function renderCatalog() {
    const query = state.filter.trim().toLowerCase();
    if (query === 'error') return '<p class="op-directory-state error">目录加载失败，请清除关键词后重试。</p>';
    const matches = navItems().filter((item) => !query || item.label.toLowerCase().includes(query));
    if (!matches.length) return '<p class="op-directory-state">暂无匹配目录。可尝试调整关键词或查看文档分类。</p>';
    return content().sidebar.map((group) => {
      const items = group.items.filter((item) => matches.some((match) => match.key === item.key));
      if (!items.length) return '';
      return `<li class="op-catalog-group">${esc(group.label)}${items.map((item) => `<button class="op-catalog-item" type="button" data-anchor="${esc(item.anchor)}" ${item.current ? 'aria-current="page"' : ''}>${esc(item.label)}</button>`).join('')}</li>`;
    }).join('');
  }
  function chrome(article) {
    return `<header class="op-header"><div class="op-brand">易宝支付<span>开放平台</span></div><nav class="op-main-nav" aria-label="主导航"><a href="#">首页</a><a href="#">平台指引</a><a href="#">解决方案</a><a href="#" aria-current="page">文档中心</a><a href="#">API</a></nav><div class="op-header-actions"><a href="#">全局搜索</a><button class="op-console" type="button">控制台</button></div></header>
      <nav class="op-doc-nav" aria-label="文档导航"><strong>文档中心</strong><a href="#">接入准备</a><a href="#" aria-current="page">接入指引</a><a href="#">API 文档</a><a href="#">工具支持</a></nav>
      <div class="op-doc-layout"><aside class="op-sidebar" aria-label="文档目录"><input class="op-catalog-search" id="op-catalog-search" placeholder="搜索当前文档" value="${esc(state.filter)}" /><ul class="op-catalog">${renderCatalog()}</ul></aside>${article}<aside class="op-toc" aria-label="本文内容"><strong>本文内容</strong>${content().toc.map((item, index) => `<a href="#${esc(item.anchor)}" class="${index === 0 ? 'is-active' : ''}" data-anchor="${esc(item.anchor)}">${esc(item.label)}</a>`).join('')}</aside></div>`;
  }
  function renderApiDocument() {
    const doc = state.spec.document;
    const article = `<article class="op-article"><div class="op-breadcrumb">文档中心<span>/</span>支付产品<span>/</span>${esc(doc.title)}</div><h1>${esc(doc.title)}</h1><p class="op-summary">${esc(doc.summary)}</p><div class="op-flow">${doc.flow.map((step, index) => `<div class="op-flow-step">${esc(step)}</div>${index === doc.flow.length - 1 ? '' : '<span class="op-flow-arrow">→</span>'}`).join('')}</div>
      ${section('overview', '接口概述', `<p>${esc(doc.overview)}</p><div class="op-info"><strong>适用范围</strong><span>${esc(doc.scope)}</span></div>`)}
      ${section('parameters', '请求参数', `<div class="op-parameter-wrap"><table class="op-parameter-table"><thead><tr><th>参数名</th><th>类型</th><th>必填</th><th>说明</th></tr></thead><tbody>${doc.parameters.map((p) => `<tr><td><code>${esc(p.name)}</code></td><td>${esc(p.type)}</td><td>${p.required ? '是' : '否'}</td><td>${esc(p.description)}</td></tr>`).join('')}</tbody></table></div>`)}
      ${section('request-example', '请求示例', codeBlock(doc.request.language, doc.request.code, 'request'))}
      ${section('response-example', '响应示例', codeBlock(doc.response.language, doc.response.code, 'response'))}
      ${section('error-guide', '错误处理', `<div class="op-error-list">${doc.errors.map((error) => `<div class="op-error"><code>${esc(error.code)}</code><p>${esc(error.message)}</p><p>${esc(error.action)}</p></div>`).join('')}</div>`)}
      <footer class="op-prev-next"><a href="#"><span>上一篇</span>${esc(doc.previous)}</a><a href="#"><span>下一篇</span>${esc(doc.next)}</a></footer></article>`;
    return chrome(article);
  }
  function renderIntegrationGuide() {
    const guide = state.spec.guide;
    const article = `<article class="op-article"><div class="op-breadcrumb">文档中心<span>/</span>接入指引<span>/</span>${esc(guide.title)}</div><h1>${esc(guide.title)}</h1><p class="op-summary">${esc(guide.summary)}</p><div class="op-flow">${guide.flow.map((step, index) => `<div class="op-flow-step">${esc(step)}</div>${index === guide.flow.length - 1 ? '' : '<span class="op-flow-arrow">→</span>'}`).join('')}</div>
      <div class="op-info"><strong>适用范围</strong><span>${esc(guide.scope)}</span></div>
      ${guide.steps.map((step, index) => section(step.key, `第 ${index + 1} 步：${step.title}`, `<div class="op-guide-step"><p>${esc(step.summary)}</p><ul class="op-checklist">${step.checklist.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>${step.code ? codeBlock(step.code.language, step.code.code, `guide-${step.key}`) : ''}</div>`)).join('')}
      <footer class="op-prev-next"><a href="#"><span>上一篇</span>${esc(guide.previous)}</a><a href="#"><span>下一篇</span>${esc(guide.next)}</a></footer></article>`;
    return chrome(article);
  }
  function renderPage() { return state.spec.metadata.family === 'integration-guide' ? renderIntegrationGuide() : renderApiDocument(); }
  function mount(spec) { state.spec = spec; root.innerHTML = renderPage(); bind(); }
  function toast(message) { const node = document.createElement('div'); node.className = 'op-toast'; node.textContent = message; document.body.appendChild(node); window.setTimeout(() => node.remove(), 1800); }
  function goTo(anchor) { document.getElementById(anchor)?.scrollIntoView({ block:'start' }); document.querySelectorAll('.op-toc a').forEach((link) => link.classList.toggle('is-active', link.dataset.anchor === anchor)); }
  function codeSource(key) {
    if (state.spec.metadata.family !== 'integration-guide') return key === 'request' ? state.spec.document.request.code : state.spec.document.response.code;
    const step = state.spec.guide.steps.find((item) => `guide-${item.key}` === key); return step?.code?.code || '';
  }
  async function copyText(source) {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(source); return true; } } catch { /* Fall through to local-preview copy. */ }
    const textarea = document.createElement('textarea'); textarea.value = source; textarea.setAttribute('readonly', ''); textarea.style.position = 'fixed'; textarea.style.opacity = '0'; document.body.appendChild(textarea); textarea.select(); const copied = document.execCommand('copy'); textarea.remove(); return copied;
  }
  function bind() {
    document.getElementById('op-catalog-search').addEventListener('input', (event) => { state.filter = event.target.value; mount(state.spec); document.getElementById('op-catalog-search').focus(); });
    document.querySelectorAll('[data-anchor]').forEach((node) => node.addEventListener('click', (event) => { event.preventDefault(); goTo(node.dataset.anchor); }));
    document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => { const copied = await copyText(codeSource(button.dataset.copy)); const requestCopy = state.spec.metadata.family === 'api-document' && button.dataset.copy === 'request'; toast(copied ? (requestCopy ? '请求示例已复制' : '示例已复制') : '复制失败，请手动选择代码'); }));
  }
  window.OpenPlatformPageSpecRuntime = { mount };
}());

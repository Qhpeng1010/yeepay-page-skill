(function () {
  'use strict';

  const root = document.getElementById('easy-account-root');
  const state = {
    spec: null,
    rows: [],
    loading: false,
    error: '',
    empty: false,
    columnMenu: false,
    visibleColumns: [],
    toast: null,
    formValues: {},
    formErrors: {},
    formServerError: '',
    formSubmitting: false,
    formSuccess: false
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function formatAmount(value) {
    const data = value && typeof value === 'object' ? value : { minor: String(value ?? '0'), currency: 'CNY' };
    const minor = String(data.minor ?? '0');
    const negative = minor.startsWith('-');
    const digits = negative ? minor.slice(1) : minor;
    const padded = digits.padStart(3, '0');
    const amount = `${padded.slice(0, -2)}.${padded.slice(-2)}`.replace(/^0+(?=\d)/, '');
    return `${negative ? '-' : ''}${amount}<small>${esc(data.currency || 'CNY')}</small>`;
  }

  function statusMarkup(value) {
    const item = typeof value === 'object' ? value : { text: value, tone: 'neutral' };
    return `<span class="ea-status ea-status-${esc(item.tone || 'neutral')}">${esc(item.text || '')}</span>`;
  }

  function sideItem(label) {
    const current = state.spec.shell?.sideNav === label;
    return `<button class="ea-side-item" type="button" ${current ? 'aria-current="page"' : ''}>${esc(label)}</button>`;
  }

  function renderShell() {
    const spec = state.spec;
    const selectedPrimary = spec.shell?.primaryNav || '账户管理';
    root.innerHTML = `
      <div class="ea-shell">
        <header class="ea-topbar">
          <div class="ea-brand-lockup">易通账<small>Easy Account</small></div>
          <nav class="ea-topnav" aria-label="主导航">
            <button type="button" ${selectedPrimary === '账户管理' ? 'aria-current="page"' : ''}>账户管理</button>
            <button type="button" ${selectedPrimary === '账务管理' ? 'aria-current="page"' : ''}>账务管理</button>
            <button type="button" ${selectedPrimary === '运营分析' ? 'aria-current="page"' : ''}>运营分析</button>
          </nav>
          <div class="ea-top-tools"><span>帮助中心</span><span>消息</span><span>${esc(spec.shell?.userLabel || '张三')}</span></div>
        </header>
        <div class="ea-layout">
          <aside class="ea-sidebar" aria-label="业务导航">
            <p class="ea-side-title">账户管理</p>
            ${sideItem('账户查询')}
            ${sideItem('开户注册')}
            ${sideItem('账户流水')}
            ${sideItem('操作日志')}
          </aside>
          <main class="ea-content">
            <div class="ea-breadcrumb">账户管理 / ${esc(spec.metadata.pageName)}</div>
            <div class="ea-page-heading"><div><h1>${esc(spec.metadata.pageName)}</h1><p>${esc(spec.metadata.selectionReason || '按权限范围完成账户管理任务')}</p></div></div>
            ${renderPage()}
            <p class="ea-footer">© 2026 易宝支付有限公司</p>
          </main>
        </div>
      </div>`;
    bindEvents();
  }

  function renderPage() {
    if (state.spec.metadata.family === 'list') return `<section class="ea-module" aria-labelledby="query-title"><div class="ea-module-heading"><h2 id="query-title">查询条件</h2></div>${renderQuery()}</section>
      <section class="ea-module" aria-labelledby="result-title"><div class="ea-result-heading"><h2 id="result-title">账户列表</h2><p>余额均为可用/冻结口径，金额单位为元</p></div>${renderResult()}</section>`;
    if (state.spec.metadata.family === 'form') return renderForm();
    return `<section class="ea-module"><div class="ea-state"><div><strong>该页面族尚未进入可交付模式</strong><span>请使用本域 legacy 流程或补充黄金案例。</span></div></div></section>`;
  }

  function renderQuery() {
    const fields = state.spec.list.query.fields || [];
    return `<form id="ea-query-form"><div class="ea-query-grid">${fields.map((field) => {
      const control = field.control === 'select'
        ? `<select id="field-${esc(field.key)}" name="${esc(field.key)}"><option value="">${esc(field.placeholder || `请选择${field.label}`)}</option>${(field.options || []).map((option) => `<option value="${esc(option.value)}">${esc(option.label)}</option>`).join('')}</select>`
        : `<input id="field-${esc(field.key)}" name="${esc(field.key)}" type="${field.control === 'number' ? 'number' : 'text'}" placeholder="${esc(field.placeholder || `请输入${field.label}`)}" />`;
      return `<div class="ea-field"><label for="field-${esc(field.key)}">${esc(field.label)}</label>${control}</div>`;
    }).join('')}</div><div class="ea-query-actions"><button class="ea-btn ea-btn-secondary" type="button" data-action="reset">重置</button><button class="ea-btn ea-btn-primary" type="submit">查询</button></div></form>`;
  }

  function renderResult() {
    if (state.loading) return `<div class="ea-state"><div><strong>正在加载账户数据</strong><span>请稍候，查询条件正在生效。</span></div></div>`;
    if (state.error) return `<div class="ea-state"><div><strong>查询失败</strong><span>${esc(state.error)}</span><br /><button class="ea-btn ea-btn-secondary" type="button" data-action="retry">重新查询</button></div></div>`;
    if (state.empty) return `<div class="ea-state"><div><strong>暂无匹配账户</strong><span>请调整查询条件后重试。</span></div></div>`;
    const table = state.spec.list.table;
    const columns = table.columns.filter((column) => state.visibleColumns.includes(column.key));
    return `<div class="ea-toolbar"><span class="ea-toolbar-note">共 ${state.rows.length} 条记录</span><div class="ea-toolbar-tools"><button class="ea-icon-btn" type="button" data-action="columns" aria-label="列设置" aria-expanded="${state.columnMenu}">⚙</button>${renderColumnMenu(table.columns)}</div></div>
      <div class="ea-table-wrap"><table class="ea-table"><thead><tr>${columns.map((column) => `<th scope="col">${esc(column.label)}</th>`).join('')}</tr></thead><tbody>${state.rows.map((row) => `<tr>${columns.map((column) => `<td>${renderCell(column, row[column.key], row)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="ea-pagination"><span>共 ${state.rows.length} 条</span><button class="ea-page-number" type="button" aria-current="page">1</button></div>`;
  }

  function renderCell(column, value, row) {
    if (column.format === 'amount') return `<span class="ea-amount">${formatAmount(value)}</span>`;
    if (column.format === 'status') return statusMarkup(value);
    if (column.key === 'actions') return (column.actions || []).map((action) => `<button class="${action.danger ? 'ea-btn-danger' : 'ea-btn-text'}" type="button" data-action="row" data-row="${esc(row.accountNo)}" data-command="${esc(action.key)}" data-confirm="${action.confirm ? 'true' : 'false'}">${esc(action.label)}</button>`).join(' ');
    return esc(value);
  }

  function renderColumnMenu(columns) {
    return `<div class="ea-column-menu" ${state.columnMenu ? '' : 'hidden'}><strong>列设置</strong>${columns.filter((column) => column.key !== 'actions').map((column) => `<label><input type="checkbox" data-column="${esc(column.key)}" ${state.visibleColumns.includes(column.key) ? 'checked' : ''} />${esc(column.label)}</label>`).join('')}</div>`;
  }

  function formFields() {
    const form = state.spec.form || {};
    return form.groups ? form.groups.flatMap((group) => group.fields || []) : form.fields || [];
  }

  function renderFormControl(field) {
    const value = state.formValues[field.key] || '';
    const error = state.formErrors[field.key];
    const id = `form-${field.key}`;
    const control = field.control === 'select'
      ? `<select id="${esc(id)}" name="${esc(field.key)}" aria-invalid="${error ? 'true' : 'false'}"><option value="">${esc(field.placeholder || `请选择${field.label}`)}</option>${(field.options || []).map((option) => `<option value="${esc(option.value)}" ${option.value === value ? 'selected' : ''}>${esc(option.label)}</option>`).join('')}</select>`
      : `<input id="${esc(id)}" name="${esc(field.key)}" type="${field.control === 'number' ? 'number' : 'text'}" value="${esc(value)}" placeholder="${esc(field.placeholder || `请输入${field.label}`)}" aria-invalid="${error ? 'true' : 'false'}" />`;
    return `<div class="ea-field ea-form-field"><label for="${esc(id)}">${esc(field.label)}${field.required ? '<b aria-hidden="true">*</b>' : ''}</label>${control}${error ? `<span class="ea-field-error">${esc(error)}</span>` : ''}</div>`;
  }

  function renderForm() {
    const form = state.spec.form;
    if (state.formSuccess) return `<section class="ea-module ea-form-complete"><div class="ea-success-mark" aria-hidden="true">✓</div><h2>账户开立申请已提交</h2><p>${esc(form.successMessage || '申请已提交，可在账户查询中核对状态。')}</p><p class="ea-success-reference">账户名称：${esc(state.formValues.accountName || '')}</p><button class="ea-btn ea-btn-primary" type="button" data-action="form-return">返回账户查询</button></section>`;
    const groups = form.groups || [{ title: '账户信息', description: '', fields: form.fields || [] }];
    return `<form id="ea-form" novalidate>${groups.map((group, index) => `<section class="ea-module ea-form-group" aria-labelledby="form-group-${index}"><div class="ea-module-heading"><div><h2 id="form-group-${index}">${esc(group.title)}</h2>${group.description ? `<p class="ea-module-description">${esc(group.description)}</p>` : ''}</div></div><div class="ea-form-grid">${(group.fields || []).map(renderFormControl).join('')}</div></section>`).join('')}
      <section class="ea-module ea-form-notice" aria-label="提交影响说明"><strong>提交影响</strong><span>${esc(form.riskNotice || '请确认填写内容准确无误。')}</span></section>
      ${state.formServerError ? `<p class="ea-form-server-error" role="alert">${esc(state.formServerError)}</p>` : ''}
      <div class="ea-form-actions"><button class="ea-btn ea-btn-secondary" type="button" data-action="form-cancel">${esc(form.submit.secondaryLabel || '取消')}</button><button class="ea-btn ea-btn-primary" type="submit" ${state.formSubmitting ? 'disabled' : ''}>${state.formSubmitting ? '正在提交' : esc(form.submit.primaryLabel)}</button></div>
    </form>`;
  }

  function readFilters() {
    return Object.fromEntries(new FormData(document.getElementById('ea-query-form')).entries());
  }

  function query(filters) {
    state.loading = true; state.error = ''; state.empty = false; renderShell();
    window.setTimeout(() => {
      if (Object.values(filters).some((value) => String(value).trim().toUpperCase() === 'ERROR')) {
        state.loading = false; state.error = '服务暂时不可用，请稍后重试。'; renderShell(); return;
      }
      const source = state.spec.list.table.rows || [];
      const name = String(filters.accountName || '').trim().toLowerCase();
      state.rows = source.filter((row) => !name || String(row.accountName).toLowerCase().includes(name));
      state.empty = String(filters.accountName || '').trim().toUpperCase() === 'NONE' || state.rows.length === 0;
      state.loading = false; renderShell();
    }, 180);
  }

  function toast(message, danger) {
    state.toast = { message, danger }; renderShell();
    window.setTimeout(() => { state.toast = null; renderShell(); }, 2200);
  }

  function confirmAction(rowId, command) {
    const mask = document.createElement('div');
    mask.className = 'ea-confirm-mask';
    mask.innerHTML = `<section class="ea-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><header id="confirm-title">确认${command === 'freeze' ? '冻结账户' : '执行操作'}</header><main>将对账户 <strong>${esc(rowId)}</strong> 执行${command === 'freeze' ? '冻结' : '该操作'}，账户可用能力会立即受到影响。</main><footer><button class="ea-btn ea-btn-secondary" data-confirm-action="cancel">取消</button><button class="ea-btn ea-btn-primary" data-confirm-action="ok">确认</button></footer></section>`;
    document.body.appendChild(mask);
    mask.querySelector('[data-confirm-action="cancel"]').focus();
    mask.addEventListener('click', (event) => {
      if (event.target === mask || event.target.dataset.confirmAction === 'cancel') mask.remove();
      if (event.target.dataset.confirmAction === 'ok') { mask.remove(); toast(`账户 ${rowId} 已提交冻结申请`); }
    });
  }

  function formIsDirty() { return Object.values(state.formValues).some((value) => String(value).trim() !== ''); }
  function resetForm() { state.formValues = { ...(state.spec.form?.initialValues || {}) }; state.formErrors = {}; state.formServerError = ''; state.formSubmitting = false; }

  function requestFormExit() {
    if (!formIsDirty()) { toast('已返回账户查询'); return; }
    const mask = document.createElement('div');
    mask.className = 'ea-confirm-mask';
    mask.innerHTML = `<section class="ea-confirm" role="dialog" aria-modal="true" aria-labelledby="discard-title"><header id="discard-title">放弃未保存修改</header><main>返回账户查询将丢失当前填写内容，是否继续？</main><footer><button class="ea-btn ea-btn-secondary" data-discard-action="stay">继续编辑</button><button class="ea-btn ea-btn-primary" data-discard-action="discard">放弃修改</button></footer></section>`;
    document.body.appendChild(mask);
    mask.querySelector('[data-discard-action="stay"]').focus();
    mask.addEventListener('click', (event) => {
      if (event.target === mask || event.target.dataset.discardAction === 'stay') mask.remove();
      if (event.target.dataset.discardAction === 'discard') { mask.remove(); resetForm(); toast('已放弃未保存修改'); }
    });
  }

  function submitForm() {
    const errors = {};
    formFields().forEach((field) => {
      const value = String(state.formValues[field.key] || '').trim();
      if (field.required && !value) errors[field.key] = field.validationMessage || `请填写${field.label}`;
      if (field.key === 'dailyLimit' && value && (!/^\d+(?:\.\d{1,2})?$/.test(value) || Number(value) > 500000 || Number(value) <= 0)) errors[field.key] = '请输入大于 0 且不超过 500000 的金额';
    });
    state.formErrors = errors;
    state.formServerError = '';
    if (Object.keys(errors).length) { renderShell(); return; }
    state.formSubmitting = true;
    renderShell();
    window.setTimeout(() => {
      state.formSubmitting = false;
      if (String(state.formValues.accountName || '').trim().toUpperCase() === 'ERROR') {
        state.formServerError = '账户名称已存在，请核对主体后重新提交。'; renderShell(); return;
      }
      state.formSuccess = true;
      renderShell();
    }, 280);
  }

  function bindEvents() {
    const form = document.getElementById('ea-query-form');
    if (form) form.addEventListener('submit', (event) => { event.preventDefault(); query(readFilters()); });
    document.querySelector('[data-action="reset"]')?.addEventListener('click', () => { form.reset(); query({}); });
    document.querySelector('[data-action="retry"]')?.addEventListener('click', () => query(readFilters()));
    document.querySelector('[data-action="columns"]')?.addEventListener('click', () => { state.columnMenu = !state.columnMenu; renderShell(); });
    document.querySelectorAll('[data-column]').forEach((input) => input.addEventListener('change', (event) => {
      const key = event.target.dataset.column;
      state.visibleColumns = event.target.checked ? [...new Set([...state.visibleColumns, key])] : state.visibleColumns.filter((item) => item !== key);
      renderShell();
    }));
    document.querySelectorAll('[data-action="row"]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.confirm === 'true') confirmAction(button.dataset.row, button.dataset.command);
      else toast(`已打开账户 ${button.dataset.row} 的详情`);
    }));
    const accountForm = document.getElementById('ea-form');
    if (accountForm) {
      accountForm.addEventListener('input', (event) => { if (event.target.name) { state.formValues[event.target.name] = event.target.value; delete state.formErrors[event.target.name]; state.formServerError = ''; } });
      accountForm.addEventListener('change', (event) => { if (event.target.name) { state.formValues[event.target.name] = event.target.value; delete state.formErrors[event.target.name]; state.formServerError = ''; } });
      accountForm.addEventListener('submit', (event) => { event.preventDefault(); submitForm(); });
    }
    document.querySelector('[data-action="form-cancel"]')?.addEventListener('click', requestFormExit);
    document.querySelector('[data-action="form-return"]')?.addEventListener('click', () => { state.formSuccess = false; resetForm(); toast('已返回账户查询'); });
    if (state.toast) {
      const node = document.createElement('div'); node.className = `ea-toast${state.toast.danger ? ' ea-toast-danger' : ''}`; node.textContent = state.toast.message; document.body.appendChild(node);
    }
  }

  window.EasyAccountPageSpecRuntime = {
    mount(spec) {
      state.spec = spec;
      state.rows = spec.list?.table?.rows || [];
      state.visibleColumns = (spec.list?.table?.columns || []).map((column) => column.key);
      state.formSuccess = false;
      resetForm();
      renderShell();
    }
  };
}());

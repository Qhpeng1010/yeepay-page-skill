(function () {
  'use strict';
  function mount(spec) {
    const root = document.getElementById('yilaiqian-root');
    const Vant = window.vant || window.Vant;
    if (!window.Vue || !Vant) { root.textContent = '收银台运行资源加载失败'; return; }
    const { createApp, ref, computed, watch } = window.Vue;
    const app = createApp({
      setup() {
        const amount = ref(''); const paymentMethod = ref(spec.checkout.paymentMethods[0]?.key || ''); const showPassword = ref(false); const password = ref(''); const submitting = ref(false); const result = ref(''); const notice = ref(''); const resultOutcome = spec.checkout.resultOutcome === 'failure' ? 'failure' : 'success';
        function amountToMinor(value) { const [whole, decimal = ''] = value.split('.'); return `${whole}${decimal.padEnd(2, '0')}`.replace(/^0+(?=\d)/, '') || '0'; }
        function minorAtMost(value, limit) { return value.length < limit.length || (value.length === limit.length && value <= limit); }
        const amountValid = computed(() => { const value = amount.value; return /^(?:0|[1-9]\d*)(?:\.\d{0,2})?$/.test(value) && /[1-9]/.test(value) && minorAtMost(amountToMinor(value), spec.checkout.amountLimitMinor); });
        const payEnabled = computed(() => amountValid.value && Boolean(paymentMethod.value) && !submitting.value);
        const currencyAmount = computed(() => amount.value || ''); const failureMessage = computed(() => `${spec.checkout.failure?.reason || ''}${spec.checkout.failure?.action ? `。${spec.checkout.failure.action}` : ''}`);
        function announce(message) { notice.value = message; window.setTimeout(() => { if (notice.value === message) notice.value = ''; }, 1800); }
        function appendAmount(key) { if (submitting.value) return; let next = amount.value; if (key === '.') { if (next.includes('.')) return; next = next ? `${next}.` : '0.'; } else { if (next.includes('.') && next.split('.')[1].length >= 2) return; next = `${next}${key}`; } if (next.length <= 10) amount.value = next; }
        function deleteAmount() { if (!submitting.value) amount.value = amount.value.slice(0, -1); }
        function clearAmount() { if (!submitting.value) amount.value = ''; }
        function chooseMethod(key) { if (!submitting.value) paymentMethod.value = key; }
        function openPassword() { if (!payEnabled.value) { announce('请输入有效金额后再付款'); return; } showPassword.value = true; }
        function closePassword() { if (!submitting.value) password.value = ''; }
        function complete() { amount.value = ''; password.value = ''; result.value = ''; paymentMethod.value = spec.checkout.paymentMethods[0]?.key || ''; announce('已返回付款页'); }
        function back() { if (showPassword.value) { showPassword.value = false; return; } if (result.value) { complete(); return; } announce('已返回扫码入口'); }
        watch(password, (value) => { if (value.length === 6 && !submitting.value) { showPassword.value = false; submitting.value = true; announce('正在确认支付'); window.setTimeout(() => { submitting.value = false; window.setTimeout(() => { password.value = ''; result.value = resultOutcome; }, 32); }, 360); } });
        return { spec, amount, paymentMethod, showPassword, password, submitting, result, notice, amountValid, payEnabled, currencyAmount, failureMessage, appendAmount, deleteAmount, clearAmount, chooseMethod, openPassword, closePassword, complete, back };
      },
      template: `
        <div class="ylq-stage"><div class="ylq-app" data-yilaiqian-runtime="vue-vant">
          <van-nav-bar :title="result ? '支付结果' : '向商户付款'" left-arrow @click-left="back" />
          <main v-if="!result" class="ylq-entry" :style="{'--van-number-keyboard-button-background': payEnabled ? '#0051ff' : 'rgba(0,81,255,.45)'}">
            <section class="ylq-card ylq-amount-card" aria-label="付款金额"><span class="ylq-amount-label">付款金额</span>
              <van-field v-model="amount" readonly clickable :clearable="Boolean(amount)" clear-trigger="always" @click-input="() => {}" @clear="clearAmount">
                <template #input><div class="ylq-amount-display" @click="() => {}"><span class="ylq-currency">￥</span><strong v-if="amount" class="ylq-amount-value">{{ currencyAmount }}</strong><em v-else class="ylq-amount-placeholder">请输入金额</em><i class="ylq-caret" aria-hidden="true"></i></div></template>
                <template #right-icon><van-icon v-if="amount" name="clear" aria-label="清除金额" @click.stop="clearAmount" /></template>
              </van-field>
            </section>
            <section class="ylq-card ylq-method-card" aria-label="支付方式"><van-radio-group v-model="paymentMethod"><van-cell v-for="method in spec.checkout.paymentMethods" :key="method.key" clickable @click="chooseMethod(method.key)"><template #title><div><div class="ylq-method-name">{{ method.label }}</div><div class="ylq-method-detail">{{ method.description }}</div></div></template><template #right-icon><van-radio :name="method.key" checked-color="#0051ff" icon-size="20px" /></template></van-cell></van-radio-group></section>
            <van-number-keyboard :show="true" theme="custom" extra-key="." close-button-text="付款" :close-button-loading="submitting" :safe-area-inset-bottom="true" @input="appendAmount" @delete="deleteAmount" @close="openPassword" />
          </main>
          <main v-else class="ylq-result" :class="{'ylq-result-failure': result === 'failure'}"><van-icon :name="result === 'failure' ? 'warning-o' : 'passed'" :color="result === 'failure' ? '#ee0a24' : '#07c160'" size="68px" /><h1>{{ result === 'failure' ? '支付失败' : '支付成功' }}</h1><p v-if="result === 'failure'" class="ylq-result-description">{{ failureMessage }}</p><div class="ylq-result-amount">￥{{ amount }}</div><van-cell-group inset><van-cell title="商户名称" :value="spec.checkout.merchantName" /><van-cell title="订单号" :value="spec.checkout.orderNo" /><van-cell title="支付方式" :value="spec.checkout.paymentMethods.find((item) => item.key === paymentMethod)?.label" /></van-cell-group><van-button round block class="ylq-complete" @click="complete">完成</van-button></main>
          <van-popup v-model:show="showPassword" position="bottom" round closeable close-icon-position="top-left" teleport="body" :duration="0" :close-on-click-overlay="!submitting" @close="closePassword"><div class="ylq-password-sheet"><h2 class="ylq-password-title">请输入付款密码</h2><van-password-input :value="password" :length="6" :gutter="8" :focused="showPassword && !submitting" info="请输入 6 位付款密码" @focus="showPassword = true" /><van-number-keyboard v-model="password" :show="showPassword" :maxlength="6" :safe-area-inset-bottom="true" /></div></van-popup>
          <van-overlay :show="submitting" :duration="0" z-index="3000"><div class="ylq-processing" role="status" aria-live="assertive"><div class="ylq-processing-box"><van-loading type="spinner" color="#0051ff" size="52px" /><h2>正在确认支付</h2><p>请稍候，不要重复付款</p></div></div></van-overlay>
          <p class="ylq-toast-live" aria-live="polite">{{ notice }}</p>
        </div></div>`
    });
    app.config.errorHandler = (error) => { root.dataset.runtimeError = String(error.message || error); root.textContent = '收银台组件加载失败，请刷新页面后重试'; console.error(error); };
    app.use(Vant); app.mount(root);
  }
  window.YilaiqianPageSpecRuntime = { mount };
}());

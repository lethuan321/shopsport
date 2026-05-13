document.addEventListener('DOMContentLoaded', () => {
  // Guard nếu AuthUI chưa load (tránh crash trắng trang)
  if (!window.AuthUI) {
    console.warn('[reset-password] AuthUI is not ready');
    return;
  }

  AuthUI.attachRipple?.();
  AuthUI.attachPasswordToggle?.();

  const form = document.querySelector('[data-reset-form]');
  const password = document.querySelector('[data-password]');
  const confirm = document.querySelector('[data-confirm-password]');
  const bar = document.querySelector('[data-strength-bar]');
  const text = document.querySelector('[data-strength-text]');

  if (!form || !password || !confirm) {
    console.warn('[reset-password] Missing required elements', { form: !!form, password: !!password, confirm: !!confirm });
    return;
  }

  const validateConfirm = () => {
    const ok = confirm.value.length > 0 && confirm.value === password.value;
    confirm.classList.toggle('is-valid', ok);
    confirm.classList.toggle('is-invalid', confirm.value.length > 0 && !ok);
    return ok;
  };

  password.addEventListener('input', () => {
    AuthUI.updateStrength?.(password, bar, text);
    validateConfirm();
  });
  confirm.addEventListener('input', validateConfirm);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const score = AuthUI.updateStrength?.(password, bar, text) ?? 0;

    if (score < 50 || !validateConfirm()) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 450);
      AuthUI.showToast?.('Mật khẩu mới chưa đủ an toàn.', 'warning');
      return;
    }
    AuthUI.showToast?.('Đặt lại mật khẩu thành công.', 'success');
  });
});

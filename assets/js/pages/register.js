document.addEventListener('DOMContentLoaded', () => {
  AuthUI.attachRipple();
  AuthUI.attachPasswordToggle();

  const form = document.querySelector('[data-register-form]');
  const email = document.querySelector('[data-register-email]');
  const password = document.querySelector('[data-password]');
  const confirm = document.querySelector('[data-confirm-password]');
  const bar = document.querySelector('[data-strength-bar]');
  const text = document.querySelector('[data-strength-text]');

  const validateConfirm = () => {
    const ok = confirm.value.length > 0 && confirm.value === password.value;
    confirm.classList.toggle('is-valid', ok);
    confirm.classList.toggle('is-invalid', confirm.value.length > 0 && !ok);
    return ok;
  };

  email?.addEventListener('input', () => AuthUI.validateEmail(email));
  password?.addEventListener('input', () => {
    AuthUI.updateStrength(password, bar, text);
    validateConfirm();
  });
  confirm?.addEventListener('input', validateConfirm);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const score = AuthUI.updateStrength(password, bar, text);
    const valid = AuthUI.markRequired(form) && AuthUI.validateEmail(email) && validateConfirm() && score >= 50;
    if (!valid) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 450);
      AuthUI.showToast('Thông tin đăng ký chưa hợp lệ.', 'warning');
      return;
    }
    AuthUI.showToast('Tạo tài khoản thành công. Vui lòng xác minh email.', 'success');
  });
});

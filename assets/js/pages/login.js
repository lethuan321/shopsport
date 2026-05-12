document.addEventListener('DOMContentLoaded', () => {
  AuthUI.initBase();
  AuthUI.remember.load();

  const form = document.querySelector('[data-login-form]');
  const email = document.querySelector('[data-login-email]');

  email?.addEventListener('input', () => AuthUI.validateEmail(email));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = AuthUI.markRequired(form) && AuthUI.validateEmail(email);
    if (!valid) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 450);
      AuthUI.showToast('Vui lòng kiểm tra email và mật khẩu.', 'warning');
      return;
    }
    AuthUI.remember.save();
    AuthUI.showToast('Đăng nhập thành công. Sẵn sàng tích hợp backend.', 'success');
  });
});

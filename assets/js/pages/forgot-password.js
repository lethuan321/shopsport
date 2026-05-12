document.addEventListener('DOMContentLoaded', () => {
  AuthUI.attachRipple();
  const form = document.querySelector('[data-forgot-form]');
  const email = document.querySelector('[data-forgot-email]');
  const success = document.querySelector('[data-forgot-success]');

  email?.addEventListener('input', () => AuthUI.validateEmail(email));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!AuthUI.validateEmail(email)) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 450);
      AuthUI.showToast('Vui lòng nhập email hợp lệ.', 'warning');
      return;
    }
    success?.classList.remove('d-none');
    AuthUI.showToast('Đã gửi liên kết đặt lại mật khẩu.', 'success');
  });
});
